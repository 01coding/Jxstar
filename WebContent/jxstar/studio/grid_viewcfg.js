Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datatablestate = Jxstar.findComboData('tablestate');

	var cols = [
	{col:{header:'状态', width:50, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datatablestate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datatablestate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datatablestate.length; i++) {
				if (Datatablestate[i][0] == value)
					return Datatablestate[i][1];
			}
		}}, field:{name:'dm_viewcfg__state',type:'string'}},
	{col:{header:'视图名称', width:111, sortable:true}, field:{name:'dm_viewcfg__view_name',type:'string'}},
	{col:{header:'视图说明', width:456, sortable:true}, field:{name:'dm_viewcfg__view_memo',type:'string'}},
	{col:{header:'视图ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'dm_viewcfg__view_id',type:'string'}},
	{col:{header:'视图脚本', width:100, sortable:true, hidden:true}, field:{name:'dm_viewcfg__view_sql',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'dm_viewcfg'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}