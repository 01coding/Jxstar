Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datatenstate = Jxstar.findComboData('tenstate');
	var Databusertype = Jxstar.findComboData('busertype');

	var cols = [
	{col:{header:'状态', width:83, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datatenstate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datatenstate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datatenstate.length; i++) {
				if (Datatenstate[i][0] == value)
					return Datatenstate[i][1];
			}
		}}, field:{name:'bos_user__auditing',type:'string'}},
	{col:{header:'用户号', width:100, sortable:true}, field:{name:'bos_user__user_code',type:'string'}},
	{col:{header:'用户名', width:100, sortable:true}, field:{name:'bos_user__user_name',type:'string'}},
	{col:{header:'用户类型', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Databusertype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Databusertype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Databusertype.length; i++) {
				if (Databusertype[i][0] == value)
					return Databusertype[i][1];
			}
		}}, field:{name:'bos_user__user_type',type:'string'}},
	{col:{header:'密码', width:100, sortable:true, hidden:true}, field:{name:'bos_user__user_pwd',type:'string'}},
	{col:{header:'职务', width:100, sortable:true}, field:{name:'bos_user__user_duty',type:'string'}},
	{col:{header:'手机', width:100, sortable:true}, field:{name:'bos_user__mob_code',type:'string'}},
	{col:{header:'邮箱', width:135, sortable:true}, field:{name:'bos_user__user_email',type:'string'}},
	{col:{header:'备注', width:100, sortable:true, hidden:true}, field:{name:'bos_user__memo',type:'string'}},
	{col:{header:'注册时间', width:145, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'bos_user__edit_date',type:'date'}},
	{col:{header:'失效时间', width:148, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'bos_user__invalid_date',type:'date'}},
	{col:{header:'账号ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_user__account_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_user__user_id',type:'string'}},
	{col:{header:'租户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_user__bos_tenant_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'bos_user'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}