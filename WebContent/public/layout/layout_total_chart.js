/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 统计功能模板。
 * 需要支持扩展外部统计参数，同时支持扩展外部统计事件；
 * totalParam = {extParam:'&param1=xxx&param2=xxx', initPage:function(layout, config){}, afterPage:, beforeStat:, afterStat:, cellsEvent:};
 * 
 * @author TonyTan
 * @version 1.0, 2011-01-01
 */

Jxstar.currentPage = function(define, totalParam) {
	if (define == null) {
		JxHint.alert('layout_total define param define is null!');
		return;
	}
	var funid = define.nodeid;
	var extcfg = {nodeid:funid};
	
	//动态加载JS文件
	if (!window.JxTotalChart) {
		JxUtil.loadJS('/public/layout/ux/total_chart.js');
	}
	//动态加载JS文件
	if (!window.JxTotalGrid) {
		JxUtil.loadJS('/public/layout/ux/total_grid.js');
		JxUtil.loadJS('/lib/ext/ux/ColumnHeaderGroup.js');
	}
	
	//加载统计扩展参数，格式参考 totalParam
	var jsurl = define.gridpage;
	if (jsurl && jsurl.length > 0) {
		if (!totalParam) totalParam = {};
		JxUtil.loadJS(jsurl, true);
		Ext.apply(totalParam, Jxstar.statParam());
		Jxstar.statParam = null;
	}
	
	var toolbar = new Ext.Toolbar({name:JxUtil.newId() + "_tool_qv", deferHeight:true, items:[{text:' '}]});
	var layout = new Ext.Panel({border:false, layout:'fit', tbar:toolbar, name:'layout_total'});
	
	//执行页面初始化事件
	if (totalParam && totalParam.initPage) {
		totalParam.initPage(layout, extcfg);
	}
	
	//执行统计
	var exeStat = function(nodeid, tbar) {
		//执行外部扩展的统计前事件
		if (totalParam && totalParam.beforeStat) {
			if (totalParam.beforeStat(layout, extcfg) === false) return;
		}
		
		//统计后加载数据
		var hdcall = function(data) {
			Ext.each(data, function(item){
				var portal = layout.portals[0];
				//处理每列
				var cnt = portal.items.length;
				for (var j = 0; j < cnt; j++) {
					var cell = portal.items.get(j);
					var pletid = cell.initialConfig.pletid;
					if (item.id == pletid) {
						cell.remove(cell.getComponent(0), true);
						
						if (item.type == 'grid') {
							JxTotalChart.viewGrid(cell, item);
						} else if (item.type == 'chart'){
							JxTotalChart.createChart(cell, item.data);
						}
					} 
				}
			});
			
			//执行外部扩展的统计事件
			if (totalParam && totalParam.afterStat) {
				totalParam.afterStat(layout, extcfg);
			}
		};
		
		var params = JxTotalChart.getToolParams(tbar);
		
		//扩展外部统计参数
		if (totalParam && typeof totalParam.extParam == 'string') {
			params += totalParam.extParam;
		} else if (totalParam && typeof totalParam.extParam == 'function') {
			params += totalParam.extParam(layout);
		}
		
		//发送后台请求
		params = 'funid=total_chart&pagetype=grid&eventcode=exestat&is_recols=1&rpt_funid=' + nodeid + params;
		
		Request.postRequest(params, hdcall);
	};
	
	//构建统计图表的工具栏
	var hdcall = function(config) {
		var etp = toolbar.get(0);
		if (etp && etp.initialConfig.text == ' ') {toolbar.remove(etp);}
		
		//构建工具栏，由于有相关控件的数据
		//所以在后台直接生成工具栏返回前台
		if (typeof config.toolfn == 'string') {
			config.toolfn = window.eval("("+config.toolfn+")");
		}
		var vbar = config.toolfn();
		var vtp = vbar.get(0);
		if (vtp.initialConfig.text == ' ') {vbar.remove(vtp);}
		//把后台构建的工具栏元素copy到前台对象中
		vbar.items.each(function(item){
			toolbar.addButton(item);
		}); 
		
		toolbar.addButton({iconCls:'eb_stat', text:jx.group.stat, handler:function(){exeStat(funid, toolbar)}});//'统计'
		toolbar.doLayout();
		
		//给工具栏赋缺省值
		JxTotalGrid.setToolDefault(toolbar);
		
		//统计单元扩展事件，格式： {'objectid':function(grid){}, 'objectid':function(chart){}...}
		var cellsEvent = (totalParam && totalParam.cellsEvent) ? totalParam.cellsEvent(layout, extcfg) : {};
		layout.cellsEvent = cellsEvent || {};
		
		//加载统计图表各单元数据
		JxTotalChart.createPortals(layout, funid);
		layout.doLayout();
		
		//执行页面加载后事件
		if (totalParam && totalParam.afterPage) {
			totalParam.afterPage(layout, extcfg);
		}
	};
	var params = 'funid=total_chart&pagetype=grid&eventcode=loadtool&rpt_funid=' + funid;
	Request.postRequest(params, hdcall);
	
	//清除垃圾
	layout.on('beforedestroy', function(p){
		p.portals = null;
		p.cellsEvent = null;
	});
	
	return layout;
};
