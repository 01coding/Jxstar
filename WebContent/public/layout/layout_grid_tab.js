/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.com
 */
 
/**
 * 上面主表格下面多子表，tab方式排列
 * 
 * @author TonyTan
 * @version 1.0, 2016-04-01
 */

Jxstar.currentPage = function(define, pageParam) {
	if (define == null) {
		JxHint.alert('layout define param define is null!');
		return;
	}
	var funid = define.nodeid;
	var pkcol = define.pkcol;
    //标签为云布局功能
	define.isCloud = true;
	
	//功能布局
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
		}]
	});
	//添加grid页面
	Jxstar.createPage(funid, 'gridpage', funLayout.getComponent(0), pageParam);

	//创建下面显示子表的tab
	var tabs = funLayout.add({
		xtype:'tabpanel', cls:'sub_tab', activeTab:0, region:'center', border:false, deferredRender:false, 
		//选择其他子表时要刷新数据
		listeners:{tabchange: function(tab, cmp){
			var sgrid = cmp.getComponent(0);
			if (sgrid && sgrid.fkValue) {
				Jxstar.loadSubData(sgrid, sgrid.fkValue);
			}
		}, beforetabchange: function(t, newp, curp){
			if (define.isCloud && newp.tabtooler && curp.tabtooler) {
				newp.tabtooler.show();
				curp.tabtooler.hide();
			}
		}}
	});
	
	//把子功能表格添加到tab中
	var subfunid = define.subfunid;
	if (subfunid != null && subfunid.length > 0) {
		var subfunids = subfunid.split(',');
		for (var i = 0, n = subfunids.length; i < n; i++) {
			var subid = subfunids[i];
			if (subid.length == 0) continue;
			
			var subdefine = Jxstar.findNode(subid);
			subdefine.showInForm = true;
            //标签为云布局功能
			subdefine.isCloud = true;
            
			var newtab = tabs.add({
				pagetype:'subgrid',
				title: subdefine.nodetitle,
				autoScroll:true,
				layout:'fit',
				border:false
			});
			
			var subParam = {pageType:'subgrid', parentNodeId:funid};
			//把按钮显示在标题栏中
			if (subdefine.isCloud) {
				subParam.showCall = function(page){
					JxCloud.addTools(page);
				};
			}
			Jxstar.createPage(subid, 'gridpage', newtab, subParam);
		}
	}
	
	//如果主记录已提交，则明细表的按钮不能使用
	var fbtn = function(de, rec, sg, noedit){
		//没有编辑权限
		var disable = noedit;
		//根据audit字段值判断
		if (!noedit && de.auditcol.length > 0) {
			var state = rec.get(de.auditcol);
			if (state == null || state.length == 0) state = '0';
			disable = (state != '0' && state != '6');
		}
		JxUtil.disCloudTool(sg, disable);
	};
	
	//附加显示数据的事件
	var hd = function() {
		var gridm = funLayout.getComponent(0).getComponent(0);//主表
		var tabs = funLayout.getComponent(1);//子表tab
		if (tabs) tabs.disable();//未选主记录时子表不可用
		
		var selm = gridm.getSelectionModel();
		//选择主表记录，显示明细表记录
		selm.on('rowselect', function(sm, index, r){
			//没有编辑权限
			var noedit = (gridm.gridNode.right.edit == '0');
		
			if (!tabs) return;
			tabs.enable();//选择主记录后子表可用
			
			//外键值
			var pkvalue = r.get(pkcol);
			//加载子表数据
			tabs.items.each(function(cmp){
				var g = cmp.getComponent(0);
				g.parentGrid = gridm;
				
				fbtn(define, r, g, noedit);
				Jxstar.loadSubData(g, pkvalue);
			});
		});
		//取消选择主表记录，不显示明细记录
		selm.on('rowdeselect', function(sm, index, r){
			//没有编辑权限
			var noedit = (gridm.gridNode.right.edit == '0');
		
			var res = sm.getSelections();
			tabs.items.each(function(cmp){
				var g = cmp.getComponent(0);
				if (res.length == 0) {
					g.getStore().removeAll();
					g.fkValue = '';
					tabs.disable();
				} else {
					fbtn(define, res[0], g, noedit);
					var pkvalue = res[0].get(pkcol);
					Jxstar.loadSubData(g, pkvalue);
				}
			});
		});
		
		//主表记录刷新后，如果没有选择记录，或者没有主记录了，则明细表记录为空
		gridm.getStore().on('load', function(store, records){
			if (tabs) {
				tabs.items.each(function(g){
					if (store.getCount() == 0) {
						g.getStore().removeAll();
						g.fkValue = '';
						tabs.disable();
					}
				});
			}
		});
		
		//删除记录后定位到第一条
		gridm.gridNode.event.on('afterdelete', function(){
			var selm = this.grid.getSelectionModel();
			selm.selectFirstRow();
		});
		gridm.on('rowdblclick', function(grid, n, event) {
			grid.gridNode.event.showSubForm();
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