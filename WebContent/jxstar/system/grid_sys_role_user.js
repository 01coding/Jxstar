Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'用户编码', width:115, sortable:true}, field:{name:'sys_user__user_code',type:'string'}},
	{col:{header:'用户名称', width:125, sortable:true}, field:{name:'sys_user__user_name',type:'string'}},
	{col:{header:'设置ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_role__user_role_id',type:'string'}},
	{col:{header:'用户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_role__user_id',type:'string'}},
	{col:{header:'角色ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_role__role_id',type:'string'}},
	{col:{header:'部门名称', width:151, sortable:true}, field:{name:'sys_dept__dept_name',type:'string'}},
	{col:{header:'部门编码', width:100, sortable:true}, field:{name:'sys_dept__dept_code',type:'string'}},
	{col:{header:'部门ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_dept__dept_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '0',
		funid: 'sys_role_user'
	};
	
	
	config.eventcfg = {		
		dataImportParam: function() {
			var roleId = this.grid.fkValue;			var options = {				whereSql: 'user_id not in (select user_id from sys_user_role where role_id = ?)',				whereValue: roleId,				whereType: 'string'			};			return options;		}		
	};
		
	return new Jxstar.GridNode(config);
}