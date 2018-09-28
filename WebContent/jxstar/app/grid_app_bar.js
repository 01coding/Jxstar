Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataappbartype = Jxstar.findComboData('appbartype');

	var cols = [
	{col:{header:'*栏目代号', width:100, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'app_bar__bar_code',type:'string'}},
	{col:{header:'*栏目名称', width:100, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'app_bar__bar_name',type:'string'}},
	{col:{header:'栏目类型', width:100, sortable:true, align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataappbartype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataappbartype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataappbartype.length; i++) {
				if (Dataappbartype[i][0] == value)
					return Dataappbartype[i][1];
			}
		}}, field:{name:'app_bar__bar_type',type:'string'}},
	{col:{header:'显示序号', width:70, sortable:true, align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22
		}),renderer:JxUtil.formatInt()}, field:{name:'app_bar__bar_index',type:'int'}},
	{col:{header:'栏目图标', width:186, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'app_bar__pack_icon',type:'string'}},
	{col:{header:'界面URL', width:273, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:100
		})}, field:{name:'app_bar__page_url',type:'string'}},
	{col:{header:'栏目描述', width:290, sortable:true, hidden:true}, field:{name:'app_bar__bar_memo',type:'string'}},
	{col:{header:'栏目id', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_bar__bar_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'app_bar'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}