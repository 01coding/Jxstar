Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datashowmode = Jxstar.findComboData('showmode');

	var cols = [
	{col:{header:'功能ID', width:103, sortable:true}, field:{name:'rpt_drill__fun_id',type:'string'}},
	{col:{header:'钻取字段', width:110, sortable:true}, field:{name:'rpt_drill__use_field',type:'string'}},
	{col:{header:'显示方式', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datashowmode
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datashowmode[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datashowmode.length; i++) {
				if (Datashowmode[i][0] == value)
					return Datashowmode[i][1];
			}
		}}, field:{name:'rpt_drill__show_mode',type:'string'}},
	{col:{header:'显示WhereSql', width:285, sortable:true}, field:{name:'rpt_drill__where_sql',type:'string'}},
	{col:{header:'显示WhereType', width:100, sortable:true, hidden:true}, field:{name:'rpt_drill__where_type',type:'string'}},
	{col:{header:'显示WhereValue', width:100, sortable:true, hidden:true}, field:{name:'rpt_drill__where_value',type:'string'}},
	{col:{header:'区域ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'rpt_drill__area_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'rpt_drill__drill_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'rpt_drill'
	};
	
	config.param.hidePageTool = true;

	
		
	return new Jxstar.GridNode(config);
}