Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Dataliketype = Jxstar.findComboData('liketype');
	var items = [{
		border:false,
		layout:'form',
		autoHeight:true,
		cls:'x-form-main',
		items:[{
			baseCls:'xf-panel',
			iconCls:'x-tool-toggle', 
			title:'选择窗口',
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
					{xtype:'checkbox', fieldLabel:'选择同名赋值', name:'fun_colext__is_same', defaultval:'1', disabled:false, anchor:'100%'},
					{xtype:'checkbox', fieldLabel:'是否可多选', name:'fun_colext__is_moreselect', defaultval:'0', disabled:false, anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'checkbox', fieldLabel:'控件是否只读', name:'fun_colext__is_readonly', defaultval:'1', disabled:false, anchor:'100%'},
					{xtype:'checkbox', fieldLabel:'不允许重复值', name:'fun_colext__is_repeatval', defaultval:'0', disabled:false, anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'WHERE子句', name:'fun_colext__where_sql', anchor:'100%', height:60, maxLength:500},
					{xtype:'textfield', fieldLabel:'WHERE参数值', name:'fun_colext__where_value', anchor:'100%', maxLength:200},
					{xtype:'textfield', fieldLabel:'WHERE参数类型', name:'fun_colext__where_type', anchor:'100%', maxLength:200},
					{xtype:'textfield', fieldLabel:'选择来源字段', name:'fun_colext__source_cols', defaultval:';', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:200},
					{xtype:'textfield', fieldLabel:'选择目标字段', name:'fun_colext__target_cols', defaultval:';', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:200},
					{xtype:'hidden', fieldLabel:'缺省显示数据', name:'fun_colext__is_showdata', defaultval:'1', anchor:'28%'},
					{xtype:'hidden', fieldLabel:'字段ID', name:'fun_colext__col_id', anchor:'28%'},
					{xtype:'hidden', fieldLabel:'字段扩展ID', name:'fun_colext__colext_id', anchor:'28%'}
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
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'智能查询字段', name:'fun_colext__query_field', anchor:'100%', maxLength:100}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'匹配方式', name:'fun_colext__like_type', defaultval:'all',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataliketype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataliketype[0][0]}
				]
			}
			]
		}]
		},{
			anchor:'100%',
			border:false,
			layout:'column',
			baseCls:'xf-panel',
			iconCls:'x-tool-toggle', 
			title:'统计子表值',
			collapsible:false,
			collapsed:false,
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.99,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'统计表名', name:'fun_colext__stat_tables', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'统计外键', name:'fun_colext__stat_fkcol', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'统计字段', name:'fun_colext__stat_col', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'统计WHERE', name:'fun_colext__stat_where', anchor:'100%', maxLength:200}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'fun_colext'
	};

	
	
	
	return new Jxstar.FormNode(config);
}