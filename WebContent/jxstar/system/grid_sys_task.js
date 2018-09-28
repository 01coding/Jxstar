Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datataskstate = Jxstar.findComboData('taskstate');
	var Datatasktype = Jxstar.findComboData('tasktype');
	var Datayesno = Jxstar.findComboData('yesno');

	var cols = [
	{col:{header:'任务名称', width:142, sortable:true}, field:{name:'task_base__task_name',type:'string'}},
	{col:{header:'后台类', width:242, sortable:true}, field:{name:'task_base__task_class',type:'string'}},
	{col:{header:'执行计划', width:143, sortable:true}, field:{name:'task_base__task_plan',type:'string'}},
	{col:{header:'任务描述', width:100, sortable:true, hidden:true}, field:{name:'task_base__task_memo',type:'string'}},
	{col:{header:'上次运行时间', width:151, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i:s');
		}}, field:{name:'task_base__run_date',type:'date'}},
	{col:{header:'任务状态', width:100, sortable:true, align:'center',
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
		}}, field:{name:'task_base__task_state',type:'string'}},
	{col:{header:'任务类型', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datatasktype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datatasktype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datatasktype.length; i++) {
				if (Datatasktype[i][0] == value)
					return Datatasktype[i][1];
			}
		}}, field:{name:'task_base__task_type',type:'string'}},
	{col:{header:'保留日志？', width:100, sortable:true, hidden:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datayesno
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datayesno[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datayesno.length; i++) {
				if (Datayesno[i][0] == value)
					return Datayesno[i][1];
			}
		}}, field:{name:'task_base__has_log',type:'string'}},
	{col:{header:'最大日志条数', width:87, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'task_base__log_num',type:'int'}},
	{col:{header:'任务ID', width:100, sortable:true, hidden:true}, field:{name:'task_base__task_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'sys_task'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}