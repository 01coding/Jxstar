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

	define.isCloud = true;
	var funid = define.nodeid;
	var pkcol = define.pkcol;
	
	//创建子表数据页面
	var subfunid = define.subfunid;
	if (Ext.isEmpty(subfunid)) {
		JxHint.alert('没有设置子功能，不能显示子功能数据！');
		return;
	}
	var subdefine = Jxstar.findNode(subfunid);
	//标签为云布局功能
	subdefine.isCloud = true;
	var pageParam = {pageType:'subeditgrid', parentNodeId:funid};
    //把按钮显示在标题栏中
	if (subdefine.isCloud) {
		pageParam.showCall = function(page){
			JxCloud.addTools(page);
			page.pageSize = 10;//每页显示10条记录
		};
	}

	//创建上下表格功能布局面板
	var funLayout = new Ext.Panel({
		border:false,
		layout:'border',
		items:[{
			pagetype:'grid',
			region:'north',
			height:280,
			layout:'fit',
			split:true,
			border:false
		},{
			title:subdefine.nodetitle, baseCls:'xs-panel', data:subfunid, cls:'sub_panel', 
			pagetype:'subgrid',
			region:'center',
			layout:'fit',
			border:false
		}]
	});
	
	//创建主表数据页面
	Jxstar.createPage(funid, 'gridpage', funLayout.getComponent(0));
	//创建子表数据
	Jxstar.createPage(subfunid, 'gridpage', funLayout.getComponent(1), pageParam);
	
	//附加显示数据的事件
	var hd = function() {
		var gridm = funLayout.getComponent(0).getComponent(0);//主表
		var grids = funLayout.getComponent(1).getComponent(0);//子表
		if (grids) {
			grids.disable();//未选主记录时子表不可用
			JxUtil.disCloudTool(grids, true);
		}
		
		//点击主表记录，显示明细表记录
		gridm.on('rowclick', function(g, n, e){
			grids.parentGrid = gridm;//设置主表对象
			
			var record = g.getStore().getAt(n);
			if (record == null) {//清除明细表中的数据
				grids.getStore().removeAll();grids.fkValue = '';
				return false;
			}
			var disable = false;
			//外键值
			var pkvalue = record.get(pkcol);
			//加载子表数据
			Jxstar.loadSubData(grids, pkvalue);
			
			//如果主记录已提交，则明细表的按钮不能使用
			if (define.auditcol.length > 0) {
				var state = record.get(define.auditcol);
				if (state == null || state.length == 0) state = '0';
				disable = (state != '0' && state != '6');
			}
			JxUtil.disCloudTool(grids, disable);
		});
		
		var sm = gridm.getSelectionModel();
		//选择记录时控制子表可用
		sm.on('rowselect', function(sm, i){
			grids.enable();//选择主记录后子表可用
		});
		//没有选择记录时控制子表不可用
		sm.on('rowdeselect', function(sm, i){
			JxUtil.delay(500, function(){
				if (sm.getCount() == 0) {
					JxUtil.disCloudTool(grids, true);
					grids.disable();
					grids.getStore().removeAll();
				}
			});
		});
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

	return funLayout;
}