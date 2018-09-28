﻿Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'字段名称', width:167, sortable:true}, field:{name:'sys_role_field__col_code',type:'string'}},
	{col:{header:'字段标题', width:134, sortable:true}, field:{name:'sys_role_field__col_name',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_role_field__role_field_id',type:'string'}},
	{col:{header:'字段ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_role_field__col_id',type:'string'}},
	{col:{header:'角色功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_role_field__role_fun_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'sys_role_field'
	};
	
	
	config.eventcfg = {		
		dataImportParam: function() {
			var fkValue = this.grid.fkValue;
	};
		
	return new Jxstar.GridNode(config);
}