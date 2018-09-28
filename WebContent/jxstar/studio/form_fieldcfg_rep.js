Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datayesno = Jxstar.findComboData('yesno');
	var Datatablestate = Jxstar.findComboData('tablestate');
	var Datafdatatype = Jxstar.findComboData('fdatatype');
	var Datafieldtype = Jxstar.findComboData('fieldtype');
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
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'序号', name:'dm_fieldcfg__field_index', defaultval:'10', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:22},
					{xtype:'textfield', fieldLabel:'字段名称', name:'dm_fieldcfg__field_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:30},
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'长度', name:'dm_fieldcfg__data_size', defaultval:'50', anchor:'100%', maxLength:22},
					{xtype:'textfield', fieldLabel:'缺省值', name:'dm_fieldcfg__default_value', anchor:'100%', maxLength:20},
					{xtype:'hidden', fieldLabel:'字段ID', name:'dm_fieldcfg__field_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'emptybox'},
					{xtype:'textfield', fieldLabel:'字段标题', name:'dm_fieldcfg__field_title', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'小数位', name:'dm_fieldcfg__data_scale', anchor:'100%', maxLength:22},
					{xtype:'combo', fieldLabel:'必填?', name:'dm_fieldcfg__nullable', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datayesno
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datayesno[0][0]},
					{xtype:'hidden', fieldLabel:'表ID', name:'dm_fieldcfg__table_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'状态', name:'dm_fieldcfg__state', defaultval:'1',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datatablestate
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datatablestate[0][0]},
					{xtype:'combo', fieldLabel:'数据类型', name:'dm_fieldcfg__data_type', defaultval:'varchar',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datafdatatype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datafdatatype[0][0]},
					{xtype:'textfield', fieldLabel:'等同字段', name:'dm_fieldcfg__like_field', anchor:'100%', maxLength:30},
					{xtype:'combo', fieldLabel:'分类', name:'dm_fieldcfg__field_type', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datafieldtype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datafieldtype[0][0]}
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
					{xtype:'textarea', fieldLabel:'字段说明', name:'dm_fieldcfg__field_memo', anchor:'100%', height:120, maxLength:1000}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'dm_fieldcfg_rep'
	};

	
	
	
	return new Jxstar.FormNode(config);
}