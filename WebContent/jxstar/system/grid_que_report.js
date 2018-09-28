Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataquestatus = Jxstar.findComboData('questatus');
	var Dataquetype = Jxstar.findComboData('quetype');
	var Dataquestatus1 = Jxstar.findComboData('questatus1');

	var cols = [
	{col:{header:'处理状态', width:75, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataquestatus
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataquestatus[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataquestatus.length; i++) {
				if (Dataquestatus[i][0] == value)
					return Dataquestatus[i][1];
			}
		}}, field:{name:'sys_question__que_status',type:'string'}},
	{col:{header:'问题单号', width:148, sortable:true}, field:{name:'sys_question__que_code',type:'string'}},
	{col:{header:'报告时间', width:132, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'sys_question__report_date',type:'date'}},
	{col:{header:'问题描述', width:334, sortable:true}, field:{name:'sys_question__que_desc',type:'string'}},
	{col:{header:'报告人', width:61, sortable:true}, field:{name:'sys_question__report_user',type:'string'}},
	{col:{header:'联系方式', width:100, sortable:true}, field:{name:'sys_question__phone',type:'string'}},
	{col:{header:'报告部门', width:121, sortable:true}, field:{name:'sys_question__dept_name',type:'string'}},
	{col:{header:'处理人', width:64, sortable:true}, field:{name:'sys_question__done_user',type:'string'}},
	{col:{header:'受理时间', width:137, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'sys_question__start_date',type:'date'}},
	{col:{header:'关闭时间', width:122, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'sys_question__done_date',type:'date'}},
	{col:{header:'问题类型', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataquetype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataquetype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataquetype.length; i++) {
				if (Dataquetype[i][0] == value)
					return Dataquetype[i][1];
			}
		}}, field:{name:'sys_question__que_type',type:'string'}},
	{col:{header:'原因分析及处理结果', width:251, sortable:true}, field:{name:'sys_question__done_desc',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_question__que_id',type:'string'}},
	{col:{header:'报告人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_question__report_userid',type:'string'}},
	{col:{header:'处理人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_question__done_userid',type:'string'}},
	{col:{header:'报告部门ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_question__dept_id',type:'string'}},
	{col:{header:'处理结果', width:100, sortable:true, hidden:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataquestatus1
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataquestatus1[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataquestatus1.length; i++) {
				if (Dataquestatus1[i][0] == value)
					return Dataquestatus1[i][1];
			}
		}}, field:{name:'sys_question__done_type',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'que_report'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}