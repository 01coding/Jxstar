Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataliketype = Jxstar.findComboData('liketype');

	var cols = [
	{col:{header:'WHERE子句', width:258, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:500
		})}, field:{name:'fun_colext__where_sql',type:'string'}},
	{col:{header:'*选择来源字段', width:145, sortable:true, defaultval:';', editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:200, allowBlank:false
		})}, field:{name:'fun_colext__source_cols',type:'string'}},
	{col:{header:'*选择目标字段', width:152, sortable:true, defaultval:';', editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:200, allowBlank:false
		})}, field:{name:'fun_colext__target_cols',type:'string'}},
	{col:{header:'WHERE参数类型', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:200
		})}, field:{name:'fun_colext__where_type',type:'string'}},
	{col:{header:'WHERE参数值', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:200
		})}, field:{name:'fun_colext__where_value',type:'string'}},
	{col:{header:'选择同名赋值', width:84, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'fun_colext__is_same',type:'string'}},
	{col:{header:'控件是否只读', width:67, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'fun_colext__is_readonly',type:'string'}},
	{col:{header:'是否可多选', width:75, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'fun_colext__is_moreselect',type:'string'}},
	{col:{header:'缺省显示数据', width:86, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'fun_colext__is_showdata',type:'string'}},
	{col:{header:'不允许重复值', width:89, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'fun_colext__is_repeatval',type:'string'}},
	{col:{header:'统计表名', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:100
		})}, field:{name:'fun_colext__stat_tables',type:'string'}},
	{col:{header:'统计字段', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:100
		})}, field:{name:'fun_colext__stat_col',type:'string'}},
	{col:{header:'统计外键', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'fun_colext__stat_fkcol',type:'string'}},
	{col:{header:'统计WHERE', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:200
		})}, field:{name:'fun_colext__stat_where',type:'string'}},
	{col:{header:'字段ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'fun_colext__col_id',type:'string'}},
	{col:{header:'字段扩展ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'fun_colext__colext_id',type:'string'}},
	{col:{header:'自定义呈现', width:100, sortable:true, hidden:true}, field:{name:'fun_colext__userender',type:'string'}},
	{col:{header:'自定义呈现JS', width:100, sortable:true, hidden:true}, field:{name:'fun_colext__customjs',type:'string'}},
	{col:{header:'智能查询字段', width:100, sortable:true, hidden:true}, field:{name:'fun_colext__query_field',type:'string'}},
	{col:{header:'匹配方式', width:100, sortable:true, hidden:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataliketype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataliketype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataliketype.length; i++) {
				if (Dataliketype[i][0] == value)
					return Dataliketype[i][1];
			}
		}}, field:{name:'fun_colext__like_type',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'fun_colext'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}