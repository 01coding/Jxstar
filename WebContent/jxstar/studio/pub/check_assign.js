/**
 * 查看任务分配界面。
 **/
Jxstar.currentPage = {
	//当前应用数据信息
	appData: null,
	
	/**
	* public 显示任务分配对话框，JxUtil.showCheckAssign中调用。
	* appData -- 应用数据，包含参数：
	*	funId -- 功能ID
	*	dataId -- 数据ID
	**/
	showWindow: function(appData) {
		var self = this;
		self.appData = appData;
		
		var hdCall = function(taskData) {
			var taskIds = taskData.taskIds;
			if (taskIds.length == 0) {//'任务已经执行完成，没有待办任务分配记录！'
				JxHint.alert(jx.wf.taskend);
				return;
			}
			
			self.showAssignGrid(taskIds);
		};
		
		//从后台查询任务信息
		var params = 'funid=wf_assign&pagetype=chkgrid&eventcode=querytask';
		params += '&check_funid='+ appData.funId +'&keyid='+ appData.dataId;
		Request.dataRequest(params, hdCall);
	},
	
	/**
	* private 创建对话框
	* assignGrid -- 显示任务分配表格
	**/
	createWindow: function(assignGrid) {
		var self = this;
		
		//创建对话框
		var win = new Ext.Window({
			title:jx.wf.qryass,		//'查看任务分配'
			layout:'fit',
			width:650,
			height:400,
			resizable: false,
			modal: true,
			border: false,
			closeAction:'close',
			items:[assignGrid],

			buttons: [{
				width: 100,
				text:jx.wf.qryhis,	//'查看历史审批'
				handler:function(){
					JxUtil.showCheckWindow(self.appData, 'check_his');
					win.close();
				}
			},{
				width: 100,
				text:jx.wf.qrymap,	//'查看流程图'
				handler:function(){
					JxUtil.showCheckWindow(self.appData, 'check_map');
					win.close();
				}
			},{
				text:jx.base.ok,	//'确定'
				handler:function(){win.close();}
			}]
		});
		win.show();
	},
	
	/**
	* private 显示任务分配的grid
	* taskIds -- 任务ID子句
	**/
	showAssignGrid: function(taskIds) {
		var self = this;
		var assignDefine = Jxstar.findNode('wf_assignq');
		
		var hdCall = function(f) {
			var page = f();
			var isEdit = Jxstar.systemVar.wf__assign__edit || '';
			if (typeof page.showPage == 'function') {
				if (isEdit != '1') {//任务分配人不可以编辑
					page.selectModel = 'row';
					page = page.showPage('notoolgrid');
					page.on('beforeedit', function(event) {return false;});
				} else {
					page = page.showPage();
				}
			}
			//显示对话框
			self.createWindow(page);
			
			//添加隔符
			taskIds = taskIds.replace(/,/g, '\',\'');
			
			//显示当前记录的任务分配
			var whereSql = 'wf_task.task_id in (\'' + taskIds + '\')';
			var whereValue = '';
			var whereType = '';
			Jxstar.loadData(page, {where_sql:whereSql, where_value:whereValue, where_type:whereType});
		};
		//加载任务分配的gridpage
		Request.loadJS(assignDefine.gridpage, hdCall);
	}
	
};