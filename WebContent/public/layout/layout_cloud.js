/*!
 * Copyright 2011-2016 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.com
 */
  
/**
 * 常用云功能布局；双击表格记录后切换到表单页面
 * 
 * @author TonyTan
 * @version 1.0, 2016-04-08
 */
 
Jxstar.currentPage = function(define, pageParam) {
	if (!pageParam) pageParam = {};
	var funid = define.nodeid;
	//是否快速新建、是否直接打开form页面
	var isfast = false, isform = false, hasform = false;
	if (define.formpage.length > 0) {
		hasform = true;
		if (pageParam.isfast) isfast = true;
		if (pageParam.showType == 'form') isform = true;
	}
	//处理审批页面类型
	var ischeck = (pageParam.pageType == 'check');
	
	var items = [{pagetype:'fungrid', layout:'fit', border:false}];
	if (isfast || isform) {
		items[1] = {pagetype:'funform', layout:'fit', border:false};
	}
	
	var layout = new Ext.Panel({
		id:'cloud_fun_'+funid,
		label: define.nodetitle,
		layout:'card',
		border:false,
		activeItem:0,
		items:items,
		listeners: {destroy:function(){
			delete JxCloud.apps[funid];
		}}
	});
	
	//标签为云布局功能
	define.isCloud = true;
	
	//保存功能对象到管理器中
	JxCloud.apps[funid] = layout;
	
	if (isfast || isform) {
		var ptype = ischeck ? 'chkform' : 'form';
		layout.showType = ptype;//在JxCloud中使用，避免明细数据重复加载
		var fparam = Ext.apply({}, pageParam);//复制一个参数，避免pageType混淆
		fparam.pageType = ptype;
		Jxstar.createPage(funid, 'formpage', layout.getComponent(1), fparam);
		
		pageParam.showCall = function(page){
			//此方法用于实现快速显示form的效果
			page.gridNode.event.create();
		};
	}
	//pageType可能是imptype类型
	pageParam.pageType = (ischeck) ? 'chkgrid' : (pageParam.pageType||'grid');
	Jxstar.createPage(funid, 'gridpage', layout.getComponent(0), pageParam);
	
	return layout;
};
