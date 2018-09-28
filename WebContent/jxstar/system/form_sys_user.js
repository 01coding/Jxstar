Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datausersex = Jxstar.findComboData('usersex');
	var Datatenstate = Jxstar.findComboData('tenstate');
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
			title:'设置头像',
			collapsible:false,
			collapsed:false,
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.7425,
				layout:'form',
				items:[
					{xtype:'imagefield', fieldLabel:'头像', name:'sys_user__user_photo', anchor:'100%', height:120, maxLength:50}
				]
			}
			]
		},{
			anchor:'100%',
			border:false,
			layout:'column',
			baseCls:'xf-panel',
			iconCls:'x-tool-toggle', 
			title:'基本信息',
			collapsible:false,
			collapsed:false,
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.7425,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'账号', name:'sys_user__user_code', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'姓名', name:'sys_user__user_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:20},
					{xtype:'combo', fieldLabel:'性别', name:'sys_user__sex',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datausersex
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datausersex[0][0]}
				]
			}
			]
		},{
			anchor:'100%',
			border:false,
			layout:'column',
			baseCls:'xf-panel',
			iconCls:'x-tool-toggle', 
			title:'联系方式',
			collapsible:false,
			collapsed:false,
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.7425,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'手机号码', name:'sys_user__mob_code', anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'固定电话', name:'sys_user__phone_code', anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'邮箱', name:'sys_user__email', anchor:'100%', maxLength:50}
				]
			}
			]
		},{
			anchor:'100%',
			border:false,
			layout:'column',
			baseCls:'xf-panel',
			iconCls:'x-tool-toggle', 
			title:'其他信息',
			collapsible:false,
			collapsed:false,
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.7425,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'职务', name:'sys_user__duty', anchor:'100%', maxLength:50},
					{xtype:'trigger', fieldLabel:'所属部门', name:'sys_dept__dept_name',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:100, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', editable:false,
						onTriggerClick: function() {
							var selcfg = {"pageType":"combogrid", "nodeId":"sys_dept", "layoutPage":"/public/layout/layout_tree.js", "sourceField":"sys_dept.dept_name;dept_id", "targetField":"sys_dept.dept_name;sys_user.dept_id", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"","fieldName":"sys_dept.dept_name"};
							JxSelect.createSelectWin(selcfg, this, 'node_sys_user_form');
						}},
					{xtype:'combo', fieldLabel:'账号激活', name:'sys_user__auditing', defaultval:'1',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datatenstate
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datatenstate[0][0]},
					{xtype:'textarea', fieldLabel:'备注', name:'sys_user__memo', anchor:'100%', height:90, maxLength:200},
					{xtype:'hidden', fieldLabel:'用户ID', name:'sys_user__user_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'人员注销', name:'sys_user__is_novalid', defaultval:'0', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'leader?', name:'sys_user__is_leader', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'部门ID', name:'sys_user__dept_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'头像版本号', name:'sys_user__user_photo_v', anchor:'65%'},
					{xtype:'hidden', fieldLabel:'IM账号', name:'sys_user__im_user_code', anchor:'65%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'sys_user'
	};

	config.param.labelWidth = 120;

	config.param.items[0].style = 'padding:10px 0;margin:0 auto;';

    var findItem = function(items, name) {
        var item = null;
        var findv = function(items, name) {
            if (item) return;
            for (var i = 0; i < items.length; i++) {
                if (items[i].items) {
                    findv(items[i].items, name);
                } else {
                    if (items[i].name == name) {
                        item = items[i];
                        return item;
                    }
                }
            }
        };
        findv(items, name);
        return item;
    };
	//修改图像控件属性
    var item = findItem(items, 'sys_user__user_photo');
    delete item.anchor;
	item.image_small_use = '1';
	item.image_small_size ='120';
	item.createcode = 'createPhoto';
	item.deletecode = 'deletePhoto';
    item.fieldLabel = '上传图片，仅支持JPG、PNG图片文件，且文件小于2M';
    item.width = 180;
    item.height = 210;

	config.initpage = function(formNode){
		var page = formNode.page;
		var event = formNode.event;
        var form = page.getForm();
		
		event.on('initother', function(fe){
        	form.findField('sys_user__user_code').setReadOnly(true);
        	form.findField('sys_user__user_name').setReadOnly(true);
        	form.findField('sys_dept__dept_name').setReadOnly(true);
		});
	};
	
	return new Jxstar.FormNode(config);
}