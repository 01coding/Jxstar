Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datanotestatus = Jxstar.findComboData('notestatus');
	var Datanotesrc = Jxstar.findComboData('notesrc');
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
					{xtype:'textfield', fieldLabel:'手机号码', name:'sys_note__mob_code', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'textarea', fieldLabel:'短信内容', name:'sys_note__send_msg', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:120, maxLength:500}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'消息发送状态', name:'sys_note__send_status', defaultval:'0',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datanotestatus
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datanotestatus[0][0]},
					{xtype:'datefield', fieldLabel:'发送时间', name:'sys_note__send_date', defaultval:'fun_getToday()', format:'Y-m-d H:i', anchor:'100%', readOnly:true},
					{xtype:'combo', fieldLabel:'发送来源', name:'sys_note__send_src', defaultval:'user',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datanotesrc
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datanotesrc[0][0]},
					{xtype:'textfield', fieldLabel:'发送人', name:'sys_note__send_user', defaultval:'fun_getUserName()', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'接收用户', name:'sys_note__user_name', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'hidden', fieldLabel:'来源记录ID', name:'sys_note__send_srcid', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'短信ID', name:'sys_note__note_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'功能ID', name:'sys_note__fun_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'接收用户ID', name:'sys_note__user_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'数据ID', name:'sys_note__data_id', anchor:'100%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'sys_note'
	};

	
	
	
	return new Jxstar.FormNode(config);
}