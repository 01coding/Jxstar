	config.eventcfg = {
		baseWf: function(fileName) {
			var self = this;
			var records = self.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			
			var funId =  records[0].get('wf_task__fun_id');
			var dataId = records[0].get('wf_task__data_id');
			
			var appData = {funId:funId, dataId:dataId};
			JxUtil.showCheckWindow(appData, fileName);
		},

		takecheck: function() {
			var self = this;
			var records = self.grid.getSelectionModel().getSelections();
			if (!JxUtil.selected(records)) return;

			var funId = records[0].get('wf_task__fun_id');
			var hdcall = function() {
				var params = 'funid=wf_task&pagetype=chkgrid&eventcode=takecheck&check_funid='+ funId;
				for (var i = 0; i < records.length; i++) {
					var taskId = records[i].get('wf_task__task_id');
					var dataId = records[i].get('wf_task__data_id');
					params += '&taskid=' + taskId + '&keyid=' + dataId;
				}
				
				//填写任务取回标志
				var checkType = 'K', checkDesc = String.format(jx.event.takedesc, JxDefault.getUserName());	//该任务被【{0}】取回！
				params += '&check_type='+ checkType +'&check_desc='+ encodeURIComponent(checkDesc);
				
				var endcall = function(data) {
					//重新加载数据
					self.grid.getStore().reload();
				};
				
				Request.postRequest(params, endcall);
			};
			//确定取回选择的审批记录吗？
			Ext.Msg.confirm(jx.base.hint, jx.event.takeyes, function(btn) {
				if (btn == 'yes') hdcall();
			});
		}
	};