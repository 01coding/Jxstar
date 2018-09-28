Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datachecktype = Jxstar.findComboData('checktype');
	var Datayesno = Jxstar.findComboData('yesno');

	var cols = [
	{col:{header:'处理人', width:83, sortable:true}, field:{name:'wf_assignhis__check_user',type:'string'}},
	{col:{header:'处理时间', width:123, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'wf_assignhis__check_date',type:'date'}},
	{col:{header:'处理意见', width:235, sortable:true}, field:{name:'wf_assignhis__check_desc',type:'string'}},
	{col:{header:'开始时间', width:112, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'wf_taskhis__start_date',type:'date'}},
	{col:{header:'受限时间', width:109, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'wf_taskhis__limit_date',type:'date'}},
	{col:{header:'节点名称', width:135, sortable:true}, field:{name:'wf_taskhis__node_title',type:'string'}},
	{col:{header:'处理类型', width:87, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datachecktype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Datachecktype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datachecktype.length; i++) {
				if (Datachecktype[i][0] == value)
					return Datachecktype[i][1];
			}
		}}, field:{name:'wf_assignhis__check_type',type:'string'}},
	{col:{header:'超时?', width:52, sortable:true, colindex:10000, hidden:true, align:'center',
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
		}}, field:{name:'wf_taskhis__is_timeout',type:'string'}},
	{col:{header:'发邮件?', width:62, sortable:true, colindex:10000, hidden:true, align:'center',
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
		}}, field:{name:'wf_taskhis__has_email',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_taskhis__fun_id',type:'string'}},
	{col:{header:'任务ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_taskhis__task_id',type:'string'}},
	{col:{header:'数据ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_taskhis__data_id',type:'string'}},
	{col:{header:'处理人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_assignhis__check_userid',type:'string'}},
	{col:{header:'分配ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_assignhis__assign_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '1',
		funid: 'wf_taskhis'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}