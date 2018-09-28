/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 上面一个GRID，下面两个表格。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Jxstar.currentPage = function(define, pageParam) {
	if (define == null) {
		JxHint.alert('layout define param define is null!');
		return;
	}

	define.isCloud = true;
	var funid = define.nodeid;
	var pkcol = define.pkcol;
	var pageParam = {pageType:'subgrid', parentNodeId:funid};
	
	//检查是否设置了子功能ID
	var subfunid = define.subfunid;
	if (Ext.isEmpty(subfunid)) {
		JxHint.alert('没有设置子功能，不能显示子功能数据！');
		return;
	}
	var subids = subfunid.split(',');
	if (subids.length < 2) {
		JxHint.alert('没有设置2个子功能，不能显示子功能数据！');
		return;
	}
	var subdefine = Jxstar.findNode(subids[0]);
	//标签为云布局功能
	subdefine.isCloud = true;
    //把按钮显示在标题栏中
	if (subdefine.isCloud) {
		pageParam.showCall = function(page){
			JxCloud.addTools(page);
			page.pageSize = 10;//每页显示10条记录
		};
	}
	
	var subdefine1 = Jxstar.findNode(subids[1]);
	//标签为云布局功能
	subdefine1.isCloud = true;
	
	//创建上下表格功能布局面板
	var funLayout = new Ext.Panel({
		border:false,
		layout:'border',
		items:[{
			margins:'0 5 5 5',
			pagetype:'grid',
			region:'north',
			height:280,
			layout:'fit',
			split:true,
			border:false
		},{
			pagetype:'subgrid',
			region:'center',
			layout:'hbox',
			layoutConfig: {
				align : 'stretch',
				pack  : 'start',
			},
			border:false,
			items:[{
				title:subdefine.nodetitle, baseCls:'xs-panel', data:subids[0], cls:'sub_panel', 
				margins:'5 5 5 5',
				pagetype:'subgrid',
				flex:1,
				layout:'fit',
				split:true,
				border:false
			},{
				title:subdefine1.nodetitle, baseCls:'xs-panel', data:subids[1], cls:'sub_panel', 
				margins:'5 5 5 0',
				pagetype:'subgrid',
				flex:1,
				layout:'fit',
				border:false
			}]
		}]
	});
	
	//创建主表数据页面
	Jxstar.createPage(funid, 'gridpage', funLayout.getComponent(0));
	//创建子表数据页面
	Jxstar.createPage(subids[0], 'gridpage', funLayout.getComponent(1).getComponent(0), pageParam);
	Jxstar.createPage(subids[1], 'gridpage', funLayout.getComponent(1).getComponent(1), pageParam);
	
	//附加显示数据的事件
	var hd = function(gridm, layout) {
		var grids = layout.getComponent(1).getComponent(0).getComponent(0);
		var grids1 = layout.getComponent(1).getComponent(1).getComponent(0);
		grids.parentGrid = gridm;
		grids1.parentGrid = gridm;
		if (grids) {
			grids.disable();//未选主记录时子表不可用
			JxUtil.disCloudTool(grids, true);
			grids1.disable();//未选主记录时子表不可用
			JxUtil.disCloudTool(grids1, true);
		}
		
		var selectRow = function(g){
			g.getSelectionModel().selectFirstRow();
			g.fireEvent('rowclick', g, 0);
		};
		gridm.getStore().on('load', function(s){
			selectRow(gridm);
		});
		
		//点击主表记录，显示明细表记录
		gridm.on('rowclick', function(g, n, e){
			var record = g.getStore().getAt(n);
			if (record == null) {//清除明细表中的数据
				grids.getStore().removeAll();grids.fkValue = '';
				grids1.getStore().removeAll();grids1.fkValue = '';
				return false;
			}
			
			//外键值
			var pkvalue = record.get(pkcol);
			//加载子表数据
			Jxstar.loadSubData(grids, pkvalue);
			Jxstar.loadSubData(grids1, pkvalue);
			
			var disable = false;
			//如果主记录已提交，则明细表的按钮不能使用
			if (define.auditcol.length > 0) {
				var state = record.get(define.auditcol);
				if (state == null || state.length == 0) state = '0';
				disable = (state != '0' && state != '6');
			}
			JxUtil.disCloudTool(grids, disable);
			JxUtil.disCloudTool(grids1, disable);
		});
		

		var sm = gridm.getSelectionModel();
		//选择记录时控制子表可用
		sm.on('rowselect', function(sm, i){
			grids.enable();
			grids1.enable();
		});
		//没有选择记录时控制子表不可用
		sm.on('rowdeselect', function(sm, i){
			JxUtil.delay(500, function(){
				if (sm.getCount() == 0) {
					JxUtil.disCloudTool(grids, true);
					grids.disable();
					grids.getStore().removeAll();
					JxUtil.disCloudTool(grids1, true);
					grids1.disable();
					grids1.getStore().removeAll();
				}
			});
		});
	};
	//保证附加事件成功
	var callhd = function() {
		var gm = funLayout.getComponent(0).getComponent(0);
		if (gm) {
			hd(gm, funLayout);
		} else {
			JxUtil.delay(500, callhd);
		}
	};
	callhd();

	return funLayout;
}