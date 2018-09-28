/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 数据迁移工具的界面。
 * 
 * @author KevinCao
 * @version 1.0, 2013-03-25
 */

Jxstar.currentPage = function() {

	//创建选择窗口
	var createSelectWin = function(config, listv) {
			if(listv.disabled){
				return;
			}
			//如果是多选，页面类型改为
			var ismore = false;
			if (config.isMoreSelect == '1') {
				ismore = true;
				config.pageType = 'selgrid';
			}
			
			var self = this;
			var nodeId = config.nodeId;
			
			//功能对象信息
			var define = Jxstar.findNode(nodeId);
			if (define == null) {
				JxHint.alert(String.format(jx.star.nopage, nodeId));	//'没有定义【{0}】功能页面信息！'
				return;
			}
			
			//取创建页面的函数
			var hdCall = function(f) {
				var page = f(define, {pageType:config.pageType});
				//创建表格对象
				if (typeof page.showPage == 'function') {
					page = page.showPage(config.pageType);
				}
				//设置页面高度
				page.height = 495;
				//创建对话框
				var	win = new Ext.Window({
					title: jx.base.select+define.nodetitle,	//'选择'
					layout: 'fit',
					width: 750,
					height: 500,
					border: false,
					modal: true,
					closeAction: 'close',
					items: [page]
				});
				win.show();
				
				//如果是布局页面，grid显示会延时，所以需要延时函数
				JxUtil.delay(500, function(){
					//如果page不是grid，则认为是树形页面，取左边的grid
					var selgrid = page;
					if (!selgrid.isXType('grid')) {
						selgrid = selgrid.getComponent(1);
						if (selgrid == null) {
							JxHint.alert(jx.star.nogrid);	//'选择功能页面不能识别表格，请检查！'
							return false;
						} else {
							selgrid = selgrid.getComponent(0);
						}
					}
					
					//显示表格对象后再加载数据才稳定
					Jxstar.loadData(selgrid, {where_sql:config.whereSql, where_value:'', where_type:config.whereType});
					
					//添加选择数据的方法
					selgrid.on('rowdblclick', function(grid, n, event){
						//取选择的来源记录数据
						var srcRecords = JxUtil.getSelectRows(grid);
						if (srcRecords == null || srcRecords.length == 0) {
						//如果选择的记录为空，则说明是清空选择的数据
							var store = grid.getStore();
							srcRecords = []; srcRecords[0] = JxUtil.emptyRecord(store);
						} else {
							//如果不是多选，则只取第一天记录的值
							if (!ismore) srcRecords = [srcRecords[0]];
						}
						
						var records , fields = [];
						var sourceField = config.sourceField;
						var srcTableName = sourceField.split(".")[0];
						var srcFields = sourceField.split(".")[1].split(";");
						for(var i = 0; i < srcFields.length; i++){
							var srcFieldName = srcTableName + '__' + srcFields[i];
							fields[i] = srcFieldName;
						}
						//向listView添加行
						var store = listv.getStore();
						for(var i = 0;i<srcRecords.length; i++){
							var record = new (store.reader.recordType)({});
							var tar_id = '';
							for(var j=0;j<fields.length;j++){
								var v = srcRecords[i].get(fields[j]);
								var f = fields[j].split('__')[1];
								if(f.indexOf('_id') > 0) tar_id = f;
								
								record.set(f,v);
							}
							var flag = true;
							var count = store.getCount();
							for(var t = 0;t < count; t++){
								var id = store.getAt(t).get(tar_id);
								if(id != null && id == record.get(tar_id)){
									flag = false;
									break;
								}
							}
							if(!flag){
								continue;
							}
							store.insert(0,record);
						}
						
						//隐藏选择的窗口
						win.close();
					});
				});
			};

			//异步从JS文件加载功能对象
			var pathname = config.layoutPage;
			if (pathname == null || pathname.length == 0) {
				pathname = define.gridpage;
			}
			if (pathname == null || pathname.length == 0){
				JxHint.alert(jx.star.noselect);	//'设计状态，不能显示选择窗口！'
				return;
			}
			Request.loadJS(pathname, hdCall);
		};


	//模块选择窗口
	var openModWin = function() {
		var selcfg = {pageType:'combogrid', nodeId:'sys_module', layoutPage:'/public/layout/layout_tree.js', sourceField:'funall_module.module_id;module_code;module_name', targetField:'module.id;code;name', whereSql:"", whereValue:'', whereType:'', isSame:'0', isShowData:'1', isMoreSelect:'1',isReadonly:'0',queryField:'',likeType:'all',fieldName:'module__code'};
		
		createSelectWin(selcfg, modListView);
	};
	//功能选择窗口
	var openFunWin = function() {
		var selcfg = {pageType:'combogrid', nodeId:'sel_fun', layoutPage:'/public/layout/layout_tree.js', sourceField:'fun_base.fun_id;fun_name', targetField:'fun.id;name', whereSql:"", whereValue:'', whereType:'', isSame:'0', isShowData:'1', isMoreSelect:'1',isReadonly:'0',queryField:'',likeType:'all',fieldName:'fun__id'};
		
		createSelectWin(selcfg, funListView);
	};
	
	//导出文件
	var expData = function(){
		var form = funLayout.getForm();
		
		var exptype = form.findField('exptype').getGroupValue();
		var Ids = new Array();
		if(exptype == 'mod'){
			var store = modListView.getStore();
			for(var i=0;i< store.getCount();i++){
				var moduleId = store.getAt(i).get('module_id');
				Ids[i] = moduleId;
			}
		}else{
			var store = funListView.getStore();
			for(var i=0;i< store.getCount();i++){
				var funId = store.getAt(i).get('fun_id');
				Ids[i] = funId;
			}
		}
		
		if(Ids.length == 0){
			JxHint.alert('请选择模块或者功能！');
			return false;
		}
		
		var expcontrol = form.findField('expcontrol').getValue();
		var expctlsel = form.findField('expctlsel').getValue();
		var expmodule = form.findField('expmodule').getValue();
		var expxls = form.findField('expxls').getValue();
		var expdmcfg = form.findField('expdmcfg').getValue();
		var isnew = form.findField('isnew').getValue();
		//输出文件名
		var exppath = form.findField('exppath').getValue();
		if(exppath.length == 0) {
			JxHint.alert('请输入导出文件名！');
			return false;
		}
		
		//设置请求的参数
		var params = 'funid=data_move';
		params += '&exptype='+ exptype +'&expIds='+Ids;
		
		params += '&expcontrol='+expcontrol + '&expctlsel='+expctlsel + '&expmodule='+expmodule 
					+ '&expxls='+expxls + '&expdmcfg='+expdmcfg + '&isnew='+isnew;
		params += '&exppath=' +exppath;
		
		params += '&pagetype=form&eventcode=expdata';
		
		//alert(params);
		//执行处理的内容
		var endcall = function(data) {
			JxHint.alert('导出成功！');
		};
		
		//发送请求
		Request.postRequest(params, endcall);
	};
	
	var data = [];
	var modStore = new Ext.data.SimpleStore({data:data,fields:['module_id','module_code','module_name']});
	var funStore = new Ext.data.SimpleStore({data:data,fields:['fun_id','fun_name']});
	
	//显示模块表格
	var modListView =  new Ext.ListView({
		store:modStore,
		multiSelect: false,
		reserveScrollOffset: true,
		disableHeaders:true,
		//disabled:true,
		columns: [{
			header: '模块ID',
			hidden:true,
			dataIndex: 'module_id'
		},{
			header: '模块编号',
			width:.4,
			dataIndex: 'module_code'
		},{
			header: '模块名称',
			width:.5,
			dataIndex: 'module_name'
		},{
			header: '操作',
			width:.1,
			align:'center',
			tpl:'<img src="resources/images/icons/button/cancel.gif" />'
		}]
	});
	
	modListView.on('click',function(view,index,node,e){
		var t = e.getTarget('img');
		if(t) {
			view.getStore().removeAt(index);
		}
	});
	
	//显示功能表格
	var funListView =  new Ext.ListView({
		store:funStore,
		multiSelect: false,
		reserveScrollOffset: true,
		disableHeaders:true,
		disabled:true,
		columns: [{
			header: '功能标识',
			hidden:true,
			dataIndex: 'fun_id'
		},{
			header: '功能名称',
			width:.5,
			dataIndex: 'fun_name'
		},{
			header: '操作',
			width:.1,
			align:'center',
			tpl:'<img src="resources/images/icons/button/cancel.gif" />'
		}]
	});
	
	funListView.on('click',function(view,index,node,e){
		var t = e.getTarget('img');
		if(t) {
			view.getStore().removeAt(index);
		}
	});
	
	//选择模块区域
	var selmodp = {
		width:500,
		height:225,
		xtype: 'container',
		layout:'border',
		items:[{
			region:'north',
			height:44,
			style:'font-size:13px;background-color:#ffffff;',
			xtype:'container',
			layout:'absolute',
			items:[{
				xtype:'radio',
				x:20, y:5, width:100, height:20, 
				checked:true,
				name:'exptype',
				inputValue:'mod',
				boxLabel:'按模块导出',
				listeners: {
					check: function(){
						modListView.setDisabled(true);
						funListView.setDisabled(false);
					}
				}
			},{
				x:150, y:0, width:80, height:20, 
				xtype:'button',
				text:'选择模块',
				handler: openModWin
			}]
		},{
			layout:'fit',
			region:'center',
			items:[modListView]
		}]
	};
	
	//选择功能区域
	var selfundp = {
		width:500,
		height:225,
		xtype: 'container',
		layout:'border',
		style:'margin-top:10px;',
		items:[{
			region:'north',
			height:44,
			style:'font-size:13px;background-color:#ffffff;',
			xtype:'container',
			layout:'absolute',
			items:[{
				xtype:'radio',
				x:20, y:5, width:100, height:20, 
				inputValue:'fun',
				name:'exptype',
				boxLabel:'按功能导出',
				listeners: {
					check: function(){
						funListView.setDisabled(true);
						modListView.setDisabled(false);
					}
				}
			},{
				x:150, y:0, width:80, height:20, 
				xtype:'button',
				text:'选择功能',
				handler: openFunWin
			}]
		},{
			layout:'fit',
			region:'center',
			items:[funListView]
		}]
	};

	//导出选项区域
	var expoption = {
		xtype: 'container',
		height:370,
		items:[{
			style:'margin:5 0 0 38px;font-size:13px;',
			xtype:'container',
			layout:'absolute',
			width:150,
			height:96,
			items: [
				{boxLabel: '对比相关选项控件', width:150, x:5, y:0, name: 'expcontrol', checked: true, xtype: "checkbox"},
				{boxLabel: '对比相关选择窗口', width:150, x:5, y:24, name: 'expctlsel', checked: true, xtype: "checkbox"},
				{boxLabel: '对比相关模块定义', width:150, x:5, y:48, name: 'expmodule', checked: true, xtype: "checkbox"},
				{boxLabel: '对比相关XLS导入定义', width:150, x:5, y:72, name: 'expxls', checked: true, xtype: "checkbox"}
			]
		},{
			style:'font-size:13px;',
			xtype:'container',
			layout:'absolute',
			width:150,
			height:24,
			items: [
				{boxLabel: '对比相关数据模型定义', width:150, height:24, x:5, y:0, name: 'expdmcfg', checked: true, xtype: "checkbox"},
				{boxLabel: '是否修改状态', width:100, x:160, height:24, y:0, name: 'isnew', checked: true, xtype: "checkbox"}
			]
		},{
			layout:'form',
			labelAlign:'top',
			style:'margin-top:30px;',
			border:false,
			items:[{
				xtype: 'textfield',
				//inputType:'file',
				fieldLabel: '输出文件名：',
				name: 'exppath',
				width:200,
				value:'C:\\export\\',
				allowBlank :false
			},{
				xtype:'button',
				text:'导出',
				handler: expData
			}]
		}]
	};
	
	
	//创建迁移工具布局面板
	var funLayout = new Ext.form.FormPanel({
		border:false,
		layout:'column',
		items:[{
			columnWidth:.6,
			baseCls:'xf-panel',
			title:'导出功能范围',
			style: 'margin:20px;',
			bodyStyle:"padding:10px",
			height:530,
			items:[selmodp, selfundp]
		},{
			columnWidth:.4,
			baseCls:'xf-panel',
			title:'导出选项',
			style: 'margin:20px;',
			bodyStyle:"padding:10px",
			height:530,
			items:[expoption]
		}]
	});
	

	return funLayout;
}