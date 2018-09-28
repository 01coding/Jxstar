Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'开始时间', width:129, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i:s');
		}}, field:{name:'warn_log__start_date',type:'date'}},
	{col:{header:'结束时间', width:126, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i:s');
		}}, field:{name:'warn_log__end_date',type:'date'}},
	{col:{header:'服务器名称', width:100, sortable:true}, field:{name:'warn_log__server_name',type:'string'}},
	{col:{header:'服务器IP', width:100, sortable:true}, field:{name:'warn_log__server_ip',type:'string'}},
	{col:{header:'运行时错误', width:208, sortable:true}, field:{name:'warn_log__run_error',type:'string'}},
	{col:{header:'上报ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'warn_log__warn_id',type:'string'}},
	{col:{header:'日志ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'warn_log__log_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'sys_warnlog'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}