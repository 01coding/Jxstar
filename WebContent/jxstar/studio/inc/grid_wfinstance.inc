	config.eventcfg = {
		baseWf: function(fileName) {
			var self = this;
			var records = self.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			
			var funId =  records[0].get('wf_instance__fun_id');
			var dataId = records[0].get('wf_instance__data_id');
			
			var appData = {funId:funId, dataId:dataId};
			JxUtil.showCheckWindow(appData, fileName);
		},
		
		//强制退回编辑人
		returnEdit: function(){
			var self = this;
			var ctype = 'E';//退回编辑人
			var records = self.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			
			var e = encodeURIComponent;
			var desc = String.format('该任务被【{0}】强制退回编辑！', JxDefault.getUserName());
			//执行后台请求
			var params = 'funid=wf_assign&pagetype=chkgrid&eventcode=execheck'+
						 '&check_type='+ ctype +'&check_desc='+ e(desc);
			
			var cfunid = records[0].get('wf_instance__fun_id');
			var dataid = records[0].get('wf_instance__data_id');
			params += '&check_funid='+ cfunid +'&keyid='+ dataid;
			params += '&isforce=1';//是强制退回，不判断当前人是否有审批任务
			
			//强制退回后刷新数据
			var hdcall = function() {
				self.grid.getStore().reload();
			};
			
			Request.postRequest(params, hdcall);
		}
	};
	

	config.initpage = function(gridNode){
		var event = gridNode.event;
		event.on('beforecustom', function(ge) {
			var records = ge.grid.getSelectionModel().getSelections();
			
			for (var i = 0; i < records.length; i++) {
				var state = records[i].get('wf_instance__run_state');
				if (state.length > 0 && state != '4') {
					JxHint.alert(jx.bus.text13);//您选择的过程实例不是挂起状态，不能操作！
					return false;
				}
			}
		});
	};
