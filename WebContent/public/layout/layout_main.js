/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 常用功能布局页面，支持grid, form, subgrid类型的页面组合。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Jxstar.currentPage = function(define, pageParam) {
	if (define == null) {
		JxHint.alert('layout_main define param define is null!');
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
		var fparam = Ext.apply({}, pageParam);//复制一个参数，避免pageType混淆
		fparam.pageType = fpageType;
		Jxstar.createPage(funid, 'formpage', newtab, fparam);
	}
	
	//取不显示在tab中的明细功能ID
	var notTabFunId = define.notTabFunId || '';
	//取子功能ID
	var subfunid = define.subfunid;
	if (subfunid != null && subfunid.length > 0 && !define.showFormSub) {
		var subfunids = subfunid.split(',');
		for (var i = 0, n = subfunids.length; i < n; i++) {
			var subid = subfunids[i];
			if (subid.length == 0) continue;
			//这类明细功能一般会显示在form下面，支持多个明细表摆放在不同的位置
			if (notTabFunId == subid || notTabFunId.indexOf(subid+',') >= 0) continue;
			
			var subdefine = Jxstar.findNode(subid);
			var newtab = tabGridForm.add({
				pagetype:'subgrid',
				title: subdefine.nodetitle+'-'+jx.layout.det,	//明细
				autoScroll:true,
				layout:'fit',
				border:false,
				iconCls:'tab_sub'
			});
			
			var subParam = {pageType:'subgrid', parentNodeId:funid};
			Jxstar.createPage(subid, 'gridpage', newtab, subParam);
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
		if (curPage != null && curPage.isXType('form')) {
			if (curPage.getForm().isDirty()) {
				if (confirm(jx.layout.modify)) {	//'记录已被修改，是否需要先保存？'
					curPage.formNode.event.save();
					return false;
				}
			} else {
				//Form内子表数据没有保存，不能提交
				if (JxUtil.checkSubGrid(curPage) == false) return false;
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
		if (curPage == null) return true;
		
		//聚焦当前页面，方便执行快捷键
		if (curPage.isXType('form')) {JxUtil.focusFirst(curPage);}
		if (curPage.isXType('grid')) {JxUtil.focusFirstRow(curPage);}
		
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
			//如果主记录已提交，则明细表的按钮不能使用
			if (define.auditcol.length > 0) {
				//设置业务状态值
				var audit0 = '0', audit2 = '2', audit6 = '6';
				if (define.status) {
					audit0 = define.status['audit0'];
					audit2 = define.status['audit2'];
				}
				var state = records[0].get(define.auditcol);
				if (state == null || state.length == 0) state = audit0;
				var disable = (state != audit0 && state != audit6);
				
				//设置子表在审批过程中可以编辑
				var subdef = curPage.gridNode.define;
				var subEdit = subdef.subChkEdit||false;
				if (subEdit && state == audit2) disable = false;
				
				var tools = curPage.getTopToolbar();
				JxUtil.disableButton(tools, disable);
			}
			Jxstar.loadSubData(curPage, pkvalue);
		}
	});
	
	//给tab切换添加快捷键
	JxUtil.tabAddKey(tabGridForm);

	return tabGridForm;
};
