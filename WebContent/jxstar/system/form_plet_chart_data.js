Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datachartdatatype = Jxstar.findComboData('chartdatatype');
	var Datachartdatasrc = Jxstar.findComboData('chartdatasrc');
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
					{xtype:'textfield', fieldLabel:'参数标题', name:'plet_chart_data__param_title', anchor:'100%', maxLength:50},
					{xtype:'combo', fieldLabel:'SQL返回值类型', name:'plet_chart_data__data_type', defaultval:'number',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datachartdatatype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datachartdatatype[0][0]},
					{xtype:'hidden', fieldLabel:'主键', name:'plet_chart_data__chart_data_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'参数名称', name:'plet_chart_data__param_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'combo', fieldLabel:'来源类型', name:'plet_chart_data__param_type', defaultval:'sql',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datachartdatasrc
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datachartdatasrc[0][0]},
					{xtype:'hidden', fieldLabel:'图表ID', name:'plet_chart_data__chart_id', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'SQL|类|常量值', name:'plet_chart_data__param_sql', anchor:'100%', height:150, maxLength:1000},
					{xtype:'textfield', fieldLabel:'WHERE参数值', name:'plet_chart_data__where_value', anchor:'100%', maxLength:200},
					{xtype:'textfield', fieldLabel:'WHERE参数类型', name:'plet_chart_data__where_type', anchor:'100%', maxLength:50}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'plet_chart_data'
	};

	config.param.formWidth = '100%';

	
	
	return new Jxstar.FormNode(config);
}