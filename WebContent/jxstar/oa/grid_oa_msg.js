Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datamsgstate = Jxstar.findComboData('msgstate');

	var cols = [
	{col:{header:'状态', width:78, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datamsgstate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datamsgstate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datamsgstate.length; i++) {
				if (Datamsgstate[i][0] == value)
					return Datamsgstate[i][1];
			}
		}}, field:{name:'oa_msg__msg_state',type:'string'}},
	{col:{header:'消息内容', width:486, sortable:true}, field:{name:'oa_msg__msg_content',type:'string'}},
	{col:{header:'发送时间', width:161, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i:s');
		}}, field:{name:'oa_msg__send_date',type:'date'}},
	{col:{header:'阅读时间', width:138, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i:s');
		}}, field:{name:'oa_msg__read_date',type:'date'}},
	{col:{header:'发件人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_msg__from_userid',type:'string'}},
	{col:{header:'收件人', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_msg__to_user',type:'string'}},
	{col:{header:'消息ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_msg__msg_id',type:'string'}},
	{col:{header:'发件人', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_msg__from_user',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_msg__fun_id',type:'string'}},
	{col:{header:'记录ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_msg__data_id',type:'string'}},
	{col:{header:'实例ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_msg__instance_id',type:'string'}},
	{col:{header:'流程ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_msg__process_id',type:'string'}},
	{col:{header:'消息类型', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_msg__msg_type',type:'string'}},
	{col:{header:'收件人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_msg__to_userid',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'oa_msg'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}