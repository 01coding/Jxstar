Jxstar.statParam = function(){
    //扩展统计参数
	var extParam = '&param_name1=tanzb&&param_name2=tanzb';
   	
    //扩展统计页面初始化事件
    var initPage = function(layout, config){
        //增加自定义的按钮
        var tbar = layout.getTopToolbar();
        //tbar.add({text:'新增按钮', handler:function(){alert('新增按钮');}});
        tbar.add({xtype:'textfield', name:'new_name'});
    };
    
    //扩展统计页面加载后事件
    var afterPage = function(layout, config){
        //给统计参数增加特殊缺省值
        var tbar = layout.getTopToolbar();
        //var ts = tbar.find('name', 'start_date');
        var ts = tbar.find('name', 'new_name');
        //取到工具栏中的查询字段
        if (ts && ts.length > 0) ts[0].setValue('自定字段');
        JxUtil.delay(1000, function(){
        	layout.getComponent(0).add({x:10, y:660, width:700, height:100, collapsed:false, html:'<div>统计数据说明</div>'});
            layout.doLayout();
        });
    };
    
    //扩展统计前事件
    var beforeStat = function(layout, config){
        alert('beforeStat');
    };
    
    //扩展统计后事件
    var afterStat = function(layout, config){
        alert('afterStat');
    };
    
    //统计cell注册事件
    var cellsEvent = function(layout, config){
        //统计报表的点击事件、或者显示数据颜色改变
        var gevent = function(grid, data){
            grid.on('rowclick',function(g, rowindex){
                alert('您选择的是第 '+rowindex+' 行！');
            });
            
            var afterLoad = function(st){
                var cm = grid.getColumnModel();
                var row = 0, col = 0;
                var gv = grid.getView();
                
                st.each(function (r) {
                    var fs = r.fields;
                    fs.each(function (f) {
                        //判断是否为数量字段
                        if (f.name.indexOf('cnt_') >= 0) {
                            col = cm.findColumnIndex(f.name);
                            if (r.get(f.name) > 1) {
                                var dc = gv.getCell(row, col);
                                //修改单元格背景色
                                dc.style.backgroundColor = '#FF9900';
                            }
                        }
                    });
                    
                    //修改行背景色
                    if (r.get('dept_name').indexOf('广州') >= 0) {
                        var dr = gv.getRow(row);
                        dr.style.backgroundColor = '#00FF99';
                    }
                    
                    row++;
                });
            };
            grid.getStore().on('load', function (st, records){
                //必须要延时执行，否则 grid.getView().mainBody 为null
                JxUtil.delay(500, function(){afterLoad(this);}, st);
            });
        };
        
        var chart1 = function(chart, data){
            chart.on('click', function(params){
                alert('chart1111='+params.name+'; data='+Ext.encode(params.data));
            });
        };
        
        var chart2 = function(chart, data){
            chart.on('click', function(params){
                alert('chart2222='+params.componentType);
            });
        };
        
        return {"store_stat":gevent, "jxstar-539-106":chart1, "jxstar-488-155":chart2};
    };
    
    return {extParam:extParam, initPage:initPage, afterPage:afterPage, beforeStat:beforeStat, afterStat:afterStat, cellsEvent:cellsEvent};
};