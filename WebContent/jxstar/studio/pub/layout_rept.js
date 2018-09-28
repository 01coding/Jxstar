/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 报表设计器功能布局。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Jxstar.currentPage = function() {
	var ReportDesigner = {
		/**
		 * 当前报表ID
		 **/
		reportId:'',
		
		layoutEl:null,

		/**
		 * 显示设计器
		 **/
		render: function(reportId, parent) {
			var self = this;
			this.reportId = reportId;
			this.layoutEl = parent;
			
			//设计面板的工具栏
			var tbar = parent.getTopToolbar();
			//检查parent中是否有设计面板
			var designPanel = parent.getComponent(0);
			if (designPanel) {
				//删除所有子控件
				designPanel.removeAll(true);
				//删除设计对象，考虑要重新加载事件
				designPanel.destroy();
				designPanel = null;
				
				//删除所有新增按钮
				tbar.removeAll(true);
			} 
			
			//创建设计面板
			var frmid = "frm_designer_report";
			designPanel = new Ext.Container({
				id:'rept_design',
				border:false,
				html:'<iframe id="'+ frmid +'" frameborder="no" style="display:none;border-width:0;width:100%;height:100%;"></iframe>'
			});

			parent.add(designPanel);
			//销毁设计面板
			designPanel.on('beforedestroy', function(cmp){
				cmp.getEl().child('iframe').remove();
				return true;
			});
			
			//由于工具栏保存的事件对象是原self对象的，所以必须先删除再创建
			tbar.add(
				{text:jx.rpt.title, iconCls:'eb_setattr', handler:function(){self.showDetail('rpt_head');}},	//'报表标题'
				{text:jx.rpt.area, iconCls:'eb_setattr', handler:function(){self.showDetail('rpt_area');}},	//'报表区域'
				{xtype:'tbseparator'},
				{text:jx.base.refresh, iconCls:'eb_refresh', handler:function(){self.reloadDesign();}}	//'刷新'
			);

			//必须要刷新布局，否则取不到el
			parent.doLayout();
			this.design = designPanel;
			
			//加载设计文件
			var href = Jxstar.path + "/jxstar/studio/pub/xls_html.jsp?user_id=" + Jxstar.session['user_id'] + 
				"&reportId=" + reportId + "&designFunId=rpt_list";

			var frm = designPanel.getEl().child('iframe');
			frm.dom.src = href + '&_dc=' + (new Date()).getTime();
			frm.show();
		},
		
		/**
		 * 刷新设计信息
		 **/
		reloadDesign: function() {
			var frm = Ext.get('frm_designer_report');
			var src = frm.dom.src;
			frm.dom.src = src;
		},
		
		/**
		 * 显示报表标题定义界面
		 **/
		showDetail: function(detFunId) {
			var self = this;
			//过滤条件
			var where_sql = detFunId + '.report_id = ?';
			var where_type = 'string';
			var where_value = self.reportId;
			
			//加载数据
			var hdcall = function(grid) {
				grid.getBottomToolbar().hide();
				//显示数据
				JxUtil.delay(500, function(){
					//保存子表控件
					self.layoutEl[detFunId] = grid;
					//设置外键值
					grid.fkValue = where_value;
					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
				});
			};

			//显示数据
			var define = Jxstar.findNode(detFunId);
			Jxstar.showData({
				filename: define.gridpage,
				title: define.nodetitle,
				pagetype: 'subeditgrid',
				nodedefine: define,
				width: 600,
				height: 300,
				modal: false,
				callback: hdcall
			});
		}
	};
	//=============================ReportDesigner End===================================
	var funid = 'rpt_list';

	//创建TAB功能布局面板
	var tabFunction = new Ext.TabPanel({
		region:'center',
		border:false,
		closeAction:'close',
		activeTab:0,
		items:[{
			pagetype:'grid',
			title: jx.rpt.define,	//'报表定义列表',
			layout:'fit',
			border:false,
			iconCls:'tab_grid'
		},{
			pagetype:'reptdes',
			title: jx.rpt.design,	//'报表设计器',
			layout:'fit',
			border:false,
			iconCls:'tab_des',
			tbar:new Ext.Toolbar()
		}]
	});
	
	Jxstar.createPage(funid, 'gridpage', tabFunction.getComponent(0));
	
	tabFunction.on('beforetabchange', function(tabPanel, newTab, currentTab){
		//取主界面的功能列表
		var fgp = tabPanel.getComponent(0);
		if (fgp == null) return false;
		//tab打开时为空
		if (fgp.items == null) return true;
		var fgrid = fgp.getComponent(0);
		if (fgrid == null) return false;
		
		var pagetype = newTab.pagetype;
		var records = JxUtil.getSelectRows(fgrid);
		if (records.length == 0 && pagetype != 'grid') {
			records = JxUtil.firstRow(fgrid);
			if (records.length == 0) {
				JxHint.alert(jx.layout.nodata);
				return false;
			}
		}
		return true;
	});

	tabFunction.on('tabchange', function(tabPanel, activeTab){
		//取当前激活的Tab页面类型
		var pagetype = activeTab.pagetype;
		//处理有些页面没有自动显示的问题
		activeTab.doLayout();
		//取主界面的功能列表
		var fgp = tabPanel.getComponent(0);
		if (fgp == null) return false;
		var fgrid = fgp.getComponent(0);
		if (fgrid == null) return false;
		
		//取选择的报表ID
		var reportId = '';
		var records = JxUtil.getSelectRows(fgrid);
		if (records.length >= 1) {
			reportId = records[0].get('rpt_list__report_id');
		} else {
			if (pagetype != 'grid') {
				JxHint.alert(jx.layout.selmain);
				return false;
			}
		}
		var activePanel = activeTab.getComponent(0);

		//显示报表设计器
		if (pagetype == 'reptdes') {
			var pe = tabFunction.getComponent(1);
			ReportDesigner.render(reportId, pe);
		}
	});
	
	var delWin = function(parent, child) {
		var win = parent[child];
		if (win != null) {
			parent[child] = null;
			delete parent[child];
			if (win.ownerCt) win.ownerCt.close();
		}
	};
	//如果设计面板隐藏时，则需要关闭所有设计对话框
	var closeWin = function(parent) {
		delWin(parent, 'rpt_area');
		delWin(parent, 'rpt_head');
	};
	var desPanel = tabFunction.getComponent(1);
	desPanel.on('hide', closeWin);
	desPanel.on('beforedestroy', closeWin);
			   
	var funLayout = new Ext.Panel({
		border:false,
		layout:'border',
		items:[{
			region:'west',
			layout:'fit',
			width:160,
			split:true,
			border:false
		},{
			region:'center',
			layout:'fit',
			border:false,
			items:[tabFunction]
		}]
	});
	Jxstar.createTree(funid, funLayout);

	return funLayout;
}