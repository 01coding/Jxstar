Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'功能名称', width:159, sortable:true}, field:{name:'fun_base__fun_name',type:'string'}},
	{col:{header:'设置ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_funx__user_funx_id',type:'string'}},
	{col:{header:'用户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_funx__user_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_funx__fun_id',type:'string'}},
	{col:{header:'数据权限SQL', width:276, sortable:true}, field:{name:'sys_user_funx__ext_sql',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'sys_user_funx'
	};
	
	
	config.eventcfg = {		
		dataImportParam: function() {
			var userId = this.grid.fkValue;			var options = {				whereSql: 'fun_id not in (select fun_id from sys_user_funx where user_id = ?)',				whereValue: userId,				whereType: 'string'			};			return options;		}		
	};
		
	return new Jxstar.GridNode(config);
}