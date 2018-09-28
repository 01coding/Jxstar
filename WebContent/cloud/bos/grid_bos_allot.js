Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataregstate = Jxstar.findComboData('regstate');

	var cols = [
	{col:{header:'资源类型', width:100, sortable:true}, field:{name:'bos_allot__resource_type',type:'string'}},
	{col:{header:'资源名称', width:143, sortable:true}, field:{name:'bos_allot__resource_name',type:'string'}},
	{col:{header:'资源说明', width:247, sortable:true, hidden:true}, field:{name:'bos_allot__memo',type:'string'}},
	{col:{header:'分配时间', width:123, sortable:true, hidden:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'bos_allot__edit_date',type:'date'}},
	{col:{header:'失效时间', width:136, sortable:true, hidden:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'bos_allot__invalid_date',type:'date'}},
	{col:{header:'分配人', width:100, sortable:true, hidden:true}, field:{name:'bos_allot__edit_user',type:'string'}},
	{col:{header:'资源ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_allot__resource_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_allot__allot_id',type:'string'}},
	{col:{header:'创建人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_allot__edit_userid',type:'string'}},
	{col:{header:'租户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_allot__bos_tenant_id',type:'string'}},
	{col:{header:'分配空间 M', width:100, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'bos_allot__allot_num',type:'int'}},
	{col:{header:'已用空间 M', width:100, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'bos_allot__use_num',type:'int'}},
	{col:{header:'状态', width:87, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataregstate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataregstate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataregstate.length; i++) {
				if (Dataregstate[i][0] == value)
					return Dataregstate[i][1];
			}
		}}, field:{name:'bos_allot__auditing',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'bos_allot'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}