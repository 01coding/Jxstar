Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataobjtype = Jxstar.findComboData('objtype');

	var cols = [
	{col:{header:'对象编号', width:100, sortable:true, hidden:true}, field:{name:'oa_news_obj__obj_code',type:'string'}},
	{col:{header:'名称', width:344, sortable:true}, field:{name:'oa_news_obj__obj_name',type:'string'}},
	{col:{header:'类型', width:147, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataobjtype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataobjtype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataobjtype.length; i++) {
				if (Dataobjtype[i][0] == value)
					return Dataobjtype[i][1];
			}
		}}, field:{name:'oa_news_obj__obj_type',type:'string'}},
	{col:{header:'不关注', width:100, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'oa_news_obj__not_show',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_news_obj__obj_detid',type:'string'}},
	{col:{header:'新闻ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_news_obj__news_id',type:'string'}},
	{col:{header:'对象ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_news_obj__obj_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'oa_news_obj'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}