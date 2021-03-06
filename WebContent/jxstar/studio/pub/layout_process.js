﻿/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 流程设计器功能布局。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Jxstar.currentPage = function(define) {
	if (define == null) {
		JxHint.alert('layout_main define param define is null!');
		return;
	}

	var funid = define.nodeid;
	var pkcol = define.pkcol;
	var title = define.nodetitle;

	var tabGridForm = new Ext.TabPanel({
		border:false,
		closeAction:'close',
		activeTab:0,
		items:[{
			pagetype:'grid',
			title: jx.wf.define,	//'过程定义列表',
			autoScroll:true,
			layout:'fit',
			border:false,
			iconCls:'tab_grid'
		},{
			pagetype:'design',
			title: jx.wf.design,	//'流程设计器',
			autoScroll:true,
			layout:'fit',
			border:false,
			iconCls:'tab_des',
			//先创建一个空按钮，保证在chrome中显示正常
			tbar:new Ext.Toolbar()
		},{
			pagetype:'subgrid',
			title: jx.wf.nodedet,	//'节点信息明细',
			autoScroll:true,
			layout:'fit',
			border:false,
			iconCls:'tab_sub'
		},{
			pagetype:'subgrid',
			title: jx.wf.linedet,	//'流转信息明细',
			autoScroll:true,
			layout:'fit',
			border:false,
			iconCls:'tab_sub'
		}]
	});
	Jxstar.createPage(funid, 'gridpage', tabGridForm.getComponent(0));
	Jxstar.createPage('wf_node', 'gridpage', tabGridForm.getComponent(2));
	Jxstar.createPage('wf_line', 'gridpage', tabGridForm.getComponent(3));

	tabGridForm.on('beforetabchange', function(tabPanel, newTab, currentTab){
		//取列表
		var fgp = tabPanel.getComponent(0);
		if (fgp == null) return false;
		//tab打开时为空
		if (fgp.items == null) return true;
		var fgrid = fgp.getComponent(0);
		if (fgrid == null) return false;
		
		var pagetype = newTab.pagetype;
		var records = JxUtil.getSelectRows(fgrid);
		if (records.length == 0 && pagetype != 'grid') {
			records = JxUtil.firstRow(fgrid);
			if (records.length == 0) {
				JxHint.alert(jx.layout.nodata);
				return false;
			}
		}
		
		return true;
	});

	tabGridForm.on('tabchange', function(tabPanel, activeTab){
		var pagetype = activeTab.pagetype;
		//处理有些页面没有自动显示的问题
		activeTab.doLayout();
		//取数据列表
		var fgp = tabPanel.getComponent(0);
		if (fgp == null) return false;
		//tab打开时为空
		if (fgp.items == null) return false;
		var fgrid = fgp.getComponent(0);
		if (fgrid == null) return false;
		
		var activePanel = activeTab.getComponent(0);
		
		//取选择记录的主键值
		var pkvalue = '';
		var records = JxUtil.getSelectRows(fgrid);
		if (records.length >= 1) {
			pkvalue = records[0].get(pkcol);
		} else {
			JxHint.alert(jx.layout.selmain);	//'请选择一条主记录！'
			return false;
		}
		
		if (pagetype == 'subgrid') {
			Jxstar.loadSubData(activePanel, pkvalue);
		} else if (pagetype == 'design') {
			//取创建页面的函数
			var hdCall = function(f) {
				var pe = tabGridForm.getComponent(1);
				var runState = records[0].get('wf_process__process_state');
				f.render(pkvalue, runState, pe, fgrid);
			};
			
			//异步从JS文件加载功能对象
			Request.loadJS('/jxstar/studio/pub/designer_process.js', hdCall);
		}
	});
	
	//创建树形布局面板
	var funLayout = new Ext.Panel({
		border:false,
		layout:'border',
		items:[{
			autoScroll:true,
			region:'west',
			layout:'fit',
			width:160,
			minSize: 160,
	        maxSize: 300,
			split:true,
			border:false
		},{
			region:'center',
			layout:'fit',
			border:false,
			items:[tabGridForm]
		}]
	});
	
	//创建树形页面
	Jxstar.createTree(funid, funLayout);

	return funLayout;
};
