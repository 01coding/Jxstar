Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'任务描述', width:395, sortable:true}, field:{name:'wf_assign__task_desc',type:'string'}},
	{col:{header:'开始时间', width:136, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'wf_assign__start_date',type:'date'}},
	{col:{header:'受限时间', width:128, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'wf_assign__limit_date',type:'date'}},
	{col:{header:'分配人', width:100, sortable:true, hidden:true}, field:{name:'wf_assign__assign_user',type:'string'}},
	{col:{header:'执行状态', width:100, sortable:true, hidden:true}, field:{name:'wf_assign__run_state',type:'string'}},
	{col:{header:'数据ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_assign__data_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_assign__assign_id',type:'string'}},
	{col:{header:'任务实例ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_assign__task_id',type:'string'}},
	{col:{header:'分配人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_assign__assign_userid',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_assign__fun_id',type:'string'}},
	{col:{header:'过程实例ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_assign__instance_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '1',
		funid: 'wf_assign'
	};
	
	
	//在最后添加一列按钮
	cols[cols.length] = {col:
		{header:'', width:50, xtype:'actioncolumn', menuDisabled:true, align:'center', items:[{
				icon: 'resources/images/icons/button/chkw.gif',
				tooltip: jx.wf.execheck,	//'执行审批操作'
				handler: function(grid, rowIndex, colIndex) {
					var rec = grid.getStore().getAt(rowIndex);
					var taskId = rec.get('wf_assign__task_id');
					var instanceId = rec.get('wf_assign__instance_id');
					var funId = rec.get('wf_assign__fun_id');
					var dataId = rec.get('wf_assign__data_id');
					
					var assignData = {taskId:taskId, instanceId:instanceId, funId:funId, dataId:dataId};
					JxUtil.showCheckWindow(assignData, 'check_work');
				}
			}]
		}
	};

	//把任务描述字段值改为超链接
	var renderTask = function(val, metaData, record) {
		var funId = record.get('wf_assign__fun_id');
		var dataId = record.get('wf_assign__data_id');
		var userId = record.get('wf_assign__assign_userid');
		
		var chgcolor = 'onmouseover="this.style.color=\'#FF4400\';" onmouseout="this.style.color=\'#0080FF\';"';
		var html = '<a style=\'color:#0080FF;\' '+ chgcolor +' onclick="JxUtil.showCheckData(\''+ funId +'\', \''+ dataId +'\', \''+ userId +'\');">'+ val +'</a>';
		return html;
	};
	
	//把第一列的值改为超链接
	cols[0].col.renderer = renderTask;
	
	//不需要复选模式
	config.param.selectModel = 'row';
		
	return new Jxstar.GridNode(config);
}