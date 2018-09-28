/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 树形表格控件。
 * 
 * @author TonyTan
 * @version 1.0, 2016-01-01
 */
Ext.ns('Jxstar');
Jxstar.TreeGridNode = function(config){
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
	
	//-------------------------------树形表格对象参数--------------------------
	//一级节点每页记录数
	this.mainPageSize = this.param.mainPageSize || 50;
	//下级节点每页记录数
	this.childPageSize = this.param.childPageSize || 20;
	//自动展开几级节点数据
	this.autoExpandLevel = this.param.autoExpandLevel || 1;
	//树形是否自动加载数据
	this.autoLoad = (this.param.autoLoad === false) ? false : true;
	//是否后台分页取数
	this.pageLoadRemote = (this.param.pageLoadRemote === false) ? false : true;
	//是否滚动自动加载分页数据
	this.autoScrollLoad = (this.param.autoScrollLoad === true) ? true : false;
	//加载数据时是否清除原节点
	this.clearOnLoad = (this.param.clearOnLoad === false) ? false : true;
	//是否添加模拟滚动条
	this.autoScrollDown = (this.param.autoScrollDown === true) ? true : false;
	//是否显示节点数据加载时间
	this.showUseTime = (this.param.showUseTime === false) ? false : true;
	//是否支持多选，添加checked
	this.multiSelected = (this.param.multiSelected === true) ? true : false;
};

Jxstar.TreeGridNode.prototype = {

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
	
	//取表格列定义信息
	getCols: function() {
		var self = this;
		var cols = self.param.cols;
		
		var mycols = [], j = 0;
		for (var i = 0; i < cols.length; i++) {
			var mycol = cols[i].col;
			var fe = cols[i].field;
			
			if (fe) {
				if (fe.name.indexOf('__') > 0) {
					mycol.dataIndex = fe.name.split('__')[1];
				} else {
					mycol.dataIndex = fe.name;
				}
			}
			if (!mycol.hidden && mycol.renderer) {
				mycol.tpl = new Ext.XTemplate('{' + mycol.dataIndex + ':this.renderer}', {
					renderer:mycol.renderer
				});
			}
			mycols[j++] = mycol;
		}
		if (self.param.isedit == '1') {
			mycols[j] = {
				header: '子级',
				width: 40,
				align:'center',
				buttons: 'add',
				buttonIconCls: 'eb_add',
				buttonTips: '新增子节点'
			};
			mycols[j+1] = {
				header: '操作',
				width: 120,
				align:'center',
				buttons: ['update', 'remove'],
				buttonText: ['编辑', '删除']
			};
		}
		
		return mycols;
	},
	
	/**
	 * 创建功能内容对象，用于扩展。
	 **/
	createPage: function(){
		var self = this;
		var define = self.define;
		
		//构建表格列
		var sm = self.getCols();

		//树形配置信息
		var config = {
			//depth:5,
			//border:false,
			enableHdMenu:false,
			
			columns:sm,
			
			//autoScroll:false,
			//rootVisible:false,
			//lines:false,
			//useArrows:false
		};
		
		if (self.pageType.indexOf('notool') < 0) {
			if (!define.isCloud || self.pageType.indexOf('sub') < 0 || this.param.showTools) {
				config.tbar = new Ext.Toolbar();
			}
		}
		
		if (self.param.isedit == '1') {
			if (config.tbar) {
				config.tbar.add({
					text: '新增',
					iconCls: 'eb_add',
					handler: function() {
						tree.addNode(tree.getRootNode());
					}
				});
			}
			config.actions = {
				add:function(n, o){
					JxTreeGrid.save(define, n, tree, o);
				},
				remove:function(n, o){
					JxTreeGrid.remove(define, n, tree, o);
				},
				update:function(n, o){
					JxTreeGrid.save(define, n, tree, o);
				}
			};
		}
		
		//是否支持多选
		if (self.multiSelected) {
			config.selModel = new Ext.tree.MultiSelectionModel();
		}
		
		//查询数据URL
		var dataUrl = Jxstar.path + '/commonAction.do?eventcode=query_gtree&funid=queryevent';
			dataUrl += '&tree_funid='+define.nodeid+'&user_id='+Jxstar.session['user_id'];
		if (self.multiSelected) {dataUrl += '&add_check=1';}
		
		if (self.param.queryurl) {
			dataUrl = self.param.queryurl;
			if (dataUrl.indexOf('&user_id=') < 0) {
				dataUrl += '&user_id='+Jxstar.session['user_id'];
			}
		}
		
		//是否更新加载数据
		var isclear = self.clearOnLoad;
		
		var cfga = {dataUrl: dataUrl, clearOnLoad:isclear};
		var cfgl = self.param.loaderConfig;
		if (!Ext.isEmpty(cfgl)) {
			Ext.apply(cfga, cfgl);
		}
		
		var st = 0, myMask = null;
		//树形数据加载对象
		var loader = new Ext.tree.TreeLoader(cfga);
		loader.on('beforeload', function(l, n){
			//不自动加载数据
			if (n.autoLoad === false) return false;
			
			if(!myMask){
				myMask = new Ext.LoadMask(tree.getEl());
			}
			myMask.show();
				
			st = (new Date()).getTime();
		});
		var root = new Ext.tree.AsyncTreeNode({id:'10', iconCls:'tree_root_ext', text:'刷新', hidden:true});
		root.autoLoad = self.autoLoad;//是否创建树时就加载数据
		root.loadRemote = self.pageLoadRemote;//是否从后台取分页数据
		//设置节点分页参数
		root.queryParams = {start:0, limit:self.mainPageSize};
		//树形分页栏
		/*config.bbar = new Ext.ux.tree.TreePagingToolbar({
			node: root,
			store: loader,
			pageSize: psize,
			displayInfo: true,
			plugins: new Ext.ux.JxPagerTool({pageSize:psize}),
			displayMsg: jx.node.rows,		//'共 {2} 条'
			emptyMsg: jx.node.datano		//'没有记录
		});*/
		config.root = root;
		config.loader = loader;
		
		//扩展树控件属性
		var cfgt = self.param.treeConfig;
		if (!Ext.isEmpty(cfgt)) {
			if (typeof cfgt == "function") {
				config = cfgt(config, self);
			} else {
				Ext.apply(config, cfgt);
			}
		}
		
		var tree;
		if (self.param.isedit == '1') {
			tree = new Ext.ux.tree.EditTreeGrid(config);
		} else {
			tree = new Ext.ux.tree.TreeGrid(config);
		}
		//是否支持多选
		if (self.multiSelected) {
			tree.on('checkchange', function(node, checked){
				var sm = tree.getSelectionModel();
				if (checked) {
					sm.select(node, null, true);
				} else {
					sm.unselect(node);
				}
				node.eachChild(function(n){
					n.ui.toggleCheck(checked);
				});
			});
		}
		
		loader.on('loadexception', function(l, node, response){
			if (myMask) {myMask.hide(); myMask = null;}
			alert('加载树数据异常，状态码：'+response.status);
		});
		//设置树根节点数据加载时添加配置信息
		loader.on('load', function(l, node){
			if (myMask) {myMask.hide(); myMask = null;}
			
			var currsize = self.childPageSize;
			//查询时又改变更新加载
			isclear = l.clearOnLoad;
			if (node.id == root.id) {
				currsize = self.mainPageSize;
				
				if (self.autoScrollDown) {
					JxTreeGrid.downScroller(tree, node, currsize);
				}
				var child = node.firstChild;
				if (!child) return;
				
				var attr = child.attributes;
				//node.attributes.tree_no = attr.tree_no;
				//node.attributes.table_name = attr.table_name;
				node.attributes.node_level = attr.node_level;//保存数据时用到
				
				//临时根节点用于传递树定义信息，需要删除
				if (child.id == '10') child.remove(true);
			}
			
			//添加分页栏
			JxTreeGrid.createNodePager(node, currsize, isclear, l);
			
			//如果有子节点，则添加查询参数
			var cnt = 0;
			node.eachChild(function(n){
				if (!n.isLeaf()) {
					n.loadRemote = self.pageLoadRemote;//是否从后台取分页数据
					
					//展开与收缩时隐藏分页栏；同时设置锁定列的位置
					if (!n.hasListener('collapse')) {
						n.on('collapse', function(n){
							if (n.pager) n.pager.hide();
							
							if (tree.locker) tree.locker.updateData();
						});
					}
					
					if (!n.hasListener('expand')) {
						n.on('expand', function(n){
							if (n.pager) n.pager.show();
							
							if (tree.locker) tree.locker.updateData();
						});
					}
					
					//添加分页参数
					n.queryParams = {start:0, limit:self.childPageSize};
					
					var ilevel = self.autoExpandLevel;
					if (ilevel > 1) {
						//避免性能问题，只自动加载5个节点
						if (cnt >= 5) return; cnt++;
						//判断是否需要展开此级数据
						var d = n.getDepth();
						if (d < ilevel && !n.isLeaf()) n.expand();
					}
				}
			});
			
			if (self.showUseTime) {
				var et = (new Date()).getTime();
				JxHint.hint('use time(ms): ' + (et-st));
			}
			
			//重新加载数据后需要更新模拟层的数据
			JxUtil.delay(200, function(){
				if (tree.locker) tree.locker.updateData();
			});
		});
		//创建锁定列对象
		tree.locker = new TreeLocker({tree:tree});
		
		//上下拖动加载更多
		if (self.autoScrollLoad) {
			JxTreeGrid.loadTreeData(tree, root, self.mainPageSize, isclear);
		}
		
		//添加功能主键与外键
		tree.pkName = self.define.pkcol;
		tree.fkName = self.define.fkcol;
		
		//初始是否显示数据，在Jxstar中加载数据
		tree.isShow = self.param.isshow;
		tree.pageType = self.pageType;
		
		//临时处理办法，将来采用全局对象来管理程序对象
		tree.gridNode = self;
		//设置事件对象的页面
		self.event.setPage(tree);
		//设置页面对象
		self.page = tree;
		
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
				JxLang.eventLang(self.nodeId, items[i]);
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
				/* 用字体图标时都找不到样式名称了
				var hasCss = Ext.util.CSS.getRule('.'+items[i].iconCls);
				if (hasCss == null && showType != 'menu') {
					items[i].iconCls = 'eb_empty';
				}*/
				
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
					text: '更多',//jx.node.extmenu,//'扩展操作…'
					iconCls: 'eb_more',
					menu: extMenu
				};
				
				tbar.add(item);
			} else {
				//如果只有一个按钮则直接显示
				if (extItems.length == 1) tbar.add(extItems[0]);
			}

			//添加查询条件
			if (self.state == '0' && (self.param.hasQuery == null || self.param.hasQuery==true)) {
				//tbar.add('->');
				//判断是采用原公共查询还是采用新的查询模式
				if (Jxstar.systemVar.useCase == '1') {
					if (self.param.showNotQryCase) {
						Jxstar.simpleQuery(self, true);
					} else {
						JxQuery.showCase(self);
					}
				} else {
				//支持部分功能采用查询方案，缺省采用通用查询
					if (self.param.showQryCase) {
						JxQuery.showCase(self);
					} else {
						Jxstar.simpleQuery(self, true);
					}
				}
			}
						
			tbar.doLayout();
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