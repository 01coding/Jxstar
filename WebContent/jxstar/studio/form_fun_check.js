Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datap_settype = Jxstar.findComboData('p_settype');
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
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'序号', name:'fun_check__check_no', defaultval:'1', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:22},
					{xtype:'combo', fieldLabel:'设置类型', name:'fun_check__set_type', defaultval:'1',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datap_settype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datap_settype[0][0]},
					{xtype:'hidden', fieldLabel:'功能标识', name:'fun_check__fun_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'状态', name:'fun_check__status', defaultval:'0',
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
					{xtype:'textfield', fieldLabel:'事件代号', name:'fun_check__event_code', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'hidden', fieldLabel:'检查项ID', name:'fun_check__check_id', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'检查项描述', name:'fun_check__check_name', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:90, maxLength:200},
					{xtype:'textarea', fieldLabel:'执行SQL', name:'fun_check__dest_sql', anchor:'100%', height:90, maxLength:500},
					{xtype:'textfield', fieldLabel:'类名', name:'fun_check__class_name', anchor:'100%', maxLength:200},
					{xtype:'textfield', fieldLabel:'方法名', name:'fun_check__method_name', anchor:'100%', maxLength:50}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'fun_check'
	};

	
	config.initpage = function(formNode){
		var event = formNode.event;
		var form = formNode.page.getForm();
		
		var setfield = function(form, d){
			var f1 = form.findField('fun_check__class_name');
            if (d) {f1.disable();} else {f1.enable();}
			var f2 = form.findField('fun_check__method_name');
            if (d) {f2.disable();} else {f2.enable();}
			var f3 = form.findField('fun_check__dest_sql');
            if (!d) {f3.disable();} else {f3.enable();}
		};
		
		//如果设置类型为类，则SQL设置字段不能编辑，否则类设置字段不能编辑
		var settype = form.findField('fun_check__set_type');
		settype.on('select', function(field){
			var d = (field.getValue() == '1');
			setfield(form, d);
		});
		
		//设置字段可编辑状态
		event.initOther = function() {
			var form = formNode.page.getForm();
			var settype = form.findField('fun_check__set_type');
			var d = (settype.getValue() == '1');
			setfield(form, d);
		};
		
		//检查必须设置类或SQL
		event.on('beforesave', function(event) {
			var form = event.form;
			var settype = form.get('fun_check__set_type');
			if (settype == '1') {
                if (form.get('fun_check__dest_sql').length == 0) {
					JxHint.alert(jx.bus.text4);//该检查项必须设置执行SQL！
					return false;
				}
			} else {
				if (form.get('fun_check__class_name').length == 0 || 
					form.get('fun_check__method_name').length == 0) {
					JxHint.alert(jx.bus.text3);//该检查项必须设置类名与方法名！
					return false;
				}
			}
			return true;
		});
        
        event.on('beforecreate', function(event) {
			var form = formNode.page.getForm();
			var pnid = formNode.parentNodeId;
            
			var ec = form.myGrid.selectEventCode||'';
            if (ec.length > 0) ec = ','+ec+',';
            form.findField('fun_check__event_code').setValue(ec);
            
        	return true;
		});
        
        JxUtil.delay(500, function(){
        	var fsql = form.findField('fun_check__dest_sql');
        	fsql.el.dom.setAttribute('placeholder', '必须是存储过程，如：{call proname(?, ?)} '+
                                     '参数就是两个?，第一个为输入参数，第二个为输出参数，都是字符串类型；'+
									 '输出值如果是："success"、"1"都表示执行成功，否则表示失败，输出值为失败信息；');
        	var fcls = form.findField('fun_check__class_name');
        	fcls.el.dom.setAttribute('placeholder', '需含完整包名，方法约定是两个参数：String keyId, RequestContext request');
        });
	};
	
	return new Jxstar.FormNode(config);
}