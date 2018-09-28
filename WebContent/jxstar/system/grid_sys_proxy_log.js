Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'操作时间', width:173, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i:s');
		}}, field:{name:'sys_proxy_log__log_date',type:'date'}},
	{col:{header:'代理人账号', width:100, sortable:true}, field:{name:'sys_proxy_log__user_code',type:'string'}},
	{col:{header:'代理人', width:100, sortable:true}, field:{name:'sys_proxy_log__user_name',type:'string'}},
	{col:{header:'被代理人账号', width:100, sortable:true}, field:{name:'sys_proxy_log__to_user_code',type:'string'}},
	{col:{header:'被代理人', width:100, sortable:true}, field:{name:'sys_proxy_log__to_user_name',type:'string'}},
	{col:{header:'日志说明', width:223, sortable:true}, field:{name:'sys_proxy_log__log_memo',type:'string'}},
	{col:{header:'代理人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_proxy_log__user_id',type:'string'}},
	{col:{header:'代理ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_proxy_log__proxy_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_proxy_log__log_id',type:'string'}},
	{col:{header:'被代理人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_proxy_log__to_user_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'sys_proxy_log'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}