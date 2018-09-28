Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Dataaudit = Jxstar.findComboData('audit');
	var items = [{
		border:false,
		layout:'form',
		autoHeight:true,
		cls:'x-form-main',
		items:[{
			baseCls:'xf-panel',
			iconCls:'x-tool-toggle', 
			title:'基础信息',
			collapsible:false,
			collapsed:false,
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
					{xtype:'textfield', fieldLabel:'包代号', name:'app_package__pack_code', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'包名称', name:'app_package__pack_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'发布路径', name:'app_package__pack_path', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'hidden', fieldLabel:'包级别', name:'app_package__pack_level', defaultval:'1', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'包类型', name:'app_package__pack_type', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'应用包ID', name:'app_package__pack_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'checkbox', fieldLabel:'自动升级？', name:'app_package__auto_up', defaultval:'0', disabled:false, anchor:'100%'},
					{xtype:'combo', fieldLabel:'栏目', name:'app_package__bar_code',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:20, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', editable:true,
						listeners:{afterrender: function(combo) {
							JxSelect.initCombo('app_package', combo, 'node_app_package_form');
						}}},
					{xtype:'combo', fieldLabel:'状态', name:'app_package__auditing',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataaudit
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataaudit[0][0]},
					{xtype:'hidden', fieldLabel:'序号', name:'app_package__pack_index', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'栏目ID', name:'app_package__bar_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'包图标', name:'app_package__pack_icon', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'包描述', name:'app_package__pack_memo', anchor:'100%', height:60, maxLength:200}
				]
			}
			]
		}]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'app_package'
	};

	config.param.formWidth = '100%';

	
	
	return new Jxstar.FormNode(config);
}