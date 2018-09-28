Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataappfunstate = Jxstar.findComboData('appfunstate');
	var Dataappfuntype = Jxstar.findComboData('appfuntype');

	var cols = [
	{col:{header:'状态', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataappfunstate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataappfunstate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataappfunstate.length; i++) {
				if (Dataappfunstate[i][0] == value)
					return Dataappfunstate[i][1];
			}
		}}, field:{name:'app_fun__fun_state',type:'string'}},
	{col:{header:'功能代号', width:117, sortable:true}, field:{name:'app_fun__fun_code',type:'string'}},
	{col:{header:'功能名称', width:110, sortable:true}, field:{name:'app_fun__fun_name',type:'string'}},
	{col:{header:'图标', width:169, sortable:true}, field:{name:'app_fun__fun_icon',type:'string'}},
	{col:{header:'序号', width:72, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'app_fun__fun_index',type:'int'}},
	{col:{header:'界面URL', width:223, sortable:true}, field:{name:'app_fun__page_url',type:'string'}},
	{col:{header:'上级功能代号', width:128, sortable:true}, field:{name:'app_fun__parent_code',type:'string'}},
	{col:{header:'上级功能名称', width:100, sortable:true}, field:{name:'app_fun__parent_name',type:'string'}},
	{col:{header:'标题背景', width:175, sortable:true, hidden:true}, field:{name:'app_fun__fun_color',type:'string'}},
	{col:{header:'功能类型', width:100, sortable:true, hidden:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataappfuntype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataappfuntype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataappfuntype.length; i++) {
				if (Dataappfuntype[i][0] == value)
					return Dataappfuntype[i][1];
			}
		}}, field:{name:'app_fun__fun_type',type:'string'}},
	{col:{header:'后台功能', width:100, sortable:true, hidden:true}, field:{name:'app_fun__ser_funid',type:'string'}},
	{col:{header:'包代号', width:100, sortable:true}, field:{name:'app_fun__pack_code',type:'string'}},
	{col:{header:'功能描述', width:265, sortable:true, hidden:true}, field:{name:'app_fun__fun_memo',type:'string'}},
	{col:{header:'应用包ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_fun__pack_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_fun__app_funid',type:'string'}},
	{col:{header:'上级功能id', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_fun__parent_funid',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'app_fun'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}