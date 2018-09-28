/**
 * 审批工作界面
 * 审批工作界面中是根据功能ID与数据ID找到当前审批taskId；
 * 提交到工作流客户端时，也是根据taskId构建任务实例继续流程执行；
 * 改进：
 * 如果在表格中选择多条记录批量审批时，同时也需要填写审批意见，这种情况就
 * 根据第一条记录ID找taskId与历史审批意见，
 * 当提交后台时就不提交taskId，而是提交多个dataId。
 *
 **/
Jxstar.currentPage = {
	//当前任务分配信息
	assignData: null,
	//操作类型描述
	typeLabel: jx.wf.advok,	//'同意。',
	//操作FORM控件
	taskForm: null,
	tabs: null,
	curCellIds: '', //当前审批节点
	
	showWindow: function(assignData) {
		var self = this;
		self.assignData = assignData;
		var curFunId = assignData.funId;
		var curDataId = assignData.dataId;
		if (assignData.taskId == null) assignData.taskId = '';
		
		//是否显示我的意见栏，默认不显示
		var hideForm = true;
		if (assignData.hideForm != null) hideForm = assignData.hideForm;
		
		var showWin = function(taskForm, hideForm) {
			self.createTab(taskForm, hideForm, curFunId, curDataId);
			self.showHischeck();
			self.showProcess();
			self.showMap();
		};
		var hdCall = function(nodeAttr) {
			//从功能中打开的界面需要给实例ID，从待办任务中打开的界面不需要给值
			if (assignData.taskId.length == 0) {
				assignData.taskId = nodeAttr.taskId;
			}
			//操作选项
			var typeConfig = self.showCheckType(nodeAttr);
			
			//取当前部门ID
			var curDeptId = JxDefault.getDeptId() + '%';
			var taskForm = new Ext.form.FormPanel({
				id: 'check_work_form',
				border: false,
				width: '90%',
				hidden:hideForm,
				cls:'chkfrm',
				style:'margin:0 auto;',
				items: [{xtype:'box', html:'<div class="chk-title">我的意见</div>'},{
					hideLabels:true,
					layout:'form',
					style:'border: 1px solid #00AAEF;',
					items: [
						typeConfig,
						{xtype:'textarea', name:'wf_task__check_desc', value:jx.wf.advok,	//'审批意见' //'同意',
							anchor:'100%', height:80, maxLength:500},
						{xtype:'hidden', name:'wf_task__next_userid'},
						{xtype:'hidden', name:'wf_task__next_nodeid'},
						{
							anchor:'100%',
							layout:'column',	
							items:[{
								columnWidth:0.50, 
								layout:'form',
								hideLabels:true,
								items:[
								{xtype:'trigger', //fieldLabel:'转发人', 
									style:'margin-left:5px;', anchor:'60%', 
									name:'wf_task__next_user',//'重新分配人'
									readOnly:false, triggerClass:'x-form-search-trigger',
									maxLength:20, editable:false, 
									onTriggerClick: function() {
										var checkType = taskForm.getForm().findField('checkType').getGroupValue();
										var selcfg = {pageType:'combogrid', nodeId:'sys_user', layoutPage:'/public/layout/layout_tree.js', sourceField:'sys_user.user_name;user_id', targetField:'wf_task.next_user;next_userid', whereSql:"sys_user.is_novalid = '0' and (sys_user.dept_id like ? or sys_user.is_leader = '1')", whereValue:curDeptId, whereType:'string', isSame:'0', isShowData:'1', isMoreSelect:'0',isReadonly:'1'};
										
										//退回时可以选择历史审批人
										if (checkType == 'R') selcfg = {pageType:'combogrid', nodeId:'wf_assignsel', layoutPage:'', sourceField:'v_wf_assignsel.check_user;check_userid;node_id', targetField:'wf_task.next_user;next_userid;next_nodeid', whereSql:"v_wf_assignsel.fun_id = ? and v_wf_assignsel.data_id = ?", whereValue:curFunId+";"+curDataId, whereType:'string;string', isSame:'0', isShowData:'1', isMoreSelect:'0',isReadonly:'1'};
										JxSelect.createSelectWin(selcfg, this, 'check_work_form');
									},
									listeners:{render:function(f){f.el.dom.setAttribute('placeholder', '选择转发人')}}
								}]},
								{columnWidth:0.50, 
								layout:'form',
								height:38,
								items:[{
									cls:'x-btn-primary',
									anchor:'30%', 
									style:'margin-right:10px; float:right;',
									xtype:'button',
									text:jx.base.ok,	//'确定',
									handler:function(){
										self.executeCheck(taskForm);
									}
								}]
							}]
						}
					]
				}]
			});
			
			self.taskForm = taskForm;
			showWin(taskForm, hideForm);
		};
		
		if (hideForm) {
			showWin(null, hideForm);
		} else {
			//如果已经审批过了，则提示，并显示审批进度
			var hintWin = function(result){
				var msg = result.message;
				if (msg.length == 0) msg = jx.req.faild;		//'执行失败！'
				JxHint.hint(msg);
				showWin(null, true);
			};
			
			//检查任务执行状况，并从后台查询当前节点设置信息
			var params = 'funid=wf_assign&pagetype=chkgrid&eventcode=querywork&taskid='+ assignData.taskId;
			params += '&check_funid='+ curFunId +'&keyid='+ curDataId;
			Request.dataRequest(params, hdCall, {errorcall:hintWin});
		}
	},
	
	/**
	* private 确定，完成任务
	* taskForm -- 任务意见表单
	**/
	executeCheck: function(taskForm) {
		var self = this;
		var form = taskForm.getForm();
		
		//操作类型
		var checkType = form.findField('checkType').getGroupValue();
		//意见内容
		var checkDesc = form.findField('wf_task__check_desc').getValue();
		
		if (checkDesc.length == 0) {//'审批意见为空，不能执行！'
			JxHint.alert(jx.wf.emptyadv);
			return false;
		}
		
		//重新分配审批人
		var nextUserId = form.findField('wf_task__next_userid').getValue();
		var nextUserName = form.findField('wf_task__next_user').getValue();
		var nextNodeId = form.findField('wf_task__next_nodeid').getValue();
		
		//缺省提醒信息
		var shint = String.format(jx.wf.seltype, self.typeLabel);	//'您选择的操作类型是“'+ self.typeLabel +'”，';
		if (nextUserId.length > 0 && nextUserName.length > 0) {
			shint += String.format(jx.wf.assign, nextUserName);		//'并且把任务重新分配给“'+ nextUserName +'”，';
		}
		
		//否决终止
		if (checkType == 'N') {
			var ret = confirm(shint + jx.wf.stopyes);	//'流程将被终止，确定执行吗？'
		} else 
		//完成
		if (checkType == 'C') {
			var ret = confirm(shint + jx.wf.endyes);	//'流程将直接完成，确定执行吗？'
		} else {
			var ret = confirm(shint + jx.wf.doyes);		//'确定执行吗？'
		}
		if (!ret) return false;
		
		var e = encodeURIComponent;
		//执行后台请求
		var params = 'funid=wf_assign&pagetype=chkgrid&eventcode=execheck'+
					 '&check_type='+ checkType +'&check_desc='+ e(checkDesc) +
					 '&next_userid='+ nextUserId +'&next_user='+ e(nextUserName) +
					 '&next_nodeid=' + nextNodeId;
		
		//如果是表格中批量审批多条记录，则采用批量审批方式
		var dataIds = self.assignData.dataIds;
		if (dataIds != null && dataIds.length > 0) {
			params += '&check_funid='+ self.assignData.funId;
			var ids = dataIds.split(',');
			for (var i = 0; i < ids.length; i++) {
				params += '&keyid=' + ids[i];
			}
		} else {
		//单条记录审批
			params += '&taskid='+ self.assignData.taskId;
			params += '&check_funid='+ self.assignData.funId;
			params += '&keyid='+ self.assignData.dataId;
		}
		
		//提交审批后，刷新数据，如果是采用异步执行，下面的方法将没有效果
		var endcall = function() {
			var ct = taskForm.ownerCt;
			ct.hide();
			self.showHischeck();
			self.showProcess();
			self.showMap(true);
			ct.ownerCt.doLayout();
			//刷新流程中心的消息
			var xt = Ext.getCmp('x_main_tab_work');
			if (xt) {
				JxPortalExt.contentTypes['portlet_work'].refresh(xt.ownerCt);
			}
			
			//刷新审批数据表格，在GridEvent.check方法中赋值
			var mygrid = JxUtil.myCheckGrid;
			if (mygrid) {
				mygrid.getStore().reload();
				JxUtil.myCheckGrid = null;
			}
			//刷新表单数据，在FormEvent.check方法中赋值
			var fpage = JxUtil.myCheckForm;
			if (fpage) {
				var mygrid = fpage.getForm().myGrid;
				if (mygrid) {
					var fnode = fpage.formNode;
					var store = mygrid.getStore();
					store.reload();
					if (fnode.define.isCloud) {
						var ct = JxCloud.apps[fnode.define.nodeid];
						var ly = ct.getLayout();
						ly.setActiveItem(0);
						ly.activeItem.doLayout();
					} else {
						var tab = fpage.findParentByType('tabpanel');
						if (tab) {
							tab.activate(tab.getComponent(0));
						}
					}
					JxUtil.myCheckForm = null;
				}
			}
			//刷新审批单报表，在JxUtil.createReportTool方法中赋值的
			if (JxUtil.myCheckIframe) {
				var src = JxUtil.myCheckIframe.dom.src;JxUtil.myCheckIframe.dom.src = src;
				JxUtil.myCheckIframe = null;
			}
		};
		
		Request.postRequest(params, endcall);
	},
	
	/**
	* private 创建完成分配任务的对话框
	* taskForm -- 输入审批意见的表单
	**/
	createTab: function(taskForm, hideForm, nodeId, dataId) {
		var self = this;
		var taskId = self.assignData.taskId;
		//添加附件显示控件
		var winid = '', lts = null, define = Jxstar.findNode(nodeId);
		var its = [{xtype:'box', cls:'x-check-his'},{xtype:'box', cls:'x-check-user'}];
		if (define.editCheckFile) {
			winid = 'form_file_'+JxUtil.newId();
			var ifrHtml = '<iframe frameborder="no" style="display:none;border-width:0;width:100%;height:100%;" ></iframe>';
			its[its.length] = {id:winid, xtype:'container', style:'border-top:1px dashed #DCE8F1;', items:[{xtype:'box', style:'height:100%;', html:ifrHtml}]};
			lts = {afterrender:function(){
				self.tabs.doLayout();
				var win1 = Ext.getCmp(winid);
				win1.addEvents('aftersize');
				win1.on('aftersize', function(){
					var ct = self.tabs.getComponent(0);
					var h = ct.getComponent(0).getHeight() + ct.getComponent(1).getHeight();
						h += ct.getComponent(2).getHeight();
					ct.setHeight(h);
					if (h > 540) tabs.setHeight(h+60);
				});
				//从功能中打开不能使用附件编辑按钮
				var disable = (taskId.length == 0) ? true : false;
				var href = Jxstar.path+'/jxstar/other/upload/formfile.jsp?winid='+winid+
					'&dataid='+dataId+'&datafunid='+nodeId+'&disable='+disable+
					'&tablename='+define.tablename+'&user_id='+Jxstar.session['user_id'];
				var frm = win1.getEl().child('iframe');
				frm.dom.src = href + '&_dc=' + (new Date()).getTime();//避免缓存
				frm.show();
			}};
		}
		
		var apprPanel = new Ext.Panel({
			title:'审批进度',
			border:false,
			items:its,
			listeners:lts
		});
		//设计面板html
		var maphtml = [//overflow:auto;
			'<div id="mx_graph_show" style="height:100%;width:100%;background-color:white;">',
				'<center id="mx_splash" style="padding-top:100px;">',
					'<img src="lib/graph/images/loading.gif">',
				'</center>',
			'</div>'
		];
		var tabs = 	new Ext.TabPanel({
			activeTab: 0,
			deferredRender: false,
			height: 570,
			width: '90%',
			cls: 'chktab',
			style:'margin:0 auto;',
			items: [apprPanel,{title:'流程图',html:maphtml}]
		});
		self.tabs = tabs;
		
		var items = [];
		if (!hideForm) items[items.length] = {xtype:'container', region:'north', hidden:hideForm, height:212, items:[taskForm]};
		items[items.length] = {xtype:'container', region:'center', items:[tabs]};
		
		//在功能中打开
		var mainTab = Jxstar.sysMainTab;
		var app_tab = Ext.getCmp('app_Process');
		if(app_tab){
			mainTab.remove(app_tab);
		}
		var win = mainTab.add({
				xtype:'container',
				label: '审批进度',
				id:'app_Process',
				border:false,
				//autoScroll:true,
				closable: true,
				layout: 'border',
				style:'background-color:#FFF;overflow-x:hidden;overflow-y:auto;',
				items: items
			});
		mainTab.activate(win);
	},
	
	//操作选项radio设置
	showCheckType: function(nodeAttr) {
		var self = this;
		//设置选择事件
		var onSelect = function(radio, checked) {
			if (checked) {
				self.typeLabel = radio.boxLabel;
				var type = radio.inputValue;
				var form = self.taskForm.getForm();
				var descField = form.findField('wf_task__check_desc');				
				if (type == 'Y') {
					descField.setValue(jx.wf.advok);	//'同意。'
				} else if (type == 'R') {
					descField.setValue(jx.wf.advret);	//'不同意，退回上一人。'
				} else if (type == 'E') {
					descField.setValue(jx.wf.advnew);	//'不同意，退回编辑人重新提交。'
				} else if (type == 'N') {
					descField.setValue(jx.wf.advnot);	//'否决，取消任务。'
				} else if (type == 'C') {
					descField.setValue(jx.wf.advend);	//'同意，审批通过。'
				} else if (type == 'M') {
					descField.setValue(jx.wf.nagree);	//'不同意'
				}
				
				//只有同意才可以选择：重新分配人
				var reUser = form.findField('wf_task__next_user');	
				reUser.setReadOnly((type != 'Y' && type != 'R'));
				
				reUser.setValue('');
				form.findField('wf_task__next_userid').setValue('');
				form.findField('wf_task__next_nodeid').setValue('');
			}
		};
		var ltr = {check: onSelect};
        
        var t = 'margin-left:10px;';
		//操作选项
		var typeItems = [
				{xtype:'radio', width:60, boxLabel:jx.wf.agree, name:'checkType', inputValue:'Y', checked:true, listeners: ltr},//'同意'
				{xtype:'radio', width:80, style:t, boxLabel:jx.wf.ret, name:'checkType', inputValue:'R', listeners: ltr},	//'退回'
				{xtype:'radio', width:120, style:t, boxLabel:jx.wf.retman, name:'checkType', inputValue:'E', listeners: ltr}//'退回编辑人'
			];
		//是否可以否决
		var hasno = Jxstar.systemVar.wf__check__hasno || '0';//是否所有审批都支持否决
		if (nodeAttr.hasNo == '1' || hasno == '1') {
			typeItems[typeItems.length] = 
				{xtype:'radio', width:100, style:t, boxLabel:jx.wf.stop, name:'checkType', inputValue:'N', listeners: ltr};//'否决终止'
		}
		//是否可以完成
		var hascomp = Jxstar.systemVar.wf__check__hascomp || '0';//是否所有审批都支持完成
		if (nodeAttr.hasComplete == '1' || hascomp == '1') {
			typeItems[typeItems.length] = 
				{xtype:'radio', width:60, style:t, boxLabel:jx.wf.end, name:'checkType', inputValue:'C', listeners: ltr};//'完成'
		}
		
		//如果是多人审批节点，则只有同意与不同意两个节点，M不同意用于多人节点，统计同意人数
		if (nodeAttr.mustAgreeNum > '0') {
			typeItems = [
				{xtype:'radio', width:60, style:t, boxLabel:jx.wf.agree, name:'checkType', inputValue:'Y', checked:true, listeners: ltr},//'同意'
				{xtype:'radio', width:80, style:t, boxLabel:jx.wf.nagree, name:'checkType', inputValue:'M', listeners: ltr}	//'不同意'
			];
			//隐藏重新分配人
			if (parseInt(nodeAttr.mustAgreeNum) < 9) {
				JxUtil.delay(1000, function(){
					var form = self.taskForm.getForm();
					var reUser = form.findField('wf_task__next_user');	
						reUser.hide();
				});
			}
		}
		
		var typePanel = {
			anchor:'100%', layout:'column',	
			items:[{
				columnWidth:0.50, 
				xtype:'compositefield',
				style:'padding:8px 5px 0 10px; font-size:15px;',
				items:[typeItems]
			},{
				columnWidth:0.50, 
				layout:'form', 
				items:[{
					cls:'x-btn-white',
					xtype:'button',
					text:'选择审批意见',
					anchor:'25%', style:'float:right;',
					handler:function(){
						self.selCheckDesc();
					}
				}]
			}]
		};
		
		return typePanel;
	},
	
	
	//选择同意模版
	selCheckDesc : function(){
		var self = this;
		selcfg={
		    pageType: 'editgrid',
		    nodeId: 'wf_agree_text',
		    layoutPage: '',
		    sourceField: 'wf_agree_text.agree_text',
		    targetField: 'wf_task.check_desc',
		    //whereSql: "v_wf_assignsel.fun_id = ? and v_wf_assignsel.data_id = ?",
		    //whereValue: curFunId+";"+curDataId,
		    //whereType: 'string;string',
		    isSame: '0',
		    isShowData: '1',
		    isMoreSelect: '0',
		   // isReadonly: '0'
		};
		var form = self.taskForm.getForm();
		var fdesc = form.findField('wf_task__check_desc');
		JxSelect.createSelectWin(selcfg, fdesc, 'check_work_form');
	},
	
	
	//显示历史审批意见
	showHischeck: function() {
		var self = this;
		var tabs = self.tabs;
		var hdcall = function(data) {
			var html = self.createHisHtml(data);
			var ct = tabs.getComponent(0);
			ct.getComponent(0).update(html);
			//审批提交后显示最新一条审批意见
			JxUtil.delay(200, function(){
				var h = ct.getComponent(0).getHeight() + ct.getComponent(1).getHeight();
				if (ct.items.getCount() == 3) {
					h += ct.getComponent(2).getHeight();
				}
				ct.setHeight(h);
				if (h > 540) tabs.setHeight(h+60);
			});
		};
		//显示当前数据的所有历史审批意见，包括子过程与父过程，如果采用过程实例ID查询会非常复杂，不能兼顾子过程的历史记录
		var params = 'funid=wf_assign&eventcode=queryhischk';
		params += '&check_funid='+ self.assignData.funId +'&keyid='+ self.assignData.dataId;
		Request.dataRequest(params, hdcall);
	},
	
	//查询当前审批人
	showProcess:function(){
		var self = this;
		var hdCall = function(data) {
			var html = self.createUserHtml(data);
			var ct = self.tabs.getComponent(0);
			ct.getComponent(1).update(html);
		};
		
		//从后台查询任务信息
		var params = 'funid=wf_assign&eventcode=queryassign';
		params += '&check_funid='+ self.assignData.funId +'&keyid='+ self.assignData.dataId;
		Request.dataRequest(params, hdCall);
	},
	
	/**
	*  创建当前分配人的信息
	**/
	createUserHtml:function(msgJson){
		var tableTpl = new Ext.Template(
			'<div class="check-title">当前审批人</div>',
			'<ul class="user-list">',
				'{rows}',
			'</ul>'
		);
		var rowTpl = new Ext.Template(
				'<li class="user-title" assginid={assign_id} dataid={data_id} funid={fun_id} taskid={task_id} title="{assign_user}">',
					'<div userid={assign_userid}>',
					'<i class="fa fa-user"></i>',
					'<span>{assign_user}</span>',
					'</div>',
					/*'<ul class="user-info">',
					'<li>',
					'任务状态：{run_state}',
					'</li>',
					'<li>',
					'审批节点：{node_title}',
					'</li>',
					'<li>',
					'任务描述：{task_desc}',
					'</li>',
					'<li>',
					'开始时间：{start_date}',
					'</li>',
					'<li>',
					'截止时间：{limit_date}',
					'</li>',
					'</ul>',*/
				'</li>'
		);
		if (!msgJson.length) {
			return '';
		}
		
		var rows = [];
		for (var i = 0; i < msgJson.length; i++) {
			rows[i] = rowTpl.apply(msgJson[i]);
		}
		var cfg = {rows:rows.join('')};
		return tableTpl.apply(cfg);
	},
	
	/**
	*  创建历史审批意见
	**/
	createHisHtml:function(msgJson){
		var tableTpl = new Ext.Template(
			//'<div class="x-check-his">',
				'<div class="his-title">历史审批意见</div>',
				'<ul class="his-list">',
					'{rows}',
				'</ul>'
			//'</div>'
		);
		
		var rowTpl = new Ext.Template(
			'<li class="his-body" assginid={assign_id} dataid={data_id} funid={fun_id} taskid={task_id}>',
				'<div class="his-time">',
					'<span>{check_date}</span>',
					'<i class="fa fa-circle"></i>',
				'</div>',
				'<div class="his-ctn">',
					'<div class="ctn-title">',
						'<span class="main">{check_user} - {check_type}</span>',
						'<span class="det">{node_title}</span>',
						//'<span>{is_timeout}</span>',
						//'<span class="det">{start_date}</span>',
						//'<span class="det">{limit_date}</span>',
					'</div>',
					'<div class="ctn-msg">',
						'<span>{check_desc}</span>',
					'</div>',
				'</div>',
			'</li>'
		);
		
		var gettype = function(type){
			var datas = ComboData['checktype'];
			for (var i = 0; i < datas.length; i++) {
				if (type == datas[i][0]) return datas[i][1];
			}
			return type;
		};
		var rows = [];
		for (var i = 0; i < msgJson.length; i++) {
			var type = msgJson[i]['check_type'];
			msgJson[i]['check_type'] = gettype(type);
			var desc = msgJson[i]['check_desc'];
			msgJson[i]['check_desc'] = desc.replace(/\n/g, '<br>');
			var cdate = msgJson[i]['check_date'];
			msgJson[i]['check_date'] = JxUtil.shortTime(cdate);
			
			if (desc == '-') {
				msgJson[i]['check_type'] = '发起人';
				msgJson[i]['node_title'] = '';
			}
			
			rows[i] = rowTpl.apply(msgJson[i]);
		}
		var cfg = {rows:rows.join('')};
		if (rows.length == 0) {
			cfg = {rows:'<li class="x-work-nodata">没有审批意见</li>'};
		}
		return tableTpl.apply(cfg);
	},
	
	
	/**
	* public 显示流程图对话框，JxUtil.showCheckMap中调用。
	* flag -- 只标记节点，不需要重新加载流程图
	**/
	showMap: function(flag) {
		var self = this;
		self.curCellIds = '';
		var hdCall = function(data) {
			//IE8中如果panel没有显示就加载workflow，会造成文字错位
			if (self.tabs && JxExt.getIE() < 9 && JxExt.isIE) {
				self.tabs.activate(self.tabs.items.get(1));
			}
		
			//取当前到达的节点
			var nodeIds = data.nodeIds.split(',');
			if (flag) {
				if (self.lastns) {//清除之前的标记
					for (var i = 0, n = self.lastns.length; i < n; i++) {
						self.cleanCurNode(self.lastns[i]);
					}
				}
				//只标记当前节点
				for (var i = 0, n = nodeIds.length; i < n; i++) {
					self.flagCurNode(nodeIds[i]);
				}
				
				if (self.tabs && JxExt.getIE() < 9 && JxExt.isIE) {
					self.tabs.activate(self.tabs.items.get(0));
				}
			} else {
				//显示流程图
				self.readDesign(data.processId, nodeIds);
			}
			//记录上次标记节点
			self.lastns = nodeIds;
		};
		
		//从后台查询任务信息
		var params = 'funid=wf_assign&pagetype=chkgrid&eventcode=querynode';
		params += '&check_funid='+ self.assignData.funId +'&keyid='+ self.assignData.dataId;
		Request.dataRequest(params, hdCall);
	},
	
	/**
	 * 从系统中读取设计文件
	 * processId -- 过程定义ID
	 * nodeIds -- 当前节点数组
	 **/
	readDesign: function(processId, nodeIds) {
		var self = this;
		//创建流程图编辑器，先检查加载图形库
		JxUtil.loadJxGraph();
		self.editor = new mxCanvas('lib/graph/config/showeditor.xml');
		//设置编辑器为只读
		var graph = self.editor.graph;
		graph.setEnabled(false);

		//读取设计文件后的回调函数
		var hdCall = function(xmlfile) {
			if (xmlfile == null || xmlfile.length == 0) { 
				return false;
			}

			var doc = mxUtils.parseXml(xmlfile);
			var dec = new mxCodec(doc);
			dec.decode(doc.documentElement, graph.getModel());
			//标记当前节点
			for (var i = 0, n = nodeIds.length; i < n; i++) {
				self.flagCurNode(nodeIds[i]);
			}
			
			//设置审批节点的鼠标与移入移出效果
			var track = new mxCellTracker(graph);
			track.mouseMove = function(sender, me) {
				var cell = this.getCell(me);
				if (cell && self.isTask(cell)) {
					//设置鼠标为样式为手状
					me.getState().setCursor('pointer');
					if (this.cur_cell == null) {
						this.cur_cell = cell;
						//设置鼠标移入节点效果
						self.moveNode(cell, true);
					}
					//设置提示信息位置
					var tip = self.getTip();
					tip.setPosition(me.getX()+20, me.getY()-10);
				} else {
					//设置鼠标移出节点效果
					self.moveNode(this.cur_cell, false);
					this.cur_cell = null;
				}
			};
			
			if (self.tabs && JxExt.getIE() < 9 && JxExt.isIE) {
				self.tabs.activate(self.tabs.items.get(0));
			}
		};

		//从数据库中读取设计文件
		var params = 'funid=wf_process&eventcode=readdesign&pagetype=formdes';
			params += '&process_id='+ processId;
		Request.dataRequest(params, hdCall, {type:'xml', wait:true});
	},
	
	/**
	 * 给指定节点加上标记
	 * cellId -- 节点ID
	 **/
	flagCurNode: function(cellId) {
		var self = this;
		var model = self.editor.graph.getModel();
		var curCell = model.getCell(cellId);
		model.beginUpdate();
		try {
			self.editor.graph.setCellStyles("strokeColor", "red", [curCell]);
			self.editor.graph.setCellStyles("strokeWidth", "2", [curCell]);
		} finally {
			model.endUpdate();
		}
		self.curCellIds += cellId+';';
	},
	
	//清除之前的结点标记
	cleanCurNode: function(cellId) {
		var self = this;
		var model = self.editor.graph.getModel();
		var curCell = model.getCell(cellId);
		model.beginUpdate();
		try {
			self.editor.graph.setCellStyles("strokeColor", "#C3D9FF", [curCell]);
			self.editor.graph.setCellStyles("strokeWidth", "0", [curCell]);
		} finally {
			model.endUpdate();
		}
	},
	
	//----------------------在流程状态图中查看当前审批人-------------------------
	//private 检查是否为审批节点
	isTask: function(cell) {
		if (cell == null) return false;
		
		var enc = new mxCodec();
		var node = enc.encode(cell);
		var nodetype = node.getAttribute('nodetype');
		if (nodetype == 'task') {
			return true;
		}
		return false;
	},
	/**
	 * 给指定的节点设置背景色
	 * cell -- 当前节点
	 * isin -- true 表示鼠标在节点上，false 表示鼠标没在节点上
	 **/
	moveNode: function(cell, isin) {
		var self = this;
		if (cell == null) return;
		if (isin) {
			self.queryUser(cell.id);
		} else {
			self.getTip().hide();
		}
		
		var oldcolor = "#87CEFA";
		if (self.curCellIds.indexOf(cell.id+';') >= 0) {
			oldcolor = "red";
		}
		var model = self.editor.graph.getModel();
		model.beginUpdate();
		try {
			self.editor.graph.setCellStyles("strokeColor", isin?"#A1A1FF":oldcolor, [cell]);
			self.editor.graph.setCellStyles("fillColor", isin?"#A1A1FF":"#87CEFA", [cell]);
		} finally {
			model.endUpdate();
		}
	},
	
	queryUser: function(nodeid){
		var self = this;
		var tip = self.getTip();
		var hdCall = function(data){
			if (Ext.isEmpty(data)) return;
			
			var msg = data.msg;
			var n = data.users.length;
			tip.show();
			if (n > 0) {
				msg = '审批人：';
				for (var i = 0; i < n; i++) {
				 	msg += data.users[i].user_name+'、';
				}
				msg = msg.substr(0, msg.length-1);
			}
			tip.el.dom.innerHTML = "<span style='color:#fff;'>"+msg+"</span>";
		};
		
		//从后台查询审批人信息
		var params = 'funid=wf_assign&pagetype=chkgrid&eventcode=queryuser&nodeid='+nodeid;
		params += '&check_funid='+ self.assignData.funId +'&keyid='+ self.assignData.dataId;
		Request.dataRequest(params, hdCall);
	},
	
	getTip: function() {
		var vid = 'x-show-checkuser';
		var tip = Ext.getCmp(vid);
		if (!tip) {
			tip = new Ext.Tip({id:vid});
			//点击任何位置，关闭提示
			Ext.getBody().on('click', function(){
				if (tip.isVisible()) {
					tip.hide();
				}
			});
		}
		
		return tip;
	}
};