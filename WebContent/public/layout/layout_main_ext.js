/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 功能布局页面：处理grid, form, subgrid页面类型。
 * 支持明细表带TREE布局，在角色功能中使用。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Jxstar.currentPage = function(define, pageParam) {
	if (define == null) {
		JxHint.alert('layout_main_ext define param define is null!');
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
			pagetype:'grid',
			title: title+'-'+jx.layout.grid,	//列表
			autoScroll:true,
			layout:'fit',
			border:false,
			iconCls:'tab_grid'
		}]
	});
	
	//处理审批页面类型
	var isCheck = (pageParam && pageParam.pageType && pageParam.pageType == 'check');
	if (isCheck) pageParam.pageType = 'chkgrid';
	
	//添加grid页面
	Jxstar.createPage(funid, 'gridpage', tabGridForm.getComponent(0), pageParam);
	//添加form页面
	var formpage = define.formpage;
	if (formpage != null && formpage.length > 0) {
		var newtab = tabGridForm.add({
			pagetype:'form',
			title: title+'-'+jx.layout.form,	//表单
			autoScroll:true,
			layout:'fit',
			border:false,
			iconCls:'tab_form'
		});
		
		var fpageType = isCheck ? 'chkform' : 'form';
		Jxstar.createPage(funid, 'formpage', newtab, {pageType:fpageType});
	}
	
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
			
			//如果子功能有布局，则使用布局页面//这一段与layout_main布局不同=======
			var layout = (subdefine.layout.length > 0) ? 'layout' : 'gridpage';
			var subParam = {pageType:'subgrid', parentNodeId:funid};
			Jxstar.createPage(subid, layout, newtab, subParam);
		}
	}

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
			//如果点击grid的新增按钮则可以打开form界面
			var form = newTab.getComponent(0);
			if (pagetype != 'form'  || (pagetype == 'form' && form.getForm().srcEvent != 'create')) {
				records = JxUtil.firstRow(fgrid);
				if (records.length == 0) {
					JxHint.alert(jx.layout.nodata);
					return false;
				}
			}
		}
		if (records.length > 0) {//当前记录没有保存，不能操作
			var pkvalue = records[0].get(pkcol);
			if (Ext.isEmpty(pkvalue)) {
				JxHint.alert(jx.event.nosave);
				return false;
			}
		}
		var curPage = currentTab.getComponent(0);
		if (curPage.isXType('form') && curPage.getForm().isDirty()) {
			if (confirm(jx.layout.modify)) {	//'记录已被修改，是否需要先保存？'
				curPage.formNode.event.save();
				return false;
			}
		}
		
		return true;
	});

	tabGridForm.on('tabchange', function(tabPanel, activeTab){
		//取当前激活的Tab页面类型
		var pagetype = activeTab.pagetype;
		//处理有些页面没有自动显示的问题
		activeTab.doLayout();
		//取主界面的功能列表
		var fgp = tabPanel.getComponent(0);
		if (fgp == null) return false;
		//tab打开时为空
		if (fgp.items == null) return false;
		var fgrid = fgp.getComponent(0);
		if (fgrid == null) return false;
		
		var curPage = activeTab.getComponent(0);
		
		//取选择记录的主键值
		var pkvalue = '';
		var records = JxUtil.getSelectRows(fgrid);
		if (records.length >= 1) {
			pkvalue = records[0].get(pkcol);
		} else {
			if ((pagetype != 'grid' && pagetype != 'form') || 
			    (pagetype == 'form' && curPage.getForm().srcEvent != 'create')) {
				JxHint.alert(jx.layout.selmain);
				return false;
			}
		}
		
		//显示表单数据
		if (pagetype == 'form') {
			var form = curPage.getForm();
			if (form.srcEvent != 'create') {
				var record = records[0];
				form.myGrid = fgrid;
				form.myStore = fgrid.getStore();
				form.myRecord = record;
				form.loadRecord(record);
			}
			//显示FORM时，执行初始化事件
			curPage.formNode.event.initForm();
			//清除打开form的来源事件
			delete form.srcEvent;
		} else if (pagetype == 'subgrid') {
			//=================================这一段与layout_main布局不同===============================
			//如果不是子表格，说明是树形布局页面，需要从布局中找到子表
			if (!curPage.isXType('grid')) {
				curPage = curPage.getComponent(1);
				if (curPage == null) {
					JxHint.alert(jx.layout.nosub);	//'明细功能页面不能识别表格，请检查！'
					return false;
				} else {
					curPage = curPage.getComponent(0);
				}
			}
			
			Jxstar.loadSubData(curPage, pkvalue);
		}
	});

	return tabGridForm;
};
