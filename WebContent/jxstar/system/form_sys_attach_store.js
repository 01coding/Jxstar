Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datafstore_path = Jxstar.findComboData('fstore_path');
	var Datafstore_type = Jxstar.findComboData('fstore_type');
	var Dataname_type = Jxstar.findComboData('name_type');
	var Datayesno = Jxstar.findComboData('yesno');
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
					{xtype:'textfield', fieldLabel:'附件库名称', name:'sys_attach_store__store_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'本地(远端)路径', name:'sys_attach_store__local_path', anchor:'100%', maxLength:100},
					{xtype:'combo', fieldLabel:'存储目录类型', name:'sys_attach_store__path_type', defaultval:'tn',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datafstore_path
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datafstore_path[0][0]},
					{xtype:'textfield', fieldLabel:'FTP地址', name:'sys_attach_store__ftp_ip', anchor:'100%', maxLength:100},
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'FTP端口', name:'sys_attach_store__ftp_port', anchor:'100%', maxLength:22},
					{xtype:'datefield', fieldLabel:'创建日期', name:'sys_attach_store__edit_date', defaultval:'fun_getToday()', format:'Y-m-d', anchor:'100%', readOnly:true},
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'序号', name:'sys_attach_store__store_no', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:22},
					{xtype:'hidden', fieldLabel:'附件库ID', name:'sys_attach_store__store_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'存储方式', name:'sys_attach_store__store_type', defaultval:'local',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datafstore_type
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datafstore_type[0][0]},
					{xtype:'combo', fieldLabel:'存储命名类型', name:'sys_attach_store__name_type', defaultval:'name',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataname_type
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataname_type[0][0]},
					{xtype:'combo', fieldLabel:'默认库?', name:'sys_attach_store__is_default', defaultval:'0',
						anchor:'100%', readOnly:true, editable:false,
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
					{xtype:'textfield', fieldLabel:'FTP用户', name:'sys_attach_store__ftp_user', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'FTP密码', name:'sys_attach_store__ftp_pwd', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'创建人', name:'sys_attach_store__edit_user', defaultval:'fun_getUserName()', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'combo', fieldLabel:'记录状态', name:'sys_attach_store__auditing', defaultval:'0',
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
					{xtype:'hidden', fieldLabel:'创建人ID', name:'sys_attach_store__edit_userid', defaultval:'fun_getUserId()', anchor:'100%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'sys_attach_store'
	};

	config.param.formWidth = '100%';

	
	
	return new Jxstar.FormNode(config);
}