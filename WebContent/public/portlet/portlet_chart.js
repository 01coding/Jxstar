/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * portlet图形控件。
 * 
 * @author TonyTan
 * @version 1.0, 2016-06-01
 */
JxPortalExt.contentTypes['portlet_chart'] = {
	/**
	 * public 刷新窗口内容
	 **/
	refresh: function(target) {
		this.showPortlet(target);
	},
	
	/**
	 * public 显示结果集图形
	 **/
	showPortlet: function(target) {
		JxUtil.loadCharts();//加载图表库
		
		var me = this;
		//如果图表在第二个tab显示，则target.body为null
		if (target.body) {
			me.renderPortlet(target);
		} else {
			target.on('afterrender', function(){me.renderPortlet(target);});
		}
	},
	
	renderPortlet: function(target) {
		var self = this;
		//先清除内容
		target.removeAll(target.getComponent(0), true);
		
		//取结果集图形设置ID
		var chartId = target.initialConfig.objectid;

		//取图形结果集数据后的回调函数
		var hdCall = function(chartJson) {
			var ct = target.body.dom;
			var chart = echarts.init(ct);
			
			//chartJson格式如：{chart_name:xx, chart_option:{} or function, chart_type:xx, chart_id:xx, chart_data:{}}
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
			window.CHART_DATAS = null;
			
			chart.setOption(option);
			//解决图表出现滚动条的问题
			if (JxExt.getIE() < 9) {Ext.fly(ct).child('div').setHeight(Ext.fly(ct).getHeight()-4);}
			target.doLayout();
		};
		
		//从后台取图形设置信息
		var params = 'funid=plet_chart&eventcode=qrychart&chart_id='+chartId;
		Request.dataRequest(params, hdCall);
	}
	
};
