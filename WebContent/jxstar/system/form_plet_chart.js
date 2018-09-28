Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datacharttype = Jxstar.findComboData('charttype');
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
					{xtype:'textfield', fieldLabel:'图形名称', name:'plet_chart__chart_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50}
				]
			},{
				border:false,
				columnWidth:0.2888,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'图形类型', name:'plet_chart__chart_type',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datacharttype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datacharttype[0][0]},
					{xtype:'hidden', fieldLabel:'图形ID', name:'plet_chart__chart_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.2063,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'序号', name:'plet_chart__chart_index', anchor:'100%', maxLength:10}
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
					{xtype:'textarea', fieldLabel:'配置代码', name:'plet_chart__chart_option', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:420, maxLength:Number.MAX_VALUE}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'plet_chart'
	};

	
	
	
	return new Jxstar.FormNode(config);
}