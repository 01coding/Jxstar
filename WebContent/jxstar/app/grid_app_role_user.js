Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'角色ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_role_user__role_id',type:'string'}},
	{col:{header:'设置ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_role_user__role_userid',type:'string'}},
	{col:{header:'用户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_role_user__user_id',type:'string'}},
	{col:{header:'用户代号', width:100, sortable:true}, field:{name:'sys_user__user_code',type:'string'}},
	{col:{header:'用户名', width:100, sortable:true}, field:{name:'sys_user__user_name',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '0',
		funid: 'app_role_user'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}