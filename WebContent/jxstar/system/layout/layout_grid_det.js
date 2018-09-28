/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 左GRID右明细表的布局。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Jxstar.currentPage = function(define, pageParam) {
	var tabGridDet = new Ext.Panel({
		border:false,
		layout:'border',
		items:[{
			xtype:'container',
			pagetype:'grid',
			autoScroll:true,
			region:'west',
			layout:'fit',
			width:300,
			split:true,
			border:false
		},{
			xtype:'container',
			pagetype:'subgrid',
			region:'center',
			layout:'fit',
			border:false
		}]
	});
	
	var funid = define.nodeid;
	var subid = define.subfunid;
	//创建数据页面
	Jxstar.createPage(funid, 'gridpage', tabGridDet.getComponent(0));
	var subparam = {pageType:'subeditgrid', parentNodeId:funid};
	Jxstar.createPage(subid, 'gridpage', tabGridDet.getComponent(1), subparam);

	//显示数据
	JxUtil.delay(500, function(){
		var igrid = tabGridDet.getComponent(0).getComponent(0);
		var pgrid = tabGridDet.getComponent(1).getComponent(0);		
		//点击调用类，显示调用参数
		igrid.on('rowclick', function(g, n, e){
			pgrid.fkValue = '';
			var record = g.getStore().getAt(n);
			if (record == null) return false;
			
			//外键值
			var fkval = record.get(define.pkcol);
			//加载数据
			Jxstar.loadSubData(pgrid, fkval);
		});
	});
	
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
			border:false,
			split:true
		},{
			region:'center',
			layout:'fit',
			border:false,
			items:[tabGridDet]
		}]
	});
	
	//创建树形页面
	Jxstar.createTree(funid, treeLayout);

	return treeLayout;
}