Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datatenstate = Jxstar.findComboData('tenstate');

	var cols = [
	{col:{header:'状态', width:100, sortable:true, align:'center',
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
		}}, field:{name:'bos_account__auditing',type:'string'}},
	{col:{header:'账号', width:151, sortable:true}, field:{name:'bos_account__account_code',type:'string'}},
	{col:{header:'密码', width:100, sortable:true, hidden:true}, field:{name:'bos_account__account_pwd',type:'string'}},
	{col:{header:'注册时间', width:180, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'bos_account__edit_date',type:'date'}},
	{col:{header:'失效时间', width:183, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'bos_account__invalid_date',type:'date'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_account__account_id',type:'string'}},
	{col:{header:'租户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_account__tenant_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'bos_account'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}