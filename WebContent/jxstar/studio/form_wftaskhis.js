Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datachecktype = Jxstar.findComboData('checktype');
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
					{xtype:'trigger', fieldLabel:'处理人', name:'wf_assignhis__check_user',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:20, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', editable:false,
						onTriggerClick: function() {
							var selcfg = {"pageType":"combogrid", "nodeId":"sys_user", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"sys_user.user_name;user_id", "targetField":"wf_assignhis.check_user;check_userid", "whereSql":"sys_user.is_novalid = '0'", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"all","fieldName":"wf_assignhis.check_user"};
							JxSelect.createSelectWin(selcfg, this, 'node_wf_taskhis_form');
						}},
					{xtype:'datefield', fieldLabel:'开始时间', name:'wf_taskhis__start_date', format:'Y-m-d H:i', anchor:'100%', readOnly:true},
					{xtype:'combo', fieldLabel:'处理类型', name:'wf_assignhis__check_type',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datachecktype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datachecktype[0][0]},
					{xtype:'hidden', fieldLabel:'发邮件?', name:'wf_taskhis__has_email', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'任务ID', name:'wf_taskhis__task_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'数据ID', name:'wf_taskhis__data_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'datefield', fieldLabel:'处理时间', name:'wf_assignhis__check_date', format:'Y-m-d H:i', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%'},
					{xtype:'datefield', fieldLabel:'受限时间', name:'wf_taskhis__limit_date', format:'Y-m-d H:i', anchor:'100%', readOnly:true},
					{xtype:'textfield', fieldLabel:'节点名称', name:'wf_taskhis__node_title', readOnly:true, anchor:'100%', maxLength:50},
					{xtype:'hidden', fieldLabel:'处理人ID', name:'wf_assignhis__check_userid', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'超时?', name:'wf_taskhis__is_timeout', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'功能ID', name:'wf_taskhis__fun_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'分配ID', name:'wf_assignhis__assign_id', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'处理意见', name:'wf_assignhis__check_desc', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:150, maxLength:500}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'wf_taskhis'
	};

	
	
	
	return new Jxstar.FormNode(config);
}