Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'角色名称', width:201, sortable:true}, field:{name:'sys_role__role_name',type:'string'}},
	{col:{header:'设置ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_role__user_role_id',type:'string'}},
	{col:{header:'用户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_role__user_id',type:'string'}},
	{col:{header:'角色ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_role__role_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'sys_user_role'
	};
	
	
	config.eventcfg = {				dataImportParam: function() {			var userId = this.grid.fkValue;			var options = {				whereSql: 'role_id not in (select role_id from sys_user_role where user_id = ?)',				whereValue: userId,				whereType: 'string'			};			return options;		}			};
		
	return new Jxstar.GridNode(config);
}