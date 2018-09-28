Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datawfrunstate = Jxstar.findComboData('wfrunstate');

	var cols = [
	{col:{header:'过程名称', width:210, sortable:true}, field:{name:'wf_process__process_name',type:'string'}},
	{col:{header:'任务描述', width:363, sortable:true}, field:{name:'wf_task__task_desc',type:'string'}},
	{col:{header:'任务状态', width:68, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datawfrunstate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datawfrunstate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datawfrunstate.length; i++) {
				if (Datawfrunstate[i][0] == value)
					return Datawfrunstate[i][1];
			}
		}}, field:{name:'wf_task__run_state',type:'string'}},
	{col:{header:'开始时间', width:119, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i:s');
		}}, field:{name:'wf_task__start_date',type:'date'}},
	{col:{header:'受限时间', width:100, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'wf_task__limit_date',type:'date'}},
	{col:{header:'功能名称', width:149, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_process__fun_name',type:'string'}},
	{col:{header:'节点名称', width:133, sortable:true}, field:{name:'wf_task__node_title',type:'string'}},
	{col:{header:'数据ID', width:100, sortable:true}, field:{name:'wf_task__data_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true}, field:{name:'wf_task__fun_id',type:'string'}},
	{col:{header:'过程实例ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_task__instance_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_task__task_id',type:'string'}},
	{col:{header:'过程ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_task__process_id',type:'string'}},
	{col:{header:'模块ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_process__module_id',type:'string'}},
	{col:{header:'节点ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_task__node_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'wf_task'
	};
	
	
	config.eventcfg = {
		baseWf: function(fileName) {
			var self = this;
			var records = self.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			
			var funId =  records[0].get('wf_task__fun_id');
			var dataId = records[0].get('wf_task__data_id');
			
			var appData = {funId:funId, dataId:dataId};
			JxUtil.showCheckWindow(appData, fileName);
		},

		takecheck: function() {
			var self = this;
			var records = self.grid.getSelectionModel().getSelections();
			if (!JxUtil.selected(records)) return;

			var funId = records[0].get('wf_task__fun_id');
			var hdcall = function() {
				var params = 'funid=wf_task&pagetype=chkgrid&eventcode=takecheck&check_funid='+ funId;
				for (var i = 0; i < records.length; i++) {
					var taskId = records[i].get('wf_task__task_id');
					var dataId = records[i].get('wf_task__data_id');
					params += '&taskid=' + taskId + '&keyid=' + dataId;
				}
				
				//填写任务取回标志
				var checkType = 'K', checkDesc = String.format(jx.event.takedesc, JxDefault.getUserName());	//该任务被【{0}】取回！
				params += '&check_type='+ checkType +'&check_desc='+ encodeURIComponent(checkDesc);
				
				var endcall = function(data) {
					//重新加载数据
					self.grid.getStore().reload();
				};
				
				Request.postRequest(params, endcall);
			};
			//确定取回选择的审批记录吗？
			Ext.Msg.confirm(jx.base.hint, jx.event.takeyes, function(btn) {
				if (btn == 'yes') hdcall();
			});
		}
	};
		
	return new Jxstar.GridNode(config);
}