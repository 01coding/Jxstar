/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 数据可视化看板。
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
	
	var cmp = new Ext.Panel({
		border:false,
		layout:'border',
		items:[{
			height:60,
			region:'north',
			border:false,
			cls:'x-dark-top'
	    },{
	        region:'center',
			border:false,
			layout:'fit',
			cls:'x-dark-body',
			name:'layout_total'
	    }]
	});
	var layout = cmp.getComponent(1);
	//设置Chart的风格
	layout.chartTheme = 'dark';
	
	//更新标题栏
    var initPage = function(layout, config){
        //当前日历
        var getDate = function(){
            var w = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            var d = new Date();
            var s = d.getDay();
            var t = d.format('Y年m月d日 H:i:s');
            return t.replace(' ', '<br>') + '&nbsp&nbsp' + w[s];
        };
        //当前部门
        var deptName = Jxstar.session['dept_name'];
        //标题
        var title = define.nodetitle;

        var html = '<table style="width:100%;height:100%;">'+
                        '<td style="width:20%; font-size:16px;color:#01bff0;font-weight:bold;text-align:left;padding-left:10px;"><span id="monitor_date">'+getDate()+'</span></td>'+
                        '<td style="width:60%; font-size:26px;color:#01bff0;font-weight:bold;text-align:center;"><span>'+title+'</span></td>'+
                        '<td style="width:20%; font-size:16px;color:#01bff0;font-weight:bold;text-align:right;padding-right:10px;"><span>'+deptName+'</span></td>'+
                   '</table>';
        var top = layout.ownerCt.getComponent(0);
        top.on('render', function(cmp){
            cmp.update(html);
        });
        
        setInterval(function(){
            var el = Ext.getDom('monitor_date');
            if (el) el.innerHTML = getDate();
        }, 1000);
	
    };
	
	//执行页面初始化事件
	if (totalParam && totalParam.initPage) {
		totalParam.initPage(layout, extcfg);
	} else {
		initPage(layout, extcfg);
	}
	
	//统计单元扩展事件，格式： {'objectid':function(grid){}, 'objectid':function(chart){}...}
	var cellsEvent = (totalParam && totalParam.cellsEvent) ? totalParam.cellsEvent(layout, extcfg) : {};
	layout.cellsEvent = cellsEvent || {};
	
	//加载统计图表各单元数据
	JxTotalChart.createPortals(layout, funid);
	layout.doLayout();
	
	return cmp;
};
