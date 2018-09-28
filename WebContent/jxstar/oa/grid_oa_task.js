Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datataskstatus = Jxstar.findComboData('taskstatus');
	var Dataoatasktype = Jxstar.findComboData('oatasktype');
	var Dataoaimportant = Jxstar.findComboData('oaimportant');
	var Dataoaurgent = Jxstar.findComboData('oaurgent');
	var Dataoatimewarn = Jxstar.findComboData('oatimewarn');
	var Dataoatasksrc = Jxstar.findComboData('oatasksrc');

	var cols = [
	{col:{header:'状态', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datataskstatus
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datataskstatus[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datataskstatus.length; i++) {
				if (Datataskstatus[i][0] == value)
					return Datataskstatus[i][1];
			}
		}}, field:{name:'oa_task__exe_status',type:'string'}},
	{col:{header:'任务名称', width:190, sortable:true}, field:{name:'oa_task__task_title',type:'string'}},
	{col:{header:'任务类型', width:94, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataoatasktype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Dataoatasktype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataoatasktype.length; i++) {
				if (Dataoatasktype[i][0] == value)
					return Dataoatasktype[i][1];
			}
		}}, field:{name:'oa_task__task_type',type:'string'}},
	{col:{header:'执行人', width:90, sortable:true}, field:{name:'oa_task__task_user',type:'string'}},
	{col:{header:'编制日期', width:141, sortable:true, hidden:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'oa_task__edit_date',type:'date'}},
	{col:{header:'重要程度', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataoaimportant
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Dataoaimportant[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataoaimportant.length; i++) {
				if (Dataoaimportant[i][0] == value)
					return Dataoaimportant[i][1];
			}
		}}, field:{name:'oa_task__import_level',type:'string'}},
	{col:{header:'紧急程度', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataoaurgent
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Dataoaurgent[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataoaurgent.length; i++) {
				if (Dataoaurgent[i][0] == value)
					return Dataoaurgent[i][1];
			}
		}}, field:{name:'oa_task__urgent_level',type:'string'}},
	{col:{header:'计划开始时间', width:146, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'oa_task__start_date',type:'date'}},
	{col:{header:'计划截止时间', width:139, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'oa_task__end_date',type:'date'}},
	{col:{header:'任务内容', width:258, sortable:true}, field:{name:'oa_task__task_cont',type:'string'}},
	{col:{header:'编制人', width:100, sortable:true}, field:{name:'oa_task__edit_user',type:'string'}},
	{col:{header:'提醒时间', width:100, sortable:true, hidden:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataoatimewarn
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataoatimewarn[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataoatimewarn.length; i++) {
				if (Dataoatimewarn[i][0] == value)
					return Dataoatimewarn[i][1];
			}
		}}, field:{name:'oa_task__warn_time',type:'string'}},
	{col:{header:'编制人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_task__edit_userid',type:'string'}},
	{col:{header:'任务ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_task__task_id',type:'string'}},
	{col:{header:'执行人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_task__task_userid',type:'string'}},
	{col:{header:'任务编号', width:100, sortable:true}, field:{name:'oa_task__task_code',type:'string'}},
	{col:{header:'实际完成时间', width:100, sortable:true, hidden:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'oa_task__work_date',type:'date'}},
	{col:{header:'完成情况', width:100, sortable:true, hidden:true}, field:{name:'oa_task__work_desc',type:'string'}},
	{col:{header:'执行部门', width:100, sortable:true, hidden:true}, field:{name:'oa_task__dept_name',type:'string'}},
	{col:{header:'处理方式', width:100, sortable:true, hidden:true}, field:{name:'oa_task__deal_type',type:'string'}},
	{col:{header:'任务来源', width:100, sortable:true, hidden:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataoatasksrc
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataoatasksrc[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataoatasksrc.length; i++) {
				if (Dataoatasksrc[i][0] == value)
					return Dataoatasksrc[i][1];
			}
		}}, field:{name:'oa_task__task_src',type:'string'}},
	{col:{header:'关联业务', width:100, sortable:true, hidden:true}, field:{name:'oa_task__bus_code',type:'string'}},
	{col:{header:'部门ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_task__dept_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'oa_task'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}