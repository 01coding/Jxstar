Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datayesno = Jxstar.findComboData('yesno');

	var cols = [
	{col:{header:'注销', width:100, sortable:true, align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datayesno
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datayesno[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datayesno.length; i++) {
				if (Datayesno[i][0] == value)
					return Datayesno[i][1];
			}
		}}, field:{name:'bos_package_use__is_cancel',type:'string'}},
	{col:{header:'租户名称', width:195, sortable:true}, field:{name:'bos_tenant__tenant_name',type:'string'}},
	{col:{header:'开始日期', width:178, sortable:true, align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.DateField({
			format: 'Y-m-d',
			minValue: '1900-01-01'
		}),
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'bos_package_use__start_date',type:'date'}},
	{col:{header:'结束日期', width:169, sortable:true, align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.DateField({
			format: 'Y-m-d',
			minValue: '1900-01-01'
		}),
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'bos_package_use__end_date',type:'date'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_package_use__pack_use_id',type:'string'}},
	{col:{header:'功能包ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_package_use__pack_id',type:'string'}},
	{col:{header:'租户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_package_use__bos_tenant_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'bos_package_use'
	};
	
	
	config.eventcfg = {		
    dataImportParam: function() {
        var packId = this.grid.fkValue;

        var options = {
            whereSql: 'bos_tenant_id not in (select bos_tenant_id from bos_package_use where pack_id = ?)',
            whereValue: packId,
            whereType: 'string'
        };
        return options;
    }
}
		
	return new Jxstar.GridNode(config);
}