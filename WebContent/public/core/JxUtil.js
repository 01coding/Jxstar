/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 公共方法工具类。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */
JxUtil = {};

(function(){
	var rules = null;
	
	Ext.apply(JxUtil, {
		//是否系统退出标志，防止浏览器的刷新事件
		isLogout: false,
		/**
		 * 退出系统，删除当前用户的会话
		 **/
		logout: function(isF5) {
			var hdcall = function() {
				//退出后再刷新，如果把reload放到回调函数外，IE中向后退发送的请求参数为空
				var params = 'funid=login&pagetype=login&eventcode=logout';
				Request.postRequest(params, function(){
					JxUtil.isLogout = true;
					var href = Jxstar.path;
					if (JxLang.curLang) href = Jxstar.path + '/index.jsp?currLang=' + JxLang.curLang;
					if (Jxstar.logoutUrl) {
						if (JxLang.curLang) {
							href = Jxstar.logoutUrl + '&currLang=' + JxLang.curLang;
						} else {
							href = Jxstar.logoutUrl;
						}
					}
					window.location.href = href;
				});
			};
			//如果是通过刷新退出系统
			if (isF5 == true) {return;}//hdcall(); 先不退出系统，影响操作
			
			//确定退出系统吗？
			Ext.Msg.confirm(jx.base.hint, jx.base.logoutok, function(btn) {
				if (btn == 'yes') hdcall();
			});
		},
		/**
		 * 判断css样式在main.css中是否存在
		 **/
		getRule: function(selector) {
			if (rules == null) {
				rules = {};
				var ss = document.styleSheets;
				var len = ss.length;
				var str = '';
				for (var i = 0; i < len; i++) {
					if (ss[i].href && ss[i].href.indexOf('main.css') >= 0) {
						var css = ss[i].cssRules;
						for (var j = 0; j < css.length; j++) {
							var names = css[j].selectorText.toLowerCase().split(',');
							for (var k = 0; k < names.length; k++) {
								var n = names[k].trim();
								if (n.length > 0) rules[n] = css[j];
								str += n + '; ';
							}
						}
					}
				}
			}
			if (rules) {
				return rules[selector.toLowerCase()];
			}
		},
		/**
		 * 把功能菜单添加到权限数组中
		 **/
		putRightNodes: function(datas) {
			for (var i = 0; i < datas.length; i++) {
				var m = datas[i];
				if (m.leaf) {
					Jxstar.rightNodes.push(m.id);
				} else {
					if (m.children) JxUtil.putRightNodes(m.children);
				}
			}
		},
		/**
		* 将字符串中的字符转为有规律的数字，ascll码值  
		**/
		strToNum:function(content){
			content = content.replace(/\"/g, "#o034");
			content = content.replace(/\'/g,"#o039");
			content = content.replace(/\r\n/g,"#o013#o010");
			content = content.replace(/\r/g,"#o013");
			content = content.replace(/\n/g,"#o010");
			content = content.replace(/\t/g,"#o009");
			content = content.replace(/\\/g,"#o092");
			content = content.replace(/&/g,"#o025");
			content = content.replace(/\+/g,"#o02B");
			content = content.replace(/%/g,"#o026");	
			return content;
		},
		/**
		* 将字符串中有规律的数字转为特定字符，ascll码值  
		**/
		numToStr: function(content){
			content = content.replace(/\#o034/g,"\"");
			content = content.replace(/\#o039/g,"\'")
			content = content.replace(/\#o013#o010/g,"\r\n");
			content = content.replace(/\#o010/g,"\n");
			content = content.replace(/\#o013/g,"\r");
			content = content.replace(/\#o009/g,"\t");
			content = content.replace(/\#o092/g,"\\");
			content = content.replace(/\#o025/g,"&");
			content = content.replace(/\#o02B/g,"+");
			content = content.replace(/\#o026/g,"%");
			return content;
		},
		
		/**
		* 构建新的主键值
		*/
		getId : function() {
			var t = (new Date()).getTime();
			t++;
			return 'jx-'+t;
		},
		
		/**
		* 计算树形ID的级别
		*/
		calTreeLevel : function(treeId) {
			if (!treeId || treeId.length == 0 || treeId.length < 4) return 0;
			
			if (treeId.indexOf('-') >= 0) {
				treeId = treeId.split('-')[1];
			}
			return Math.floor(treeId.length/4);
		},
		
		/**
		 * 执行js脚本
		 **/
		eval: function(js) {
			try {
				if (window.execScript) {
				   window.execScript(js);
				} else {
				   window.eval(js);
				}
			} catch(e) {
				console.error('JxUtil.eval '+js+'; error: '+e);
			}
		},
		
		//显示导入文件的对话框
		showImpWin: function(params, hdcall) {
			var queryForm = new Ext.form.FormPanel({
				layout:'form', 
				labelAlign:'right',
				labelWidth:80,
				border:false, 
				baseCls:'x-plain',
				autoHeight: true,
				bodyStyle: 'padding: 20px 10px 0 10px;',
				defaults: {
					anchor: '95%',
					allowBlank: false,
					msgTarget: 'side'
				},
				items: [{
					xtype: 'fileuploadfield',
					useType: 'file',
					fieldLabel: jx.event.selfile,	//选择文件
					name: 'import_file',
					buttonText: '',
					maxLength: 200,
					buttonCfg: {
						iconCls: 'upload_icon'
					}
				}]
			});

			//创建对话框
			var self = this;
			var win = new Ext.Window({
				title:'选择文件',
				layout:'fit',
				width:400,
				height:170,
				resizable: false,
				modal: true,
				closeAction:'close',
				items:[queryForm],

				buttons: [{
					text:jx.base.ok,
					handler:function(){
						var form = queryForm.getForm();
						if (!form.isValid()) return;
						
						var hd = function(data){
							win.close();
							if (hdcall) hdcall(data);
						};
						
						//上传附件
						Request.fileRequest(form, params, hd);
					}
				},{
					text:jx.base.cancel,
					handler:function(){win.close();}
				}]
			});
			win.show();
		},
		
		//加载IM工具，一般小项目不启用此套件，移动端默认启用
		loadIM: function(ct) {
			var showed = Jxstar.systemVar.sys__im__showed || '0';
			if (showed.length == 0 || showed == '0') return;
			
			var el = ct.getComponent(0).getEl();
			var imicon = el.insertHtml("afterBegin", "<div id=\"div_imicon\" class=\"x-imicon\" title=\"企业微信\"><i class=\"fa fa-weixin\"></i><span class=\"badge badge-important pull-top\"></span></div>");
			window.imicon = imicon;
			Ext.get(imicon).on("click", function(){
				JxUtil.showIM();
			});
			
			//取IM用户信息
			var params = 'funid=im_event&eventcode=im_login';
			Request.postRequest(params, function(data){
				var str = Ext.encode(data);
				localStorage.setItem('curruser_im', str);
			});
		},
		
		//显示IM工具
		showIM: function() {
			window.open(Jxstar.path + '/cloud/im/index.html?_dc=' + (new Date()).getTime());
		},
		
		//显示个人信息设置
		showUser: function() {
			var userid = Jxstar.session['user_id'];
			var define = Jxstar.findNode('sys_user');
			JxUtil.openFunPage(define, define.formpage, '个人设置', userid);
		},
		
		//显示租户信息
		showTenants: function() {
			var ts = Jxstar.tenants, e = encodeURIComponent;
			if (!ts) return;
			
			var login = function(ten){
				var params = 'funid=login&pagetype=login&eventcode=logout';
				Request.postRequest(params, function(){
					var params = 'funid=login_event&eventcode=cloud_login&user_code='+Jxstar.session['user_code']+'&user_pwd='+ts.myx+'&not_verify=1'+
								 '&tenant_id='+ten.tenant_id+'&tenant_name='+e(ten.tenant_name);
					Request.postRequest(params, function(data){
						win.close();
						Jxstar.viewport.destroy();
						Jxstar.session = data;
						Request.loadJS('/public/core/JxBody.js');
					}, {errorcall:function(){
						window.location.href = Jxstar.path+'/index.jsp';
					}});
				});
			};
			
			var items = [], hi = 80, v = ts.info;
			for (var i = 0; i < v.length; i++) {
				hi += 60;
				items[i] = {xtype:'button', ten:v[i], text:v[i].tenant_name, 
							width:250, height:40, margins:'20 20 0 20', handler:function(b){
								login(b.initialConfig.ten);}};
			}
			var win = new Ext.Window({
				title:'选择公司',
				width: 300,
				height: hi,
				layout:'vbox',
				items:items
			});
			win.show();
		},
		
		/**
		 * 显示当前在线用户
		 **/
		onLineUser: function() {
			var hdcall = function(grid) {
				Jxstar.loadInitData(grid);
			};
			var define = Jxstar.findNode('sys_user_login');
			Jxstar.showData({
				filename: define.gridpage,
				title: define.nodetitle,
				pagetype: 'notool',
				width: 600,
				height: 350,
				callback: hdcall
			});
		},
		
		/**
		 * 动态加载功能定义数据：
		 * 如果在网速比较慢时使用会影响加载速度，直接放到index_top中了，不使用此方法了。
		 **/
		loadJxData: function() {
			Ext.fly('loading').dom.innerHTML = jx.util.loading;//'正在加载功能数据文件...';
			Ext.fly('loading').show();
			JxUtil.loadJS('/public/data/NodeDefine.js', true);
			JxUtil.loadJS('/public/data/RuleData.js', true);
			JxUtil.loadJS('/public/locale/combo-lang-'+ JxLang.type +'.js', true);
			Ext.fly('loading').hide();
		},
	
		/**
		 * 动态加载图形库文件
		 * hdcall --  加载图形库后执行的函数
		 **/
		loadJxGraph: function() {
			if (!window.mxClient) {
				//IE11用mxclient-ff.js文件
				var fileName = 'mxclient-ff.jsgz';
				if (Ext.isIE) {
					fileName = 'mxclient-ie.jsgz';
				} else if (Ext.isChrome) {
					fileName = 'mxclient-ch.jsgz';
				}
				//用eval方法在ie中加载报错，用execScript没问题
				JxUtil.loadJS('/lib/graph/js/' + fileName);
				window.mxClient = mxClient;
			}
		},
		
		/**
		 * 同步加载js文件，加载后的文件为全局对象；
		 * public目录中的静态文件可以缓存，通过后台类压缩管理；
		 * url --  JS文件路径
		 * nocache -- 是否不使用缓存
		 **/
		loadJS: function(url, nocache) {
			//第1一个字符应该是/
			if (url.charAt(0) != '/') url = '/' + url;
			url = Jxstar.path + url;
			
			//不使用缓存时，加唯一标志
			if (nocache === true) {
				var dc = '?dc=' + (new Date()).getTime();
				url += dc;
			}
			
			var req = new XmlRequest('GET', url, false);
			req.send();
			var js = req.getText();
			
			try {
				if (window.execScript) {
				   window.execScript(js);
				} else {
				   window.eval(js);
				}
			} catch(e) {
				console.error('JxUtil.loadJS '+url+'; error: '+e);
			}
		},
		
		/**
		 * 动态加载css文件
		 * url --  css文件路径
		 * nocache -- 是否不使用缓存
		 **/
		loadCss: function(url, nocache) {
			//第1一个字符应该是/
			if (url.charAt(0) != '/') url = '/' + url;
			url = Jxstar.path + url;
			
			//不使用缓存时，加唯一标志
			if (nocache === true) {
				var dc = '?dc=' + (new Date()).getTime();
				url += dc;
			}
			
			var element = document.createElement("link");   
			element.setAttribute('rel','stylesheet');   
			element.setAttribute('type','text/css');   
			element.setAttribute('href',url);   
			document.getElementsByTagName('head')[0].appendChild(element);   
			return element;
		},
		
		//加载图表库
		loadCharts: function() {
			if (typeof echarts == "undefined") {
				JxUtil.loadJS('/lib/echarts/echarts.min.js');
				JxUtil.loadJS('/lib/echarts/dark.js');
			}
		},
						
		//当前用户是否管理员
		isAdminUser: function(){
			var roleId = Jxstar.session['role_id'];
			return (roleId.indexOf('admin') >= 0);
		},
		
		//选择第一行，并返回选择的记录，如果原来有选择记录，则返回原来选择的记录
		firstRow: function(grid) {
			if (!grid) return [];
			
			var records = JxUtil.getSelectRows(grid);
			if (records.length > 0) return records;
			
			var s = grid.getStore();
			var cnt = s.getCount();
			if (cnt == 0) return [];
			
			var sm = grid.getSelectionModel();
			if (sm.getSelections) {
				sm.selectFirstRow();
			} else {
				sm.select(0, 0);
			}
			return [s.getAt(0)];
		},
		
		//显示一个椭圆审核标志
		showAuditFlag: function(fe) {
			var auditcol = fe.define.auditcol;
			if (Ext.isEmpty(auditcol)) return;
			var record = fe.form.myRecord;
			if (Ext.isEmpty(record)) return;
			
			var getx = function(s){
				var vs = Jxstar.findComboData('audit');
				for (var i = 0, n = vs.length; i < n; i++) {
					if (vs[i][0] == s) return vs[i][1];
				}
				return '';
			};
			var fg = fe.form.getEl().child('div.x-fflag');
			var state = record.get(auditcol);
			var msg = getx(state);
			if (state == '0' || state == '1' || state == '6' || state == '7') {//隐藏标志
				if (fg) fg.hide();
				return;
			} else if (state == '3') {//显示已审批标志
				if (fg) {
					fg.show();
					fg.removeClass('x-fflag-blue');
					fg.dom.innerHTML = msg;
				} else {
					fe.form.getEl().insertHtml('afterBegin', '<div class="x-fflag">'+msg+'</div>');
				}
			} else if (state == '2' || state == '4' || state == '5') {//显示未审批标志
				if (fg) {
					fg.show();
					fg.addClass('x-fflag-blue');
					fg.dom.innerHTML = msg;
				} else {
					fe.form.getEl().insertHtml('afterBegin', '<div class="x-fflag x-fflag-blue">'+msg+'</div>');
				}
			}
		},
		
		//给Combo控件添加: 请选择
		insertEmpty: function(combo){
			if (!combo) return;
			
			var st = combo.store;
			if (!st) return;
			var cnt = st.getCount();
			if (cnt == 0) return;
			
			var record = new (st.reader.recordType)({value:'', text:jx.star.select});//请选择 jx.star.select
			st.insert(0, record);
		},
		
		//取字段所在的列号
		getColumnIndex: function(grid, colname){
			var isCheck = grid.getSelectionModel() instanceof Ext.grid.CheckboxSelectionModel;
		
			var mycols = grid.gridNode.param.cols;
			for (var i = 0, n = mycols.length; i < n; i++) {
				if (mycols[i].col.name == colname) {
					//排除序号列与checkbox列
					return i + (isCheck ? 2:1);
				}
			}
			return -1;
        },
		
		//检查当前表格中选择的记录的值必填项及长度是否有效
		validateGrid: function(grid) {
			//取第二个Tab的表单
			var isReqCheck = true, myForm = null, nnfs = null;
			if (grid.isXType('editorgrid') == false) {
				var f = JxUtil.getMyForm(grid);
				if (f) {
					myForm = f.getForm();
				} else {
					f = JxUtil.getCloudForm(grid);
					if (f) {
						myForm = f.getForm();
					} else {
						//取表格必填字段
						nnfs = grid.gridNode.param.notNullFields;
						if (!nnfs || nnfs.length == 0) {
							//如果是普通表格，又没有找到表单对象；又没有表必填字段
							isReqCheck = false;
						}
					}
				}
			}
			
			if (isReqCheck == false) return true;
			
			var cm = grid.getColumnModel();
			var records = JxUtil.getSelectRows(grid);
			var hint = function(record, name){
				var index = grid.getStore().indexOf(record);
				var label = cm.getColumnHeader(cm.findColumnIndex(name));
				var hint = String.format(jx.event.auditvalid, index+1, label);
				JxHint.alert(hint);	//第【{0}】条记录的【{1}】数据不完整！
				return false;
			};
			
			for (var i = 0; i < records.length; i++) {
				var record = records[i];
				var fields = record.fields.keys;
				for (var j = 0; j < fields.length; j++) {
					var name = fields[j];
					var value = record.data[name];
					if (value == null) value = '';
					
					//判断必填字段
					if (nnfs && nnfs.length > 0) {
						if (nnfs.indexOf(name+';') >= 0 && value.length == 0) {
							return hint(record, name);
						}
					}

					//如果可编辑表格，则取表格字段，否则取表单字段
					var field = null;
					if (grid.isXType('editorgrid')) {
						var colIndex = cm.findColumnIndex(name);
						var rowIndex = grid.getStore().indexOfId(record.id);
						var editor = cm.getCellEditor(colIndex, rowIndex);
						if (editor) field = editor.field;
					} else {
						if (myForm) {
							field = myForm.findField(name);
						}
					}
					
					if (field != null && !field.validateValue(value)) {
						return hint(record, name);
					}
				}
			}
			return true;
		},
		
		//提交前，检查子表数据是否保存
		checkSubGrid: function(fpage) {
			//取明细表的panel
			var subps = fpage.subgrids;
			if (subps == null || subps.length == 0) return true;
			
			for (var i = 0; i < subps.length; i++) {
				var subgrid = subps[i].getComponent(0);
				if (subgrid.isXType('grid')) {
					var store = subgrid.getStore();
					var mrow = store.getModifiedRecords();
					if (mrow.length > 0) {
						JxHint.alert(subps[i].title + jx.util.subno);//'子表数据没有保存，不能执行此操作！'
						return false;
					}
				}
			}
			return true;
		},
		
		//添加附件类型控件，增加index参数方便设置初始显示类型
		addAttachCombo: function(grid, combocode, index) {
			index = index || 0;
			grid.attachTypeCombo = function() {
				var typedata = Jxstar.findComboData(combocode);
				return {
					anchor:'60%',
					xtype:'combo',
					name:'attach_type_combo',
					fieldLabel:jx.util.doctype,//'资料类型',
					store: new Ext.data.SimpleStore({
						fields:['value','text'],
						data: typedata
					}),
					emptyText: jx.star.select,
					mode: 'local',
					triggerAction: 'all',
					valueField: 'value',
					displayField: 'text',
					editable:false,
					value: typedata[index][0]
				};
			};
		},
		
		//根据表格取表单对象
		getMyForm: function(myGrid) {
			var tabPanel = myGrid.findParentByType('tabpanel');
			if (tabPanel == null) return null;
			if (tabPanel.getComponent(1) == null) return null;
			
			var formPanel = tabPanel.getComponent(1).getComponent(0);
			if (formPanel == null || !formPanel.isXType('form')) {
				return null;
			}
			return formPanel;
		},
		
		//取云布局中的表格
		getCloudForm: function(myGrid) {
			var funid = myGrid.gridNode.nodeId;
			var layout = JxCloud.apps[funid];
			if (!layout) return;
			var fpage = layout.getComponent(1);
			if (!fpage) return;
			
			//修改多tab的form取不到对象的问题
			var cform = fpage.getComponent(0);
			if (!cform || cform.isXType('form') == false) {			
				 cform = fpage.getComponent(0).getComponent(0);
			}
			
			return cform;
		},
		
		//根据表单取表格对象
		getMyGrid: function(myForm) {
			//取到tab控件，而后取第一个页面中的表格
			var tabPanel = myForm.findParentByType('tabpanel');
			if (!tabPanel || tabPanel.isXType('tabpanel') == false) {
				return;
			}
			
			var grid = tabPanel.getComponent(0).getComponent(0);
			if (!grid || grid.isXType('grid') == false) {
				return;
			}
			
			return grid;
		},
		
		//在功能区域的表单或子表中取得父功能的表格
		getParentGrid: function(childCmp) {
			if (!childCmp) return;
			//增加参数parentGrid，方便在复杂布局中自定义父表格
			var pg = childCmp.parentGrid;
			if (pg && pg.isXType('grid')) return pg;
			var gn = childCmp.gridNode;
			if (gn && gn.define.isCloud) {
				return JxUtil.getParentForm(childCmp).myGrid;
			}
			
			//取到tab控件，而后取第一个页面中的表格
			var tabPanel = childCmp.findParentByType('tabpanel');
			if (!tabPanel || tabPanel.isXType('tabpanel') == false) {
				return;
			}
			
			var grid = tabPanel.getComponent(0).getComponent(0);
			if (!grid || grid.isXType('grid') == false) {
				return;
			}
			
			return grid;
		},
		
		//根据form在的子表取到父form对象
		getParentForm: function(subGrid, isCmp) {
			var form = subGrid.findParentByType('form');
			if (Ext.isEmpty(form)) {
				var tabPanel = subGrid.findParentByType('tabpanel');
				if (!tabPanel) return null;
				
				var pform = tabPanel.getComponent(1);
				if (!pform) return null;
				
				form = pform.getComponent(0);
				if (!form || form.isXType('form') == false) return null;
			}
			if (isCmp) {
				return form;
			} else {
				return form.getForm();
			}
		},
		
		//在功能区域的表格或表单中取到布局页面中的树形控件
		getLayoutTree: function(childCmp) {
			var tabPanel;
			//如果是云布局，则直接取功能布局
			if (childCmp.formNode) {
				var define = childCmp.formNode.define;
				if (define.isCloud) {
					tabPanel = JxCloud.apps[define.nodeid];
				}
			}
			if (!tabPanel) {
				//取到tab控件，再取上级容器对象
				tabPanel = childCmp.findParentByType('tabpanel');
				if (!tabPanel || tabPanel.isXType('tabpanel') == false) return null;
			}
			
			//左边第一个子控件是树
			var tree = tabPanel.ownerCt.ownerCt.getComponent(0).getComponent(0);
			if (!tree || tree.isXType('treepanel') == false) return null;
			
			return tree;
		},
		
		//给树形控件添加本级选项
		treeAddCheck: function(tree) {
			if (!tree) return;
			var tool = tree.getTopToolbar();
			var tools = tree.getTopToolbar().find('xtype', 'checkbox');
			if (tools.length > 0) return;
			
			tool.insert(1, '->');
			tool.insert(2, {xtype:'checkbox', boxLabel:jx.util.curlevel});//'本级'
			tool.doLayout();
		},
		
		//显示表格合计数据在分页工具栏中
		viewSumData: function(grid) {
			var bbar = grid.getBottomToolbar();
			if (!bbar) return;
			
			var sumdata = grid.getStore().reader.jsonData.data.sum;
			if (Ext.isEmpty(sumdata)) return;
			sumdata = sumdata[0];
			
			var cm = grid.getColumnModel();
			var sumText = jx.util.total;//'合计:';
			Ext.iterate(sumdata, function(key, value){
				var header = cm.getColumnById(key).header;
				
				sumText += header + '：' + value + ' ';
			});
			
			var sumItem = bbar.sumItem;
			if (Ext.isEmpty(sumItem)) {
				var idx = bbar.items.indexOf(bbar.refresh);
				sumItem = new Ext.Toolbar.TextItem(sumText);
				
				bbar.insert(idx + 1, new Ext.Toolbar.Separator());
				bbar.insert(idx + 2, sumItem);
				
				bbar.sumItem = sumItem;
			} else {
				sumItem.setText(sumText);
			}
			bbar.doLayout();
		},
		
		/**
		 * 显示FORM表单的对话框
		 * {wincfg, formcfg, okcall, nocall} -- 表单配置信息，参数：{items:[], width:200, height:100}
		 * okcall -- 确定的回调函数
		 **/
		formWindow: function(config) {
			var formcfg = {
				layout:'form'
			};
			formcfg = Ext.apply(formcfg, config.formcfg||{});
			var winForm = new Ext.form.FormPanel(formcfg);

			//创建对话框
			var self = this;
			var wincfg = {
				title:jx.base.inputtext,
				layout:'fit',
				width:config.width||400,
				height:config.height||160,
				resizable: false,
				modal: true,
				closeAction:'close',
				items:[winForm],

				buttons: [{
					text:jx.base.ok,	//确定
					handler:function(){
						if (config.okcall){
							config.okcall(winForm.getForm(), win);
						} else {
							win.close();
						}
					}
				},{
					text:jx.base.cancel,	//取消
					handler:function(){
						if (config.nocall){
							config.nocall(win);
						} else {
							win.close();
						}
					}
				}]
			};
			wincfg = Ext.apply(wincfg, config.wincfg||{});
			var win = new Ext.Window(wincfg);
			win.show();
		},
		
		/**
		 * 修改密码
		 * userId -- 需要修改密码的用户ID
		 **/
		setPass : function(userId, loginFn) {
			//密码输入界面
			var passForm = new Ext.form.FormPanel({
				layout:'form', 
				labelAlign:'right',
				style: 'padding:20px 10px 0 0 ;',
				border: false,
				frame: false,
				baseCls: 'x-plain',
				items:[//'原密码'
					{xtype:'textfield', fieldLabel:jx.sys.oldpwd, name:'modfiy_pass__old_pass', inputType: 'password', 
						allowBlank:false, labelSeparator:'*', labelStyle:'color:#0077FF;', anchor:'100%', maxLength:20},//'新密码'
					{xtype:'textfield', fieldLabel:jx.sys.newpwd, id:'modfiy_pass__new_pass', inputType: 'password', 
						allowBlank:false, labelSeparator:'*', labelStyle:'color:#0077FF;', anchor:'100%', maxLength:20},//'确认新密码'
					{xtype:'textfield', fieldLabel:jx.sys.conpwd, id:'modfiy_pass__confirm_pass', inputType: 'password', 
						allowBlank:false, labelSeparator:'*', labelStyle:'color:#0077FF;', anchor:'100%', maxLength:20}
				]
			});

			//显示修改密码的界面
			var win = new Ext.Window({
				title:jx.sys.modpwd,	//'修改密码'
				layout:'fit',
				width:350,
				height:260,
				resizable: false,
				modal: true,
				closeAction:'close',
				items:[passForm],

				buttons: [{
					text:jx.base.ok,	//'确定'
					handler:function(){
						//数据校验
						if (!passForm.getForm().isValid()) {
							JxHint.alert(jx.event.datavalid);	//'请确保输入的数据正确完整！'
							return;
						}
						
						var myform = passForm.getForm();
						var oldpass = myform.findField('modfiy_pass__old_pass').getValue();
						var newpass = myform.findField('modfiy_pass__new_pass').getValue();
						var confirmpass = myform.findField('modfiy_pass__confirm_pass').getValue();
						
						if (newpass != confirmpass) {
							JxHint.alert(jx.sys.twopwd);	//'请确保两次输入的新密码相同！'
							return;
						}
						
						//请求参数
						var params = 'funid=sys_user&oldpass='+ oldpass +'&newpass='+ newpass;
						params += '&keyid=' + userId;
						params += '&pagetype=editgrid&eventcode=setpass';
						
						//发送后台请求
						Request.postRequest(params, function(data, extd){
							win.close();
							//登录时修改密码成功，然后直接登录
							if (loginFn) loginFn();
						});
					}
				},{
					text:jx.base.cancel,	//'取消'
					handler:function(){win.close();}
				}]
			});
			win.show();
		},
		
		/**
		 * 审批过程中，显示表单中可以编辑的字段
		 * nodeId -- 功能ID
		 * dataId -- 数据ID
		 * form -- 表单对象
		 **/
		showCheckEdit: function(nodeId, dataId, form) {
			var self = this;
			
			var hdCall = function(data) {
				//取当前申请节点可以编辑的字段
				var editFields = data.editFields;
				if (editFields.length == 0) return;
				
				var fields = editFields.split(';');
				//alert('fields=' + fields);
				for (var i = 0; i < fields.length; i++) {
					if (fields[i].length > 0) {
						//alert('replace=' + fields[i].replace('.', '__'));
						var field = form.findField(fields[i].replace('.', '__'));
						if (field) field.setReadOnly(false);
					}
				}
			};
			
			//从后台查询任务信息
			var params = 'funid=wf_assign&pagetype=chkgrid&eventcode=queryfield';
			params += '&check_funid='+ nodeId +'&keyid='+ dataId;
			Request.dataRequest(params, hdCall);
		},
		
		/**
		 * 审批过程中，显示表单中：改编辑、改只读、改显示、改隐藏 的字段
		 * pos 0 - 开始、1 - 审批、2 - 预览
		 **/
		showCheckField: function(nodeId, dataId, form, pos, isaudit) {
			var self = this;
			var sets = function(cols, type){
				if (!cols || cols.length == 0) return;
				
				var fields = cols.split(';');
				//alert('fields=' + fields + '; type='+type);
				for (var i = 0; i < fields.length; i++) {
					var fn = fields[i].replace('.', '__');
					if (fn.length == 0) continue;
					
					var field = form.findField(fn);
					if (!field) continue;
					
					if (type == '0') {
						field.setReadOnly(false);//改编辑
					} else if (type == '1') {
						field.setReadOnly(true);//改只读
					} else if (type == '2') {
						field.show();//改显示
					} else {
						field.hide();//改隐藏
					}
				}
			};
			
			//先编辑再只读、先显示再隐藏
			var hdCall = function(data) {
				if (!isaudit) {//已归档的记录不做处理
					sets(data.editFields, '0');
				}
				sets(data.onlyFields, '1');
				sets(data.showFields, '2');
				sets(data.hideFields, '3');
			};
			
			var params;
			if (pos == '0') {//单据界面
				params = 'funid=wf_node_field&eventcode=startfield&wf_funid='+ nodeId +'&data_id='+ dataId;
			} else if (pos == '1') {//审批界面
				params = 'funid=wf_node_field&eventcode=wffields&wf_funid='+ nodeId +'&data_id='+ dataId;
			} else {//预览界面
				params = 'funid=wf_node_field&eventcode=prefield&nodeid='+ nodeId +'&processid='+ dataId;
			}
				
			//从后台查询任务信息
			Request.dataRequest(params, hdCall);
		},
		
		/**
		 * 审批过程中，显示表单中可以编辑的字段
		 * nodeId -- 功能ID
		 * dataId -- 数据ID
		 * form -- 表单对象
		 **/
		showCheckEdit: function(nodeId, dataId, form, toolBar) {
			var self = this;
			
			var hdCall = function(data) {
				//取当前申请节点可以编辑的字段
				var editFields = data.editFields;
				if (editFields.length == 0) return;
				
				var fields = editFields.split(';');
				//alert('fields=' + fields);
				for (var i = 0; i < fields.length; i++) {
					if (fields[i].length > 0) {
						//alert('replace=' + fields[i].replace('.', '__'));
						var field = form.findField(fields[i].replace('.', '__'));
						if (field) field.setReadOnly(false);
					}
				}
				
				//修改保存按钮为可编辑状态
				//var saveBtn = self.getButton(toolBar, 'save');
				//if (saveBtn != null) saveBtn.enable();
			};
			
			//从后台查询任务信息
			var params = 'funid=wf_assign&pagetype=chkgrid&eventcode=queryfield';
			params += '&check_funid='+ nodeId +'&keyid='+ dataId;
			Request.dataRequest(params, hdCall);
		},
	
		/**
		 * 显示待审批的记录
		 * nodeId -- 功能ID
		 * dataId -- 数据ID
		 * userId -- 用户ID
		 **/
		showCheckData: function(nodeId, dataId, userId) {
			//取功能对象信息
			var define = Jxstar.findNode(nodeId);
			if (define == null) {
				JxHint.alert(String.format(jx.star.nopage, nodeId));	//'没有定义【{0}】功能页面信息！'
				return false;
			}
			//缺省审批界面，如果为空则是form
			if (Ext.isEmpty(define.showform)) {
				define.showform = 'form';
			}
			//构建页面参数
			var pkcol = define.pkcol.replace('__', '.');
			var pageParam = {
				pageType: 'check', 
				whereSql: ' exists (select * from wf_assign where run_state = ? and assign_userid = ? and fun_id = ? and data_id = '+ pkcol +')',
				whereValue: '0;'+userId+';'+nodeId,
				whereType: 'string;string;string',
				showType: define.showform,	//指定缺省显示表单页面，grid, form, report，如果为空则是form
				updateId: dataId
			};
			
			if (Ext.isEmpty(define.checkPage)) {
				Jxstar.createNode(nodeId, pageParam);
			} else {
				//支持指定显示审批表单界面，避免晃动的效果
				var pageUrl = define.checkPage;
				var title = define.nodetitle + jx.base.check;
				JxUtil.openFunPage(define, pageUrl, title, dataId, null, 'chkform');
			}
		},
		
		/**
		 * 打开一个指定页面的功能标签
		 */
		openFunPage: function(define, pageurl, title, dataid, hdcall, ptype) {
			if (Ext.isString(define)) {//如果是string表示传递的是funId
				define = Jxstar.findNode(define);
				if (define == null) {
					JxHint.alert(String.format(jx.star.nopage, nodeId));	//'没有定义【{0}】功能页面信息！'
					return;
				}
			}
			
			var id = 'fun_'+define.nodeid+'_xx';
			Request.loadJS(pageurl, function(f){
				if (!ptype) ptype = 'form';
				var page = f().showPage(ptype);
				
				var mainTab = Jxstar.sysMainTab;
				var funTab = mainTab.getComponent(id);
				if (funTab != null) {
					mainTab.remove(funTab, true);
					funTab = null;
				}
				//显示数据
				funTab = mainTab.add({
						id: id,
						label: title,
						border: false,
						layout: 'fit',
						closable: true,
						iconCls: 'function',
						items: [page]
					});
				mainTab.activate(funTab);
				
				var pkcol = define.pkcol.replace('__', '.');
				var mycall = function(page){
					//加载显示数据
					var options = {
						where_sql: pkcol+' = ?',
						where_type: 'string',
						where_value: dataid,
						callback: function(data) {
							if (data.length > 0) {
								var r = page.formNode.event.newRecord(data[0]);
								page.getForm().myRecord = r;
								page.getForm().loadRecord(r);
								page.formNode.event.initForm();
							}
						}
					};
					Jxstar.queryData(define.nodeid, options);
				};
				if (!hdcall) hdcall = mycall;
				hdcall(page);
			});
		},
		
		/**
		 * 显示已审批的记录
		 * nodeId -- 功能ID
		 * dataId -- 数据ID
		 * userId -- 用户ID
		 **/
		showCheckHisData: function(nodeId, dataId, userId) {
			//取功能对象信息
			var define = Jxstar.findNode(nodeId);
			if (define == null) {
				JxHint.alert(String.format(jx.star.nopage, nodeId));	//'没有定义【{0}】功能页面信息！'
				return false;
			}
			
			//构建页面参数
			var pkcol = define.pkcol.replace('__', '.');
			var pageParam = {
				pageType: 'chkqry', //chkqry用chk是查看历史审批意见时不受数据权限控制，如果用check会出现审批按钮显示在工具栏中，用grid会受数据权限控制
				//whereSql: ' exists (select * from wf_assignhis where check_userid = ? and fun_id = ? and data_id = '+ pkcol +')',
				//whereValue: userId+';'+nodeId,
				whereSql: pkcol +' = ?',
				whereValue: dataId,
				whereType: 'string',
				showType: 'form',
				updateId: dataId
			};
			if (Ext.isEmpty(define.checkPage)) {
				Jxstar.createNode(nodeId, pageParam);
			} else {
				//支持指定显示审批表单界面，避免晃动的效果
				var pageUrl = define.checkPage;
				var title = define.nodetitle;
				JxUtil.openFunPage(define, pageUrl, title, dataId);
			}
		},
		
		/**
		 * 显示流程相关信息界面
		 * appData -- 相关数据
		 * fileName -- 相关信息界面文件
		 **/
		showCheckWindow: function(appData, fileName) {
			var hdCall = function(f) {
				f.showWindow(appData);
			};

			//加载信息界面文件
			Request.loadJS('/jxstar/studio/pub/'+ fileName +'.js', hdCall);
		},
		
		/**
		 * 显示业务表单数据界面
		 * funId -- 功能ID
		 * dataId -- 数据ID
		 **/
		showFormData: function(funId, dataId) {
			var define = Jxstar.findNode(funId);
			
			var pkcol = define.pkcol.replace('__', '.');
			var hdcall = function(page) {
				var options = {
					where_sql: pkcol + ' = ?',
					where_type: 'string',
					where_value: dataId,
					callback: function(data) {
						if (data.length == 0) {
							JxHint.alert(jx.util.nodata);	//'没有找到业务记录！'
						} else {
							var r = page.formNode.event.newRecord(data[0]);
							
							page.getForm().myRecord = r;
							page.getForm().loadRecord(r);
							//初始化事件
							page.formNode.event.initForm();
						}
					}
				};
				Jxstar.queryData(funId, options);
			};
			
			Jxstar.showData({
				filename: define.formpage,
				pagetype: 'form',
				title: define.nodetitle, 
				callback: hdcall
			});
		},
	
		/**
		 * 取工具栏中的按钮
		 * toolBar --  工具栏
		 * eventCode -- 事件代号
		 **/
		getButton: function(toolBar, eventCode) {
			if (!toolBar) return;
			if (toolBar.isXType) {
				return toolBar.find('eventCode', eventCode)[0];
			} else {
				return toolBar.query('button[eventcode="'+eventCode+'"]')[0];
			}
		},
		
		/**
		 * 在表单INC中取指定字段名的配置信息
		 * items --  配置对象
		 * name  --  字段名
		 **/
		findFormItem: function(items, name) {
	        var item = null;
	        var findv = function(items, name) {
	            if (item) return;
	            for (var i = 0; i < items.length; i++) {
	                if (items[i].items) {
	                    findv(items[i].items, name);
	                } else {
	                    if (items[i].name == name) {
	                        item = items[i];
	                        return item;
	                    }
	                }
	            }
	        };
	        findv(items, name);
	        return item;
		},
		
		/**
		 * 取当前表格每页记录数设置
		 * grid --  当前表格对象
		 **/
		getPageSize: function(grid) {
			//可以直接表格对象的每页记录数，方便子表设置
			var pageSize = Jxstar.pageSize;
			//根据分页工具栏取每页记录数
			var bbar = grid.getBottomToolbar();
			if (bbar && bbar.isXType('paging')) {
				pageSize = bbar.pageSize;
			} else {
				var pbar = grid.pagebar;
				if (pbar) {
					pageSize = pbar.pageSize;
				} else {
					//如果分页工具栏放在顶部了
					var tbar = grid.getTopToolbar();
					if (tbar) {
						var pbar = tbar.findByType('paging')[0];
						if (pbar) {
							pageSize = pbar.pageSize;
						} else {
							//如果没有找到分页栏，就设置每页10000条记录
							pageSize = 10000;
						}
					}
				}
			}
			return pageSize;
		},
		
		/**
		 * 云布局下，取子表的工具栏对象
		 * subgrid -- 子表格对象
		 **/
		disCloudTool: function(subgrid, disable) {
			var bar = JxUtil.getCloudTool(subgrid);
			if (!bar) return;
			
			if (bar.isXType) {
				JxUtil.disableButton(bar, disable);
			} else {
				var btns = bar.query('button[righttype="edit"]');
				for (var i = 0; i < btns.length; i++) {
					btns[i].disabled = disable;
				}
			}
		},
		
		getCloudTool: function(subgrid) {
			var bar = subgrid.getTopToolbar();
			if (!bar) {
				var ct = subgrid.ownerCt;
				bar = ct.header;
				if (!bar) {//再取tab容器标题工具栏
					bar = ct.tabtooler;
					if (!bar) return;
				}
			}
			return bar;
		},
		
		//获取checkboxgroup, radiogroup分组数据
		getGroupData: function(code) {
			var datas = Jxstar.findComboData(code);
			var data = [];
			for(var i= 0; i < datas.length; i++){
				var label = datas[i][1];
				var val = datas[i][0];
				data.push({boxLabel:label, inputValue:val, name:'radio_'+code});
			}
			return data;
		},
		
		//根据值取显示值
		getGroupText: function(value, code) {
			if (!value || !code) return '';
			var datas = Jxstar.findComboData(code);
			var vs = value.split(',');
			var ts = '';
			for (var i = 0; i < vs.length; i++) {
				for (var j = 0; j < datas.length; j++) {
					if (vs[i] == datas[j][0]) {
						ts += datas[j][1] + ',';
					}
				}
			}
			return ts.substring(0, ts.length-1);
		},
		
		/**
		 * 设置编辑权限的按钮为disable状态，用于处理已复核记录设置编辑按钮为disable
		 * toolBar --  工具栏
		 * disable -- 是否不可用
		 **/
		disableButton: function(toolBar, disable) {
			if (!toolBar) return;
			var btns = toolBar.find('rightType', 'edit');
			Ext.each(btns, function(btn){btn.setDisabled(disable);});
		},
	
		/**
		 * 设置表单的字段是否为只读
		 * form --  表单对象BasicForm
		 * readOnly -- 只读：true 设置所有字段为只读，false 设置字段恢复为原状态
		 **/
		readOnlyForm: function(form, readOnly) {
			if (readOnly == true) {
				//修改所有字段为只读，不可编辑
				form.fieldItems().each(function(f){
					if (f.isXType('field')) {
						if (f.isXType('checkbox', true) || f.isXType('radio', true)) {
							f.setDisabled(true);
						} else {
							f.setReadOnly(true);
						}
					}
				});
			} else {
				//修改所有字段为非只读，但如果字段原属性为只读，则不处理
				form.fieldItems().each(function(f){
					var initReadOnly = f.initialConfig.readOnly;
					var initDisabled = f.initialConfig.disabled;

					if (f.isXType('field')) {//添加fileuploadfield，解决disable后不能enable的问题
						if (f.isXType('checkbox', true) || f.isXType('radio', true) || f.isXType('fileuploadfield', true)) {
							if (!initDisabled) {
								f.setDisabled(false);
							}
						} else {
							if (!initReadOnly) {
								f.setReadOnly(false);
							}
						}
					}
				});
			}
		},
		
		/**
		 * 判断功能表单数据是否在修改中
		 **/
		isModifyForm: function(fpage){
			if (!fpage || !fpage.formNode) return false;
			if (fpage.getForm().isDirty()) return true;
			
			var gs = fpage.findByType('grid');
			if (gs && gs.length > 0) {
				for (var i = 0; i < gs.length; i++) {
					var store = gs[i].getStore();
					if (gs[i].gridNode && store) {
						var mrow = store.getModifiedRecords();
						if (mrow && mrow.length > 0) {
							return true;
						}
					}
				}
			}
			
			return false;
		},
	
		/**
		 * 格式化number(n)，处理数字的n位小数位数，用于grid.editor.renderer。
		 * 系统组件Ext.util.Format.number()也支持该功能，但性能有差异。
		 **/
		formatNumber: function(n){
			return function(v){
				if (n == null || isNaN(n)) n = 2;
				return (v !== undefined && v !== null && v !== '') ?
						parseFloat(parseFloat(v).toFixed(n)) : '';
			};
		},
		//n 表示保留几位小数
		formatMoney: function(n){
			return function(v){
				if (n == null || isNaN(n)) n = 2;
				var f = '0,000';
				if (n > 0) f += '.';
				for (var i = 0; i < n; i++) {
					f += '0';
				}
				v = (v !== undefined && v !== null && v !== '') ?
						Ext.util.Format.number(v, f) : '';
				//把小数位后面的多余0去掉
				if (v.indexOf('.') >= 0) {
					var c = 0;//要去掉的字符个数
					for (var i = v.length-1; i >= 0; i--) {
						if (v.charAt(i) == '0') {
							c++;
						} else {
							break;
						}
					}
					//小数位全部是0，则连.也去掉
					if (n == c) c++; 
					v = v.substr(0, v.length-c);
				}
				
				return v;
			};
		},

		/**
		 * 格式化int整数，用于grid.editor.renderer。
		 **/
		formatInt: function(){
			return function(v){
				return (v !== undefined && v !== null && v !== '') ?
						parseInt(v) : '';
			};
		},
	
		/**
		* 表格中的数据保存为csv文件，
		* 原有一个gridToExcel.getExcelXml方法可以输出为xls文件，但它的格式是xml，在linux下无法打开，所以采用csv格式的文件。
		* grid -- 数据表格
		* includeHidden -- 是否输出隐藏字段
		*/
		gridToCSV: function(grid, includeHidden) {
			//文件内容
			var fileContent = '';
			var cm = grid.getColumnModel();
			
			//输出分组标题
			var groups = '';
			var rows = cm.rows;//支持多行分组标题
			if (rows && rows.length > 0) {
				for (var n = 0; n < rows.length; n++) {
					var r = rows[n];
					for (var i = 0; i < r.length; i++) {
						var cs = r[i].colspan; 
						if (i == 0) cs = cs-1;//去掉序号列
						groups += r[i].header+',';
						if (cs > 1) {
							for (var j = 0; j < cs-1; j++) {
								groups += ',';
							}
						}
					}
					if (groups.length > 0) {
						groups = groups.substr(0, groups.length-1);
						fileContent += groups + '\n';
						groups = '';
					}
				}
			}
			
			//输出表格标题
			var title = '';
			var colCount = cm.getColumnCount();
			for (var i = 0; i < colCount; i++) {
				if (cm.getDataIndex(i).length > 0 && (includeHidden || !cm.isHidden(i))) {
					title += cm.getColumnHeader(i) + ',';
				}
			}
			if (title.length > 0) {
				title = title.substr(0, title.length-1);
			}
			
			//输出表格内容
			var content = '', row = '', r;
			for (var i = 0, it = grid.store.data.items, l = it.length; i < l; i++) {
				r = it[i].data;
				var k = 0;
				for (var j = 0; j < colCount; j++) {
					if ((cm.getDataIndex(j).length > 0)
						&& (includeHidden || !cm.isHidden(j))) {
						var v = r[cm.getDataIndex(j)];
						v = Ext.isDate(v) ? v.dateFormat('Y-m-d H:i:s') : v;
						k++;
						row += v + ',';
					}
				}
				if (row.length > 0) {
					row = row.substr(0, row.length-1);
				}
				//保存每行数据
				content += row + '\n';
				row = '';
			}
			
			fileContent += title + '\n';
			fileContent += content + '\n';
			
			return fileContent;
		},
	
		/**
		* 创建一个新的随机ID值
		*/
		newId: function() {
			return JxUtil.uuid(8,16);
		},
		
		/**
		* 创建表单临时主键
		*/
		getTmpKeyId: function() {
			return 'tmp-'+JxUtil.uuid(20,16);
		},
		
		/**
		* 创建唯一ID，len 表示长度， radix 表示进制
		*	uuid(8, 2)  // 01001010
		*	uuid(8, 10) // 47473046
		*	uuid(8, 16) // 098f4d35
		*	uuid() 		// cc75515e-859d-453e-be02-75ae1d919818
		*/
		uuid: function(len, radix) {
		    var chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
		    var uuid = [], i;
		    radix = radix || chars.length;
		 
		    if (len) {
		      // Compact form
		      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
		    } else {
		      // rfc4122, version 4 form
		      var r;
		 
		      // rfc4122 requires these characters
		      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		      uuid[14] = '4';
		 
		      // Fill in random data.  At i==19 set the high bits of clock sequence as
		      // per rfc4122, sec. 4.1.5
		      for (i = 0; i < 36; i++) {
		        if (!uuid[i]) {
		          r = 0 | Math.random()*16;
		          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
		        }
		      }
		    }
		 
		    return uuid.join('');
		},
		
		/**
		* 创建一条空记录
		* store -- 存储对象
		*/
		emptyRecord: function(store) {
			var record = new (store.reader.recordType)({});
			var cols = record.fields.keys;

			//给每个字段给空值
			for (var i = 0; i < cols.length; i++){
				record.set(cols[i], '');
			}
			return record;
		},
		//获取Html转义字符
		htmlEncode: function( html ) {
		  return document.createElement( 'a' ).appendChild( 
		         document.createTextNode( html ) ).parentNode.innerHTML;
		},
		//获取Html 
		htmlDecode: function( html ) {
		  var a = document.createElement( 'a' ); a.innerHTML = html;
		  return a.textContent;
		},

		/**
		* FORM中字段控件添加CTRL+F1事件查看字段帮助说明；
		* 根据字段名，分解为表名与字段名，从数据模型中取字段解释说明。
		*
		* field -- 字段控件
		* event -- 按钮事件
		*/
		specialKey: function(field, event) {
			//CTRL+F1事件
			if (event.ctrlKey && event.keyCode == event.F1) {
				//取表名与字段名
				var ft = field.name.split('__');

				//显示字段信息
				var showField = function(data) {
					var html = "<div style=\"background-color:#fff;font-size:13px;line-height:22px;padding:2px;width:100%;height:100%;overflow:auto;\">"+JxUtil.htmlEncode(data.info)+"</div>";
					var win = new Ext.Window({
						title:jx.util.seefield,	//'查看字段信息'
						layout:'fit',
						width:450,
						height:250,
						resizable: true,
						modal: true,
						style: '',
						closeAction:'close',
						html:html,

						buttons: [{
							text:jx.base.ok,	//'确定'
							handler:function(){win.close();}
						}]
					});
					win.show();
				};
				
				//发送请求
				var params = 'funid=dm_fieldcfg&table_name=' + ft[0] + '&field_name=' + ft[1];
					params += '&eventcode=queryfield';
				Request.postRequest(params, showField);
			}
		},
		
		/**
		* FORM中字段控件值修改后触发的事件
		* 注意：TextArea控件在添加x-grid3-dirty-cell样式后无效，
		* 所以去掉了ext-all.css中的.x-form-text, textarea.x-form-field背景图片样式。
		*
		* field -- 字段控件
		* newValue -- 修改后的值
		* oldValue -- 修改前的值
		*/
		changeValue: function(field, newValue, oldValue) {
			if (field.isDirty()) {
				field.addClass('x-grid3-dirty-cell');
			} else {
				field.removeClass('x-grid3-dirty-cell');
			}
		},
		
		/**
		* 清除FORM表单中所有字段的修改标记，设置最新的原始值
		* form -- form控件
		*/
		clearDirty: function(form) {
			form.fieldItems().each(function(f){
				var name = f.name;
				if (name != null && name.length > 0) {
					f.removeClass('x-grid3-dirty-cell');
					f.originalValue = f.getValue();
				}
			});
		},
		
		/**
		* 如果字段值长度超过了field控件长度，支持显示提示信息
		* form -- formPanel
		*/
		fieldValueTip: function(formPanel) {
			var fields = formPanel.findByType('textfield');
			if (fields && fields.length > 0) {
				Ext.each(fields, function(item){
					if (item.isXType('textarea') || item.isXType('datefield') || item.isXType('numberfield')) return;
					var v = item.getValue();
					var len = JxUtil.strlen(v);//初步约定每个字符8像素
					var width = item.getWidth();
					if (item.tip || ((len*8 > width) && item.el)) {
						if (!item.tip) {
							item.tip = new Ext.ToolTip({
								target: item.el,
								html: v
							});
							//alert(len + ';' + width + ';' + item.getName());
						} else {
							if (item.tip.body) {//鼠标没提示时body=null
								item.tip.body.dom.innerHTML = v;
							} else {
								item.tip.html = v;
							}
						}
					}
				});
			}
		},
		
		/**
		* 取当前表单中的修改了值的字段名。
		* 由于保存方法经常需要取字段值做运算处理，但这些又没有修改，
		* 所以要把所有值传递到后台，同时传递哪些字段的值修改了。
		**/
		getDirtyFields: function(form) {
			var name, fields = '';
			form.fieldItems().each(function(f){
				name = f.name;
				if (name != null && name.length > 0 && f.isDirty()) {
					fields += name.replace('__', '.') + ';';
				}
			});
			if (fields.length > 1) {
				fields = fields.substr(0, fields.length - 1);
			}
			return fields;
		},
		
		/**
		* 取当前表单的值，组成URL，格式如：&name1=value1&name2=value2...
		* BasicForm.getValues(true)方法不能处理checkbox，combo的值。
		* dirtyOnly -- 是否只处理脏数据
		**/
		getFormValues: function(form, dirtyOnly) {
			var name, val, data = '', e = encodeURIComponent;
			form.fieldItems().each(function(f){
				name = f.name;
				val = f.getValue();
				val = Ext.isDate(val) ? val.dateFormat('Y-m-d H:i:s') : val;

				if (name != null && name.length > 0 && (dirtyOnly !== true || f.isDirty())) {
					data += '&' + e(name) + '=' + e(val);
				}
			});

			return data;
		},
		
		/**
		* 解析查询值中的页面参数，参数格式：[table_name.field_name]
		* whereValue -- 查询值，其中可能含页面参数
		* tagRecord -- 页面记录集，字段名格式为table_name__field_name
		* isBig -- 是否大括号 [true|false]
		**/
		parseWhereValue: function(whereValue, tagRecord, isBig) {
			if (whereValue == null || whereValue.length == 0 || 
				tagRecord == null) return whereValue;
			
			var re = /\[[^\]]+\]/g;
			if (isBig) re = /\{[^\{]+\}/g;
			//替换字符串中的字段名
			var fn = function(name, index, format, args) {
				name = name.substr(1, name.length-2);
				name = name.replace('.', '__');
				var v;
				if (tagRecord.get) {
					v = tagRecord.get(name);
				} else {
					v = tagRecord[name];
				}
				
				return v || name;
			};
			
			var value = whereValue.replace(re, fn);
			return value;
		},
		
		/**
		* 取表格中选择的记录；可编辑表格中的选择方式不同。
		*/
		getSelectRows : function(g) {
			var records = [];
			var selModel = g.getSelectionModel();
			if (selModel.getSelections) {
				records = selModel.getSelections();
			} else {
				var pos = selModel.getSelectedCell();
				if (pos == null) return records;
				
				var record = g.getStore().getAt(pos[0]);
				if (record) records = [record];
			}
			return records;
		},
	
		/**
		* 是否选择记录判断
		*/
		selected: function(records) {
			if (records == null) {
				JxHint.alert(jx.util.isnull);	//'记录对象为NULL，不能执行此操作！'
				return false;
			}
			if (records.length == 0) {
				JxHint.alert(jx.util.selectno);	//'没有选择一条记录，不能执行此操作！'
				return false;
			}
			
			return true;
		},
		
		/**
		* 是否单选记录判断
		*/
		selectone: function(records) {
			if (!this.selected(records)) return false;
			if (records.length > 1) {
				JxHint.alert(jx.util.selectone);	//'只能选择一条记录！'
				return false;
			}
			
			return true;
		},
		
		/**
		* 显示检查项执行失败的结果信息
		* 后台返回的检查项数据内容为：
		* checkMsg:[{checkName:'', result:true},
		*  {checkName:'', result:false, faildDesc:'', keyid:'', message:'', data:{}},...]
		*/
		checkResult: function(extData) {
			if (!extData || extData.length == 0) return;
			var cds = extData.checkMsg;
			//解析失败信息中的参数值
			for (var i = 0, n = cds.length; i < n; i++) {
				var data = cds[i];
				var faild = data.faildDesc;
				if (!data.result && faild.length > 0 && faild.indexOf('[') > -1) {
					faild = faild.replace(/\[/g, '{');
					faild = faild.replace(/\]/g, '}');
					var tpl = new Ext.XTemplate(faild);
					data.faildDesc = tpl.apply(data.data);
				}
			}
			
			//构建提示消息的模板
			var tpl = new Ext.XTemplate(
				'<div style="background-color:#fff;">',
				'<table style="font-size:13px;width:100%;">',
				  '<tr style="font-weight:bold;background-color:#ccc;height:28px;">'+
				    '<td style="width:150px;">'+ jx.util.checks +'</td>'+//检查项
					'<td style="width:40px;">'+ jx.util.results +'</td>'+//结果
					'<td style="width:190px;">'+ jx.util.failp +'</td>'+//失败提示
				  '</tr>',
				'<tpl for="checkMsg">',
				  '<tr style="background-color:#eee;height:28px;">',
					'<td>{checkName}</td>',
					'<tpl if="result == false">',
					  '<td><span class="eb_audit_cancel">&nbsp;&nbsp;&nbsp;&nbsp;</span></td>',
					'</tpl>',
					'<tpl if="result == true">',
					  '<td><span class="eb_select">&nbsp;&nbsp;&nbsp;&nbsp;</span></td>',
					'</tpl>',
					'<td>{faildDesc} {message}</td>',
				  '</tr>',
				'</tpl>',
				'</table>',
				'</div>'
			);
			
			//创建对话框
			var win = new Ext.Window({
				title:jx.util.checkis,//'检查项执行结果'
				layout:'fit',
				width:400,
				height:300,
				resizable: false,
				modal: true,
				autoScroll: true,
				closeAction: 'close',
				tpl: tpl,
				data: extData
			});
			win.show();
		},
		
		/**
		* 给tab控件添加快捷键，ctrl+alt+1表示第1个tab
		*/
		tabAddKey: function(tab) {
			var hd = function(tab) {
				var mappings = [], cnt = tab.items.getCount();
				for (var i = 0; i < cnt; i++) {
					//'1' = 49
					var fn = function(k, e){
						var index = k - 49;
						tab.activate(index);
					};
					var key = 49+i;
					mappings[i] = {key:key, ctrl:true, alt:true, fn:fn};
				}
				tab.keymap = new Ext.KeyMap(tab.el, mappings);
				tab.keymap.enable();
			};
			
			JxUtil.delay(1000, function(){if (this.el) hd(this);}, tab);
		},
		
		/**
		* 判断当前事件代号的按钮是否disable
		*/
		isDisableBtn: function(page, eventCode) {
			var tbar = page.getTopToolbar();
			if (tbar == null) return true;
			var btn = JxUtil.getButton(tbar, eventCode);
			if (btn == null) return true;
			return btn.disabled;
		},
		
		/**
		* 聚焦表单第一个控件，方便执行快捷键
		*/
		focusFirst: function(page) {
			if (page == null || !page.isXType('form')) return;
			
			var hd = function() {
				page.form.items.each(function(f){
					if (f.isFormField && f.rendered && f.name && !f.isXType('hidden')) {
						f.focus();//true
						return false;
					}
				});
			};
			
			JxUtil.delay(500, hd);
		},
		
		/**
		* 聚焦表格当前行，方便执行快捷键
		*/
		focusFirstRow: function(page) {
			if (page == null || !page.isXType('grid')) return;
			
			var row = JxUtil.getRowNum(page);
			page.getView().focusRow(row);
		},
		
		/**
		* 获取表格当前选择的行号
		*/
		getRowNum: function(page) {
			if (page == null || !page.isXType('grid')) return -1;
		
			var sm = page.getSelectionModel();
			if (sm.getSelectedCell) {//单元个选择模式
				var pos = sm.getSelectedCell();
				if (pos) {
					return pos[0];
				} else {
					return -1;
				}
			} else {//行选模式
				var s = page.getStore();
				var r = sm.getSelected();
				if (r) {
					return s.indexOf(r);
				} else {
					return -1;
				}
			}
		},
		
		/**
		* 获取表格第一个可编辑列的位置
		*/
		getEditCol: function(page) {
			if (page == null || !page.isXType('editorgrid')) return -1;
			
			var cm = page.getColumnModel();
			var cnt = cm.getColumnCount();
			for (var i = 0; i < cnt; i++) {
				if (cm.isCellEditable(i, 0)) return i;
			}
			return -1;
		},
	
		/**
		* 解析响应对象的错误信息
		* 参考文件：src/adapter/core/ext-base-ajax.js
		*/
		errorResponse: function(response) {
			var msg, code = response.status;
			
			if (response.isTimeout) {
				msg = jx.util.limittime;	//'请求超时，请重新操作，如果失败请联系管理员！'
			} else {
				if (code >= 200 && code < 300) {
					var result = Ext.decode(response.responseText);
					msg = result.message;
					if (msg.length == 0) {
						msg = response.statusText;
					}
				} else {
					if (response.responseText != null && response.responseText.length > 0) {
						var msg = response.responseText;
						try {
							var result = Ext.decode(response.responseText);
							msg = result.message;
						}catch(e) {}
						JxHint.alert(msg); 
						return;
					} else {
						msg = response.statusText;
					}
				}
			}
			
			if (msg.indexOf('communication') > -1) {//communication failure
				msg = jx.util.netfail;//'网络异常访问服务器失败，确认后重新操作！';
				/*var srcdesc = response.srcdesc || '';
				if (srcdesc.length > 0) {
					msg += '，来源：' + srcdesc;
				}*/
				//是否显示网络异常
				var show = Jxstar.systemVar.sys__show__neterror || '0';
				if (show == '1') {
					alert(msg);
				}
				return;
			} else {
				alert(msg);
			}
			//会话失效，退出系统 code <= 0 || 
			if (msg.indexOf(jx.index.login) >= 0) {//'登录'
				JxUtil.isLogout = true;	//正常退出
				window.location.href = Jxstar.logoutUrl || Jxstar.path;
			}
		},
		
		/**
		* 延迟执行指定的函数
		* time -- 延时时间，ms
		* fn -- 函数
		* scope -- 指定延时函数中的this对象
		* args -- 数组，指定fn中的参数
		*/
		delay: function(time, fn, scope, args) {
			(new Ext.util.DelayedTask()).delay(time, fn, scope, args);
		},
		
		/**
		* 递归删除DOM与子对象
		* parent -- 要删除的对象
		*/
		removeChild: function(parent){
			if (!parent) return;
			try {
				var childs = parent.childNodes || [];
				for (var i = childs.length - 1; i >= 0; i--) {
					var has = childs[i].hasChildNodes();
					if (has) {
						JxUtil.removeChild(childs[i]);
					} else {
						if (childs[i]) {
							parent.removeChild(childs[i]);
							childs[i] = null;
						}
					}
				}

				if (parent) parent.parentNode.removeChild(parent);
				parent = null;
			} catch(e){}
		},
		
		/**
		* 判断是否为手机号码格式
		*/
		isphone: function(value) {
			if (value == null || value.length != 11) return false;
			var p = /^1[3,4,5,7,8]\d{9}$/;
			return p.test(value) ? true : false;
		},
		
		/**
		* 判断是否为邮件地址格式
		*/
		isemail: function(value) {
			if (value == null || value.length < 5) return false;
			var p = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;  
			return (p.test(value)) ? true : false;
		},
		
		/**
		* 取字符串的长度，汉字为两个字节长度
		*/
		strlen: function(value) {
			if (value == null || value.length < 1) return 0;
			
			var len = 0;
			for (var i = 0; i < value.length; i++) {
				if (value.charCodeAt(i) < 299) {
					len++;
				} else {
					len += 2;
				}
			}
			return len;
		},
		
		/**
		* 把数字转换为金额大写
		*/
		numBigMoney: function(num) {
			var strOutput = "";   
			var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';   
				num += "00";   
			var intPos = num.indexOf('.');
			
			if (intPos >= 0){ 
				num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
			}
			
			strUnit = strUnit.substr(strUnit.length - num.length);   
			for (var i=0; i < num.length; i++){   
				strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i,1),1) + strUnit.substr(i,1);   
			}
			
			return strOutput.replace(/零角零分$/, '整')
							.replace(/零[仟佰拾]/g, '零')
							.replace(/零{2,}/g, '零')
							.replace(/零([亿|万])/g, '$1')
							.replace(/零+元/, '元')
							.replace(/亿零{0,3}万/, '亿')
							.replace(/^元/, "零元"); 
		},
		
		/**
		* 处理IE6中不能显示PNG的透明效果
		*/
		fixPNG: function(myIMG) {
			if (!Ext.isIE6) return;

			var imgID = (myIMG.id) ? "id='" + myIMG.id + "' " : "";
			var imgTitle = (myIMG.title) ? "title='" + myIMG.title   + "' " : "title='" + myIMG.alt + "' ";
			var newHTML = "<span " + imgID + imgTitle + " style=\"width:" + myIMG.width + "px; height:" + 
				myIMG.height + "px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + 
				myIMG.src + "', sizingMethod='scale');\"></span>";
			
			myIMG.outerHTML = newHTML;
		},
		
		/**
		* 呈现日期，在col.renderer
		*/
		renderDate: function(value, format) {
			if (Ext.isString(value)) {
				value = value.replace('T', ' ');
				if (value.length == 19) {
					value = Date.parseDate(value, 'Y-m-d H:i:s');
				} else if (value.length == 10) {
					value = Date.parseDate(value, 'Y-m-d');
				}
			}
			return value ? Ext.util.Format.date(value, format) : '';
		},
		
		/**
		* 取呈现函数中的样式：renderer:value.format('Y-m-d') 或 JxUtil.renderDate(value, 'Y-m-');
		*/
		getDateFormat: function(renderer) {
			var ren = renderer.toString(), form = 'Y-m-d';
			if (ren.indexOf('\'Y-m-d\'') >= 0 || ren.indexOf('\"Y-m-d\"') >= 0) {
				form = 'Y-m-d';
			} else if (ren.indexOf('\'Y-m\'') >= 0 || ren.indexOf('\"Y-m\"') >= 0) {
				form = 'Y-m';
			} else if (ren.indexOf('\'Y\'') >= 0 || ren.indexOf('\"Y\"') >= 0) {
				form = 'Y';
			}
			return form;
		},
		
		//把时间戳 YYYYMMddHHmmss 解析为日期或时间
		shortTime: function(ts, isbr) {
			if (!ts || ts.length < 14) return ts;
			if (ts.indexOf('-') > -1) {
				var re = /[-: ]/g;
				ts = ts.replace(re, '');
			}
			
			var cur = JxUtil.getTimeStamp();
			//如果是当天的时间，则只显示HH:mm，否则显示日期
			if (cur.substr(0, 8) == ts.substr(0, 8)) {
				return '今天'+(isbr ? '<br>':' ')+ts.substr(8, 2)+':'+ts.substr(10, 2);
			} else {
				return ts.substr(4, 2)+'-'+ts.substr(6, 2)+(isbr ? '<br>':' ')+ts.substr(8, 2)+':'+ts.substr(10, 2);//不要年份：ts.substr(0, 4)+'-'+
			}
		},
		shortDate: function(ts) {
			if (!ts || ts.length < 14) return ts;
			if (ts.indexOf('-') > -1) {
				var re = /[-: ]/g;
				ts = ts.replace(re, '');
			}
			
			var cur = JxUtil.getTimeStamp();
			//如果是当天的时间，则只显示HH:mm，否则显示日期
			if (cur.substr(0, 8) == ts.substr(0, 8)) {
				return ts.substr(8, 2)+':'+ts.substr(10, 2);
			} else {
				return ts.substr(4, 2)+'-'+ts.substr(6, 2);
			}
		},
		
		/**
		* 取时间戳字符串：YYYYMMddHHmmss
		*/
		getTimeStamp: function() {
			var d = new Date();
			return d.format('YmdHis');
		},
		
		/**
		* 取当前年份
		* inc -- 增减年份
		*/
		getCurYear: function(inc){
			var d = new Date();
			var y = parseInt(d.format('Y'));
			
			if (inc != null) {
				y = y + inc
			}
			return y;
		},
		
		/**
		* 取当前时间, 格式：yyyy-mm-dd hh:mm:ss
		*/
		getTodayTime: function(){
			var d = new Date();
			return d.format('Y-m-d H:i:s');
		},

		/**
		* 取当前日期, 格式：yyyy-mm-dd
		* inc -- 增减天数
		*/
		getToday: function(inc){
			var d = new Date();
			if (inc != null) {
				d = d.add(Date.DAY, inc);
			}
			return d.format('Y-m-d');
		},

		/**
		* 取当前月份, 格式：yyyy-mm
		* inc -- 增减月份
		*/
		getMonth: function(inc){
			var d = new Date();
			if (inc != null) {
				d = d.add(Date.MONTH, inc);
			}
			return d.format('Y-m');
		},

		/**
		* 取间隔月份, 格式：yyyy-mm
		*/
		getNextMonth: function(smonth, num){
			if (smonth == null) return '';
			smonth = smonth.split(' ')[0];
			
			var sd = smonth.split('-');
			if (sd.length == 2) {
				smonth = smonth + '-01';
			} else if (sd.length == 1) {
				smonth = smonth + '-01-01';
			}
			var dt = Date.parseDate(smonth, "Y-m-d");

			dt = dt.add(Date.MONTH, num);
			return dt.format('Y-m');
		},

		/**
		* 取指定日期间隔值的日期, 格式：yyyy-mm-dd
		*/
		getNextDate: function (sdate, num){
			if (sdate == null) return '';
			sdate = sdate.split(' ')[0];
			
			var sd = sdate.split('-');
			if (sd.length == 2) {
				sdate = sdate + '-01';
			} else if (sd.length == 1) {
				sdate = sdate + '-01-01';
			}
			var dt = Date.parseDate(sdate, "Y-m-d");

			dt = dt.add(Date.DAY, num);
			return dt.format('Y-m-d');
		},

		/**
		* 取本周的开始与结束日期，星期日是一周的第一天, 开始日期为本周日，结束日期为下周期日, 格式：yyyy-mm-dd
		*/
		getWeekDates: function(){
			var d = new Date();
			var w = d.getDay();//0是星期日，6是星期六

			var sd = this.getNextDate(this.getToday(), -w);
			var ed = this.getNextDate(this.getToday(), 7-w);

			return [sd, ed];
		},

		/**
		* 取上周的开始与结束日期，星期日是一周的第一天, 开始日期为本周日，结束日期为下周期日, 格式：yyyy-mm-dd
		*/
		getPreWeekDates: function(){
			var d = new Date();
			var w = d.getDay();//0是星期日，6是星期六

			var sd = this.getNextDate(this.getToday(), -w-7);
			var ed = this.getNextDate(this.getToday(), -w);

			return [sd, ed];
		},

		/**
		* 取本月的开始与结束日期，结束日期为下月第一天, 格式：yyyy-mm-dd
		*/
		getMonthDates: function(){
			var smonth = this.getMonth();

			var sd = smonth + '-01';
			var ed = this.getNextMonth(smonth, 1) + '-01';

			return [sd, ed];
		},

		/**
		* 取上月的开始与结束日期，结束日期为本月第一天, 格式：yyyy-mm-dd
		*/
		getPreMonthDates: function(){
			var smonth = this.getNextMonth(this.getMonth(), -1);

			var sd = smonth + '-01';
			var ed = this.getNextMonth(smonth, 1) + '-01';

			return [sd, ed];
		},
		
		/**
		* 保留f小数位，做四舍五入处理；JavaScript原生toFixed在有些浏览器中没有做四舍五入
		*/
		toFixed: function(v, f) {
			with(Math) {
				return round(v * pow(10, f)) / pow(10, f);
			}
		},
		
		/**
		* 乘法运算，rec可以是record、form，a是参数1的字段名，b是参数2的字段名，c是结果的字段名，
		* 如：a * b = c
		*/
		multiply: function(rec, a, b, c) {
			var va = rec.get(a);
			var vb = rec.get(b);
			var vc = (parseFloat(va) * 100) * (parseFloat(vb) * 100);
			vc = vc / 10000;//防止乘法结果本来是1.4，结果为1.39999999999992
			if (isNaN(vc)) {
				vc = 0;
			} else {
				vc = JxUtil.toFixed(vc, 2);
			}
			rec.set(c, vc);
		},
		
		//显示流程导航图标；parentNode -- 父级树节点; moduleLevel -- 显示模块级别，填写1或2
		viewNavIcon: function(parentNode, moduleLevel) {
			if (!moduleLevel || moduleLevel < 1) moduleLevel = 1;
			
			var hdCall = function(data) {
				if (data != null) data = data.root; 
				if (data == null || data.length == 0) return;
				for (var i = 0, n = data.length; i < n; i++) {
					var moduleId = data[i].wfnav_graph__module_id;
					if (moduleId.length == 0 || moduleId.length != moduleLevel*4) continue;
					
					var oneNode = parentNode.findChild('id', moduleId);
					if (Ext.isEmpty(oneNode)) continue;
					
					var graphId = data[i].wfnav_graph__graph_id;
					var graphTitle = data[i].wfnav_graph__graph_name;
					if (graphId.length == 0) continue;
					
					var anchor = oneNode.getUI().getAnchor();
					var cls = 'wfnav-icon';
					if (Ext.isChrome) cls += ' wfnav-icon-chrome';
					//删除以前创建图标，二级模块显示用，否则会重复创建
					var wfnav = Ext.fly(anchor).next('.wfnav-icon');
					if (wfnav) wfnav.remove();
					
					var chg = 'onmouseover="this.style.marginRight=\'3px\';" onmouseout="this.style.marginRight=\'4px\';"';
					var navIcon = Ext.fly(anchor).insertHtml('afterEnd', 
						'<span '+ chg +' class="'+ cls +'" graphid="'+ graphId +'" title="'+ graphTitle +'" graphtitle="'+ graphTitle +'"></span>', true);
					navIcon.on('click', function(e, t){
						e.stopEvent();
						JxWfGraph.showGraphFun(t.getAttribute('graphid'), null, false, t.getAttribute('graphtitle'));
					});
				}
			};
			var where_sql = encodeURIComponent('auditing = 1');
			var params = 'eventcode=query_data&funid=queryevent&pagetype=grid'+
				'&query_funid=wfnav_graph&where_sql=' + where_sql;
			Request.dataRequest(params, hdCall);
		},
		
		showLinkWin: function(type,linkFunid,where_sql,where_value,where_type){
			if(type=='grid'){
				var hdcall = function(grid) {
		            JxUtil.delay(500, function(){
		                Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
		            });
		        };
		        var define = Jxstar.findNode(linkFunid);
		        Jxstar.showData({
		            filename: define.gridpage,
		            title: define.nodetitle,
		            pagetype: 'grid',
		            nodedefine: define,
		            callback: hdcall
		        });
			}else{
				var hdcall = function(page) {
		            var options = {
		                where_sql: where_sql,
		                where_type: where_type,
		                where_value: where_value,
		                callback: function(data) {
		                    //如果没有数据则执行新增
		                    if (data.length == 0) {
		                        page.formNode.event.create();
		                    } else {
		                        var r = page.formNode.event.newRecord(data[0]);
		                        page.getForm().myRecord = r;
		                        page.getForm().loadRecord(r);
		                    }
		                }
		            };
		            Jxstar.queryData(linkFunid, options) 
		        };
		
		        //显示数据
		        var define = Jxstar.findNode(linkFunid);
		        Jxstar.showData({
		            filename: define.formpage,
		            title: define.nodetitle,
		            callback: hdcall
		        });
			}
		}
	});//Ext.apply

})();
