Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datawxmsgstate = Jxstar.findComboData('wxmsgstate');
	var Datawxmsgtype = Jxstar.findComboData('wxmsgtype');

	var cols = [
	{col:{header:'消息状态', width:80, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datawxmsgstate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datawxmsgstate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datawxmsgstate.length; i++) {
				if (Datawxmsgstate[i][0] == value)
					return Datawxmsgstate[i][1];
			}
		}}, field:{name:'wx_message__msg_state',type:'string'}},
	{col:{header:'消息分类', width:85, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datawxmsgtype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datawxmsgtype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datawxmsgtype.length; i++) {
				if (Datawxmsgtype[i][0] == value)
					return Datawxmsgtype[i][1];
			}
		}}, field:{name:'wx_message__msg_type',type:'string'}},
	{col:{header:'标题', width:236, sortable:true}, field:{name:'wx_message__msg_title',type:'string'}},
	{col:{header:'描述', width:100, sortable:true, hidden:true}, field:{name:'wx_message__msg_desc',type:'string'}},
	{col:{header:'微信用户ID', width:100, sortable:true}, field:{name:'wx_message__touser',type:'string'}},
	{col:{header:'写入时间', width:153, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i:s');
		}}, field:{name:'wx_message__write_date',type:'date'}},
	{col:{header:'计划发送时间', width:137, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i:s');
		}}, field:{name:'wx_message__plan_date',type:'date'}},
	{col:{header:'实际发送时间', width:143, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i:s');
		}}, field:{name:'wx_message__send_time',type:'date'}},
	{col:{header:'返回的消息', width:332, sortable:true}, field:{name:'wx_message__return_msg',type:'string'}},
	{col:{header:'创建者', width:100, sortable:true}, field:{name:'wx_message__edit_user',type:'string'}},
	{col:{header:'业务单号', width:100, sortable:true}, field:{name:'wx_message__bus_code',type:'string'}},
	{col:{header:'对象的类型', width:100, sortable:true}, field:{name:'wx_message__bus_name',type:'string'}},
	{col:{header:'返回的类型', width:100, sortable:true, hidden:true}, field:{name:'wx_message__return_code',type:'string'}},
	{col:{header:'创建者ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wx_message__edit_userid',type:'string'}},
	{col:{header:'消息ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wx_message__msg_id',type:'string'}},
	{col:{header:'图片的链接', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wx_message__pic_url',type:'string'}},
	{col:{header:'消息的链接', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wx_message__msg_url',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'wx_message'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}