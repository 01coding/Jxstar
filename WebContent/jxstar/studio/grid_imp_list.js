Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataimptpltype = Jxstar.findComboData('imptpltype');

	var cols = [
	{col:{header:'序号', width:57, sortable:true, align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22
		}),renderer:JxUtil.formatInt()}, field:{name:'imp_list__imp_index',type:'int'}},
	{col:{header:'*功能标识', width:100, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TriggerField({
			maxLength:25,
			editable:false, allowBlank:false,
			triggerClass:'x-form-search-trigger', 
			onTriggerClick: function() {
				var selcfg = {"pageType":"combogrid", "nodeId":"sel_fun", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"fun_base.fun_id;fun_name", "targetField":"imp_list.fun_id;fun_name", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"","fieldName":"imp_list.fun_id"};
				JxSelect.createSelectWin(selcfg, this, 'node_imp_list_editgrid');
			}
		})}, field:{name:'imp_list__fun_id',type:'string'}},
	{col:{header:'功能名称', width:112, sortable:true, editable:false,
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'imp_list__fun_name',type:'string'}},
	{col:{header:'*模板文件', width:243, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:200, allowBlank:false
		})}, field:{name:'imp_list__tpl_file',type:'string'}},
	{col:{header:'*模板类型', width:99, sortable:true, defaultval:'xls', align:'center',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataimptpltype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Dataimptpltype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataimptpltype.length; i++) {
				if (Dataimptpltype[i][0] == value)
					return Dataimptpltype[i][1];
			}
		}}, field:{name:'imp_list__tpl_type',type:'string'}},
	{col:{header:'*新增SQL', width:323, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:2000, allowBlank:false
		})}, field:{name:'imp_list__insert_sql',type:'string'}},
	{col:{header:'定义ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'imp_list__imp_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'imp_list'
	};
	
	config.param.notNullFields = 'imp_list__insert_sql;imp_list__tpl_file;imp_list__fun_id;imp_list__tpl_type;';
	
	
		
	return new Jxstar.GridNode(config);
}