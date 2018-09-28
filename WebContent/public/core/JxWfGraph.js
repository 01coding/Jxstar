/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 显示导航流程图。
 * 
 * @author TonyTan
 * @version 1.0, 2012-11-01
 */

JxWfGraph = {};

Ext.apply(JxWfGraph, {
	//显示流程图的控件
	editor : null,
	//当前导航图ID
	graphId : '', 
	//打开功能时的过滤数据的wheresql的查询值，格式为：{name1:'', name2:''}
	//节点定义中扩展wherevalue的值要定义为：[name1];[name2]
	queryValue : null,
	//是否调用后台查询数据库是否有数据库记录
	isFlag : false,
	
	//public 支持主菜单中直接打开功能导航图的功能
    showGraphFun : function(graphId, queryValue, isFlag, graphTitle){
		var self = this;
		//创建功能显示Tab
		var mainTab = Jxstar.sysMainTab;
		var tabid = 'wfnav_graph_fun_tab';
		var wfnavTab = mainTab.getComponent(tabid);
		
		var title = graphTitle||'流程导航图';
		if (wfnavTab == null) {
			wfnavTab = mainTab.add({
				id: tabid,
				label: title,
				border: false,
				layout: 'fit',
				closable: true,
				autoScroll: false,
				iconCls: 'function'
			});
		} else {
			wfnavTab.setTitle(title);
			//解决功能标题没有改变的问题
			var funtab = Jxstar.funMainTab.getTab(tabid);
			var el = funtab.child('span', true);
			var html = el.innerHTML;
			if (html && html.length > 10) {
				html = html.split('</i>')[0] + '</i>' + title;
				el.innerHTML = html;
			}
		}
		mainTab.activate(wfnavTab);
		//然后显示导航流程图
		self.createGraph(wfnavTab, graphId, queryValue, isFlag);
    },
	
	//public 支持自定义功能中直接打开流程图，可以添加数据标记
    createGraph : function(wfnavTab, graphId, queryValue, isFlag){
		var self = this;
		self.graphId = graphId;
		self.queryValue = queryValue||{};
		self.isFlag = isFlag||false;
		
		var navctl = wfnavTab.getComponent(0);
		if (navctl == null) {
			var tabid = 'wfnav_graph_tab';
			//设计面板html
			var htmls = [
				'<div id="mx_graph_show_nav" style="height:100%;width:100%;background-color:white;overflow:none;">',
					'<center id="mx_splash" style="padding-top:230px;">',
						'<img src="lib/graph/images/loading.gif">',
					'</center>',
				'</div>'
			];
			
			//var tbar = new Ext.Toolbar({deferHeight:true, items:[{text:'刷新'},{text:'另存图片'}]});

			navctl = new Ext.Panel({
				id: tabid,
				border:false,
				layout: 'fit',
				iconCls: 'nav_flow',
				//title: wfnavTab.label,
				html: htmls.join('')
			});
			wfnavTab.add(navctl);
			wfnavTab.doLayout();
			
			navctl.on('destroy', function(){
				if (self.editor != null) {
					self.editor.destroy();
					mxClient.dispose();
					self.editor = null;
				}
			});
				
			//创建流程图
			self.createEdit();
		}
		//根据最新参数显示流程图
		self.readDesign();
    },
	
	//private 检查是否为任务节点
	isTask: function(cell) {
		if (cell == null) return false;
		
		var enc = new mxCodec();
		var node = enc.encode(cell);
		var nodetype = node.getAttribute('nodetype');
		if (nodetype == 'task') {
			return true;
		}
		return false;
	},
	//private 取任务节点的ID
	getTaskId: function(cell) {
		if (cell == null) return '';
		
		var enc = new mxCodec();
		var node = enc.encode(cell);
		var nodetype = node.getAttribute('nodetype');
		if (nodetype == 'task') {
			return node.getAttribute('id');
		}
		return '';
	},
	
	//创建显示流程图的画布
	createEdit: function() {
		var self = this;
		//创建流程图编辑器，先检查加载图形库
		JxUtil.loadJxGraph();
		self.editor = new mxCanvas('lib/graph/config/showeditor_nav.xml');
		var graph = self.editor.graph;
		//设置编辑器为只读
		//由于设置setEnabled为false，分组块不能收缩了，所以采用下面的组合
		graph.setCellsEditable(false);
		graph.setCellsSelectable(false);
		graph.setConnectable(false);
		graph.setCellsMovable(false);
		
		//设置导航图的任务节点的鼠标与移入移出效果
		var track = new mxCellTracker(graph);
		track.mouseMove = function(sender, me) {
			var cell = this.getCell(me);
			if (cell && self.isTask(cell)) {
				//设置鼠标为样式为手状
				me.getState().setCursor('pointer');
				if (this.cur_cell == null) {
					this.cur_cell = cell;
					//设置鼠标移入节点效果
					self.moveNode(cell, true);
				}
			} else {
				//设置鼠标移出节点效果
				self.moveNode(this.cur_cell, false);
				this.cur_cell = null;
			}
		};
		
		//捕获任务节点的鼠标点击事件
		graph.addListener(mxEvent.CLICK, function(sender, evt) {
			var cell = evt.getProperty('cell');
			var nodeId = self.getTaskId(cell);
			if (nodeId.length > 0) {
				self.clickCell(self.graphId, nodeId);
			}
		});
	},
	
	//点击任务节点，打开功能
	clickCell: function(graphId, nodeId) {
		var self = this;

		var hdCall = function(data) {
			if (data == null || data.fun_id == null) {
				JxHint.alert(jx.util.wfnn);//没有找到点击节点的设置属性！
				return;
			}
			
			var fun_id = data.fun_id;
			if (!Ext.isEmpty(fun_id)) {
				if (!Jxstar.validNode(fun_id)) {
					JxHint.alert(String.format(jx.star.noright, fun_id));	//'用户没有该【{0}】功能的授权！'
					return false;
				}
			
				if (!Ext.isEmpty(data.where_sql)) {
					var param = {};
					param.whereSql = data.where_sql;
					param.whereValue = JxUtil.parseWhereValue(data.where_value, self.queryValue);
					param.whereType = data.where_type;
					param.isQuery = '1';
					Jxstar.createNode(fun_id, param);
				} else {
					Jxstar.createNode(fun_id);
				}
			}
		};

		//读取节点设置信息
		var params = 'funid=wfnav_graph&eventcode=querynode&pagetype=formdes';
			params += '&graph_id='+ graphId + '&node_id=' + nodeId;
		Request.dataRequest(params, hdCall);
	},
	
	//从服务器中加载导航图设计信息
	readDesign: function() {
		var self = this;

		//读取设计文件后的回调函数
		var hdCall = function(xmlfile) {
			if (xmlfile == null || xmlfile.length == 0) {
				JxHint.alert(jx.util.wfnds);//没有找到流程导航图设计文件！
				return;
			}
			
			var doc = mxUtils.parseXml(xmlfile);
			var dec = new mxCodec(doc);
			dec.decode(doc.documentElement, self.editor.graph.getModel());
			
			//是否标记有数据记录的状态
			self.queryFlag();
			//给没有权限与没有设置功能属性的节点标记为灰色
			self.disableFlag();
		};

		//从数据库中读取设计文件
		var params = 'funid=wfnav_graph&eventcode=readdesign&pagetype=formdes';
			params += '&graph_id='+ self.graphId;
		Request.dataRequest(params, hdCall, {type:'xml', wait:true});
	},
	
	//标记有数据的节点为红色背景
	queryFlag: function() {
		var self = this;
		if (!self.isFlag) return;
		
		//数据格式为：[{node_id:'', fun_id:'', cnt:n},...]
		var hdCall = function(data) {
			if (data == null || data.length == 0) {
				JxHint.alert(jx.util.wfnodes);//没有找到点击节点对应功能的记录数！
				return;
			}
			
			for (var i = 0, n = data.length; i < n; i++) {
				var cnt = data[i].cnt;
				var node_id = data[i].node_id;
				if (cnt > 0) self.flagCurNode(node_id);
			}
		};
		
		var datavalue = '';
		if (!Ext.isEmpty(self.queryValue)) {
			datavalue = encodeURIComponent(Ext.urlEncode(self.queryValue));
		}

		//从数据库中读取有哪些节点有数据
		var params = 'funid=wfnav_graph&eventcode=queryflag&pagetype=formdes';
			params += '&graph_id='+ self.graphId+'&datavalue='+datavalue;
		Request.dataRequest(params, hdCall);
	},
	
	//标记没有功能权限与没有设置功能属性的节点为灰色边框
	disableFlag: function() {
		var self = this;
		//数据格式：[{fun_id:'', node_id:''}...]
		var hdCall = function(data) {
			var model = self.editor.graph.getModel();
			//先标记没有功能权限的节点为灰色
			Ext.iterate(data, function(node){
				var cell = model.getCell(node.node_id);
				if (!Jxstar.validNode(node.fun_id)) {
					self.disableNode(cell);
				}
            });
			
			//取所有功能节点，如果没有设置功能信息则标记为灰色
			Ext.iterate(model.cells, function(key, cell){
				if (cell.is_disabled) return;
				//如果没有定义功能信息，则标记为灰色
				var hasfun = false;
				Ext.iterate(data, function(node){
					if (key == node.node_id) {
						hasfun = true;
						return;
					}
				});
				if (!hasfun && self.isTask(cell)) {
					self.disableNode(cell);
				}
            });
		};
	
		//从数据库中读取有哪些节点与功能ID
		var params = 'funid=wfnav_graph&eventcode=queryfun&pagetype=formdes';
			params += '&graph_id='+ self.graphId;
		Request.dataRequest(params, hdCall);
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
			self.editor.graph.setCellStyles("strokeWidth", "1", [curCell]);
			self.editor.graph.setCellStyles("strokeColor", "red", [curCell]);
			self.editor.graph.setCellStyles("fillColor", "#BB0000", [curCell]);
		} finally {
			model.endUpdate();
		}
	},
	
	/**
	 * 给指定节点加上灰色标记
	 * cell -- 任务节点
	 **/
	disableNode: function(cell) {
		var self = this;
		var model = self.editor.graph.getModel();
		model.beginUpdate();
		try {
			self.editor.graph.setCellStyles("strokeColor", "#ECECEC", [cell]);
			self.editor.graph.setCellStyles("fillColor", "#BBBBBB", [cell]);
			cell.is_disabled = true;//自定义属性
		} finally {
			model.endUpdate();
		}
	},
	
	/**
	 * 给指定的节点设置背景色
	 * cell -- 当前节点
	 * isin -- true 表示鼠标在节点上，false 表示鼠标没在节点上
	 **/
	moveNode: function(cell, isin) {
		//为空与灰色的节点都不处理鼠标事件
		if (cell == null) return;
		if (cell.is_disabled) return;
		
		var self = this;
		var model = self.editor.graph.getModel();
		model.beginUpdate();
		try {
			self.editor.graph.setCellStyles("strokeColor", isin?"#A1A1FF":"#87CEFA", [cell]);
			self.editor.graph.setCellStyles("fillColor", isin?"#A1A1FF":"#87CEFA", [cell]);
		} finally {
			model.endUpdate();
		}
	}
});
