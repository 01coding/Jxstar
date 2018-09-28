Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataobjtype = Jxstar.findComboData('objtype');

	var cols = [
	{col:{header:'姓名/部门', width:224, sortable:true}, field:{name:'oa_docs_obj__obj_name',type:'string'}},
	{col:{header:'对象编号', width:100, sortable:true, hidden:true}, field:{name:'oa_docs_obj__obj_code',type:'string'}},
	{col:{header:'类型', width:100, sortable:true, align:'center',
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
		}}, field:{name:'oa_docs_obj__obj_type',type:'string'}},
	{col:{header:'权限类型', width:100, sortable:true, hidden:true}, field:{name:'oa_docs_obj__right_type',type:'string'}},
	{col:{header:'文件ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_docs_obj__docs_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_docs_obj__docs_objid',type:'string'}},
	{col:{header:'对象ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_docs_obj__obj_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'oa_docs_obj1'
	};
	
	config.param.hidePageTool = true;

	
		
	return new Jxstar.GridNode(config);
}