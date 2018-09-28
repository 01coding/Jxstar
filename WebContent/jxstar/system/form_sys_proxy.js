Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Dataaudit = Jxstar.findComboData('audit');
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
					{xtype:'combo', fieldLabel:'记录状态', name:'sys_proxy__auditing',
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
					{xtype:'trigger', fieldLabel:'代理人账号', name:'sys_proxy__user_code',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:20, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', editable:false,
						onTriggerClick: function() {
							var selcfg = {"pageType":"combogrid", "nodeId":"sys_user", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"sys_user.user_code;user_name;user_id", "targetField":"sys_proxy.user_code;user_name;user_id", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"all","fieldName":"sys_proxy.user_code"};
							JxSelect.createSelectWin(selcfg, this, 'node_sys_proxy_form');
						}},
					{xtype:'trigger', fieldLabel:'被代理人账号', name:'sys_proxy__to_user_code',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:20, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', editable:false,
						onTriggerClick: function() {
							var selcfg = {"pageType":"combogrid", "nodeId":"sys_user", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"sys_user.user_code;user_name;user_id", "targetField":"sys_proxy.to_user_code;to_user_name;to_user_id", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"all","fieldName":"sys_proxy.to_user_code"};
							JxSelect.createSelectWin(selcfg, this, 'node_sys_proxy_form');
						}},
					{xtype:'datefield', fieldLabel:'代理开始日期', name:'sys_proxy__start_date', format:'Y-m-d', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%'},
					{xtype:'textfield', fieldLabel:'设置人', name:'sys_proxy__set_user', defaultval:'fun_getUserName()', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'hidden', fieldLabel:'代理人ID', name:'sys_proxy__user_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'主键', name:'sys_proxy__proxy_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'datefield', fieldLabel:'设置日期', name:'sys_proxy__set_date', defaultval:'fun_getToday()', format:'Y-m-d', anchor:'100%', readOnly:true},
					{xtype:'textfield', fieldLabel:'代理人', name:'sys_proxy__user_name', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'被代理人', name:'sys_proxy__to_user_name', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'datefield', fieldLabel:'代理结束日期', name:'sys_proxy__end_date', format:'Y-m-d', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'被代理人ID', name:'sys_proxy__to_user_id', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'设置说明', name:'sys_proxy__set_memo', anchor:'100%', height:90, maxLength:200}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'sys_proxy'
	};

	
	
	
	return new Jxstar.FormNode(config);
}