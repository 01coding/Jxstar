Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datacharttype = Jxstar.findComboData('charttype');

	var cols = [
	{col:{header:'序号', width:71, sortable:true}, field:{name:'plet_chart__chart_index',type:'string'}},
	{col:{header:'图形名称', width:184, sortable:true}, field:{name:'plet_chart__chart_name',type:'string'}},
	{col:{header:'图形类型', width:125, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datacharttype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Datacharttype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datacharttype.length; i++) {
				if (Datacharttype[i][0] == value)
					return Datacharttype[i][1];
			}
		}}, field:{name:'plet_chart__chart_type',type:'string'}},
	{col:{header:'图形ID', width:127, sortable:true, colindex:10000}, field:{name:'plet_chart__chart_id',type:'string'}},
	{col:{header:'配置代码', width:467, sortable:true}, field:{name:'plet_chart__chart_option',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'plet_chart'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}