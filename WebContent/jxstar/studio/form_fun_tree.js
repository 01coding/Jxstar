Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datanodecls = Jxstar.findComboData('nodecls');
	var Datacharflag = Jxstar.findComboData('charflag');
	var Datatreetype = Jxstar.findComboData('treetype');
	var items = [{
		border:false,
		layout:'form',
		autoHeight:true,
		cls:'x-form-main',
		items:[{
			anchor:'100%',
			border:false,
			layout:'column',
			baseCls:'xf-panel',
			iconCls:'x-tool-toggle', 
			title:'基础信息',
			collapsible:false,
			collapsed:false,
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'数据表', name:'fun_tree__table_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'节点ID字段', name:'fun_tree__node_id', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'节点名字段', name:'fun_tree__node_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'级别字段', name:'fun_tree__node_level', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'textarea', fieldLabel:'目标过滤条件', name:'fun_tree__right_where', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:60, maxLength:200},
					{xtype:'textfield', fieldLabel:'树形标题', name:'fun_tree__tree_title', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'hidden', fieldLabel:'树形ID', name:'fun_tree__tree_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'树形功能ID', name:'fun_tree__self_funid', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:25},
					{xtype:'textarea', fieldLabel:'WHERE子句', name:'fun_tree__self_where', anchor:'100%', height:60, maxLength:200},
					{xtype:'textfield', fieldLabel:'ORDER子句', name:'fun_tree__self_order', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'数据源名', name:'fun_tree__db_name', anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'节点附加值', name:'fun_tree__node_other', anchor:'100%', maxLength:100},
					{xtype:'checkbox', fieldLabel:'是否含本级', name:'fun_tree__has_level', defaultval:'0', disabled:false, anchor:'100%'},
					{xtype:'hidden', fieldLabel:'所属功能ID', name:'fun_tree__fun_id', anchor:'100%'}
				]
			}
			]
		},{
			anchor:'100%',
			border:false,
			layout:'column',
			baseCls:'xf-panel',
			iconCls:'x-tool-toggle', 
			title:'多级树信息',
			collapsible:false,
			collapsed:false,
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'树序号', name:'fun_tree__tree_no', defaultval:'1', anchor:'100%', maxLength:1},
					{xtype:'combo', fieldLabel:'节点样式', name:'fun_tree__node_style',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datanodecls
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datanodecls[0][0]},
					{xtype:'combo', fieldLabel:'树形组标志', name:'fun_tree__team_id', defaultval:'A',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datacharflag
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datacharflag[0][0]},
					{xtype:'textfield', fieldLabel:'叶标识字段', name:'fun_tree__leaf_col', anchor:'100%', maxLength:50}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'树类型', name:'fun_tree__tree_type', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datatreetype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datatreetype[0][0]},
					{xtype:'textfield', fieldLabel:'关联查询字段', name:'fun_tree__relat_col', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'父ID字段', name:'fun_tree__parent_col', anchor:'100%', maxLength:50},
					{xtype:'checkbox', fieldLabel:'不检查子级', name:'fun_tree__not_check', defaultval:'0', disabled:false, anchor:'100%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'fun_tree'
	};

	
	
	
	return new Jxstar.FormNode(config);
}