/**
 * 查看任务实例界面。
 **/
Jxstar.currentPage = {
	//当前应用数据信息
	appData: null,
	
	/**
	* public 显示查看任务实例的对话框
	* appData -- 应用数据，包含参数：
	*	funId -- 功能ID
	*	dataId -- 数据ID
	**/
	showWindow: function(appData) {
		var self = this;
		self.appData = appData;
		self.showGrid(appData.funId, appData.dataId);
	},
	
	/**
	* private 创建对话框
	**/
	createWindow: function(grid) {
		var self = this;
		
		//创建对话框
		var win = new Ext.Window({
			title:'查看任务实例',
			layout:'fit',
			width:750,
			height:400,
			resizable: false,
			modal: true,
			border: false,
			closeAction:'close',
			items:[grid]
		});
		win.show();
	},
	
	/**
	* private 显示当前功能的任务实例
	* funId
	**/
	showGrid: function(funId, dataId) {
		var self = this;
		var define = Jxstar.findNode('wf_task');
		
		var hdCall = function(f) {
			var page = f();
			if (typeof page.showPage == 'function') {
				page = page.showPage('chkgrid');
			}
			//显示对话框
			self.createWindow(page);
			//显示当前记录的任务分配
			var whereSql = 'wf_task.fun_id = ?';
			var whereValue = funId;
			var whereType = 'string';
			if (dataId && dataId.length > 0) {
				whereSql += ' and wf_task.data_id = ?';
				whereType += ';string';
				whereValue += ';'+dataId;
			}
			Jxstar.loadData(page, {where_sql:whereSql, where_value:whereValue, where_type:whereType});
		};

		//加载任务分配的gridpage
		Request.loadJS(define.gridpage, hdCall);
	}
	
};