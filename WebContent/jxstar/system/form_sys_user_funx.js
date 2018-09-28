Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
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
				columnWidth:0.99,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'功能名称', name:'fun_base__fun_name', readOnly:true, anchor:'100%', maxLength:50},
					{xtype:'textarea', fieldLabel:'数据权限SQL', name:'sys_user_funx__ext_sql', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:180, maxLength:500},
					{xtype:'hidden', fieldLabel:'功能ID', name:'sys_user_funx__fun_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'用户ID', name:'sys_user_funx__user_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'设置ID', name:'sys_user_funx__user_funx_id', anchor:'100%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'sys_user_funx'
	};

	
	
	
	return new Jxstar.FormNode(config);
}