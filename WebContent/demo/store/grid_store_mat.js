Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'物资编码', width:134, sortable:true}, field:{name:'store_mat__mat_code',type:'string'}},
	{col:{header:'物资名称', width:210, sortable:true}, field:{name:'store_mat__mat_name',type:'string'}},
	{col:{header:'型号', width:100, sortable:true}, field:{name:'store_mat__mat_size',type:'string'}},
	{col:{header:'物资分类', width:100, sortable:true}, field:{name:'store_mat__type_name',type:'string'}},
	{col:{header:'分类编码', width:100, sortable:true}, field:{name:'store_mat__type_code',type:'string'}},
	{col:{header:'单位', width:100, sortable:true}, field:{name:'store_mat__mat_unit',type:'string'}},
	{col:{header:'单价(元)', width:100, sortable:true, align:'right',renderer:JxUtil.formatNumber(2)}, field:{name:'store_mat__mat_price',type:'float'}},
	{col:{header:'分类ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'store_mat__type_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'store_mat__mat_id',type:'string'}},
	{col:{header:'备注', width:100, sortable:true, hidden:true}, field:{name:'store_mat__mat_desc',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'store_mat'
	};
	
	config.param.notNullFields = 'store_mat__mat_name;store_mat__type_name;store_mat__mat_code;';
	
	
		
	return new Jxstar.GridNode(config);
}