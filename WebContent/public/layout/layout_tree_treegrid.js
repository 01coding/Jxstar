/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 树形页面布局，支持tree, treegrid类型的页面组合。
 * 
 * @author TonyTan
 * @version 1.0, 2016-01-01
 */

Jxstar.currentPage = function(define, pageParam) {//pageType, parentNodeId
	if (define == null) {
		JxHint.alert('layout_tree define param define is null!');
		return;
	}

	var funid = define.nodeid;
	
	pageParam = pageParam || {};
	
	var tbar = null, tt = define.treeteam;
	if (tt && tt.length > 1) tbar = new Ext.Toolbar();
	//创建树形布局面板
	var funLayout = new Ext.Panel({
		border:false,
		layout:'border',
		items:[{
			autoScroll:true,
			region:'west',
			layout:'fit',
			width:160,
			minSize: 0,
	        maxSize: 300,
			split:true,
			border:false,
			tbar:tbar
		},{
			region:'center',
			layout:'fit',
			border:false
		}]
	});
	
	//创建数据页面
	JxTreeGrid.createTree('sys_dept', funLayout, 'A', '组织机构');
	JxTreeGrid.createTreeGrid(funLayout.getComponent(1), define, pageParam);

	return funLayout;
};