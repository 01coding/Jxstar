/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 大数据工具的界面。
 * 
 * @author KevinCao
 * @version 1.0, 2013-03-25
 */

Jxstar.currentPage = function() {

	var expData = function(){
		var form = bigDataForm.getForm();
		var exppath = form.findField('exppath').getValue();
		var tableName = form.findField('exp_tableName').getValue();
		var fieldName = form.findField('exp_fieldName').getValue();
		var keyField = form.findField('exp_keyField').getValue();
		var where = form.findField('exp_where').getValue();
		
		if(exppath.length == 0){
			JxHint.alert('请输入文件路径！');
			return false;
		}else if(tableName.length == 0){
			JxHint.alert('请输入导出表名！');
			return false;
		}else if(fieldName.length == 0){
			JxHint.alert('请输入导出大字段名！');
			return false;
		}else if(keyField.length == 0){
			JxHint.alert('请输入导出主键字段名！');
			return false;
		}
		
		var e = encodeURIComponent;
		var params = 'funid=data_big';
		params += '&path='+exppath + '&tableName='+tableName + '&blobName='+fieldName + '&keyName='+keyField+'&where='+e(where);
		params += '&pagetype=form&eventcode=expblob';
		
		var endcall = function(data) {
			JxHint.alert('导出成功！');
		};

		//发送请求
		Request.postRequest(params, endcall);
	};
	
	var impData = function(){
		var form = bigDataForm.getForm();
		var exppath = form.findField('exppath').getValue();
		var tableName = form.findField('imp_tableName').getValue();
		var fieldName = form.findField('imp_fieldName').getValue();
		var keyField = form.findField('imp_keyField').getValue();
		
		if(exppath.length == 0){
			JxHint.alert('请输入文件路径！');
			return false;
		}else if(tableName.length == 0){
			JxHint.alert('请输入导入表名！');
			return false;
		}else if(fieldName.length == 0){
			JxHint.alert('请输入导入大字段名！');
			return false;
		}else if(keyField.length == 0){
			JxHint.alert('请输入导入主键字段名！');
			return false;
		}
		
		var params = 'funid=data_big';
		params += '&path='+exppath + '&tableName='+tableName + '&blobName='+fieldName + '&keyName='+keyField;
		params += '&pagetype=form&eventcode=impblob';
		
		var endcall = function(data) {
			JxHint.alert('导入成功！');
		};

		//发送请求
		Request.postRequest(params, endcall);
	};
	
	var executeRequest = function(type){
		var form = bigDataForm.getForm();
		var where = form.findField('exp_where').getValue();
		var exppath = form.findField('exppath').getValue();
		
		var e = encodeURIComponent;
		var params = 'funid=data_big';
		params += '&path='+exppath + '&type=' +type ;
		params += '&pagetype=form&eventcode=pageblob'+'&where='+e(where);
		
		var endcall = function(data) {
			JxHint.alert(data.msg);
		};

		//发送请求
		Request.postRequest(params, endcall);
	};
	
	var btnClick = function(e){
		var value = e.value;
		if(value == null || value.length == 0) return false;
		executeRequest(value);
	};
	
	var testService = function(){
		var pageurl = '/jxstar/studio/pub/layout_server_test.js';
		var title = '服务接口测试';
		var id = 'fun_server_test_xx';
		
		Request.loadJS(pageurl, function(f){
			var page = f();
			
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
		});
	};
	
	var bigDataForm = new Ext.form.FormPanel({
		style: 'padding:20px;',
		border:false,
		items:[{
			xtype: 'textfield',
			fieldLabel: '文件路径：',
			name: 'exppath',
			value:'C:\\',
			width:290,
			allowBlank :false
		},{
			layout:'table',
            layoutConfig: {columns:3},
			border:false,
			style:'margin-left:10px',
			defaults :{
				style :'marginRight:30px;marginBottom:10px;marginTop:10px;'
			},
			items:[{
				xtype:'button',
				text:'导出功能设计',
				scale:'medium',
				value:'expfun',
				handler: btnClick
			},{
				xtype:'button',
				text:'导出流程图',
				scale:'medium',
				value:'expwf',
				handler: btnClick
			 },{
				xtype:'button',
				text:'导出流程导航',
				scale:'medium',
				value:'expnav',
				handler: btnClick
			},{
				xtype:'button',
				text:'导入功能设计',
				scale:'medium',
				value:'impfun',
				handler: btnClick
			},{
				xtype:'button',
				text:'导入流程图',
				scale:'medium',
				value:'impwf',
				handler: btnClick
			},{
				xtype:'button',
				text:'导入流程导航',
				scale:'medium',
				value:'impnav',
				handler: btnClick
			}]
		},{
			style:'margin-top:10px',
			xtype:'container',
			layout:'column',
			items:[{
				baseCls:'xf-panel',
				title:'自定义导出',
				layout:'form', 
				columnWidth:0.5,
				items:[{
					xtype: 'textfield',
					fieldLabel: '表名：',
					name: 'exp_tableName',
					width:300
				},{
					xtype: 'textfield',
					fieldLabel: '大字段名：',
					name: 'exp_fieldName',
					width:300
				},{
					xtype: 'textfield',
					fieldLabel: '主键字段名：',
					name: 'exp_keyField',
					width:300
				},{
					xtype: 'textfield',
					fieldLabel: '过滤条件：',
					name: 'exp_where',
					width:300
				},{
					xtype:'button',
					text:'导出',
					handler:expData
				}]
			},{
				baseCls:'xf-panel',
				title:'自定义导入',
				layout:'form', 
				columnWidth:0.5,
				style:'margin-left:10px;',
				items:[{
					xtype: 'textfield',
					fieldLabel: '表名：',
					name: 'imp_tableName',
					width:300
				},{
					xtype: 'textfield',
					fieldLabel: '大字段名：',
					name: 'imp_fieldName',
					width:300
				},{
					xtype: 'textfield',
					fieldLabel: '主键字段名：',
					name: 'imp_keyField',
					style: 'margin-bottom:36px',
					width:300
				},{
					xtype:'button',
					text:'导入',
					handler:impData
				}]
			}]
		},{
			style:'margin:20px 10px',
			xtype:'button',
			text:'服务接口测试',
			handler:testService
		}]
	});
	
	//创建大数据工具布局面板
	var funLayout = new Ext.Panel({
		border:false,
		layout:'fit',
		items:[bigDataForm]
	});
	

	return funLayout;
}