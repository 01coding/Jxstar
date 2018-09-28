/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 上下GRID布局，上为主下为子。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Jxstar.currentPage = function(define, pageParam) {
	if (define == null) {
		JxHint.alert('layout_grid_tb define param define is null!');
		return;
	}

	var funid = define.nodeid;
	var pkcol = define.pkcol;

	//创建上下表格功能布局面板
	var funLayout = new Ext.Panel({
		border:false,
		layout:'border',
		items:[{
			pagetype:'grid',
			region:'north',
			height:350,
			layout:'fit',
			split:true,
			border:false
		},{
			pagetype:'subgrid',
			region:'center',
			layout:'fit',
			border:false
		}]
	});
	
	//创建主表数据页面
	Jxstar.createPage(funid, 'gridpage', funLayout.getComponent(0));
	var pageParam = {pageType:'subgrid', parentNodeId:funid};
	//创建子表数据页面
	var subfunid = define.subfunid;
	if (subfunid != null && subfunid.length > 0) {
		Jxstar.createPage(subfunid, 'gridpage', funLayout.getComponent(1), pageParam);
	}
	
	//附加显示数据的事件
	var hd = function() {
		var gridm = funLayout.getComponent(0).getComponent(0);//主表
		var grids = funLayout.getComponent(1).getComponent(0);//子表
		
		var selectRow = function(g){
			var selm = g.getSelectionModel();
			if (selm && selm.getSelections) {
				selm.selectFirstRow();
				g.fireEvent('rowclick', g, 0);
			}
		};
		gridm.getStore().on('load', function(s){
			selectRow(gridm);
		});
		
		//点击主表记录，显示明细表记录
		gridm.on('rowclick', function(g, n, e){
			var record = g.getStore().getAt(n);
			if (record == null) {//清除明细表中的数据
				grids.getStore().removeAll();grids.fkValue = '';
				return false;
			}
			
			//外键值
			var pkvalue = record.get(pkcol);
			//加载子表数据
			Jxstar.loadSubData(grids, pkvalue);
		});
		selectRow(gridm);
	};
	//保证附加事件成功
	var callhd = function() {
		var gm = funLayout.getComponent(0).getComponent(0);
		if (gm) {
			hd();
		} else {
			JxUtil.delay(500, callhd);
		}
	};
	callhd();

	//----------------构建树形页面----------------
	var tbar = null, tt = define.treeteam;
	if (tt && tt.length > 1) tbar = new Ext.Toolbar();
	//创建树形布局面板
	var treeLayout = new Ext.Panel({
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
			border:false,
			tbar:tbar
		},{
			region:'center',
			layout:'fit',
			border:false,
			items:[funLayout]
		}]
	});
	Jxstar.createTree(funid, treeLayout);

	return treeLayout;
}