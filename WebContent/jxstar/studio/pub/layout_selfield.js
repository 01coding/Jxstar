/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 选择多表字段页面布局，采用左右GRID布局。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Jxstar.currentPage = function(define, pageParam) {
	var funid = 'sel_field';

	var funLayout = new Ext.Panel({
		border:false,
		layout:'border',
		items:[{
			pagetype:'grid',
			autoScroll:true,
			region:'west',
			layout:'fit',
			width:200,
			split:true,
			border:false
		},{
			pagetype:'subgrid',
			region:'center',
			layout:'fit',
			border:false
		}]
	});
	
	//创建数据页面
	Jxstar.createPage('sel_table', 'gridpage', funLayout.getComponent(0), {pageType:'myimport'});
	var pageParam = {pageType:'import', parentNodeId:'sel_table'};
	Jxstar.createPage('sel_field', 'gridpage', funLayout.getComponent(1), pageParam);

	//显示数据
	JxUtil.delay(1000, function(){
		var pgrid = funLayout.getComponent(0).getComponent(0);
		var sgrid = funLayout.getComponent(1).getComponent(0);		
		//点击表名，显示字段明细
		pgrid.on('rowclick', function(g, n, e){
			var record = g.getStore().getAt(n);
			if (record == null) return false;
			
			var fkval = record.get('dm_table__table_name');
			Jxstar.loadSubData(sgrid, fkval);
		});
	});

	return funLayout;
}