Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datanotestatus = Jxstar.findComboData('notestatus');
	var Datanotesrc = Jxstar.findComboData('notesrc');

	var cols = [
	{col:{header:'发送时间', width:149, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'sys_note__send_date',type:'date'}},
	{col:{header:'手机号码', width:100, sortable:true}, field:{name:'sys_note__mob_code',type:'string'}},
	{col:{header:'短信内容', width:367, sortable:true}, field:{name:'sys_note__send_msg',type:'string'}},
	{col:{header:'消息发送状态', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datanotestatus
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datanotestatus[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datanotestatus.length; i++) {
				if (Datanotestatus[i][0] == value)
					return Datanotestatus[i][1];
			}
		}}, field:{name:'sys_note__send_status',type:'string'}},
	{col:{header:'接收用户', width:71, sortable:true}, field:{name:'sys_note__user_name',type:'string'}},
	{col:{header:'发送来源', width:78, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datanotesrc
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datanotesrc[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datanotesrc.length; i++) {
				if (Datanotesrc[i][0] == value)
					return Datanotesrc[i][1];
			}
		}}, field:{name:'sys_note__send_src',type:'string'}},
	{col:{header:'发送人', width:75, sortable:true}, field:{name:'sys_note__send_user',type:'string'}},
	{col:{header:'来源记录ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_note__send_srcid',type:'string'}},
	{col:{header:'数据ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_note__data_id',type:'string'}},
	{col:{header:'短信ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_note__note_id',type:'string'}},
	{col:{header:'接收用户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_note__user_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_note__fun_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '0',
		funid: 'sys_note'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}