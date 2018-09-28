Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datawfasstate = Jxstar.findComboData('wfasstate');

	var cols = [
	{col:{header:'*分配人', width:97, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TriggerField({
			maxLength:20,
			editable:false, allowBlank:false,
			triggerClass:'x-form-search-trigger', 
			onTriggerClick: function() {
				var selcfg = {"pageType":"combogrid", "nodeId":"sys_user", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"sys_user.user_name;user_id", "targetField":"wf_assign.assign_user;assign_userid", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"all","fieldName":"wf_assign.assign_user"};
				JxSelect.createSelectWin(selcfg, this, 'node_wf_assignq_editgrid');
			}
		})}, field:{name:'wf_assign__assign_user',type:'string'}},
	{col:{header:'任务描述', width:307, sortable:true}, field:{name:'wf_assign__task_desc',type:'string'}},
	{col:{header:'执行状态', width:86, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datawfasstate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datawfasstate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datawfasstate.length; i++) {
				if (Datawfasstate[i][0] == value)
					return Datawfasstate[i][1];
			}
		}}, field:{name:'wf_assign__run_state',type:'string'}},
	{col:{header:'开始时间', width:113, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'wf_assign__start_date',type:'date'}},
	{col:{header:'受限时间', width:110, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'wf_assign__limit_date',type:'date'}},
	{col:{header:'分配人编号', width:80, sortable:true}, field:{name:'sys_user__user_code',type:'string'}},
	{col:{header:'任务节点', width:100, sortable:true}, field:{name:'wf_task__node_title',type:'string'}},
	{col:{header:'所属部门', width:132, sortable:true}, field:{name:'sys_dept__dept_name',type:'string'}},
	{col:{header:'部门编码', width:100, sortable:true}, field:{name:'sys_dept__dept_code',type:'string'}},
	{col:{header:'分配人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_assign__assign_userid',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_assign__assign_id',type:'string'}},
	{col:{header:'过程实例ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_assign__instance_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_assign__fun_id',type:'string'}},
	{col:{header:'数据ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_assign__data_id',type:'string'}},
	{col:{header:'任务实例ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_assign__task_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '1',
		funid: 'wf_assignq'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}