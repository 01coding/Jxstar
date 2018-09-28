Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'物资ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'store_indet__mat_id',type:'string'}},
	{col:{header:'入库单ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'store_indet__in_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'store_indet__indet_id',type:'string'}},
	{col:{header:'物资编码', width:129, sortable:true, editable:false,
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'store_mat__mat_code',type:'string'}},
	{col:{header:'*物资名称', width:181, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.ComboBox({
			maxLength:50, name:'store_mat__mat_name', 
			editable:true, hcss:'color:#0077FF;', allowBlank:false,
			triggerClass:'x-form-search-trigger', 
			listeners:{afterrender: function(combo) {
				JxSelect.initCombo('store_indet', combo, 'node_store_indet_editgrid');
			}}
		})}, field:{name:'store_mat__mat_name',type:'string'}},
	{col:{header:'型号', width:217, sortable:true, editable:false,
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'store_mat__mat_size',type:'string'}},
	{col:{header:'单位', width:67, sortable:true, editable:false,
		editor:new Ext.form.TextField({
			maxLength:10
		})}, field:{name:'store_mat__mat_unit',type:'string'}},
	{col:{header:'单价(元)', width:100, sortable:true, align:'right',
		editable:false,
		editor:new Ext.form.NumberField({
			maxLength:22
		}),renderer:JxUtil.formatMoney(2)}, field:{name:'store_mat__mat_price',type:'float'}},
	{col:{header:'*入库数量', width:100, sortable:true, align:'right',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.NumberField({
			maxLength:22, allowBlank:false
		}),renderer:JxUtil.formatNumber(2)}, field:{name:'store_indet__in_num',type:'float'}},
	{col:{header:'入库金额', width:100, sortable:true, align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			maxLength:22
		}),renderer:JxUtil.formatMoney(2)}, field:{name:'store_indet__in_money',type:'float'}},
	{col:{header:'货位', width:121, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'store_indet__local_code',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'store_indet'
	};
	
	config.param.notNullFields = 'store_mat__mat_name;store_indet__in_num;';
	config.param.substat = true;

	//config.param.average_fields = ['store_indet__in_num','store_mat__mat_price','store_indet__in_money'];
//config.param.hasQuery = false;

config.initpage = function(gridNode) {
    var grid = gridNode.page;
    
    var calu = function(record, field1, field2, field3) {
        var value = record.get(field1) * record.get(field2);
        record.set(field3, value);
    };

    //金额 = 数量 * 单价;
    grid.on('afteredit', function(e){
        if (e.field == 'store_indet__in_num') {
            calu(e.record, 'store_indet__in_num', 'store_mat__mat_price', 'store_indet__in_money');
        }
    });
};
		
	return new Jxstar.GridNode(config);
}