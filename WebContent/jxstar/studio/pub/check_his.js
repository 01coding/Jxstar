/**
 * 查看审批历史界面。
 **/
Jxstar.currentPage = {
	//当前应用数据信息
	appData: null,
	
	/**
	* public 显示历史审批对话框，JxUtil.showCheckHis中调用。
	* appData -- 应用数据，包含参数：
	*	funId -- 功能ID
	*	dataId -- 数据ID
	**/
	showWindow: function(appData) {
		var self = this;
		self.appData = appData;
		
		self.showCheckHis(appData.funId, appData.dataId);
	},
	
	/**
	* private 创建对话框
	* hisGrid -- 显示历史审批表格
	**/
	createWindow: function(hisGrid) {
		var self = this;
		
		//创建对话框
		var win = new Ext.Window({
			title:jx.wf.qryhis,		//'查看历史审批'
			layout:'fit',
			width:650,
			height:400,
			resizable: false,
			modal: true,
			border: false,
			closeAction:'close',
			items:[hisGrid],

			buttons: [{
				width: 100,
				text:jx.wf.qryass,	//'查看任务分配'
				handler:function(){
					JxUtil.showCheckWindow(self.appData, 'check_assign');
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
	* private 显示历史审批意见的grid
	* funId -- 功能ID
	* dataId -- 数据ID
	**/
	showCheckHis: function(funId, dataId) {
		var self = this;
		var taskDefine = Jxstar.findNode('wf_taskhis');
		
		var hdCall = function(f) {
			var page = f();
			if (typeof page.showPage == 'function') {
				page.selectModel = 'row';
				//page = page.showPage('notoolgrid');
				page = page.showPage();
			}
			//显示对话框
			self.createWindow(page);
			
			//显示当前数据的所有历史审批意见，包括子过程与父过程，如果采用过程实例ID查询会非常复杂，不能兼顾子过程的历史记录
			var whereSql = 'wf_taskhis.fun_id = ? and wf_taskhis.data_id = ?';
			var whereValue = funId+ ';' +dataId;
			var whereType = 'string;string';
			Jxstar.loadData(page, {where_sql:whereSql, where_value:whereValue, where_type:whereType});
		};

		//加载任务历史gridpage
		
		Request.loadJS(taskDefine.gridpage, hdCall);
	}
	
};