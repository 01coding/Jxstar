/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 功能设计器功能布局。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Jxstar.currentPage = function() {
	var funid = 'sys_fun_base';

	//创建TAB功能布局面板
	var tabFunction = new Ext.TabPanel({
		region:'center',
		border:false,
		closeAction:'close',
		activeTab:0,
		items:[{
			pagetype:'grid',
			title: jx.fun.grid,		//'功能列表',
			autoScroll:true,
			layout:'fit',
			border:false,
			iconCls:'tab_grid'
		},{
			pagetype:'form',
			title: jx.fun.form,		//'功能信息',
			autoScroll:true,
			layout:'fit',
			border:false,
			iconCls:'tab_form'
		},{
			pagetype:'subgrid',
			title: jx.fun.field,	//'字段列表',
			autoScroll:true,
			layout:'fit',
			border:false,
			iconCls:'tab_sub'
		},{
			pagetype:'subgrid',
			title: jx.fun.event,	//'事件注册',
			autoScroll:true,
			layout:'fit',
			border:false,
			iconCls:'tab_sub'
		},{
			pagetype:'griddes',
			title: jx.fun.dgrid,	//'表格设计',
			autoScroll:true,
			layout:'fit',
			border:false,
			iconCls:'tab_des'
		},{
			pagetype:'formdes',
			title: jx.fun.dform,	//'表单设计',
			autoScroll:true,
			layout:'fit',
			border:false,
			iconCls:'tab_des',
			//先创建一个空按钮，保证在chrome中显示正常
			tbar:new Ext.Toolbar()
		}]
	});
	
	Jxstar.createPage(funid, 'gridpage', tabFunction.getComponent(0));
	Jxstar.createPage(funid, 'formpage', tabFunction.getComponent(1));
	
	var pageParam = {pageType:'subgrid', parentNodeId:funid};
	Jxstar.createPage('sys_fun_col', 'gridpage', tabFunction.getComponent(2), pageParam);
	Jxstar.createPage('fun_event', 'gridpage', tabFunction.getComponent(3), pageParam);
	
	tabFunction.on('beforetabchange', function(tabPanel, newTab, currentTab){
		//取主界面的功能列表
		var fgp = tabPanel.getComponent(0);
		if (fgp == null) return false;
		//tab打开时为空
		if (fgp.items == null) return true;
		var fgrid = fgp.getComponent(0);
		if (fgrid == null) return false;
		
		var records = JxUtil.getSelectRows(fgrid);
		if (records.length == 0 && newTab.pagetype != 'grid') {
			records = JxUtil.firstRow(fgrid);
			if (records.length == 0) {
				JxHint.alert(jx.layout.nodata);
				return false;
			}
		}
		var curPage = currentTab.getComponent(0);
		if (curPage && curPage.isXType('form') && curPage.getForm().isDirty()) {
			if (confirm(jx.layout.modify)) {	//'记录已被修改，是否需要先保存？'
				self.save();
				return false;
			}
		}
		return true;
	});

	tabFunction.on('tabchange', function(tabPanel, activeTab){
		//取当前激活的Tab页面类型
		var pagetype = activeTab.pagetype;
		//处理有些页面没有自动显示的问题
		activeTab.doLayout();
		//取主界面的功能列表
		var fgp = tabPanel.getComponent(0);
		if (fgp == null) return false;
		var fgrid = fgp.getComponent(0);
		if (fgrid == null) return false;
		
		//取选择的功能ID
		var selfunid = '';
		var records = JxUtil.getSelectRows(fgrid);
		if (records.length >= 1) {
			selfunid = records[0].get('fun_base__fun_id');
		} else {
			if (pagetype != 'grid') {
				JxHint.alert(jx.layout.selmain);
				return false;
			}
		}
		var activePanel = activeTab.getComponent(0);
		
		//显示表单数据
		if (pagetype == 'form') {
			var form = activeTab.getComponent(0);
			var record = records[0];
			form.getForm().myGrid = fgrid;
			form.getForm().myStore = fgrid.getStore();
			form.getForm().myRecord = record;
			form.getForm().loadRecord(record);
			//显示FORM时，执行初始化事件
			form.formNode.event.initForm();
		} else
		//显示字段列表
		if (pagetype == 'subgrid') {
			Jxstar.loadSubData(activePanel, selfunid);
		} else
		//显示表格设计器
		if (pagetype == 'griddes') {
			//取创建页面的函数
			var hdCall = function(f) {
				f.createDesign(selfunid, tabFunction.getComponent(4));
			};
			//异步从JS文件加载功能对象
			Request.loadJS('/jxstar/studio/pub/designer_grid.js', hdCall);
		} else
		//显示表单设计器
		if (pagetype == 'formdes') {
			//取创建页面的函数
			var hdCall = function(f) {
				var parent = tabFunction.getComponent(5);
				f.render(selfunid, parent);
			};
			
			//异步从JS文件加载功能对象
			Request.loadJS('/jxstar/studio/pub/designer_form.js', hdCall);
		}
	});
			   
	//创建功能注册布局面板
	var funLayout = new Ext.Panel({
		border:false,
		layout:'border',
		items:[{
			region:'west',
			layout:'fit',
			width:160,
			split:true,
			border:false
		},{
			region:'center',
			layout:'fit',
			border:false,
			items:[tabFunction]
		}]
	});
	var tree = Jxstar.createTree(funid, funLayout);
	//如果不是jxstar账户，则不显示开发平台模块
	var wsql = '', wvalue = '', wtype = '';
	if (Jxstar.session['user_code'] != 'jxstar') {
		wsql = 'module_id not like ?';
		wvalue = '1010%';
		wtype = 'string';
	}
	
	if (wsql.length > 0) {
		var loader = tree.getLoader();
		loader.baseParams.where_sql = wsql;
		loader.baseParams.where_value = wvalue;
		loader.baseParams.where_type = wtype;
	}

	return funLayout;
}