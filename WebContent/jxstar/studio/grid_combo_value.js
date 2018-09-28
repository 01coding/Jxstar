Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'控件值', width:74, sortable:true}, field:{name:'funall_control__value_data',type:'string'}},
	{col:{header:'显示值', width:125, sortable:true}, field:{name:'funall_control__display_data',type:'string'}},
	{col:{header:'序号', width:55, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'funall_control__control_index',type:'float'}},
	{col:{header:'控件代码', width:100, sortable:true}, field:{name:'funall_control__control_code',type:'string'}},
	{col:{header:'控件名称', width:126, sortable:true}, field:{name:'funall_control__control_name',type:'string'}},
	{col:{header:'控件ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'funall_control__control_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'sel_combo_value'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}