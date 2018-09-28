Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datayesno = Jxstar.findComboData('yesno');
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
					{xtype:'textfield', fieldLabel:'模板标识', name:'mail_template__template_tag', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:30},
					{xtype:'trigger', fieldLabel:'功能名称', name:'mail_template__fun_name',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:50, editable:false,
						onTriggerClick: function() {
							var selcfg = {"pageType":"combogrid", "nodeId":"sel_fun", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"", "targetField":"", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"1", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"","fieldName":"mail_template.fun_name"};
							JxSelect.createSelectWin(selcfg, this, 'node_mail_template_form');
						}},
					{xtype:'hidden', fieldLabel:'功能ID', name:'mail_template__fun_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'模板名称', name:'mail_template__template_name', anchor:'100%', maxLength:50},
					{xtype:'combo', fieldLabel:'默认模板', name:'mail_template__is_default', defaultval:'1',
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
					{xtype:'hidden', fieldLabel:'带附件', name:'mail_template__is_attach', defaultval:'0', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'模板ID', name:'mail_template__template_id', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'模板内容', name:'mail_template__template_cont', anchor:'100%', height:270, maxLength:Number.MAX_VALUE}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'mail_template'
	};

	JxFormSub.formAddSub(config);

	//修改控件类型
	var findcfg = function(items) {
		for (var i = items.length-1; i >= 0; i--) {
			if (items[i].name == 'mail_template__template_cont') {
				return items[i];
			} else {
				if (items[i].items && items[i].items.length > 0) {
					return findcfg(items[i].items);
				}
			}
		}
		return null;
	};
	var heitem = findcfg(items);
	if (heitem) {
		delete heitem.width;
		heitem.xtype = 'imghtmleditor';
		heitem.anchor = '100%';
		heitem.maxLength = 20000;
	}
	
	config.initpage = function(fn){
		var fe = fn.event;
		
		fe.on('initother', function(fe){
			var field = fe.form.findField('mail_template__template_cont');
			var value = field.getValue();
			value = value.replace(/'/g, '"');//防止数据修改提示
			field.originalValue = value;
		});
	};
	
	return new Jxstar.FormNode(config);
}