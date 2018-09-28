/**
 * 查看流程图界面。
 **/
Jxstar.currentPage = {
	//流程图编辑器
	editor: null,
	//当前应用数据信息
	appData: null,
	
	/**
	* public 显示流程图对话框，JxUtil.showCheckMap中调用。
	* appData -- 应用数据，包含参数：
	*	funId -- 功能ID
	*	dataId -- 数据ID
	**/
	showWindow: function(appData) {
		var self = this;
		self.appData = appData;
		
		var hdCall = function(data) {
			//取当前到达的节点
			var nodeIds = data.nodeIds;
			//if (nodeIds.length == 0) {
			//	JxHint.alert('过程已经执行完成，没有当前节点标志！');
			//}
			nodeIds = nodeIds.split(',');
			
			var processId = data.processId;
			var processName = data.processName;
			
			//显示对话框
			self.createWindow(processName);
			//显示流程图
			self.readDesign(processId, nodeIds);
		};
		
		//从后台查询任务信息
		var params = 'funid=wf_assign&pagetype=chkgrid&eventcode=querynode';
		params += '&check_funid='+ appData.funId +'&keyid='+ appData.dataId;
		Request.dataRequest(params, hdCall);
	},
	
	/**
	* private 创建流程图对话框
	* processName -- 过程名称
	**/
	createWindow: function(processName) {
		var self = this;
		//设计面板html
		var htmls = [
			'<div id="mx_graph_show" style="height:100%;width:100%;background-color:white;overflow:auto;">',
				'<center id="mx_splash" style="padding-top:230px;">',
					'<img src="lib/graph/images/loading.gif">',
				'</center>',
			'</div>'
		];
		
		//创建对话框
		var win = new Ext.Window({
			title:String.format(jx.wf.qryxmap, processName),	//'查看【'+ processName +'】的流程图',
			layout:'fit',
			width:750,
			height:500,
			resizable: true,
			modal: true,
			closeAction:'close',
			html: htmls.join(''),

			buttons: [{
				width: 100,
				text:jx.wf.qryhis,	//'查看历史审批',
				handler:function(){
					JxUtil.showCheckWindow(self.appData, 'check_his');
					win.close();
				}
			},{
				width: 100,
				text:jx.wf.qryass,	//'查看任务分配',
				handler:function(){
					JxUtil.showCheckWindow(self.appData, 'check_assign');
					win.close();
				}
			},{
				text:jx.base.ok,	//'确定',
				handler:function(){win.close();}
			}]
		});
		
		win.on('destroy', function(){
			if (self.editor != null) {
				self.editor.destroy();
				mxClient.dispose();
				self.editor = null;
			}
		});
		
		win.show();
	},
	
	/**
	 * 从系统中读取设计文件
	 * processId -- 过程定义ID
	 * nodeIds -- 当前节点数组
	 **/
	readDesign: function(processId, nodeIds) {
		var self = this;
		//创建流程图编辑器，先检查加载图形库
		JxUtil.loadJxGraph();
		self.editor = new mxCanvas('lib/graph/config/showeditor.xml');
		//设置编辑器为只读
		self.editor.graph.setEnabled(false);

		//读取设计文件后的回调函数
		var hdCall = function(xmlfile) {
			if (xmlfile == null || xmlfile.length == 0) { 
				return false;
			}

			var doc = mxUtils.parseXml(xmlfile);
			var dec = new mxCodec(doc);
			dec.decode(doc.documentElement, self.editor.graph.getModel());
			
			//标记当前节点
			for (var i = 0, n = nodeIds.length; i < n; i++) {
				self.flagCurNode(nodeIds[i]);
			}
		};

		//从数据库中读取设计文件
		var params = 'funid=wf_process&eventcode=readdesign&pagetype=formdes';
			params += '&process_id='+ processId;
		Request.dataRequest(params, hdCall, {type:'xml', wait:true});
	},
	
	/**
	 * 给指定节点加上标记
	 * cellId -- 节点ID
	 **/
	flagCurNode: function(cellId) {
		var self = this;
		var model = self.editor.graph.getModel();
		var curCell = model.getCell(cellId);
		model.beginUpdate();
		try {
			self.editor.graph.setCellStyles("strokeColor", "red", [curCell]);
			self.editor.graph.setCellStyles("strokeWidth", "2", [curCell]);
		} finally {
			model.endUpdate();
		}
	}
};