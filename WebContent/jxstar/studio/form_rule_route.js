Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Dataregstatus = Jxstar.findComboData('regstatus');
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
					{xtype:'textfield', fieldLabel:'序号', name:'fun_rule_route__route_no', defaultval:'1', anchor:'53%', maxLength:10},
					{xtype:'textfield', fieldLabel:'来源功能ID', name:'fun_rule_route__src_funid', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:25},
					{xtype:'textfield', fieldLabel:'目标功能ID', name:'fun_rule_route__fun_id', readOnly:true, anchor:'100%', maxLength:25},
					{xtype:'hidden', fieldLabel:'路由ID', name:'fun_rule_route__route_id', anchor:'59%'},
					{xtype:'hidden', fieldLabel:'参数类型', name:'fun_rule_route__where_type', anchor:'59%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'emptybox'},
					{xtype:'trigger', fieldLabel:'导入布局', name:'fun_rule_route__layout_page',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:100, editable:true,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"fun_layout", "layoutPage":"", "sourceField":"funall_layout.layout_path", "targetField":"fun_rule_route.layout_page", "whereSql":"layout_path like '%tree%' or layout_path like '%layout_main.%'", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"0","queryField":"","likeType":"","fieldName":"fun_rule_route.layout_page"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_rule_route_form');
							}
							this.menu.show(this.el);
						}},
					{xtype:'combo', fieldLabel:'状态', name:'fun_rule_route__status', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataregstatus
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataregstatus[0][0]},
					{xtype:'hidden', fieldLabel:'页面参数名', name:'fun_rule_route__where_value', anchor:'57%'}
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
					{xtype:'textarea', fieldLabel:'来源功能Where', name:'fun_rule_route__where_sql', anchor:'100%', height:90, maxLength:500}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'rule_route'
	};

	
	
	
	return new Jxstar.FormNode(config);
}