Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datashowmode = Jxstar.findComboData('showmode');
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
					{xtype:'textfield', fieldLabel:'功能ID', name:'rpt_drill__fun_id', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:25},
					{xtype:'combo', fieldLabel:'显示方式', name:'rpt_drill__show_mode', defaultval:'win',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datashowmode
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datashowmode[0][0]}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'钻取字段', name:'rpt_drill__use_field', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50}
				]
			}
			]
		},{
			anchor:'100%',
			border:false,
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.99,
				layout:'form',
				items:[
					{xtype:'textarea', fieldLabel:'显示WhereSql', name:'rpt_drill__where_sql', anchor:'100%', height:90, maxLength:400},
					{xtype:'textfield', fieldLabel:'显示WhereType', name:'rpt_drill__where_type', anchor:'100%', maxLength:200},
					{xtype:'textfield', fieldLabel:'显示WhereValue', name:'rpt_drill__where_value', anchor:'100%', maxLength:200},
					{xtype:'hidden', fieldLabel:'主键', name:'rpt_drill__drill_id', anchor:'45%'},
					{xtype:'hidden', fieldLabel:'区域ID', name:'rpt_drill__area_id', anchor:'45%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'rpt_drill'
	};

	
	
	
	return new Jxstar.FormNode(config);
}