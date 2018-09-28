Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datafunreg_type = Jxstar.findComboData('funreg_type');
	var Dataauditv = Jxstar.findComboData('auditv');
	var Datashowform = Jxstar.findComboData('showform');
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
					{xtype:'textfield', fieldLabel:'功能名称', name:'fun_base__fun_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'功能标识', name:'fun_base__fun_id', readOnly:true, anchor:'100%', maxLength:25}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'功能序号', name:'fun_base__fun_index', anchor:'100%', maxLength:22}
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
				columnWidth:0.66,
				layout:'form',
				items:[
					{xtype:'trigger', fieldLabel:'布局页面', name:'fun_base__layout_page',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:100, editable:true,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"fun_layout", "layoutPage":"", "sourceField":"funall_layout.layout_path", "targetField":"fun_base.layout_page", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"0","queryField":"","likeType":"","fieldName":"fun_base.layout_page"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_sys_fun_base_form');
							}
							this.menu.show(this.el);
						}},
					{xtype:'textfield', fieldLabel:'GRID页面', name:'fun_base__grid_page', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'FORM页面', name:'fun_base__form_page', anchor:'100%', maxLength:100}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'注册类型', name:'fun_base__reg_type', defaultval:'main',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datafunreg_type
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datafunreg_type[0][0]},
					{xtype:'textfield', fieldLabel:'功能图标', name:'fun_base__icons_css', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'子功能ID', name:'fun_base__subfun_id', anchor:'100%', maxLength:300}
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
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'业务表名', name:'fun_base__table_name',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:50, editable:true,
						listeners:{afterrender: function(combo) {
							JxSelect.initCombo('sys_fun_base', combo, 'node_sys_fun_base_form');
						}}},
					{xtype:'trigger', fieldLabel:'功能主键', name:'fun_base__pk_col',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:50, editable:true,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"sel_field", "layoutPage":"", "sourceField":"v_field_info.col_code", "targetField":"fun_base.pk_col", "whereSql":"v_field_info.table_name = ?", "whereValue":"[fun_base.table_name]", "whereType":"string", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"0","queryField":"","likeType":"","fieldName":"fun_base.pk_col"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_sys_fun_base_form');
							}
							this.menu.show(this.el);
						}},
					{xtype:'trigger', fieldLabel:'记录状态列', name:'fun_base__audit_col',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:50, editable:true,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"sel_field", "layoutPage":"", "sourceField":"v_field_info.col_code", "targetField":"fun_base.audit_col", "whereSql":"v_field_info.table_name = ?", "whereValue":"[fun_base.table_name]", "whereType":"string", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"0","queryField":"","likeType":"","fieldName":"fun_base.audit_col"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_sys_fun_base_form');
							}
							this.menu.show(this.el);
						}},
					{xtype:'combo', fieldLabel:'有效记录值', name:'fun_base__valid_flag', defaultval:'1',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataauditv
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataauditv[0][0]},
					{xtype:'combo', fieldLabel:'审批界面类型', name:'fun_base__show_form',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datashowform
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datashowform[0][0]},
					{xtype:'checkbox', fieldLabel:'是否归档', name:'fun_base__is_archive', defaultval:'0', disabled:false, anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'编码前缀', name:'fun_base__code_prefix', anchor:'100%', maxLength:20},
					{xtype:'trigger', fieldLabel:'编码字段', name:'fun_base__code_col',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:50, editable:true,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"sel_field", "layoutPage":"", "sourceField":"v_field_info.col_code", "targetField":"fun_base.code_col", "whereSql":"v_field_info.table_name = ?", "whereValue":"[fun_base.table_name]", "whereType":"string", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"0","queryField":"","likeType":"","fieldName":"fun_base.code_col"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_sys_fun_base_form');
							}
							this.menu.show(this.el);
						}},
					{xtype:'trigger', fieldLabel:'复制列', name:'fun_base__copy_col',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:50, editable:true,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"sel_field", "layoutPage":"", "sourceField":"v_field_info.col_code", "targetField":"fun_base.copy_col", "whereSql":"v_field_info.table_name = ?", "whereValue":"[fun_base.table_name]", "whereType":"string", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"0","queryField":"","likeType":"","fieldName":"fun_base.copy_col"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_sys_fun_base_form');
							}
							this.menu.show(this.el);
						}},
					{xtype:'trigger', fieldLabel:'功能外键', name:'fun_base__fk_col',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:50, editable:true,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"sel_field", "layoutPage":"", "sourceField":"v_field_info.col_code", "targetField":"fun_base.fk_col", "whereSql":"v_field_info.table_name = ?", "whereValue":"[fun_base.table_name]", "whereType":"string", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"0","queryField":"","likeType":"","fieldName":"fun_base.fk_col"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_sys_fun_base_form');
							}
							this.menu.show(this.el);
						}},
					{xtype:'trigger', fieldLabel:'模块ID', name:'fun_base__module_id',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:25, editable:false,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {"pageType":"combogrid", "nodeId":"sys_module", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"funall_module.module_id", "targetField":"fun_base.module_id", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"","fieldName":"fun_base.module_id"};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_sys_fun_base_form');
							}
							this.menu.show(this.el);
						}},
					{xtype:'checkbox', fieldLabel:'用户信息', name:'fun_base__is_userinfo', defaultval:'1', disabled:false, anchor:'100%'},
					{xtype:'hidden', fieldLabel:'无租户查询', name:'fun_base__not_tenant', defaultval:'0', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'数据源名', name:'fun_base__ds_name', defaultval:'default', anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'必填子功能', name:'fun_base__val_subid', anchor:'100%', maxLength:200},
					{xtype:'textfield', fieldLabel:'缺省查询字段', name:'fun_base__first_field', anchor:'100%', maxLength:200},
					{xtype:'checkbox', fieldLabel:'初始显示', name:'fun_base__init_show', defaultval:'1', disabled:false, anchor:'100%'},
					{xtype:'checkbox', fieldLabel:'显示查询', name:'fun_base__is_query', defaultval:'1', disabled:false, anchor:'100%'},
					{xtype:'checkbox', fieldLabel:'表格编辑', name:'fun_base__isedit', defaultval:'0', disabled:false, anchor:'100%'},
					{xtype:'hidden', fieldLabel:'功能状态', name:'fun_base__fun_state', defaultval:'0', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'from子句', name:'fun_base__from_sql', anchor:'100%', height:60, maxLength:500},
					{xtype:'textarea', fieldLabel:'where子句', name:'fun_base__where_sql', anchor:'100%', height:120, maxLength:500},
					{xtype:'textarea', fieldLabel:'order子句', name:'fun_base__order_sql', anchor:'100%', height:60, maxLength:200},
					{xtype:'textarea', fieldLabel:'group子句', name:'fun_base__group_sql', anchor:'100%', height:60, maxLength:200}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'sys_fun_base'
	};

	config.param.formWidth = '100%';

	config.initpage = function(formNode){
		var event = formNode.event;
		
		//如果FROM_SQL值为空，在修改table_name时自动添加SQL
		var form = formNode.page.getForm();
		var tblField = form.findField('fun_base__table_name');
		tblField.on('change', function(field){
			var fs = form.findField('fun_base__from_sql').getValue();
			if (fs.length == 0) {
				form.set('fun_base__from_sql', 'from ' + tblField.getValue());
			}
		});
	};
	
	return new Jxstar.FormNode(config);
}