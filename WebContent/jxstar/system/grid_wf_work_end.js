Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datawfstate = Jxstar.findComboData('wfstate');

	var cols = [
	{col:{header:'任务摘要', width:267, sortable:true}, field:{name:'wf_instancehis__instance_title',type:'string'}},
	{col:{header:'开始时间', width:153, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'wf_instancehis__start_date',type:'date'}},
	{col:{header:'结束时间', width:149, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'wf_instancehis__end_date',type:'date'}},
	{col:{header:'发起人', width:78, sortable:true}, field:{name:'wf_instancehis__start_user',type:'string'}},
	{col:{header:'状态', width:75, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datawfstate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datawfstate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datawfstate.length; i++) {
				if (Datawfstate[i][0] == value)
					return Datawfstate[i][1];
			}
		}}, field:{name:'wf_instancehis__run_state',type:'string'}},
	{col:{header:'任务名称', width:161, sortable:true}, field:{name:'wf_instancehis__process_name',type:'string'}},
	{col:{header:'实例消息', width:100, sortable:true, hidden:true}, field:{name:'wf_instancehis__instance_desc',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_instancehis__fun_id',type:'string'}},
	{col:{header:'过程ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_instancehis__process_id',type:'string'}},
	{col:{header:'发起人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_instancehis__start_userid',type:'string'}},
	{col:{header:'开始节点', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_instancehis__start_nodeid',type:'string'}},
	{col:{header:'父实例ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_instancehis__parent_sid',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_instancehis__instance_id',type:'string'}},
	{col:{header:'父过程ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_instancehis__parent_pid',type:'string'}},
	{col:{header:'数据ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_instancehis__data_id',type:'string'}},
	{col:{header:'父节点ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_instancehis__parent_nid',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'wf_work_end'
	};
	
	
	var renderTask = function(val, metaData, record) {
		var funId = record.get('wf_instancehis__fun_id');
		var dataId = record.get('wf_instancehis__data_id');
		var userId = JxDefault.getUserId();
		
		var html = "<span class=\"x-msgshow\" onclick=\"JxUtil.showCheckHisData('"+funId+"', '"+dataId+"', '"+userId+"');\">"+val+"</span>";
		return html;
	};
	
	for (var i = 0, n = cols.length; i < n; i++) {
		if (cols[i].field.name == 'wf_instancehis__instance_title') {
			cols[i].col.renderer = renderTask;
		}
	}
		
	return new Jxstar.GridNode(config);
}