	config.initpage = function(formNode){
		var event = formNode.event;
		
		//关闭问题时检查必填项
		event.on('beforecustom', function(event) {
			var form = event.form;
			if (!form.isValid()) {
				JxHint.alert(jx.event.datavalid);	//'请确保输入的数据正确完整！'
				return false;
			}
			var que_status = form.get('sys_question__que_status');
			if (que_status > '7') { 
				JxHint.alert(jx.bus.text35);//'问题已经完成或已否决，不能提交！'
				return false;
			}
			
			var done_type = form.get("sys_question__done_type");
			if (done_type == '2') {
				JxHint.alert(jx.bus.text36);//'处理必须是已经完成或已否决，才能提交！'
				return false;
			}
			
			return true;
		});
		
		event.on('aftercustom', function(fe) {
			var page = fe.page;
			var tab = page.ownerCt.ownerCt;
			var tab1 = tab.getComponent(0);
			tab.activate(tab1);
			
			var grid = tab1.getComponent(0);
			grid.getStore().reload();
		});
	};
	
	config.eventcfg = {
		//初始化页面数据
		initOther : function() {
			var myform = this.form;

			var done_type = myform.get("sys_question__done_type");
			if (done_type == null || done_type.length == 0) {
				myform.set("sys_question__done_type", '2');
			}
			var start_date = myform.get("sys_question__start_date");
			if (start_date == null || start_date.length == 0) {
				myform.set("sys_question__start_date", JxDefault.getToday());
			}
			
			var username = myform.get("sys_question__done_user");
			if (username == null || username.length == 0) {
				myform.set("sys_question__done_user", JxDefault.getUserName());
				myform.set("sys_question__done_userid", JxDefault.getUserId());
			}
			/*
			var que_status = myform.get("sys_question__que_status");
			var readOnly = (que_status != '1');
			JxUtil.readOnlyForm(myform, readOnly);
			JxUtil.disableButton(this.page.getTopToolbar(), readOnly);*/
		}
	};