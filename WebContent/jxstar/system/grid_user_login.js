Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'账号', width:75, sortable:true}, field:{name:'sys_user_login__user_code',type:'string'}},
	{col:{header:'用户名', width:100, sortable:true}, field:{name:'sys_user_login__user_name',type:'string'}},
	{col:{header:'客户端IP', width:100, sortable:true}, field:{name:'sys_user_login__client_ip',type:'string'}},
	{col:{header:'登录时间', width:142, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i:s');
		}}, field:{name:'sys_user_login__login_date',type:'date'}},
	{col:{header:'用户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_login__user_id',type:'string'}},
	{col:{header:'日志ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_login__log_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_login__login_id',type:'string'}},
	{col:{header:'部门名称', width:119, sortable:true}, field:{name:'sys_user_login__dept_name',type:'string'}},
	{col:{header:'部门ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_login__dept_id',type:'string'}},
	{col:{header:'客户端程序', width:334, sortable:true}, field:{name:'sys_user_login__client_agent',type:'string'}},
	{col:{header:'会话ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_user_login__session_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '1',
		funid: 'sys_user_login'
	};
	
	
	config.param.selectModel = 'row';
		
	return new Jxstar.GridNode(config);
}