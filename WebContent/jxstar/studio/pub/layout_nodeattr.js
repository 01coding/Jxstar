/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 流程节点属性设置功能布局，支持form，subgrid类型的页面组合。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Jxstar.currentPage = function(define) {
	if (define == null) {
		JxHint.alert('layout_nodeattr define param is null!');
		return;
	}

	var funid = define.nodeid;
	var pkcol = define.pkcol;
	var title = define.nodetitle;

	//创建标准GridForm布局
	var tabGridForm = new Ext.TabPanel({
		border:false,
		closeAction:'close',
		activeTab:0,
		items:[{
			pagetype:'form',
			title: title+'-'+jx.layout.form,	//表单
			autoScroll:true,
			layout:'fit',
			border:false,
			iconCls:'tab_form'
		}]
	});

	//添加form页面
	Jxstar.createPage(funid, 'formpage', tabGridForm.getComponent(0));
	
	//取子功能ID
	var subfunid = define.subfunid;
	if (subfunid != null && subfunid.length > 0) {
		var subfunids = subfunid.split(',');
		for (var i = 0, n = subfunids.length; i < n; i++) {
			var subid = subfunids[i];
			if (subid.length == 0) continue;
			
			var subdefine = Jxstar.findNode(subid);
			var newtab = tabGridForm.add({
				pagetype:'subgrid',
				title: subdefine.nodetitle+'-'+jx.layout.det,	//明细
				autoScroll:true,
				layout:'fit',
				border:false,
				iconCls:'tab_sub'
			});
			
			var pageParam = {pageType:'subgrid', parentNodeId:funid};
			Jxstar.createPage(subid, 'gridpage', newtab, pageParam);
		}
	}
	
	//在form没有记录时，不能打开明细表
	tabGridForm.on('beforetabchange', function(tabPanel, newTab, currentTab){
		var fp = tabPanel.getComponent(0);
		if (fp == null) return false;
		
		//取FORM
		if (fp.items == null) return true;
		var form = fp.getComponent(0);
		if (form == null) return false;
		
		//取主键值
		var record = form.getForm().myRecord;
		if (record == null) return false;
		var pkvalue = record.get(pkcol);
		var pagetype = newTab.pagetype;
		if (pagetype == 'subgrid' && pkvalue.length == 0) {
			JxHint.alert(jx.wf.nomain);	//'主记录没有创建，不能打开明细记录！'
			return false;
		}
		
		return true;
	});

	tabGridForm.on('tabchange', function(tabPanel, activeTab){
		var fp = tabPanel.getComponent(0);
		if (fp == null) return false;
		
		//取FORM
		if (fp.items == null) return true;
		var form = fp.getComponent(0);
		if (form == null) return false;
		
		//取主键值
		var record = form.getForm().myRecord;
		if (record == null) return false;
		var pkvalue = record.get(pkcol);
		var pagetype = activeTab.pagetype;
		
		var activePanel = activeTab.getComponent(0);
		
		//显示明细数据
		if (pagetype == 'subgrid') {
			Jxstar.loadSubData(activePanel, pkvalue);
		}
	});

	return tabGridForm;
};
