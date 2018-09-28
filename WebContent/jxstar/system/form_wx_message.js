Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datawxmsgstate = Jxstar.findComboData('wxmsgstate');
	var Datawxmsgtype = Jxstar.findComboData('wxmsgtype');
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
					{xtype:'combo', fieldLabel:'消息状态', name:'wx_message__msg_state', defaultval:'0',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datawxmsgstate
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datawxmsgstate[0][0]},
					{xtype:'textfield', fieldLabel:'微信用户ID', name:'wx_message__touser', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'datetimefield', fieldLabel:'计划发送时间', name:'wx_message__plan_date', defaultval:'fun_getToday()', format:'Y-m-d H:i:s', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%'},
					{xtype:'textfield', fieldLabel:'创建者', name:'wx_message__edit_user', defaultval:'fun_getUserName()', readOnly:true, anchor:'100%', maxLength:30},
					{xtype:'textfield', fieldLabel:'对象的类型', name:'wx_message__bus_name', readOnly:true, anchor:'100%', maxLength:30},
					{xtype:'hidden', fieldLabel:'消息的链接', name:'wx_message__msg_url', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'消息ID', name:'wx_message__msg_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'消息分类', name:'wx_message__msg_type', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datawxmsgtype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datawxmsgtype[0][0]},
					{xtype:'datefield', fieldLabel:'写入时间', name:'wx_message__write_date', defaultval:'fun_getToday()', format:'Y-m-d H:i:s', anchor:'100%', readOnly:true},
					{xtype:'datefield', fieldLabel:'实际发送时间', name:'wx_message__send_time', format:'Y-m-d H:i:s', anchor:'100%', readOnly:true},
					{xtype:'textfield', fieldLabel:'业务单号', name:'wx_message__bus_code', readOnly:true, anchor:'100%', maxLength:30},
					{xtype:'textfield', fieldLabel:'返回的类型', name:'wx_message__return_code', readOnly:true, anchor:'100%', maxLength:10},
					{xtype:'hidden', fieldLabel:'创建者ID', name:'wx_message__edit_userid', defaultval:'fun_getUserId()', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'图片的链接', name:'wx_message__pic_url', anchor:'100%'}
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
					{xtype:'textfield', fieldLabel:'标题', name:'wx_message__msg_title', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'textarea', fieldLabel:'描述', name:'wx_message__msg_desc', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:90, maxLength:800},
					{xtype:'textarea', fieldLabel:'返回的消息', name:'wx_message__return_msg', readOnly:true, anchor:'100%', height:90, maxLength:100}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'wx_message'
	};

	
	
	
	return new Jxstar.FormNode(config);
}