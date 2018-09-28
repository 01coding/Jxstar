Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataandor = Jxstar.findComboData('andor');

	var cols = [
	{col:{header:'序号', width:48, sortable:true, align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22
		}),renderer:JxUtil.formatInt()}, field:{name:'sys_role_data__data_no',type:'int'}},
	{col:{header:'左括弧', width:58, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:10
		})}, field:{name:'sys_role_data__left_brack',type:'string'}},
	{col:{header:'分类名称', width:147, sortable:true}, field:{name:'sys_datatype__dtype_name',type:'string'}},
	{col:{header:'权限字段', width:139, sortable:true}, field:{name:'sys_datatype__dtype_field',type:'string'}},
	{col:{header:'设置ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_role_data__role_data_id',type:'string'}},
	{col:{header:'角色功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_role_data__role_fun_id',type:'string'}},
	{col:{header:'数据权限ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_role_data__dtype_id',type:'string'}},
	{col:{header:'右括弧', width:52, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:10
		})}, field:{name:'sys_role_data__right_brack',type:'string'}},
	{col:{header:'运算关系', width:77, sortable:true, defaultval:'and', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataandor
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataandor[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataandor.length; i++) {
				if (Dataandor[i][0] == value)
					return Dataandor[i][1];
			}
		}}, field:{name:'sys_role_data__andor',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'sys_role_data'
	};
	
	
	config.eventcfg = {		
		dataImportParam: function() {
			var roleId = this.grid.fkValue;			var options = {				whereSql: 'dtype_id not in (select dtype_id from sys_role_data where role_fun_id = ?)',				whereValue: roleId,				whereType: 'string'			};			return options;		}		
	};
		
	return new Jxstar.GridNode(config);
}