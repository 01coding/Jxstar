Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datachartdatatype = Jxstar.findComboData('chartdatatype');
	var Datachartdatasrc = Jxstar.findComboData('chartdatasrc');

	var cols = [
	{col:{header:'参数标题', width:144, sortable:true}, field:{name:'plet_chart_data__param_title',type:'string'}},
	{col:{header:'参数名称', width:119, sortable:true}, field:{name:'plet_chart_data__param_name',type:'string'}},
	{col:{header:'SQL返回值类型', width:109, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datachartdatatype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datachartdatatype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datachartdatatype.length; i++) {
				if (Datachartdatatype[i][0] == value)
					return Datachartdatatype[i][1];
			}
		}}, field:{name:'plet_chart_data__data_type',type:'string'}},
	{col:{header:'来源类型', width:113, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datachartdatasrc
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Datachartdatasrc[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datachartdatasrc.length; i++) {
				if (Datachartdatasrc[i][0] == value)
					return Datachartdatasrc[i][1];
			}
		}}, field:{name:'plet_chart_data__param_type',type:'string'}},
	{col:{header:'SQL|类|常量值', width:360, sortable:true}, field:{name:'plet_chart_data__param_sql',type:'string'}},
	{col:{header:'图表ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'plet_chart_data__chart_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'plet_chart_data__chart_data_id',type:'string'}},
	{col:{header:'WHERE参数值', width:100, sortable:true, hidden:true}, field:{name:'plet_chart_data__where_value',type:'string'}},
	{col:{header:'WHERE参数类型', width:100, sortable:true, hidden:true}, field:{name:'plet_chart_data__where_type',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'plet_chart_data'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}