/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 前台框架代号为：jxstar，Jxstar类为核心公共对象。
 * 
 * 扩展表格Grid对象的属性：
 * pkName -- 主键名
 * fkName -- 外键名，在FORM记录保存后回写需要用到
 * fkValue -- 外键值，在保存数据时必须传递到后台
 * pageType -- 页面类型
 * isShow -- 是否初始显示数据
 * selectKeyId -- 选择的单条记录ID，用于识别当前选择的记录
 *
 * cmpTree      -- 添加了树形控件，该属性必须延时1s才能取到
 * treeNodeAttr -- 点击的树形节点的属性
 *              -- 常见属性名称有：id, text, node_level, tree_no, table_name, 附加属性等
 *
 * jxstarParam.old_wsql -- 原查询语句，如数据导入窗口的过滤语句，在通用查询时用到
 * jxstarParam.old_wtype -- 原查询参数类型
 * jxstarParam.old_wvalue -- 原查询参数值
 * jxstarParam.tree_wsql -- 树型查询语句，在通用查询时用到
 * jxstarParam.tree_wtype -- 树型查询参数类型
 * jxstarParam.tree_wvalue -- 树型查询参数值
 *
 * 还有Grid.Event.dataImport、upload方法中有使用自定义参数，在方法中消除
 * 
 * 扩展表单Form对象的属性：
 * myGrid -- 对应的表格对象
 * myRecord -- 当前显示的记录对象
 * myStore -- 当前显示的记录库
 * fkName -- 外键字段名
 * fkValue -- 外键值
 * srcEvent -- 新增来源事件名
 * 
 * ColumnModel.config 增加 defaultval 配置项，配置缺省值，
 * 可以是字符串与函数，在editgrid中新增记录时给缺省值。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Ext.ns('Jxstar');
(function(){

	Ext.apply(Jxstar, {
		//每页记录数
		pageSize: 50,
		//当前表格记录起始序号，解决分页显示记录时序号不累加的问题，在JxExt中赋值
		startNo: 0,

		//当前程序会话信息
		session: {},
		
		//当前用户授权的功能ID，在显示功能菜单时添加授权功能ID
		rightNodes: [],
		
		//流程绘图对象，在designer_process.render方法中创建绘图对象
		editor: null,
		
		//保存系统环境变量
		systemVar: {},
		
		/**
		* 在首页的TAB上打开一个功能页面，
		* 
		* nodeId：功能ID
		* pageParam: 页面参数对象
		*	pageType -- 页面类型
		*	parentNodeId -- 父功能ID
		*   isQuery -- 是否工具栏查询，如果是1，则不保存原始查询SQL
		*	whereSql -- 过滤wheresql语句
		*	whereValue -- 过滤语句参数值
		*	whereType -- 过滤语句参数类型
		*	showType -- 审批界面显示样式：grid, form, report
		*	updateId -- 指定form要显示的记录ID
		*   isNotRight -- 不判断功能权限
		*/
		createNode: function(nodeId, pageParam) {
			if (nodeId == null || nodeId.length == 0) {
				JxHint.alert(jx.star.noid);	//'打开的功能ID为空！'
				return false;
			}
			
			//功能对象信息
			var define = Jxstar.findNode(nodeId);
			if (define == null) {
				JxHint.alert(String.format(jx.star.nodef, nodeId));	//'没有定义【{0}】功能页面信息！'
				return false;
			}
			//需要打开新的window窗口显示
			if (define.isOpenWin) {
				var url = 'page.jsp?nodeid='+nodeId;
				window.open(url);
				return;
			}
			//支持扩展功能打开参数
			if (define.showType) {
				pageParam = Ext.apply(pageParam||{}, {showType:define.showType});
			}
			if (define.isfast) {
				pageParam = Ext.apply(pageParam||{}, {isfast:true});
			}
			
			//检查用户是否有该功能的权限，审批时不判断
			var isNot = (pageParam && pageParam.isNotRight == '1');
			var isCheck = (pageParam && pageParam.pageType && pageParam.pageType == 'check');
			if (!isCheck && !isNot && !Jxstar.validNode(nodeId)) {
				JxHint.alert(String.format(jx.star.noright, nodeId));	//'用户没有该【{0}】功能的授权！'
				return false;
			}
			
			//取主功能TAB
			var mainTab = Jxstar.sysMainTab;
			var funTitle = define.nodetitle;
			if (pageParam && pageParam.funTitle) funTitle = pageParam.funTitle;
			
			//如果打开了功能界面就显示，否则创建功能界面
			var funTab = mainTab.getComponent('fun_' + define.nodeid);
			
			//如果是审批界面，功能标题上添加'--审批'
			if (isCheck) funTitle += jx.base.check;	//审批
			//为了数据及时，如果已显示，则先删除该功能再显示
			if (funTab != null) {
				mainTab.remove(funTab, true);
				funTab = null;
			}
			
			//异步加载功能对象后再显示
			var hdCall = function(f) {
				var page = f(define, pageParam);
				if (!page) return;//单执行脚本
				
				//如果不是layout页面，是GridNode页面，则有showPage方法
				if (typeof page.showPage == 'function') {
					pageParam = pageParam || {};
					page = page.showPage(pageParam.pageType, pageParam.parentNodeId);
				}
				
				//如果表格页面没有border，则布局显示border
				var border = false;//(page.isXType('grid') && !page.border);
				var id = 'fun_' + define.nodeid;
				funTab = mainTab.add({
					id: id,
					label: funTitle,
					border: border,
					layout: 'fit',
					closable: true,
					autoScroll: true,
					//iconCls: 'function',
					items: [page],
					listeners: {//下面的方法有利于释放内存对象
						beforedestroy: function(){
							page = null;
							funTab = null;
						},
						destroy: function(){
							if(Ext.isIE){CollectGarbage();}//IE强制回收内存
						}
					}
				});
				mainTab.activate(funTab);
				
				//显示表格对象后再加载数据才稳定
				if (page.isXType('grid')) {
					if (pageParam && pageParam.whereSql && pageParam.whereSql.length > 0) {
						Jxstar.loadData(page, {where_sql:pageParam.whereSql, where_value:pageParam.whereValue, where_type:pageParam.whereType, is_query:pageParam.isQuery, query_type:pageParam.queryType||'0'});
					} else {
						Jxstar.loadInitData(page);
					}
				}
				page = null;
			};

			//异步从JS文件加载功能对象
			var pathname = define.layout;
			if (pathname == null || pathname.length == 0) pathname = define.gridpage;
			if (pathname == null || pathname.length == 0 || pathname.indexOf('.jsp') > -1) {
				JxHint.alert(String.format(jx.star.nopage, nodeId));
				return false;
			}
			Request.loadJS(pathname, hdCall);
		},

		/**
		* 创建页面对象，可以是form与grid
		* 
		* nodeId：功能ID
		* pageName：页面类型gridpage|formpage 
		* target：功能对象显示的窗口
		* pageParam: 页面参数对象，与上面的参数相同
		*/
		createPage: function(nodeId, pageName, target, pageParam) {
			if (nodeId == null || nodeId.length == 0) {
				JxHint.alert(jx.star.noid);	//'打开的功能ID为空！'
				return;
			}

			//功能对象信息
			var define = Jxstar.findNode(nodeId);
			if (define == null) {
				JxHint.alert(String.format(jx.star.nodef, nodeId));	//'没有定义【{0}】功能页面信息！'
				return;
			}

			//取创建页面的函数
			var hdCall = function(f) {
				var page = f(define, pageParam);
				//如果不是layout页面，是GridNode页面，则有showPage方法
				if (typeof page.showPage == 'function') {
					pageParam = pageParam || {};
					page = page.showPage(pageParam.pageType, pageParam.parentNodeId);
				}
				//构建子对象后，再构建容器对象
				var lc = pageParam.layoutCall;
				if (lc) {
					lc(page);
				} else {
					//把新页面添加到目标窗口中
					target.add(page);
					//重新显示目标窗口
					target.doLayout();
				}
				//保存传递参数到页面对象
				page.pageParam = pageParam;
				
				//显示页面对象后执行回调方法
				var sc = pageParam.showCall;
				if (sc) sc(page);
				
				//显示表格对象后再加载数据才稳定
				if (page.isXType('grid')) {
					//page.focus();//聚焦表格对象
					
					//打开功能缺省显示界面，可以显示：grid, form, chkreport
					if (pageParam && pageParam.showType && (pageParam.showType == 'form' || pageParam.showType == 'report')) {
						var store = page.getStore(); if (store == null) return;
						store.on('load', function(){
							if (page == null) return;
							//找到指定的行
							var row = 0;
							if (pageParam.updateId != null && pageParam.updateId.length > 0) {
								row = store.find(define.pkcol, pageParam.updateId);
							}
							if (row < 0) return true;
							page.getSelectionModel().selectRow(row);
							//显示审批单
							if (pageParam.showType == 'report') {
								page.gridNode.event.viewHtmlReport();
							} else {
								//显示form界面
								if (store.getCount() > 0) {
									page.gridNode.event.showForm();
								}
							}
							page = null;
						});
					}
					
					//先邦定store事件，再加载数据
					if (pageParam && pageParam.whereSql && pageParam.whereSql.length > 0) {
						Jxstar.loadData(page, {where_sql:pageParam.whereSql, where_value:pageParam.whereValue, where_type:pageParam.whereType, is_query:pageParam.isQuery, query_type:pageParam.queryType||'0'});
					} else {
						//控制数据导入第一次不刷新
						if (pageParam.pageType != 'import') {
							Jxstar.loadInitData(page);
						}
					}
				} else {
					//支持portlet界面加载后，执行回调方法加载数据
					if (page.reload) page.reload();
				}
				//重新布局页面，否则在IE11下快速新建有时会显示不全
				if (page.isXType('form')) page.doLayout();
			};

			//异步从JS文件加载功能对象
			var pageUrl = define[pageName];
			if (pageUrl.length == 0) {
				JxHint.alert(String.format(jx.star.nopage, nodeId));	//'没有定义【{0}】功能页面信息！'
				return false;
			}
			Request.loadJS(pageUrl, hdCall);
		},

		/**
		* 创建树型对象
		* 
		* nodeId：功能ID
		* target：功能对象显示的窗口
		* [treePanel]: 指定树形控件的显示位置
		* [dataPanel]: 指定数据表格的显示位置
		* [preClickFn]: 点击树形节点前执行的事件，参数是树形布局控件
		*/
		createTree: function(nodeId, target, treePanel, dataPanel, preClickFn) {
			if (nodeId == null || nodeId.length == 0) {
				JxHint.alert(jx.star.notreeid);	//'打开的树型功能ID为空！'
				return;
			}

			treePanel = treePanel || target.getComponent(0);
			dataPanel = dataPanel || target.getComponent(1);

			//根节点ID
			var ROOT_ID = '10';
		
			var createTreeTeam = function(isTeam, team_id, team_title) {
				//查询数据URL
				var dataUrl = Jxstar.path + '/commonAction.do?eventcode=query_tree&funid=queryevent';
					dataUrl += '&tree_funid='+nodeId+'&user_id='+Jxstar.session['user_id'];
				
				var tbar = new Ext.Toolbar();
				var tree = new Ext.tree.TreePanel({
					teamid: (isTeam) ? team_id : '',
					tbar: (isTeam) ? null : tbar,
					border:false,
					
					autoScroll:true,
					rootVisible:false,
					lines:false,
					useArrows:false,
					
					loader: new Ext.tree.TreeLoader({
						dataUrl: dataUrl,
						listeners: {
							beforeload:function(loader, node){
								loader.baseParams.tree_no = node.attributes.tree_no||'';
								if (isTeam) loader.baseParams.team_id = team_id;
							}
						}
					}),
					
					root: new Ext.tree.AsyncTreeNode({id:ROOT_ID, iconCls:'tree_root_ext', text:jx.star.refresh})
				});
				
				//设置树根节点数据加载时添加配置信息
				tree.on('load', function(node){
					if (node.id == ROOT_ID) {
						var child = node.firstChild;
						if (!child) return;
						
						var attr = child.attributes;
						//取树形标题的多语言文字
						var title = JxLang.otherText('treetitle', nodeId+'__'+attr.tree_no, attr.tree_title);
						if (title.length > 0) {
							tbar.items.get(0).setText(title);
						}
						node.attributes.tree_no = attr.tree_no;
						node.attributes.table_name = attr.table_name;
						node.attributes.node_level = attr.node_level;
						node.attributes.right_where = attr.right_where;
						
						//临时根节点用于传递树定义信息，需要删除
						if (child.id == '10') child.remove(true);
					}
				});
				
				//添加刷新按钮
				var hd = function(){
					tree.getLoader().load(tree.getRootNode());
					tree.fireEvent('click', tree.getRootNode());
				};
				tbar.add({text:jx.star.refresh, cls:'x-btn x-btn-white', handler:hd});//iconCls:'tree_root'
				
				//处理目标表格对象查询与属性
				var delayFun = function() {
					var tabPanel = dataPanel.getComponent(0);
					var grid = tabPanel;
					//有些左右表格布局，不能用tabpanel判断
					if (!tabPanel.isXType('grid')) {
						var tp = tabPanel.getComponent(0);
						if (tp) grid = tp.getComponent(0);
					}
					var root = tree.getRootNode();
					//展开根节点，根节点不显示
					//root.expand();

					//设置根节点树型信息
					var ra = root.attributes;
					grid.treeNodeAttr = {id:'', text:'', node_level:ra.node_level, 
						tree_no:ra.tree_no, table_name:ra.table_name};
					//添加树形控件
					grid.cmpTree = tree;

					//添加节点点击事件，查询树形数据
					tree.on('click', function(node){
						//如果有自定义点击事件，则不处理
						if (tree.hasCustClick) return;
						
						//切换到第一个标签页
						if (tabPanel.isXType('tabpanel')) {
							tabPanel.activate(tabPanel.getComponent(0));
						}
						//云布局中返回列表
						var define = Jxstar.findNode(nodeId);
						if (define && define.isCloud) {
							var ct = JxCloud.apps[nodeId];
							if (ct) {
								var ly = ct.getLayout();
								ly.setActiveItem(0);
								ly.activeItem.doLayout();
							}
						}
						
						//扩展点击前事件，主要处理扩展的查询条件
						var extWhere = null;//{where_sql:where_sql, where_value:where_value, where_type:where_type}
						if (preClickFn!= null && typeof preClickFn == 'function') {
							extWhere = preClickFn(tree, node, grid);
						}
						
						var attr = node.attributes;
						var treeId = attr.id;
						//var treeLevel = Math.floor(treeId.length/4)+1;
						var treeLevel = JxUtil.calTreeLevel(treeId)+1;
						
						//注册的树形查询条件
						var where_type = 'string';
						var where_value = treeId+'%';
						var where_sql = attr.right_where;
						if (where_sql && where_sql.length > 0) {
							where_sql = '(' + where_sql + ')';
						}
						
						//是否不含下级
						var tbar = tree.getTopToolbar();
						if (tbar) {
							var tools = tbar.find('xtype', 'checkbox');
							if (tools.length > 0) {
								if (tools[0].getValue() == '1') {
									where_value = treeId;
								}
							}
						}
						//如果过滤条件是=，则不添加%
						if (where_sql.indexOf('=') >= 0) {
							where_value = treeId;
						}
						
						//如果是根节点
						if (ROOT_ID == treeId) {
							where_value = '%';
						}
						
						//如果wheresql中有[tree_id]，则需要用where_value替换
						if (where_sql.indexOf('[tree_id]') >= 0) {
							var re = /\[tree_id\]/g;
							where_sql = where_sql.replace(re, where_value)
						}
						//如果wheresql中没有?，则type, value都设为空，只允许有一个?号
						if (where_sql.indexOf('?') < 0) {
							where_type = '', where_value = '';
						}
						
						//扩展的树形查询条件
						if (extWhere != null) {
							if (!Ext.isEmpty(extWhere.where_sql)) {
								where_sql += ' and ' + extWhere.where_sql;
							}
							if (!Ext.isEmpty(extWhere.where_value)) {
								where_value += ';' + extWhere.where_value;
							}
							if (!Ext.isEmpty(extWhere.where_type)) {
								where_type += ';' + extWhere.where_type;
							}
						}
						
						//如果是树型功能，则只显示下级数据
						//以前是根据左边表名相等来判断是否需要增加级别过滤
						var reg_type = grid.gridNode ? grid.gridNode.define.regtype : '';
						if (reg_type == 'treemain' && (attr.tree_no == '1' || attr.tree_no == '')) {
							if (attr.has_level == '1' && treeLevel > 1) {
								where_sql += ' and (' + attr.node_level + ' = ? or ' + attr.node_level + ' = ?)';
								where_value += ';' + treeLevel + ';' + (treeLevel-1);
								where_type += ';int;int';
							} else {
								//where_sql += ' and ' + attr.node_level + ' = ?';
								//where_value += ';' + treeLevel;
								//where_type += ';int';
							}
						}
						
						//where_type第一个字符为;，则去掉，因为没有?
						if (where_type.charAt(0) == ';') {
							where_type = where_type.substring(1, where_type.length);
							where_value = where_value.substring(1, where_value.length);
						}
						
						//保存树形查询参数
						if (!grid.jxstarParam) grid.jxstarParam = {};
						grid.jxstarParam.tree_wsql = where_sql;
						grid.jxstarParam.tree_wtype = where_type;
						grid.jxstarParam.tree_wvalue = where_value;
						
						//提交后台查询请求
						if (grid.isXType('grid')) {
							Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type, is_query:1});
						} else if (grid.isXType('treegrid')) {
							JxTreeGrid.myQuery(grid, [where_sql, where_value, where_type], '0');
						}
						
						//添加树形参数值
						grid.treeNodeAttr = attr;
					});
					
					//去掉相关对象的引用
					tree.on('beforedestroy', function(){
						grid = null;
						tabPanel = null;
						dataPanel = null;
					});
				};
				
				//取树形目标表格对象
				var getTreeGrid = function(dataPanel) {
					var tabPanel = dataPanel.getComponent(0);
					if (Ext.isEmpty(tabPanel)) return null;
					
					var grid = tabPanel;
					if (!tabPanel.isXType('grid')) {
						var tp = tabPanel.getComponent(0);
						if (tp) grid = tp.getComponent(0);
					}
					return grid;
				};
				
				//延时执行该方法
				var callhd = function() {
					var grid = getTreeGrid(dataPanel);
					if (Ext.isEmpty(grid)) {
						JxUtil.delay(500, callhd);
					} else {
						delayFun();
					}
				};
				JxUtil.delay(1000, callhd);
				
				return tree;
			};
			
			var tree;
			//var params = 'eventcode=query_team&funid=queryevent&tree_funid='+nodeId;
			var hdCall = function(data) {
				//如果没有树形组，则创建单树
				if (Ext.isEmpty(data)) {
					tree = createTreeTeam(false);
					treePanel.add(tree);
					treePanel.doLayout();
					return;
				}
				//如果有多个树形控件，不采用抽屉布局，改为card布局
				var isTeam = data.length > 1;
				var cur_tree;
				if (isTeam) {
					var comboData = new Array();
					for (var i = 0, n = data.length; i < n; i++) {
						var key = nodeId + '__' + data[i].team_id;
						var title = JxLang.otherText('treetitle', key, data[i].team_title);
						comboData[i] = [data[i].team_id, title];
					}
					
					var combo = Jxstar.createCombo('sel_tree', comboData, 130);
					//添加comboBox
					var tbar = treePanel.getTopToolbar();
					tbar.add(combo);
					
					combo.on('select',function(cb){
						var value = cb.value;
						cur_tree = null;
						treePanel.items.each(function(item){
							if (item.teamid == value) {
								cur_tree = item;
							}
						});
						if(cur_tree) {
							treePanel.layout.setActiveItem(cur_tree.id);
						}
					});
					
					//添加刷新按钮
					var hd = function(){
						cur_tree.getLoader().load(cur_tree.getRootNode());
						cur_tree.fireEvent('click', cur_tree.getRootNode());
					};
					tbar.add('->',{text:'',iconCls:'x-tbar-loading', handler:hd});
					
					//treePanel.border = true;
					treePanel.layout = new Ext.Container.LAYOUTS['card'];
				}
				
				for (var i = 0, n = data.length; i < n; i++) { 
					var key = nodeId + '__' + data[i].team_id;
					//取树形组标题多语言文字
					var title = JxLang.otherText('treetitle', key, data[i].team_title);
					tree = createTreeTeam(isTeam, data[i].team_id, title);
					treePanel.add(tree);
					treePanel.doLayout();
				}
				
				treePanel.activeItem = 0;
				cur_tree = treePanel.getComponent(0);
			}
			//Request.dataRequest(params, hdCall);//由于是异步，外部方法取不到tree
			var define = Jxstar.findNode(nodeId);
			hdCall(define.treeteam);
			
			return tree;
		},

		/**
		* 打一个弹出Form界面窗口，
		* items参数：
		* filename：显示文件类名
		* title：窗口标题
		* grid: 来源grid
		* width：窗口宽度
		* height: 窗口高度
		* pagetype: 页面类型
		* parentNodeId: 父功能ID
		* record: 记录数据
		* store: 存储对象
		*/
		openSubForm: function(cfg) {
			//异步加载功能对象后再显示
			var hdCall = function(f) {
				var page = f();
				if (typeof page.showPage == 'function') {
					page = page.showPage(cfg.pagetype||'form', cfg.parentNodeId);
				}

				//创建对话框
				var	win = new Ext.Window({
					title: cfg.title,
					layout: 'fit',
					width: cfg.width || 800,
					height: cfg.height || 500,
					constrainHeader: true,
					//resizable: true,
					modal: true,
					border: false,
					closeAction: 'close',
					autoScroll: true,
					//style: 'padding: 5px;',
					items: [page]
				});
				win.show();

				//加载表单数据
				if (cfg.store != null) {
					var form = page.getForm();
					form.myGrid = cfg.grid;
					form.myStore = cfg.store;

					if (cfg.record == null) {
						page.formNode.event.create();
					} else {
						form.myRecord = cfg.record;
						form.loadRecord(cfg.record);
					}

					//设置外键值
					form.fkName = cfg.grid.fkName;
					form.fkValue = cfg.grid.fkValue;
					
					//显示FORM时，执行初始化事件
					page.formNode.event.initForm(true);
				}
			};
			
			//异步从JS文件加载功能对象
			Request.loadJS(cfg.filename, hdCall);
		},

		/**
		* 切换到Form界面，约定第一个标签为grid，第二个标签为form
		* items参数：
		* define: 当前功能定义对象
		* grid: 当前grid控件
		* record: 记录数据
		* store: 存储对象
		*/
		showForm: function(items) {
			//取当前功能的数据面板
			var tabpanel = items.grid.findParentByType('tabpanel');
			if (tabpanel == null) return;
			var formpanel = tabpanel.getComponent(1);
			if (formpanel == null) return;
			var formpage = formpanel.getComponent(0);
			if (formpage == null || !formpage.isXType('form')) return;
			
			var form = formpage.getForm();
			form.myGrid = items.grid;
			form.myStore = items.store;
			
			//设置外键值
			form.fkName = items.grid.fkName;
			form.fkValue = items.grid.fkValue;
			
			//打开form的来源事件，在布局页面中切换tab时需要判断
			form.srcEvent = 'create';
			
			//如果记录为空，表示新增记录
			if (items.record == null) {
				//临时采用form对象保存表单对象来处理
				formpage.formNode.event.create();
			} else {
				form.myRecord = items.record;
				form.loadRecord(items.record);
			}
			//切换到form页面
			tabpanel.activate(formpanel);
		},

		/**
		* 打一个弹出的数据窗口，
		* items参数：
		* wincfg: window的通用属性
		* modal: 是否模态
		* pagetype: 页面类型
		* filename: 显示文件类名
		* title: 窗口标题
		* width: 窗口宽度
		* height: 窗口高度
		* callback: 回调函数
		*/
		showData: function(cfg) {
			//异步加载功能对象后再显示
			var hdCall = function(f) {
				var page = f(cfg.nodedefine, {pageType:cfg.pagetype});
				if (typeof page.showPage == 'function') {
					page = page.showPage(cfg.pagetype);
				}
				
				var modal = cfg.modal;
				if (cfg.modal == null) modal = true;
				var wincfg = {
					title: cfg.title,
					layout: 'fit',
					width: cfg.width || 800,
					height: cfg.height || 500,
					constrainHeader: true,
					//resizable: true,
					border: false,
					modal: modal,
					closeAction: 'close',
					autoScroll: true,
					//style: 'padding: 5px;',//否则内部panel宽度会多10px
					items: [page]
				};
				if (cfg.wincfg) {
					Ext.apply(wincfg, cfg.wincfg);
				}
				//创建对话框
				var	win = new Ext.Window(wincfg);
				//显示
				win.show();
				//执行回调函数
				if (cfg.callback) cfg.callback(page);
			};

			//异步从JS文件加载功能对象
			Request.loadJS(cfg.filename, hdCall);
		},
		
		/**
		* 打当前功能的高级查询对话框
		* nodePage -- 当前功能对象
		*/
		showQuery: function(nodePage) {
			//异步加载功能对象后再显示
			var hdCall = function(queryData) {
				var page = JxSearch.queryWindow(queryData, nodePage);

				//创建对话框
				var	win = new Ext.Window({
					title: jx.star.hqry,	//'高级查询'
					layout: 'fit',
					width: 750,
					height: 450,
					constrainHeader: true,
					resizable: false,
					modal: true,
					closeAction: 'close',
					//style: 'padding: 5px;',
					items: [page]
				});
				//显示
				win.show();
			};
			
			//加载当前功能的高级查询界面
			var params = 'funid=queryevent&eventcode=cond_query';
			params += '&selfunid='+nodePage.nodeId;
			Request.dataRequest(params, hdCall);
		},

		/**
		* 从后台取部分数据到前台加工处理
		* 
		* nodeid: 功能ID
		* options: 请求参数：where_sql, where_value, where_type, callback
		* return 返回的数据结果是一个数组
		*/
		queryData: function(nodeid, options) {
			if (nodeid == null || nodeid.length == 0 || options == null) {
				JxHint.alert(jx.star.noparam);	//'加载数据的参数不正确！'
				return false;
			}
		
			var params = 'eventcode=query_data&funid=queryevent&query_funid='+nodeid;
			params += '&where_sql=' + options.where_sql || '';
			params += '&where_value=' + options.where_value || '';
			params += '&where_type=' + options.where_type || '';
			
			var hdCall = function(data) {
				if (options.callback) {
					options.callback(data.root);
				}
			};
			
			Request.dataRequest(params, hdCall);
		},
		
		/**
		* 加载子表格的数据，
		* 
		* grid: 表格对象
		* fkval: 外键值
		*/
		loadSubData: function(grid, fkval) {
			if (grid == null) return;
			if (!grid.isXType('grid')) {
				if (grid.isXType('treegrid')) {
					grid.loadTreeData({dataId:fkval});
					return;
				} else {
					JxHint.alert(jx.star.nosubgrid);	//'无法识别子表对象，不能加载数据！'
					return;
				}
			}
			if (fkval == null || fkval.length == 0) return;
			//取主键名
			var fkName = grid.fkName;
			if (fkName == null || fkName.length == 0) {
				JxHint.alert(jx.star.nofk);		//'该功能没有注册外键！'
				return false;
			}
			fkName = fkName.replace('__', '.');
			//添加外键值
			grid.fkValue = fkval;
			
			//提交后台查询请求
			var wsql = fkName + ' = ?';
			var whereParam = {where_sql:wsql, where_value:fkval, where_type:'string'};
			
			//扩展子功能wheresql，用fkval作为参数
			if (grid.subWhereSql) {
				whereParam.where_sql = grid.subWhereSql();
			}
			//扩展子功能whereparam，可以自定义修改外键值
			if (grid.subWhereParam) {
				whereParam = grid.subWhereParam();
			}
			//把父功能ID传递到后台，支持{PFUNID}作为where值写到功能信息中
			if (grid.gridNode) {
				var pfunid = grid.gridNode.parentNodeId;
				if (pfunid && pfunid.length > 0) {
					whereParam.parent_funid = pfunid;
					whereParam.parent_keyid = fkval;
				}
			}
			Jxstar.loadData(grid, whereParam);
		},

		/**
		* 重载表格的数据，去掉了所有后加的查询条件。
		* 
		* grid: 表格对象
		*/
		reload: function(grid) {
			grid.getStore().load({params:{start:0,limit:Jxstar.pageSize}});
		},

		/**
		* 重载表格的数据，
		* 
		* grid: 表格对象
		* options: 查询参数对象，参数有：
		*	where_sql -- 过滤语句
		*	where_value -- 参数值 
		*	where_type -- 参数类型
		*	is_query -- 为1表示是工具栏查询，则附加原查询语句查询，且不保存当前查询语句，为空则需要保存查询语句，如数据导入
		*	query_type -- 缺省值为0，为1表示是高级查询，高级查询不处理归档，可以查询已复核的数据
		*	has_page -- 缺省值为1，为1表示处理分页查询，否则不处理分页查询
		*/
		loadData: function(grid, options) {
			if (grid == null || grid.getStore() == null) return;
			
			//缺省查询条件添加的位置
			var wpos = Jxstar.systemVar.page__where__pos||'end';
			
			//保存原查询语句，如数据导入时用到
			if (options.is_query == null) {
				grid.jxstarParam.old_wsql = options.where_sql||'';
				grid.jxstarParam.old_wtype = options.where_type||'';
				grid.jxstarParam.old_wvalue = options.where_value||'';
			} else {
			//取原查询语句
				var old_wsql = grid.jxstarParam.old_wsql;
				var old_wtype = grid.jxstarParam.old_wtype;
				var old_wvalue = grid.jxstarParam.old_wvalue;
				if (old_wsql && old_wsql.length > 0) {
					if (options.where_sql && options.where_sql.length > 0) {
						if (wpos == 'end') {
							options.where_sql = '(' + old_wsql + ') and (' + options.where_sql + ')';
						} else {
							options.where_sql = '(' + options.where_sql + ') and (' + old_wsql + ')';
						}
					} else {
						options.where_sql = old_wsql;
					}
				}
				if (old_wtype && old_wtype.length > 0) {
					if (options.where_type && options.where_type.length > 0) {
						if (wpos == 'end') {
							options.where_type = old_wtype + ';' + options.where_type;
						} else {
							options.where_type = options.where_type + ';' + old_wtype;
						}
					} else {
						options.where_type = old_wtype;
					}
				}
				if (old_wvalue && old_wvalue.length > 0) {
					if (options.where_value && options.where_value.length > 0) {
						if (wpos == 'end') {
							options.where_value = old_wvalue + ';' + options.where_value;
						} else {
							options.where_value = options.where_value + ';' + old_wvalue;
						}
					} else {
						options.where_value = old_wvalue;
					}
				}
			}
			//根据分页工具栏取每页记录数
			var pageSize = JxUtil.getPageSize(grid);
			var params = Ext.apply({start:0, limit:pageSize}, options);
			grid.getStore().load({params:params});
			
			SessionTimer.resetTimer();
		},

		/**
		* 加载表格的初始数据，
		* 
		* grid: 页面对象
		*/
		loadInitData: function(grid) {
			if (grid != null && grid.isXType('grid')) {
				var store = grid.getStore();
				var pagetype = grid.pageType;
				//combogrid类型的表格在createSelectWin()方法中加载数据
				//子表数据也不执行初始加载，否则会报this.grid is null的错误
				if (store != null && grid.isShow == '1' && (pagetype != 'combogrid' && pagetype.indexOf('sub') < 0)) {
					var pageSize = JxUtil.getPageSize(grid);
					store.load({
						params:{start:0,limit:pageSize}
					});
				}
			}
			
			SessionTimer.resetTimer();
		},

		/**
		* private:表格加载数据后的回调函数，
		* 
		* page: 页面对象
		*/
		loadDataBc: function(grid) {
			if (grid == null || grid.getStore() == null) return;

			var count = grid.getStore().getCount();
			var selmodel = grid.getSelectionModel();
			var rowIndex = Jxstar.getSelectIndex(grid);
			if (rowIndex > -1 && count > 0 && typeof selmodel.selectRow != 'undefined') {
				selmodel.selectRow(rowIndex);
				if (count > 0 && grid.pageType != 'combogrid') {
					grid.fireEvent('rowclick', grid, rowIndex);
				}
			}

			//显示统计数据
			Jxstar.viewSumData(grid);
			
			//处理表格记录是否有附件的标志
			JxAttach.viewAttachFlag(grid);
		},
		
		/**
		 * 根据表格当前选择的记录ID取行号；
		 * 缺省不选择第1行记录；
		 **/
		getSelectIndex: function(grid) {
			if (grid == null || grid.getStore() == null) return 0;
			var selectKeyId = grid.selectKeyId || '';
			var rowIndex = -1, store = grid.getStore();
			if (selectKeyId.length > 0) {
				var pkcol = grid.gridNode.define.pkcol;
				var index = store.find(pkcol, selectKeyId);
				if (index > -1) rowIndex = index;
			}
			
			return rowIndex;
		},

		/**
		* private:在分页栏中显示统计数据
		* 被JxUtil.viewSumData方法替换。
		* 
		* page: 页面对象
		*/
		viewSumData: function(grid) {
			var sumData = grid.getStore().reader.jsonData.data.sum;
			
			if (sumData != null && sumData.length > 0) {
				if (grid.jxsum) {
					grid.jxsum.refresh({data: sumData[0]});
				} else {
					var sum = new Jxstar.JxSum();
					sum.init(grid);
					sum.refresh({data: sumData[0]});
				}
			}
		},
		
		/**
		* 查找功能定义信息，采用静态文件，不采用动态加载的方式，
		* 这点不再做其它测试，两者性能相差5倍。
		* nodeId: 功能ID
		*/
		findNode: function(nodeId) {
			var define = NodeDefine[nodeId];
			if (define == null) {
				return {gridpage:'', formpage:''};
			}
			
			//处理功能名称的多语言
			define.nodetitle = JxLang.funText(define.nodeid, define.nodetitle);

			return define;
		},
		
		/**
		* 检查功能ID是否是已授权的功能ID
		* nodeId: 功能ID
		*/
		validNode: function(nodeId) {
			//集成页面不判断授权
			if (Jxstar.isone == '1') return true;
			
			var self = this;
			//如果是管理员，则不校验
			if (JxUtil.isAdminUser()) return true;
			
			//检查功能ID是否在授权的功能ID数组中
			for (var i = 0; i < self.rightNodes.length; i++) {
				if (self.rightNodes[i] == nodeId) return true;
			}
			return false;
		},

		/**
		* 查找下拉选项控件，
		* 
		* comboID: 选项代号
		*/
		findComboData: function(comboID) {
			var define = ComboData[comboID];
			if (define == null) {
				define = [['', '']];
			}

			return define;
		},

		/**
		* 创建一个显示下拉选项数据的块，
		* 
		*/
		createComboMenu: function(parentField) {
			var m = new Ext.menu.Menu({width:450, height:350});
			m.parentField = parentField;

			return m;
		},

		/**
		* 创建一个下拉选项对象，
		* 
		* comboName: 选项代号
		* comboData: 选项数据
		* comboWidth: 控件宽度
		*/
		createCombo: function(comboName, comboData, comboWidth) {
			var combo = new Ext.form.ComboBox({
				name:comboName, 
				store: new Ext.data.SimpleStore({
					fields:['value','text'],
					data: comboData
				}),
				emptyText: jx.star.select,	//'请选择'
				mode: 'local',
				triggerAction: 'all',
				valueField: 'value',
				displayField: 'text',
				editable:false,
				width: comboWidth||80,
				value: comboData[0][0]});
			
			return combo;
		},

		/**
		* 创建表格快速简单查询
		*/
		simpleQuery: function(nodePage, isTree) {
			var page = nodePage.page;
			var tbar = page.getTopToolbar();
			
			//添加查询字段
			Jxstar.addBaseQry(nodePage, tbar, isTree);
		},
		//同时用于JxQuery的简单查询
		addBaseQry: function(nodePage, tbar, isTree) {
			var self = this;
			var page = nodePage.page;
			var first = nodePage.define.first;
			
			var fields = ['nofield']; //查询字段
			var titles = ''; //字段标题
			//取查询字段：如果没有设置查询字段，则取第一个字段
			var mycols = nodePage.param.cols;
			if (first.length > 0) {
				first = first.replace(/\./g, '__');
				fields = first.split(',');
			}
			
			for (var j = 0; j < fields.length; j++) {
				for (var i = 0, c = 0, n = mycols.length; i < n; i++){
					var col = mycols[i].col, field = mycols[i].field;
					if (field == null || field.name.length == 0) continue;
					if (field.type != 'string') continue;
					
					var h = col.header;
					if (h.charAt(0) == '*') h = h.substr(1);
					
					if (fields[0] == 'nofield') {
						titles = h;
						first = field.name;
						break;
					} else if (fields[j] == field.name || (field.name+'&').indexOf('__'+fields[j]+'&') > 0) {
						titles += h;
						if (j < fields.length-1) {
							titles += ', ';
						}
					}
				}
			}
			titles = jx.cloud.text11 + titles;//'回车搜索：'
			
			var qid = JxUtil.newId()+'_fqv', qidi = qid+'i', qidx = qid+'x', qidb = qid+'b';
			var h = (tbar.name) ? 27 : 30;//子表用
			
			//添加一个文本输入栏，用于输入查询值
			tbar.add({xtype:'box', itemId:qidb, width:250, style:'position:relative;', html:
				'<input id="'+qid+'" style="width:250px; padding-left:10px; padding-right:25px; border-radius: 5px !important; height:'+h+'px !important;" '+
					'class="x-form-text x-form-field" type="text" placeholder="'+ titles +'" data-fields="'+ first +'"></input>'+
				'<i id="'+qidi+'" class="ace-icon fa eb_query x-btn-qryi"></i>'
			});
			if (tbar.isXType('toolbar')) {
				tbar.add({text:jx.cloud.text12, cls:'x-btn x-btn-qry', tooltip:jx.star.hqry, //高级
					handler:function(){ self.showQuery(nodePage); } });
				tbar.add({xtype:'box', itemId:'qidx', width:20, hidden:true, html:
					'<i id="'+qidx+'" class="ace-icon fa eb_clear x-btn-qryx"></i>'});
			}
			//刷新工具栏
			tbar.doLayout();
			
			//绑定查询方法
			var qryfn = function(){
				//清空查询条件
				var qidx = tbar.getComponent('qidx');
				if (qidx && qidx.el) {
					qidx.el.on('click', function(){
						qidx.setVisible(false);
						delete page.qryCondData;
						Jxstar.myQuery(page);
					});
				}
				var fqv = Ext.get(qid);
				if (fqv) {
					fqv.on('keydown', function(e, t){
						if (e.getKey() == e.ENTER) {
							fastQuery(first, fqv.dom.value);
							e.preventDefault();//避免在IE中出发分页combo控件事件
							//清除高级查询内容
							if (qidx) qidx.setVisible(false);
							delete page.qryCondData;
						}
					});
				}
				var fqi = Ext.get(qidi);
				if (fqi) {
					fqi.on('click', function(e, t){
						fastQuery(first, fqv.dom.value);
						e.preventDefault();
					});
				}
			};
			
			//如果不是在第一个tab，则需要延时绑定事件，否则取不到对象
			if (tbar.el) {
				qryfn();
			} else {
				tbar.on('afterrender', function(){JxUtil.delay(500, qryfn);});
			}
			
			//查询方法
			var fastQuery = function(field, value){
				var isarch = tbar.find('name', 'xx_isarch')[0];//取含归档的checkbox
				var query_type = '0';
				if (isarch && isarch.getValue() == '1') {//是否可以查询到已复核的记录
					query_type = '1';
				}
		
				var cnt = field.split(',').length;
				//解析SQL	
				var where = field.replace(/,/g, ' like ? or ');
				where = where.replace(/__/g, '.');
				where = '('+where+' like ?)';
				
				var values = '', types = '';
				for (var i = 0; i < cnt; i++) {
					values += '%'+value+'%;';
					types += 'string;';
				}
				types = types.substr(0, types.length-1);
				values = values.substr(0, values.length-1);
				
				if (!isTree) {
					Jxstar.myQuery(page, [where, values, types], query_type);
				} else {
					JxTreeGrid.myQuery(page, [where, values, types], '1');
				}
			};
		},
		
		/**
		 * 添加树形查询语句的查询
		 * page -- 是表格对象
		 * wheres -- 是查询条件:sql, value, type
		 * queryType -- 是否高级查询
		 */
		myQuery: function(page, wheres, queryType) {
			if (wheres == null) wheres = new Array('','','');
			if (queryType == null) queryType= '0';
			
			//取树形查询语句
			var tree_wsql = page.jxstarParam.tree_wsql;
			var tree_wtype = page.jxstarParam.tree_wtype;
			var tree_wvalue = page.jxstarParam.tree_wvalue;
			if (tree_wsql && tree_wsql.length > 0) {
				if (wheres[0] && wheres[0].length > 0) {
					wheres[0] = tree_wsql + ' and (' + wheres[0] + ')';
				} else {
					wheres[0] = tree_wsql;
				}
			}
			if (tree_wvalue && tree_wvalue.length > 0) {
				if (wheres[1] && wheres[1].length > 0) {
					wheres[1] = tree_wvalue + ';' + wheres[1];
				} else {
					wheres[1] = tree_wvalue;
				}
			}
			if (tree_wtype && tree_wtype.length > 0) {
				if (wheres[2] && wheres[2].length > 0) {
					wheres[2] = tree_wtype + ';' + wheres[2];
				} else {
					wheres[2] = tree_wtype;
				}
			}

			Jxstar.loadData(page, {where_sql:wheres[0], where_value:wheres[1], where_type:wheres[2], is_query:1, query_type:queryType});
		}
	});//Ext.apply

})();
