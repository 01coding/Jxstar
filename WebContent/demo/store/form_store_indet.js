Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
		var items = [{
		border:false,
		layout:'form',
		autoHeight:true,
		cls:'x-form-main',
		items:[{
			anchor:'100%',
			border:false,
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'物资编码', name:'store_mat__mat_code', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'型号', name:'store_mat__mat_size', readOnly:true, anchor:'100%', maxLength:50},
					{xtype:'numberfield', fieldLabel:'入库数量', name:'store_indet__in_num', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:22},
					{xtype:'numberfield', renderer:JxUtil.formatMoney(2), fieldLabel:'入库金额', name:'store_indet__in_money', anchor:'100%', maxLength:22},
					{xtype:'hidden', fieldLabel:'物资ID', name:'store_indet__mat_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'主键', name:'store_indet__indet_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'物资名称', name:'store_mat__mat_name',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:50, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', editable:true,
						listeners:{afterrender: function(combo) {
							JxSelect.initCombo('store_indet', combo, 'node_store_indet_form');
						}}},
					{xtype:'textfield', fieldLabel:'单位', name:'store_mat__mat_unit', readOnly:true, anchor:'100%', maxLength:10},
					{xtype:'numberfield', renderer:JxUtil.formatMoney(2), fieldLabel:'单价(元)', name:'store_mat__mat_price', readOnly:true, anchor:'100%', maxLength:22},
					{xtype:'textfield', fieldLabel:'货位', name:'store_indet__local_code', anchor:'100%', maxLength:20},
					{xtype:'hidden', fieldLabel:'入库单ID', name:'store_indet__in_id', anchor:'100%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'store_indet'
	};

	config.param.formWidth = '100%';

	
	
	return new Jxstar.FormNode(config);
}