Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datataskstate = Jxstar.findComboData('taskstate');

	var cols = [
	{col:{header:'上报名称', width:127, sortable:true}, field:{name:'warn_base__warn_name',type:'string'}},
	{col:{header:'上报功能ID', width:100, sortable:true}, field:{name:'warn_base__fun_id',type:'string'}},
	{col:{header:'功能名称', width:151, sortable:true}, field:{name:'warn_base__fun_name',type:'string'}},
	{col:{header:'上报消息描述', width:319, sortable:true, hidden:true}, field:{name:'warn_base__warn_desc',type:'string'}},
	{col:{header:'触发事件代码', width:100, sortable:true, hidden:true}, field:{name:'warn_base__event_code',type:'string'}},
	{col:{header:'上报条件SQL', width:338, sortable:true}, field:{name:'warn_base__where_sql',type:'string'}},
	{col:{header:'判断间隔时间值', width:100, sortable:true, hidden:true}, field:{name:'warn_base__time_value',type:'string'}},
	{col:{header:'执行间隔时间值', width:100, sortable:true, hidden:true}, field:{name:'warn_base__run_plan',type:'string'}},
	{col:{header:'是否待办任务', width:100, sortable:true, hidden:true}, field:{name:'warn_base__is_assign',type:'string'}},
	{col:{header:'根据权限通知', width:100, sortable:true, hidden:true}, field:{name:'warn_base__use_role',type:'string'}},
	{col:{header:'是否发送短信', width:100, sortable:true, hidden:true}, field:{name:'warn_base__send_sms',type:'string'}},
	{col:{header:'是否发送邮件', width:100, sortable:true, hidden:true}, field:{name:'warn_base__send_email',type:'string'}},
	{col:{header:'是否保留日志', width:100, sortable:true, hidden:true}, field:{name:'warn_base__has_log',type:'string'}},
	{col:{header:'保留日志条数', width:100, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'warn_base__log_num',type:'int'}},
	{col:{header:'上次运行时间', width:138, sortable:true, hidden:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i:s');
		}}, field:{name:'warn_base__run_date',type:'date'}},
	{col:{header:'任务状态', width:73, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datataskstate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datataskstate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datataskstate.length; i++) {
				if (Datataskstate[i][0] == value)
					return Datataskstate[i][1];
			}
		}}, field:{name:'warn_base__run_state',type:'string'}},
	{col:{header:'上报用途描述', width:100, sortable:true, hidden:true}, field:{name:'warn_base__warn_memo',type:'string'}},
	{col:{header:'上报ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'warn_base__warn_id',type:'string'}},
	{col:{header:'邮件模板ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'warn_base__templet_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'sys_warn'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}