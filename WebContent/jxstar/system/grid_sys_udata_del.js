Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'姓名', width:100, sortable:true}, field:{name:'sys_user__user_name',type:'string'}},
	{col:{header:'显示值', width:172, sortable:true}, field:{name:'sys_user_data__display',type:'string'}},
	{col:{header:'数据值', width:119, sortable:true}, field:{name:'sys_user_data__dtype_data',type:'string'}},
	{col:{header:'含下级?', width:59, sortable:true}, field:{name:'sys_user_data__has_sub',type:'string'}},
	{col:{header:'类别名称', width:119, sortable:true}, field:{name:'sys_datatype__dtype_name',type:'string'}},
	{col:{header:'权限字段', width:100, sortable:true}, field:{name:'sys_datatype__dtype_field',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_datatype__funid',type:'string'}},
	{col:{header:'显示字段', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_datatype__fun_vfield',type:'string'}},
	{col:{header:'数据字段', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_datatype__fun_field',type:'string'}},
	{col:{header:'设置ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_data__user_data_id',type:'string'}},
	{col:{header:'用户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_data__user_id',type:'string'}},
	{col:{header:'数据权限ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_data__dtype_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'sys_udata_del'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}