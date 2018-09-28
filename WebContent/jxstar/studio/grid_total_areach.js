Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataareatypetot3 = Jxstar.findComboData('areatypetot3');

	var cols = [
	{col:{header:'序号', width:69, sortable:true, align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22
		}),renderer:JxUtil.formatInt()}, field:{name:'rpt_chart__area_index',type:'int'}},
	{col:{header:'*名称', width:214, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'rpt_chart__area_name',type:'string'}},
	{col:{header:'区域类型', width:100, sortable:true, defaultval:'chart', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataareatypetot3
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataareatypetot3[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataareatypetot3.length; i++) {
				if (Dataareatypetot3[i][0] == value)
					return Dataareatypetot3[i][1];
			}
		}}, field:{name:'rpt_chart__area_type',type:'string'}},
	{col:{header:'*统计功能ID|图形ID', width:154, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:25, allowBlank:false
		})}, field:{name:'rpt_chart__object_id',type:'string'}},
	{col:{header:'图标CSS', width:150, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'rpt_chart__iconcls',type:'string'}},
	{col:{header:'统计对象', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'rpt_chart__object_name',type:'string'}},
	{col:{header:'报表ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'rpt_chart__report_id',type:'string'}},
	{col:{header:'区域ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'rpt_chart__area_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'total_areach'
	};
	
	
	config.eventcfg = {
        showChart: function() {
            Jxstar.createNode('plet_chart');
        },
		
		//显示明细表的数据
		showParam: function() {
			var self = this;
            var subid = 'rpt_param';
			var define = Jxstar.findNode(subid);
            var sm = self.grid.getSelectionModel();
			var records = sm.getSelections();
			if (records == null || records.length == 0) {
                sm.selectFirstRow();
                records = sm.getSelections();
                if (!JxUtil.selected(records)) return;
            }
			
			//过滤条件
			var where_sql = 'rpt_param.area_id in (select a.area_id from rpt_chart a, rpt_chart b where a.report_id = b.report_id and b.area_id = ?)';
			var where_type = 'string';
			var where_value = records[0].get('rpt_chart__area_id');
			
			//加载数据
			var hdcall = function(grid) {
				grid.getBottomToolbar().hide();
				
				//显示数据
				JxUtil.delay(500, function(){
					//保存子表控件
					self.grid[subid] = grid;
					//设置外键值
					grid.fkValue = where_value;
					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type, has_page:0});
				});
			};

			//显示数据
			Jxstar.showData({
				filename: define.gridpage,
				title: define.nodetitle,
				pagetype: 'subeditgrid',
				nodedefine: define,
				width: 800,
				height: 300,
				modal: false,
				callback: hdcall
			});
		},
		
        //布局设置
        design: function(){
            var self = this; 
			var keyid = self.grid.fkValue;
			
			if (!window.JxTotalChart) {
				JxUtil.loadJS('/public/layout/ux/total_chart.js');
			}
			JxTotalChart.readTemp('settemp', keyid, '0');
            
        }
	};
		
	return new Jxstar.GridNode(config);
}