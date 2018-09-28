Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Dataoatasktype = Jxstar.findComboData('oatasktype');
	var Dataoatimewarn = Jxstar.findComboData('oatimewarn');
	var Datataskstatus = Jxstar.findComboData('taskstatus');
	var Dataoaurgent = Jxstar.findComboData('oaurgent');
	var Dataoaimportant = Jxstar.findComboData('oaimportant');
	var items = [{
		border:false,
		layout:'form',
		autoHeight:true,
		cls:'x-form-main',
		items:[{
			anchor:'100%',
			border:false,
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'任务名称', name:'oa_task__task_title', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'combo', fieldLabel:'任务类型', name:'oa_task__task_type', defaultval:'0',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataoatasktype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataoatasktype[0][0]},
					{xtype:'datefield', fieldLabel:'计划开始时间', name:'oa_task__start_date', format:'Y-m-d H:i', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%'},
					{xtype:'datefield', fieldLabel:'计划截止时间', name:'oa_task__end_date', format:'Y-m-d H:i', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%'},
					{xtype:'combo', fieldLabel:'提醒时间', name:'oa_task__warn_time', defaultval:'60',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataoatimewarn
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataoatimewarn[0][0]},
					{xtype:'trigger', fieldLabel:'执行人', name:'oa_task__task_user',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:20, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', editable:false,
						onTriggerClick: function() {
							var selcfg = {"pageType":"combogrid", "nodeId":"sys_user", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"sys_user.user_name;user_id;dept_id;sys_dept.dept_name", "targetField":"oa_task.task_user;task_userid;dept_id;dept_name", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"user_name","likeType":"all","fieldName":"oa_task.task_user"};
							JxSelect.createSelectWin(selcfg, this, 'node_oa_task_form');
						}},
					{xtype:'textfield', fieldLabel:'执行部门', name:'oa_task__dept_name', readOnly:true, anchor:'100%', maxLength:50},
					{xtype:'hidden', fieldLabel:'关联业务', name:'oa_task__bus_code', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'编制人ID', name:'oa_task__edit_userid', defaultval:'fun_getUserId()', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'部门ID', name:'oa_task__dept_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'状态', name:'oa_task__exe_status', defaultval:'0',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datataskstatus
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datataskstatus[0][0]},
					{xtype:'textfield', fieldLabel:'任务编号', name:'oa_task__task_code', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'combo', fieldLabel:'紧急程度', name:'oa_task__urgent_level', defaultval:'0',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataoaurgent
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataoaurgent[0][0]},
					{xtype:'combo', fieldLabel:'重要程度', name:'oa_task__import_level', defaultval:'0',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataoaimportant
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataoaimportant[0][0]},
					{xtype:'datefield', fieldLabel:'编制日期', name:'oa_task__edit_date', defaultval:'fun_getToday()', format:'Y-m-d', anchor:'100%', readOnly:true},
					{xtype:'textfield', fieldLabel:'编制人', name:'oa_task__edit_user', defaultval:'fun_getUserName()', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'datefield', fieldLabel:'实际完成时间', name:'oa_task__work_date', format:'Y-m-d H:i', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'任务来源', name:'oa_task__task_src', defaultval:'0', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'执行人ID', name:'oa_task__task_userid', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'任务ID', name:'oa_task__task_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'处理方式', name:'oa_task__deal_type', anchor:'100%'}
				]
			}
			]
		},{
			anchor:'100%',
			border:false,
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.99,
				layout:'form',
				items:[
					{xtype:'textarea', fieldLabel:'任务内容', name:'oa_task__task_cont', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:90, maxLength:400},
					{xtype:'textarea', fieldLabel:'完成情况', name:'oa_task__work_desc', anchor:'100%', height:90, maxLength:400}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'oa_task'
	};

	
	
	
	return new Jxstar.FormNode(config);
}