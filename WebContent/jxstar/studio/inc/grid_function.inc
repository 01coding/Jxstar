	if (typeof CodeMirror == "undefined") {
		JxUtil.loadCss('/lib/codemirror/codemirror.css');
		JxUtil.loadCss('/lib/codemirror/addon/dialog/dialog.css');
		
		JxUtil.loadJS('/lib/codemirror/codemirror.js');
		JxUtil.loadJS('/lib/codemirror/addon/dialog/dialog.js');
		JxUtil.loadJS('/lib/codemirror/addon/search/searchcursor.js');
		JxUtil.loadJS('/lib/codemirror/addon/search/search.js');
		JxUtil.loadJS('/lib/codemirror/addon/edit/matchbrackets.js');
		JxUtil.loadJS('/lib/codemirror/addon/edit/closebrackets.js');
		
		JxUtil.loadJS('/lib/codemirror/mode/sql.js');
		JxUtil.loadJS('/lib/codemirror/mode/javascript.js');
		JxUtil.loadJS('/lib/codemirror/jsformat.js');
	}
	

	//页面代码，type: layout\grid\form
	JxUtil.pagecode = function(nodeId, type) {
		var title = "表单代码";
		if(type == "grid"){
			title = "表格代码";
		}
		if(type =="layout"){
			title = "布局代码";
		}
		openWin(nodeId,type,title,2);//js类型 为2
	};
	
	//扩展代码，type: grid\form
	JxUtil.extcode = function(nodeId, type) {
		openWin(nodeId,type,'代码编辑',1);//inc类型为1
	};
	
	//打开编辑窗口
	function openWin(funid,type,content,JSType){	
		var hdcall = function(data){
			var tb,edit,tp;
			if(data.JStype == 2){
				var title = data.title;
				if(type !="layout"){
					tb = [{text:'保存',handler:function(){saveJs(funid,type,edit.getValue());}},
					{text:'预览',handler:function(){openNode(funid);}},
					{text:'重新生成代码',handler:function(){createJs(edit,funid,type);}},'->',{html:title}
					];
				}else{
					tb = [{text:'保存',handler:function(){saveJs(funid,type,edit.getValue());}},
					{text:'预览',handler:function(){openNode(funid);}},
					'->',{html:title}
					];
				}
			}else {
			    var title;
				if(data.title == ""){
					if(type == "grid"){
						title = "grid-inc 数据库字段";
					}else{
						title =	"form-inc 数据库字段";
					}
				}else{
					title = data.title;
				}
				tb = new Ext.Toolbar({items:[{text:'保存',handler:function(){saveInc(funid,type,edit.getValue());}},{text:'预览',handler:function(){openNode(funid);}},'->',{html:title}]});
			}
			
			var html = '<div><div class="wp-title">'+funid+'</div><ul class="x-nav">'
					+'<li index="0" class="active" type="grid" >表格inc</li>'
					+'<li index="1" type="form">表单inc</li>'
					+'<li index="2" type="grid">表格代码</li>'
					+'<li index="3" type="form">表单代码</li>'
					+'<li index="4" type="layout">布局代码</li>'
					+'</ul></div>';
			var textPanel = new Ext.Panel({
						tbar:tb,
						region: 'center', 
						layout:'fit',
						style:"font-size:15px",
						items:[{xtype:'textarea'}]
					});
			tp = textPanel;
			var layout = new Ext.Container({
					layout:'border',
					items:[{region:'west',split:true,width:150,html:html},textPanel]
				});
			JxUtil.delay(500, function(){
				var t = layout.getComponent(1).body.first().dom;
				edit = CodeMirror.fromTextArea(t, {
					readOnly : false,
					lineNumbers : true,
					matchBrackets : true,//匹配关闭括弧
					autoCloseBrackets : true,//自动创建关闭括弧
					indentUnit : 4,//缩进字符个数
					mode : 'text/typescript'
				});
				if(data.type == 0 ){
					edit.setValue('查询代码出错了。');
				}else{
					var text = data.data;
					text = JxUtil.numToStr(text);
					edit.setValue(text);
				}
				edit.setSize("100%","100%");
				edit.focus();
			});			
			
			var mainTab = Jxstar.sysMainTab;
			var win = mainTab.add({
					label: content,
					border:false,
					layout: 'fit',
					closable: true,
					iconCls: 'function',
					items: [layout]
				});
			mainTab.activate(win);
			var wp = layout.getComponent(0).el;
			if(type == "form"){
				wp.select(".x-nav li.active").removeClass("active");
				wp.select(".x-nav li").elements[1].className += " active";
			}
			wp.select(".x-nav li").on("click",function(e,t){
				 var index = t.getAttribute('index');
				 var type = t.getAttribute('type');
				 getjsCode(edit,tp,funid,index,type,wp,t);
			});
			
		};
		var param ;
		if(JSType == 1){
			param = "funid=sys_fun_base&eventcode=extcode&fun_id="+funid+"&type="+type;//获取inc 请求
		}else if(JSType == 2){
			param = "funid=sys_fun_base&eventcode=layoutcode&fun_id="+funid+"&type="+type+"&createType="+0;//获取js 请求
		}
		Request.postRequest(param,hdcall);
	};
	//刷新代码
	function getjsCode(edit,tp,funid,index,type,wp,t){
		var hdcall = function(data){
			var tb;
			if(data.JStype == 2){
				var title = data.title;
				if(type !="layout"){
					tb = [{text:'保存',handler:function(){saveJs(funid,type,edit.getValue());}},
					{text:'预览',handler:function(){openNode(funid);}},
					{text:'重新生成代码',handler:function(){createJs(edit,funid,type);}},'->',{html:title}
					];
				}else{
					tb = [{text:'保存',handler:function(){saveJs(funid,type,edit.getValue());}},
					{text:'预览',handler:function(){openNode(funid);}},
					'->',{html:title}
					];
				}
			}else {
			    var title;
				if(data.title == ""){
					if(type == "grid"){
						title = "grid-inc 数据库字段";
					}else{
						title =	"form-inc 数据库字段";
					}
				}else{
					title = data.title;
				}
				tb = [{text:'保存',handler:function(){saveInc(funid,type,edit.getValue());}},
					{text:'预览',handler:function(){openNode(funid);}},'->',{html:title}];
			}
			var tbp = tp.getTopToolbar();
			tbp.removeAll();
			tbp.add(tb);
			tp.doLayout();
			var text = (data.data == null)?"":data.data;
			text = JxUtil.numToStr(text);
			edit.setValue(text);
			wp.select(".x-nav li.active").removeClass("active");
			t.className += " active";
		}
		var param = "funid=sys_fun_base";
		switch(index){
			case "0":param += "&eventcode=extcode&fun_id="+funid+"&type=grid"; break;
			case "1":param += "&eventcode=extcode&fun_id="+funid+"&type=form"; break;
			case "2":param += "&eventcode=layoutcode&fun_id="+funid+"&type=grid&createType=0"; break;
			case "3":param += "&eventcode=layoutcode&fun_id="+funid+"&type=form&createType=0"; break;
			case "4":param += "&eventcode=layoutcode&fun_id="+funid+"&type=layout&createType=0"; break;
		}
		Request.postRequest(param,hdcall);
	}
	//预览，打开功能
	function openNode(funid){
		Jxstar.createNode(funid);
	}
	//重新生成代码
	function createJs(edit,funid,type){
		if(type == "layout"){
			Ext.Msg.alert('提示', 'layout编辑不存在"重新生成代码"功能');
			return;
		}
		var hdcall = function(data){
			var text = (data.data == null)?"":data.data;
			text = JxUtil.numToStr(text);
			edit.setValue(text);
		};
		var param = 'funid=sys_fun_base&eventcode=layoutcode&fun_id='+funid+'&type='+type+'&createType='+1;
		Request.postRequest(param,hdcall);
	}
	//js保存
	function saveJs(funid,type,content){
		content = content.replace(/funid/g,"funid");
		content = content.replace(/eventcode/g,"eventcode");
		content = JxUtil.strToNum(content);
		var param = "funid=sys_fun_base&eventcode=saveJs&content="+content+"&fun_id="+funid+"&type="+type;
		Request.postRequest(param,null);
	
	};
	
	//inc保存
	function saveInc(funid,type,content){
		content = content.replace(/funid/g,"funid");
		content = content.replace(/eventcode/g,"eventcode");
		content = JxUtil.strToNum(content);
		var param = "funid=sys_fun_base&eventcode=saveContent&content="+content+"&fun_id="+funid+"&type="+type+"&relpath="+Jxstar.session['project_path'];
		Request.postRequest(param,null);
	
	};
	
	config.eventcfg = {
		//扩展代码
		extcode: function() {
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			var nodeId = records[0].get('fun_base__fun_id');
			
			JxUtil.extcode(nodeId, 'grid');
		},
		
		updateDes: function(){
			var hintcall = function(btn, text) {
				if (btn != 'ok') return;
				if (text.length == 0) {
					JxHint.alert(jx.bus.text9 + 'd:\\design_update');//必须输入设计文件更新路径，如
					return;
				}				
				
				var params = 'funid=sys_fun_base&topath='+ text +'&pagetype=editgrid&eventcode=updatedes';
				
				//发送请求
				Request.postRequest(params, null);
			};

			Ext.MessageBox.prompt(jx.base.hint, jx.bus.text10, hintcall);//'输入设计文件更新路径'
		},
		
		createFun: function(){
			var self = this;
			
			var attr = self.grid.treeNodeAttr;
			if(attr == null ) {//change by cch  去掉底层判断 || !attr.leaf 
				JxHint.alert(jx.bus.text11);//必须选择最底层模块，才能新增功能！
				return;
			}
			
			var hintcall = function(btn, text) {
				if (btn != 'ok') return;

				var hdcall = function() {
					self.grid.getStore().reload();
				};
				
				var params = 'funid=sys_fun_base&cfunid='+ text +'&pagetype=editgrid&eventcode=create';
				//添加模块ID
				params += '&cmodid=' + attr.id;
				
				//发送请求
				Request.postRequest(params, hdcall);
			};

			//'请输入新功能ID'
			Ext.MessageBox.prompt(jx.base.hint, jx.fun.newid, hintcall);
		},
		
		copyFun: function(){
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			var selfunid = records[0].get('fun_base__fun_id');
		
			var self = this;
			var hintcall = function(btn, text) {
				if (btn != 'ok') return;

				var hdcall = function() {
					self.grid.getStore().reload();
				};
				
				var params = 'funid=sys_fun_base&oldfunid='+ selfunid +'&newfunid='+ text +'&pagetype=editgrid&eventcode=copy';
				
				//发送请求
				Request.postRequest(params, hdcall);
			};

			//'请输入新功能ID'
			Ext.MessageBox.prompt(jx.base.hint, jx.fun.newid, hintcall);
		},
			
		createNode: function(){
			var self = this;
			
			//取模块ID
			var attr = self.grid.treeNodeAttr;
			var modId = '', modText = '', hintText = '';
			if(attr != null) {
				modId = attr.id;
				modText = attr.text;
			}
			//if (modId.length > 0 && modText.length > 0) {
			//	hintText = String.format(jx.bus.text7, modText);//生成所有功能数据选“是”，生成【'+ modText +'】模块数据选“否”，或取消？
			//} else {
           		modId = '';
				hintText = jx.bus.text8;//确定生成所有功能的数据吗？
			//}
			
			var hintcall = function(btn, text) {
				if (btn == 'cancel') return;
				if (btn == 'yes') modId = '';

				//设置请求的参数
				var params = 'funid='+ self.define.nodeid + '&moduleid=' + modId;
				params += '&pagetype=grid&eventcode=createNode&projectpath=' + Jxstar.session['project_path'];

				//生成文件后自动加载该文件
				var hdcall = function() {
					Request.loadJS('/public/data/NodeDefine.js');
				};

				//发送请求
				Request.postRequest(params, hdcall);
			};

			Ext.Msg.show({
			   title: jx.base.hint,
			   msg: hintText,
			   buttons: (modId.length > 0) ? Ext.Msg.YESNOCANCEL : Ext.Msg.OKCANCEL,
			   fn: hintcall,
			   icon: Ext.MessageBox.QUESTION
			});
		},

		createRule: function(){
			//取选择记录的主键值
			var params = 'funid='+ this.define.nodeid;
			
			//设置请求的参数
			params += '&pagetype=grid&eventcode=createRule&projectpath=' + Jxstar.session['project_path'];

			//生成文件后自动加载该文件
			var hdcall = function() {
				Request.loadJS('/public/data/RuleData.js');
			};

			//发送请求
			Request.postRequest(params, hdcall);
		},
		
		createTree: function(){
			//取选择记录的主键值
			var params = 'funid='+ this.define.nodeid;
			
			//设置请求的参数
			params += '&pagetype=grid&eventcode=createTree&projectpath=' + Jxstar.session['project_path'];

			//生成文件后自动加载该文件
			var hdcall = function() {
				Request.loadJS('/public/data/TreeData.js');
			};

			//发送请求
			Request.postRequest(params, hdcall);
		},

		setFunext: function(){
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			var selfunid = records[0].get('fun_base__fun_id');
			
			//加载Form数据
			var hdcall = function(page) {
				//设置外键键
				page.getForm().fkName = 'fun_ext__fun_id';
				page.getForm().fkValue = selfunid;
				
				//加载显示数据
				var options = {
					where_sql: 'fun_ext.fun_id = ?',
					where_type: 'string',
					where_value: selfunid,
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
				Jxstar.queryData('fun_ext', options);
			};
			
			//显示数据
			var define = Jxstar.findNode('fun_ext');
			Jxstar.showData({
				filename: define.formpage,
				title: define.nodetitle,
				width: 500,
				height: 250,
				callback: hdcall
			});
		},
		
		setStatus: function(){
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			var selfunid = records[0].get('fun_base__fun_id');
			
			//加载Form数据
			var hdcall = function(page) {
				//设置外键键
				page.getForm().fkName = 'fun_status__fun_id';
				page.getForm().fkValue = selfunid;
				
				//加载显示数据
				var options = {
					where_sql: 'fun_status.fun_id = ?',
					where_type: 'string',
					where_value: selfunid,
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
				Jxstar.queryData('fun_status', options);
			};
			
			//显示数据
			var define = Jxstar.findNode('fun_status');
			Jxstar.showData({
				filename: define.formpage,
				title: define.nodetitle,
				width: 750,
				height: 470,
				callback: hdcall
			});
		},

		setFunTree: function(){
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;

			//过滤条件
			var where_sql = 'fun_tree.fun_id = ?';
			var where_type = 'string';
			var where_value = records[0].get('fun_base__fun_id');
			
			//加载数据
			var hdcall = function(layout) {
				//显示数据
				JxUtil.delay(500, function(){
					var grid = layout.getComponent(0).getComponent(0);
				
					//设置外键值
					grid.fkValue = where_value;
					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
				});
			};

			//显示数据
			var define = Jxstar.findNode('fun_tree');
			Jxstar.showData({
				filename: define.layout,
				title: define.nodetitle,
				pagetype: 'subgrid',
				nodedefine: define,
				callback: hdcall
			});
		},
		
		setFunRoute: function(){
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;

			//过滤条件
			var where_sql = 'fun_rule_route.fun_id = ?';
			var where_type = 'string';
			var where_value = records[0].get('fun_base__fun_id');
			
			//加载数据
			var hdcall = function(layout) {
				//显示数据
				JxUtil.delay(500, function(){
					var grid = layout.getComponent(0).getComponent(0);
				
					//设置外键值
					grid.fkValue = where_value;
					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
				});
			};

			//显示数据
			var define = Jxstar.findNode('rule_route');
			Jxstar.showData({
				filename: define.layout,
				title: define.nodetitle,
				pagetype: 'subgrid',
				nodedefine: define,
				callback: hdcall
			});
		},
		
		setFunSql: function(){
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;

			//过滤条件
			var selectFunId = records[0].get('fun_base__fun_id');
			var where_sql = 'fun_rule_sql.src_funid = ? and fun_rule_sql.route_id = ?';
			var where_type = 'string;string';
			var where_value = selectFunId + ';noroute';
			
			//加载数据
			var hdcall = function(layout) {
				//显示数据
				JxUtil.delay(500, function(){
					var grid = layout;//.getComponent(0).getComponent(0);
					//当前选择的功能ID
					grid.selectFunId = selectFunId;
					grid.selectEventCode = '';
					//清除外键设置，在form的initpage方法中处理来源功能ID为外键值
					grid.fkValue = 'noroute';
					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
				});
			};

			//显示数据
			var define = Jxstar.findNode('rule_sqlm');
			Jxstar.showData({
				filename: define.gridpage,
				title: define.nodetitle,
				pagetype: 'subgrid',
				nodedefine: define,
				callback: hdcall
			});
		},
		
		setCodeRule: function(){
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			var selfunid = records[0].get('fun_base__fun_id');
			
			//加载Form数据
			var hdcall = function(page) {
				//设置外键键
				page.getForm().fkName = 'sys_coderule__fun_id';
				page.getForm().fkValue = selfunid;
				
				//加载显示数据
				var options = {
					where_sql: 'sys_coderule.fun_id = ?',
					where_type: 'string',
					where_value: selfunid,
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
				Jxstar.queryData('sys_coderule', options);
			};
			
			//显示数据
			var define = Jxstar.findNode('sys_coderule');
			Jxstar.showData({
				filename: define.formpage,
				title: define.nodetitle,
				width: 650,
				height: 300,
				callback: hdcall
			});
		},
		
		createReport: function(reportType) {
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selected(records)) return;

			for (var i = 0, n = records.length; i < n; i++) {
				var funid = records[i].get('fun_base__fun_id');
				var params = 'funid=sys_fun_base&selfunid='+ funid +'&pagetype=grid&eventcode=createreport&reportType=' + reportType;

				//发送请求
				Request.postRequest(params, null);
			}
		},
        
        //创建字段多语言文字
        createTxt: function() {
            var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selected(records)) return;

            var params = 'funid=sys_fun_base&eventcode=createtxt&projectpath=' + Jxstar.session['project_path'];
			for (var i = 0, n = records.length; i < n; i++) {
				var funid = records[i].get('fun_base__fun_id');
				params += '&selfunids='+ funid;
			}
            //发送请求
			Request.postRequest(params, null);
        }
	};
	
	config.initpage = function(gridNode){
		var event = gridNode.event;
		var grid = gridNode.page;
		
		grid.on('rowdblclick', function(g, n, e) {
			event.showForm();
		});
		
		//表格编辑后事件
		grid.on('afteredit', function(event) {
			if (event.field == 'fun_base__table_name') {
				var record = event.record;
				var table_name = record.get('fun_base__table_name');
				var from_sql = record.get('fun_base__from_sql');
				if (from_sql.length == 0) {
					record.set('fun_base__from_sql', 'from ' + table_name);
				}
			}
		});
	};