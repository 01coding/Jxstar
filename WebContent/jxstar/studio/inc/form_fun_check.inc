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