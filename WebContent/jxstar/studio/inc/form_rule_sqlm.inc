	config.initpage = function(formNode){
		var event = formNode.event;
		
		event.on('beforecreate', function(event) {
			var form = formNode.page.getForm();
			var pnid = formNode.parentNodeId;
			//取设置SQL的功能ID
			var srcfunid = '', destfunid = '';
			//“数据导入”设置目标功能ID
            var srcfield = 'fun_rule_sql__src_funid';
			var destfield = 'fun_rule_sql__dest_funid';
            var eventfield = 'fun_rule_sql__event_code';
			if (pnid == 'rule_route') {
				var pg = JxUtil.getParentGrid(form.myGrid);
				if (pg) {
					var records = pg.getSelectionModel().getSelections();
					if (records.length > 0) {
						srcfunid = records[0].get('fun_rule_route__src_funid');
                        destfunid = records[0].get('fun_rule_route__fun_id');
					}
                    form.findField(srcfield).setValue(srcfunid);
                    form.findField(destfield).setValue(destfunid);
                    form.findField(eventfield).setValue(',import,');
				}
			} else {
				srcfunid = form.myGrid.selectFunId;
                form.findField(srcfield).setValue(srcfunid);
                form.findField(destfield).setValue(srcfunid);
                var ec = form.myGrid.selectEventCode||'';
                if (ec.length > 0) ec = ','+ec+',';
                form.findField(eventfield).setValue(ec);
			}
		});
		
		event.initOther = function() {
			var form = formNode.page.getForm();
			var pnid = formNode.parentNodeId;
            //反馈SQL必须把来源ID设置为不可编辑，因为是作为过滤条件用
            var srcfield = 'fun_rule_sql__src_funid';
			if (pnid != 'rule_route') {
                form.findField(srcfield).disable();
            }
		};
	};