Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'任务详情', width:337, sortable:true, hidden:true}, field:{name:'v_wf_assign__task_desc',type:'string'}},
	{col:{header:'任务描述', width:352, sortable:true}, field:{name:'v_wf_assign__instance_title',type:'string'}},
	{col:{header:'创建时间', width:189, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i:s');
		}}, field:{name:'v_wf_assign__start_date',type:'date'}},
	{col:{header:'申请人', width:100, sortable:true}, field:{name:'v_wf_assign__start_user',type:'string'}},
	{col:{header:'流程名称', width:156, sortable:true}, field:{name:'v_wf_assign__process_name',type:'string'}},
	{col:{header:'待办人', width:100, sortable:true, hidden:true}, field:{name:'v_wf_assign__assign_user',type:'string'}},
	{col:{header:'功能id', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'v_wf_assign__fun_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'v_wf_assign__key_id',type:'string'}},
	{col:{header:'创建用户id', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'v_wf_assign__start_userid',type:'string'}},
	{col:{header:'待办人id', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'v_wf_assign__assign_userid',type:'string'}},
	{col:{header:'数据id', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'v_wf_assign__data_id',type:'string'}},
	{col:{header:'待办时间', width:100, sortable:true, hidden:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i:s');
		}}, field:{name:'v_wf_assign__assign_date',type:'date'}},
	{col:{header:'佃户id', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'v_wf_assign__tenant_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'v_wf_assign'
	};
	
	
	var renderTask = function(val, metaData, record) {
		var funId = record.get('v_wf_assign__fun_id');
		var dataId = record.get('v_wf_assign__data_id');
		var userId = JxDefault.getUserId();
		
		var html = "<span class=\"x-msgshow\" onclick=\"JxUtil.showCheckData('"+funId+"', '"+dataId+"', '"+userId+"');\">"+val+"</span>";
		return html;
	};
	
	for (var i = 0, n = cols.length; i < n; i++) {
		if (cols[i].field.name == 'v_wf_assign__instance_title') {
			cols[i].col.renderer = renderTask;
		}
	}
		
	return new Jxstar.GridNode(config);
}