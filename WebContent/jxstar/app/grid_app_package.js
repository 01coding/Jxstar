Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataaudit = Jxstar.findComboData('audit');
	var Dataapppacktype = Jxstar.findComboData('apppacktype');

	var cols = [
	{col:{header:'栏目ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_package__bar_id',type:'string'}},
	{col:{header:'序号', width:72, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'app_package__pack_index',type:'int'}},
	{col:{header:'状态', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataaudit
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataaudit[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataaudit.length; i++) {
				if (Dataaudit[i][0] == value)
					return Dataaudit[i][1];
			}
		}}, field:{name:'app_package__auditing',type:'string'}},
	{col:{header:'包代号', width:100, sortable:true}, field:{name:'app_package__pack_code',type:'string'}},
	{col:{header:'包名称', width:100, sortable:true}, field:{name:'app_package__pack_name',type:'string'}},
	{col:{header:'自动升级？', width:78, sortable:true}, field:{name:'app_package__auto_up',type:'string'}},
	{col:{header:'栏目', width:100, sortable:true}, field:{name:'app_package__bar_code',type:'string'}},
	{col:{header:'发布路径', width:219, sortable:true}, field:{name:'app_package__pack_path',type:'string'}},
	{col:{header:'包图标', width:100, sortable:true, hidden:true}, field:{name:'app_package__pack_icon',type:'string'}},
	{col:{header:'包类型', width:100, sortable:true, hidden:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataapppacktype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataapppacktype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataapppacktype.length; i++) {
				if (Dataapppacktype[i][0] == value)
					return Dataapppacktype[i][1];
			}
		}}, field:{name:'app_package__pack_type',type:'string'}},
	{col:{header:'包级别', width:100, sortable:true, hidden:true}, field:{name:'app_package__pack_level',type:'string'}},
	{col:{header:'包描述', width:306, sortable:true}, field:{name:'app_package__pack_memo',type:'string'}},
	{col:{header:'应用包ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_package__pack_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'app_package'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}