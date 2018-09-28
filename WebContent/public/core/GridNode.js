/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 表格页面的基类对象。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Ext.ns('Jxstar');
Jxstar.GridNode = function(config){
	//节点配置信息
	this.config = config;
	//表格定义信息
	this.param = config.param;
	//选择模式[check|row]
	this.selectModel = this.param.selectModel||'';

	//功能定义ID
	this.nodeId = this.param.funid;
	//功能页面类型，用于判断显示哪些事件按钮与是否生成可编辑表格
	this.pageType = this.param.isedit=='1'?'editgrid':'grid';

	//功能定义对象
	this.define = Jxstar.findNode(this.nodeId);
	//事件定义对象
	this.event = new Jxstar.GridEvent(this.define);

	//功能页面对象
	this.page = null;
	
	//父功能ID，用于控制子功能的操作权限
	this.parentNodeId = '';

	//是否设计状态 0 运行状态 1 设计状态
	this.state = '0';
	
	//当前功能权限信息，与读取按钮信息同时读出来
	this.right = {edit:'1', print:'1', audit:'1', other:'1'};
	
	//处理字段多语言文字
	if (this.state == '0') {
		JxLang.gridField(this.nodeId, this.param.cols);
	}
};

Jxstar.GridNode.prototype = {
	/**
	 * 显示功能页面，外部调用主要方法。
	 * pageType -- 页面类型，根据需要在显示时确定页面用途类型
	 * parentNodeId -- 父功能ID
	 **/
	showPage: function(pageType, parentNodeId){
		//如果外部给页面类型，则取外部的值
		if (pageType != null) {
			this.pageType = pageType;
			//如果是可编辑子表，则该为可编辑页面类型
			if (pageType == 'subgrid' && this.param.isedit=='1') {
				this.pageType = 'subeditgrid';
			}
			if (pageType == 'grid' && this.param.isedit=='1') {
				this.pageType = 'editgrid';
			}
			if (pageType == 'check') {
				this.pageType = 'chkgrid';
			}
		}
		
		//支持统一设置云布局下，子表显示为工具栏的效果
		var subtools = Jxstar.systemVar.page__show__subtools;
		if (subtools == '1' && this.pageType.indexOf('sub') >= 0) {
			this.param.showTools = true;
		}
		
		//设置父功能ID
		if (parentNodeId != null) this.parentNodeId = parentNodeId;

		//创建页面
		if (!this.createPage()) return;
		//扩展自定义事件信息
		this.extEvent();
		//如果是下拉选项数据，则不要工具栏
		if (this.pageType.indexOf('notool') < 0) {
			//云布局中的子表不创建工具栏，在JxFormSub中处理
			if (!this.define.isCloud || this.pageType.indexOf('sub') < 0 || this.param.showTools) {
				//创建工具栏，同时执行页面扩展方法
				this.createTool();
			}
		}
		//添加页面扩展方法（临时处理，还需要检查在页面扩展中可能需要处理按钮的情况）
		this.initPage();

		//返回页面对象
		return this.page;
	},
	
	//private 分离构建列模型与存储对象的方法，方便重构cm,store
	createCmAndStore: function(mycols){
		if (mycols == null || mycols.length == 0) {
			//'创建页面的字段参数为空！'
			JxHint.alert(jx.node.nofields);
			return false;
		}

		var self = this;
		//用于保存字段信息
		var fields = [];
		//用于添加列序号列与复选框列
		var cols = [];
		//是否保存用户自定义表格列状态
		var isstate = Jxstar.systemVar.page__grid__state||'0';
		
		//定义列控件序号、列字段序号
		var sn = 0, fn = 0;
		if (!self.param.noRowNum) {
			var cfg = {
				renderer : function(v, p, record, rowIndex){
					if(this.rowspan){
						p.cellAttr = 'rowspan="'+this.rowspan+'"';
					}
					return rowIndex+1+Jxstar.startNo;
				}
			};
			if (isstate == '1') {
				cfg.header = '<div class="x-gray"><i class="fa gear"></i></div>';
			}
			//添加序号列，支持分页显示序号累加
			var rn = new Ext.grid.RowNumberer(cfg);
			cols[sn] = rn;
			sn++;
		}
		
		//这些类型的表格不需要显示checkbox
		var noCheck = (self.pageType == 'notoolgrid') || 
					  (self.pageType == 'combogrid');
		
		var sm = null;
		//添加复选框
		if (self.selectModel == 'check' || (self.selectModel == '' && !noCheck)) {
			if (self.sm == null) {
				sm = new Ext.grid.CheckboxSelectionModel();
				sm.width = 40;
			} else {
				sm = self.sm;
			}
			cols[sn] = sm;
			sn++;
		}
		
		//添加扩展插件列
		/*if (self.param.plugins != null) {
			cols[sn] = self.param.plugins;
			sn++;
		}*/
		
		//组合列信息
		for (var i = 0; i < mycols.length; i++) {
			//如果没有列则不处理
			var mc = mycols[i].col;
			if (mc == null) continue;
			
			//取字段信息
			var mf = mycols[i].field;
			if (mf != null) {
				fields[fn++] = mf;
			
				//列的排序字段就采用字段名
				mc.dataIndex =  mf.name;
				//以字段名作为列ID
				mc.id =  mf.name;
			}
			
			//处理form跳转列的样式 
			if (self.define.isCloud && !noCheck && (self.pageType == 'grid' || self.pageType.indexOf('chk') >= 0)) {
				var sf = self.param.showFormField || self.define.first;
				if (mf && sf.length > 0 && (sf == mf.name || (mf.name+'&').indexOf('__'+sf+'&') > 0) && !mc.renderer) {
					mc.renderer = function(val, metaData, record) {
						return '<a class="x-ashow">'+ val +'</a>';
					};
					mc.listeners = {click:function(col, grid, rowIndex, e){
						var store = grid.getStore();
						var record = store.getAt(rowIndex);
						var items = {define:self.define, grid:grid, record:record, store:store};
						JxCloud.showForm(items);
					}};
				}
			}
			
			//把列信息组合
			cols[sn++] = mc;
		}
		//创建列显示对象
		var cm = new Ext.grid.ColumnModel(cols);
		
		//查询数据URL
		var url = Jxstar.path + '/commonAction.do?eventcode=query_data&funid=queryevent&pagetype='+self.pageType;
			url += '&query_funid='+self.nodeId+'&user_id='+Jxstar.session['user_id'];
		if (self.param.queryurl) {
			url = self.param.queryurl;
			if (url.indexOf('&user_id=') < 0) {
				url += '&user_id='+Jxstar.session['user_id'];
			}
		}
		
		//支持替换存储对象
		var store;
		if (self.param.storeFn) {
			store = self.param.storeFn(fields);
		} else {
			//创建数据对象
			store = new Ext.data.Store({
				proxy: new Ext.data.HttpProxy({
					method: 'POST',
					url: url,
					listeners: {exception: function(a, b, c, d, e, f){
						store.removeAll();
						e.srcdesc = 'GridNode.js?url='+url;
						JxUtil.errorResponse(e);
					}}
				}),
				reader: new Ext.data.JsonReader({
					root: 'data.root',
					totalProperty: 'data.total'
				}, fields),
				remoteSort: true,
				sortInfo: self.param.sorts,
				groupField: self.param.groupField,//添加数据分组字段
				pruneModifiedRecords: true
			});
		}
		//初始化当前行号，在分页工具栏中设置正确的行号
		store.on('beforeload', function(){Jxstar.startNo = 0;});
		//如果表格内容有修改，则提示是否取消编辑。
		var dataModify = function(st, rs){
			//开始查询数据的时间
			Jxstar.st = (new Date()).getTime();
			
			var mrow = st.getModifiedRecords();//取记录集中修改的内容
			if (mrow.length > 0) {
				//'重新加载数据后，新增或修改记录会丢失，请确认是否保存修改内容！'
				if (confirm(jx.node.reloaddata)) {
					self.event.editSave();
					return false;
				}
			}
			return true;
		};
		store.on('beforeload', dataModify);
		
		self.sm = sm;
		self.cm = cm;
		self.store = store;
		self.noCheck = noCheck;
	},
	
	//private 加载数据，显示加载时间
	storeLoad: function(store) {
		var self = this;
		Jxstar.loadDataBc(self.page);
		
		//加载数据所花的时间
		var isHint = Jxstar.systemVar.show__use__time;
		if (Ext.isEmpty(isHint) || isHint == '1') {
			Jxstar.et = (new Date()).getTime(); 
			var useTime = Jxstar.et - Jxstar.st;
			JxHint.hint('use time(ms): ' + useTime);
		}
		
		//处理序号列宽度
		if (!self.param.noRowNum) {
			var max = store.getCount()+Jxstar.startNo;
			var len = max.toString().length;
			var cm = self.page.getColumnModel();
			if (len > 4) {
				cm.setColumnWidth(0, len*10);
			} else {
				var width = cm.getColumnWidth(0);
				if (width > 42) {
					cm.setColumnWidth(0, 40);
				}
			}
		}
		
		//如果是form中的明细表，则根据记录条数显示表格高度
		var ih = self.param.initRowH || 130;//初始行高
		if (this.param.showTools) {
			if (ih < 155) ih = 155;
		}
		
		var maxh = self.param.maxGridH;//最大表格高度
		var ah = self.param.autoHeight;
		var ct = self.page.ownerCt;
		//var form = self.page.findParentByType('form');
		if (ct) {
			var type = ct.initialConfig.showType;
			if (!type || type != 'inform') ct = null;
		}
		if (ct && (Ext.isEmpty(ah) || ah)) {
			var cnt = store.getCount();
			if (cnt < 2) cnt = 2;//最少显示6行的高度
			var height = ih+cnt*34;//4行固定高度+35个像素每行的高度
			
			//如果是在tab中的grid，则调整tab的高度
			var cls = ct.ownerCt.el.dom.className;
			if (cls.indexOf('sub_tab') > 0) {
				ct = ct.ownerCt;
			}
			//控制表格最大高度
			if (maxh && maxh < height) height = maxh;
			//当数据显示高度大于控件高度时才调整
			//if (height > ct.getHeight()) {
				ct.setHeight(height);
				ct.doLayout();
				ct.ownerCt.doLayout();//不加这行，当form出现滚动条时会挡住部分界面
			//}
		}
	},
	
	//public 传入新的列配置，重新构建表格对象
	reconfigGrid: function(mycols) {
		var self = this;
		var grid = self.page;
		//构建列模型与存储对象
		self.createCmAndStore(mycols);
		grid.getBottomToolbar().bindStore(self.store);
		//加载数据后调用回调函数
		self.store.on('load', self.storeLoad, self);
		//重新构建表格对象
		grid.reconfigure(self.store, self.cm);
	},

	/**
	 * 创建功能内容对象，用于扩展。
	 **/
	createPage: function(){
		var self = this;
		var grid = null;
		//是否保存用户自定义表格列状态
		var isstate = Jxstar.systemVar.page__grid__state||'0';
		//是否开启表格列锁定功能
		var islock = self.param.gridLocked;
		
		//构建列模型与存储对象
		self.createCmAndStore(self.param.cols);
		
		//配置信息
		var config = {
			cls: self.pageType,		//添加分页类型到样式中，方便处理工具栏样式
			//autoHeight: true,	//添加此属性，实现表格整个滚动的效果
			border: false,
			loadMask: true,
			columnLines: true,	//显示列分隔线
			store: self.store,
			cm: self.cm,
			sm: self.sm,
			stripeRows: true,	//显示斑马线
			enableHdMenu: (self.state != '0'),		//运行时屏蔽表头菜单
			enableColumnMove: (self.state != '0' || isstate == '1'),	//运行时禁止表头移动

			clicksToEdit:1		//单击编辑数据
		};

		//添加扩展插件
		if (self.param.plugins != null) {
			config.plugins = self.param.plugins;
		}

		//如果是下拉选项数据，则不要工具栏self.pageType != 'combogrid' && 
		if (self.pageType.indexOf('notool') < 0) {
			//云布局中的子表不创建工具栏，在JxFormSub中处理
			if (!self.define.isCloud || self.pageType.indexOf('sub') < 0 || self.param.showTools) {
				//添加工具栏的快捷键
				//var tkm = new Ext.ux.ToolbarKeyMap();
				//处理：FF下工具栏高度为27px，IE为29px，通过下面设置后为27px
				//if (Ext.isIE) tcfg.style = 'padding:1px;';
				//创建工具栏，先创建一个空按钮，保证在chrome中显示正常
				var tbar = new Ext.Toolbar();
				config.tbar = tbar;
			}
		}

		//设计状态不需要分页栏
		if (self.state == '0' && self.pageType.indexOf('notool') < 0 && 
			!self.param.hidePageTool && (!self.define.showInForm || self.param.showTools) && 
			(!self.define.isCloud || !self.param.showTools)) {
			var psize = self.param.pageSize || Jxstar.pageSize;
			config.bbar = new Ext.PagingToolbar({
				deferHeight:true,
				pageSize: psize,
				store: self.store,
				cls:'x-pagebar',
				plugins: (self.pageType != 'combogrid') ? new Ext.ux.JxPagerTool({pageSize:psize}) : null,
				displayInfo: (self.pageType != 'combogrid'),
				displayMsg: jx.node.rows,	//'共 {2} 条'
				emptyMsg: jx.node.datano		//'没有记录
			});
		}
		
		//添加其他扩展属性
		var ocfg = self.param.pageConfig;
		if (!Ext.isEmpty(ocfg)) {
			Ext.apply(config, ocfg);
		}

		//创建表对象
		if (self.pageType.indexOf('edit') >= 0 || 
		   (self.pageType == 'chkgrid' && self.param.isedit == '1')) {//设置审批过程中可以修改
			grid = new Ext.grid.EditorGridPanel(config);
		} else {
			grid = new Ext.grid.GridPanel(config);
		}
		if (isstate == '1') {
			JxExt.gridStateEvent(grid);
		}
		//创建锁定列对象
		if (islock) {
			grid.locker = new GridLocker({grid:grid});
		}
		
		//控制可编辑表格的编辑状态
		if (grid.isXType('editorgrid')) {
			grid.on('beforeedit', function(event) {
				var r = event.record;
				var a = self.define.auditcol;
				var s = r.get(a);	//记录状态值
				var audit0 = '0', audit2 = '2', audit6 = '6';
				if (self.define.status) {//设置业务状态值
					audit0 = self.define.status['audit0'];
					audit2 = self.define.status['audit2'];
				}
				var tools = event.grid.getTopToolbar();
				if (!tools) {
					if (self.pageType.indexOf('sub') >= 0 && self.define.isCloud) {
						tools = JxUtil.getCloudTool(event.grid);
						if (!tools) return true;
					} else {
						return true;//如果没有工具栏则可以操作
					}
				}
				//如果设置了审批中可以修改保存的按钮，则可以修改
				var saveChkBtn = JxUtil.getButton(tools, 'save_eg_chk');
				if (s == audit2 && saveChkBtn) return true;
				
				if (s == null || s.length == 0) s = audit0;
				if (s != audit0 && s != audit6) return false;
				
				//没有编辑权限的不能编辑
				if (self.right.edit == '0') return false;
				
				//没有保存按钮或不可用，则不能编辑
				var saveBtn = JxUtil.getButton(tools, 'save_eg');
				//子表保存按钮从主表中取
				if (!saveBtn && self.pageType.indexOf('sub') >= 0) {
					var form = event.grid.parentForm;//JxFormSub中加载子表数据赋值
					if (form) saveBtn = JxUtil.getButton(form.getTopToolbar(), 'save');
					if (self.define.subChkEdit && !saveBtn) {
						saveBtn = JxUtil.getButton(form.getTopToolbar(), 'save_chk');
					}
				}
				//保存提交一起执行
				var eas = Jxstar.systemVar.edit__audit__save||'0';
				if (eas == '1') {
					if (saveBtn && saveBtn.disabled) return false;
				} else {
					if (saveBtn == null || saveBtn.disabled) return false;
				}
				return true;
			});
			
			//回车进入当前选择行的第一个可编辑控件
			grid.on('keydown', function(e) {
				if (e.getKey() == e.ENTER) {
					var g = this;
					var row = JxUtil.getRowNum(g);
					var col = JxUtil.getEditCol(g);
					if (row < 0) row = 0;
					g.startEditing(row, col);
				}
			}, grid);
		} else {
			//双击打开form记录
			grid.on('rowdblclick', function(grid, n, event) {
				if (self.pageType == 'grid' || self.pageType.indexOf('chk') >= 0) {
					self.event.showForm();
				} else if (self.pageType == 'subgrid') {
					self.event.showSubForm();
				} else if (self.pageType == 'import') {
					self.event.imp();
				} else if (self.pageType == 'imptype') {
					self.event.impType();
				}
			});
		}
				
		//记录当前选择的记录行号
		grid.getSelectionModel().on('rowselect', function(select, index, record){
			grid.selectKeyId = record.get(self.define.pkcol);
		});
		//加载数据后调用回调函数
		self.store.on('load', self.storeLoad, self);
		
		//添加表格控件注销事件，效果不明显
		grid.on('beforedestroy', function(gp){
			self.sm = null;				delete self.sm;
			self.cm = null;				delete self.cm;
			self.store = null;			delete self.store;
			self.noCheck = null;		delete self.noCheck;
		
			gp.pkName = null;			delete gp.pkName;
			gp.fkName = null;			delete gp.fkName;
			gp.fkValue = null;			delete gp.fkValue;
			gp.pageType = null;			delete gp.pageType;
			gp.isShow = null;			delete gp.isShow;
			gp.selectKeyId = null;		delete gp.selectKeyId;
			gp.jxstarParam = null;		delete gp.jxstarParam;
			gp.gridNode.destroy();
			gp.gridNode = null;			delete gp.gridNode;
			gp.cmpTree = null;			delete gp.cmpTree;
			gp.treeNodeAttr = null;		delete gp.treeNodeAttr;
			
			if (gp.qryCt) {Ext.destroy(gp.qryCt, gp.qryCt.el);}
			gp.qryCt = null;			delete gp.qryCt;
			gp = null;
			
			if (grid.locker) grid.locker.unlock();
			
			return true;
		});
		
		//设置单选模式
		if (self.selectModel == 'row' || self.noCheck) {
			grid.getSelectionModel().singleSelect = true;
		}

		//构建表格相关参数对象
		grid.jxstarParam = {};
		//添加功能主键与外键
		grid.pkName = self.define.pkcol;
		grid.fkName = self.define.fkcol;
		
		//初始是否显示数据，在Jxstar中加载数据
		grid.isShow = self.param.isshow;
		grid.pageType = self.pageType;
		
		//临时处理办法，将来采用全局对象来管理程序对象
		grid.gridNode = self;
		//设置事件对象的页面
		self.event.setPage(grid);
		//设置页面对象
		self.page = grid;
		
		//如果显示查询方案，则添加查询工具栏，避免出现表格延时移动
		if (self.state == '0' && (self.param.hasQuery == null || self.param.hasQuery==true)) {
			if ((Jxstar.systemVar.useCase == '1' || self.param.showQryCase) && !self.param.showNotQryCase && !self.param.showTools) {
				grid.on('render', function(g){
					if (Ext.isEmpty(g.tbar)) return;
					g.qryCt = new Ext.Container({
						renderTo:g.tbar,
						cls:'tool-query x-small-editor',
						height:48
					});
				});
			}
		}
		
		return true;
	},

	/**
	 * 创建工具栏对象。
	 **/
	createTool: function(){
		var params = 'funid=queryevent&eventcode=query_loadtb&selpfunid='+this.parentNodeId;
		if (this.state == '1') {
			params += '&selfunid=sys_fun_base&selpagetype=desgrid';
		} else {
			params += '&selfunid='+this.nodeId + '&selpagetype='+this.pageType;
		}
		
		var self = this;
		var hdCall = function(json) {
			//如果打开功能立即关闭，会存在page为null
			if (self.page == null || json == null) return;
			//取按钮数组
			var items = json.buttons;
			//取权限信息
			var right = json.right;
			if (right) self.right = right;
			
			var ei = self.event;
			var tbar = self.page.getTopToolbar();
			
			//保存按钮快捷键与事件
			//var akeys = [];
			//标示按钮段号，如果在不同的段位加分隔栏
			var dnum = 0;
			//保存扩展按钮
			var extItems = [];
			
			//给按钮对象分配事件
			for (var i = 0, n = items.length; i < n; i++){
				//处理按钮多语言文字
				var tt = (self.state == '1') ? 'sys_fun_base' : self.nodeId;
				JxLang.eventLang(tt, items[i]);
				//处理快捷键
				/*var hk = items[i].accKey;
				if (!Ext.isEmpty(hk)) {
					items[i].text = items[i].text+'('+ hk.toUpperCase() +')';
					items[i].keyBinding = {key:hk, ctrl:true, alt:true};
					//添加提示会造成one_page.jsp中打开功能时出现样式错误
					//items[i].tooltip = {text:'Ctrl+Alt+' + hk.toUpperCase()};
				}*/
				
				//按钮显示类型[tool|menu]
				var showType = items[i].showType;
			
				if (items[i].method.length > 0) {
					var h = ei[items[i].method];
					if (h == null) continue;
					var a = items[i].args;
					//自定义方法用事件代码作为参数
					if (items[i].method == 'customEvent' && (!a || a.length == 0)) {
						a = [items[i].eventCode];
					}
					
					items[i].scope = ei;
					if (a != null && a.length > 0) {
						items[i].handler = h.createDelegate(ei, a);
					} else {
						//执行前判断按钮disable，上面的方法带参数取不到button
						h = h.createInterceptor(function(t){
							return !(t.disabled);
						});
						items[i].handler = h;
					}
				}
				
				//如果没有定义事件的样式，则取缺省样式
				var cls = items[i].iconCls;
				if (showType != 'menu' && cls.indexOf('eb_') == 0) {
					var ss = JxUtil.getRule('.'+cls+'::before');
					if (!ss) items[i].iconCls = 'eb_empty';
				}
				
				//添加分隔栏
				var idx = items[i].eventIndex;
				if (idx == null || idx.length == 0) idx = '0';
				idx = parseInt(parseInt(idx)/100);
				if (idx > dnum) {
					if (i > 0) {
						if (extItems.length > 0) {
							extItems[extItems.length] = '-';
						} else {
							tbar.add('-');
						}
					}
					dnum = idx;
				}

				//如果是显示到菜单，则添加扩展栏中
				if (showType == 'menu') {
					extItems[extItems.length] = items[i];
				} else {
					var ec = items[i].eventCode;
					if (ec.indexOf('create') >= 0 || ec.indexOf('imp') >= 0) {
						items[i].cls =  'x-btn-success';//按钮突出显示
					} else if (ec.indexOf('save') >= 0 || ec == 'audit') {
						items[i].cls =  'x-btn-primary';//按钮突出显示
					}
					tbar.add(items[i]);	//添加按钮
				}
			}
			//添加扩展工具栏
			var fn = self.config.toolext;
			if (self.state == '0' && fn && typeof fn == 'function') {
				fn(self, tbar, extItems);
			}
			
			var len = extItems.length;
			if (len > 0 && extItems[len-1] == '-') extItems.splice(len-1, 1);
			//添加扩展按钮
			if (extItems.length > 1) {
				var extMenu = new Ext.menu.Menu({items: extItems});
				var item = {
					eventCode: 'ext_menu',
					text: jx.cloud.text13,//'更多'
					iconCls: 'eb_more',
					menu: extMenu
				};
				
				tbar.add(item);
			} else {
				//如果只有一个按钮则直接显示
				if (extItems.length == 1) tbar.add(extItems[0]);
			}

			//添加查询条件
			if (self.state == '0' && (self.param.hasQuery == null || self.param.hasQuery == true) && !self.param.showTools) {
				tbar.add('->');
				//判断是采用原公共查询还是采用新的查询模式
				if (Jxstar.systemVar.useCase == '1') {
					if (self.param.showNotQryCase) {
						Jxstar.simpleQuery(self);
					} else {
						JxQuery.showCase(self);
					}
				} else {
				//支持部分功能采用查询方案，缺省采用通用查询
					if (self.param.showQryCase) {
						JxQuery.showCase(self);
					} else {
						Jxstar.simpleQuery(self);
					}
				}
			} else if (self.param.showTools && self.param.hasQuery == true) {
				tbar.add('->');
				Jxstar.simpleQuery(self);
			}
			//显示查询方案
			if (self.param.showStat) {
				JxGroup.showCase(self);
			}
			//如果没有按钮则隐藏工具栏
			if (tbar.items.getCount() == 0) {
				tbar.hide();
				self.page.doLayout();
			} else {
				tbar.doLayout();
			}
		};

		Request.dataRequest(params, hdCall);
	},

	/**
	 * 扩展自定义事件到this.event中。
	 **/
	extEvent: function(){
		var scope = this;
		var cfg = this.config.eventcfg;
		if (cfg) {
			Ext.apply(this.event, cfg);
		}
	},
		
	/**
	 * 页面加载完后执行的方法，参数有表格对象与功能定义对象。
	 **/
	initPage: function(){
		var scope = this;
		var fn = this.config.initpage;
		if (typeof fn == 'function') {
			fn(scope);
		}
	},
	
	/**
	 * 设置设计状态 0 运行状态 1 设计状态。
	 **/
	setState: function(state) {
		this.state = state;
	},
	
	/**
	 * 销毁grid页面对象
	 **/
	destroy: function() {
		this.config = null;			delete this.config;
		this.param = null;			delete this.param;
		this.selectModel = null;	delete this.selectModel;
		this.nodeId = null;			delete this.nodeId;
		this.pageType = null;		delete this.pageType;
		this.id = null;				delete this.id;
		this.define = null;			delete this.define;
		this.event.myDestroy();
		this.event = null;			delete this.event;
		this.page = null;			delete this.page;
		this.parentNodeId = null;	delete this.parentNodeId;
		this.state = null;			delete this.state;
		this.right = null;			delete this.right;
	}
};
