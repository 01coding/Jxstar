/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 统计图表设计工具类。
 * 
 * @author TonyTan
 * @version 1.0, 2013-03-07
 */

JxTotalChart = {};
(function(){
//复制模版设置功能
Ext.apply(JxTotalChart, JxPortalExt);
	
Ext.apply(JxTotalChart, {
	
	//是否首页模版应用
	IS_TEMPLET: false,
	
	//默认[plet_templet]首页模版使用，也用于统计图表设计[total_chart]
	funId: 'total_chart',
	
	//清除这个对象
	contentTypes: null,
	
	/**
	 * public
	 * 从系统中取portal配置，构建后显示在target中
	 * config json = [{funid:'', x:10, y:10, width:100, height:100, collapsed:false},{}...]
	 **/
	createPortals: function(target, funid) {
		var me = this;
		
		var hdcall = function(datas) {
			if (Ext.isEmpty(datas)) {
				JxHint.alert(jx.util.pletnsp);//没有设置portal模板！
				return;
			}
			
			me.parsePortal(datas, target);
			//只有1个面板
			var portal = target.portals[0];
			//处理每列
			var cnt = portal.items.length;
			for (var j = 0; j < cnt; j++) {
				var cell = portal.items.get(j);
				var objectid = cell.initialConfig.objectid;
				cell.cellEvent = target.cellsEvent[objectid];
				
				//显示内容，showPortlet是公共方法
				me.showPortlet(cell);
			}
		};
		
		var params = 'funid=total_chart&pagetype=editgrid&eventcode=readtemp&totalfunid='+funid;
		Request.dataRequest(params, hdcall);
	},
	
	/**
	 * private 覆盖工具栏方法
	 **/
	getTools: function() {
		var me = this;
		var tools = [{
			id:'refresh',
			handler: function(e, btn, panel){
				me.showPortlet(panel);
			}
		},{
			id:'close',
			handler: function(e, btn, panel){
				panel.ownerCt.remove(panel, true);
			}
		}];
		return tools;
	},

	//显示结果集表格或者图表
	showPortlet: function(target) {
		var me = this;
		var typecode = target.initialConfig.typecode;
		
		//先清除内容
		target.removeAll(target.getComponent(0), true);
		
		//再构建统计表格或图形
		if (typecode == 'query') {
			this.createTotalGrid(target);
		} else if (typecode == 'chart') {
			this.createTotalChart(target);
		}
	},
	
	//构建统计表格
	createTotalGrid : function(target){
		var me = this;
		
		var gear = target.getTool('fa-file-excel-o');
		if (!gear) {
			var gear = {
				id:'fa-file-excel-o',
				qtip:jx.group.sexcel,
				handler: function(e, target, cell){
					var grid = cell.findByType('grid')[0];
					Request.exportCSV(grid, jx.group.statdata+'.csv', false);
				}
			};
			target.addTool(gear);
		}
		
		//构建统计报表{total:xx, root:[{},{}], delcols:[], groups:[], cols:[{col_code:, display:, format:, combo_code:, is_show:, col_width:},...]}
		var hdcall = function(data) {
			me.viewGrid(target, data);
		};
		
		var params = me.getToolParams(target);
		//取表格数据区域ID
		var funId = target.initialConfig.objectid;
		//调用后台取统计报表的数据与统计列
		params = 'funid=sysevent&pagetype=grid&eventcode=totalexe&is_recols=1&rpt_funid=' + funId + params;
		Request.postRequest(params, hdcall);
	},
	
	//重新显示表格对象
	viewGrid : function(target, data) {
		var grid = JxTotalGrid.createGrid(data);
		//绑定扩展事件
		if (target.cellEvent) target.cellEvent(grid, data);
		
		var cm = grid.getColumnModel();
		//如果有需要动态隐藏的列[field1, field2...]
		if (data.delcols) {
			var cols = data.delcols;
			for (var i = 0, n = cols.length; i < n; i++) {
				var index = cm.getIndexById(cols[i]);
				if (index > -1) {
					cm.setHidden(index, true);
				}
			}
		}
		
		grid.getStore().loadData(data);
		
		target.add(grid);
		target.doLayout();
	},
	
	//获取chart的主题
	getTheme : function(cell) {
		var ct = cell.findParentBy(function(item){
				if (item.initialConfig.name == 'layout_total') return true;
			});
		if (ct && ct.chartTheme) {
			return ct.chartTheme;
		} else {
			return '';
		}
	},
	//构建统计图表
	createChart : function(target, chartJson) {
		//chartJson格式如：{chart_name:xx, chart_option:{} or function, chart_type:xx, chart_id:xx, chart_data:{}}
		var ct = target.body.dom;
		var th = this.getTheme(target), chart;
		if (th.length > 0) {
			chart = echarts.init(ct, th);
		} else {
			chart = echarts.init(ct);
		}
		
		var co = chartJson.chart_option||'';
		//图形配置
		var option = {};
		try {
			var fx = co.indexOf('function');
			if (-1 < fx && fx < 5) {
				var s = "(function(){var fn = "+co+" return fn;})()";
				var fn = window.eval(s);
				var datas = {};
				if (chartJson.chart_data) datas = Ext.decode(chartJson.chart_data);
				option = fn(datas, chart);
			} else {
				//chart_data参数有：plet_chart_data表中定义的明细参数名
				//图形数据，option代码会用到，如：CHART_DATAS.data
				if (chartJson.chart_data) window.CHART_DATAS = Ext.decode(chartJson.chart_data);
				if (co && co.length > 0) option = Ext.decode(co);
				window.CHART_DATAS = null;
			}
		} catch (e) {
			alert('error json : '+co);
			return;
		}
		
		chart.setOption(option);
		
		//绑定扩展事件
		if (target.cellEvent) target.cellEvent(chart, chartJson);
		
		target.doLayout();
	},
	
	//构建统计图表
	createTotalChart : function(target){
		var me = this;
		JxUtil.loadCharts();//加载图表库
		
		//取图形结果集数据后的回调函数
		var hdCall = function(chartJson) {
			me.createChart(target, chartJson);
		};
		
		var params = me.getToolParams(target);
		//取结果集图形设置ID
		var chartId = target.initialConfig.objectid;
		//从后台取图形设置信息
		params = 'funid=plet_chart&eventcode=qrychart&chart_id='+chartId + params;
		Request.dataRequest(params, hdCall);
	},
	
	//获取工具栏中的统计参数
	getToolParams : function(tbar) {
		var params = '';
		var novalid = false;
		
		if (!tbar.isXType('toolbar')) {
			var ct = tbar.findParentBy(function(item){
				if (item.initialConfig.name == 'layout_total') return true;
			});
			if (!ct) return params;
			tbar = ct.getTopToolbar();
			if (!tbar) return params;
		}
		
		//取工具栏中的参数值与有效性
		tbar.items.each(function(item){
			if (item.isXType('field')) {
				if (item.isValid() == false) {
					novalid = true;
					return false;
				}
				var val = item.getValue();
				val = Ext.isDate(val) ? val.dateFormat('Y-m-d H:i:s') : val;
				params += '&' + item.getName() + '=' + val;
			}
		});
		
		if (novalid) {
			JxHint.alert(jx.event.datavalid);
			return;
		}
		
		return params;
	}
	
	});//Ext.apply
})();
