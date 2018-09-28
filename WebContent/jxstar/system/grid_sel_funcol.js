Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datadatatype = Jxstar.findComboData('datatype');

	var cols = [
	{col:{header:'字段代码', width:179, sortable:true}, field:{name:'fun_col__col_code',type:'string'}},
	{col:{header:'字段名称', width:121, sortable:true}, field:{name:'fun_col__col_name',type:'string'}},
	{col:{header:'数据类型', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datadatatype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datadatatype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datadatatype.length; i++) {
				if (Datadatatype[i][0] == value)
					return Datadatatype[i][1];
			}
		}}, field:{name:'fun_col__data_type',type:'string'}},
	{col:{header:'字段ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'fun_col__col_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'fun_col__fun_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '1',
		funid: 'sel_fun_col'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}