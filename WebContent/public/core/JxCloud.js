/*!
 * Copyright 2011-2016 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.com
 */
 
/**
 * Jxstar-Cloud版本的功能对象管理工具
 * 
 * @author TonyTan
 * @version 1.0, 2016-04-12
 */

Ext.ns('JxCloud');
(function(){

	Ext.apply(JxCloud, {
		//保存所有打开的功能页面对象，方便全局检索，用功能ID作为KEY
		apps: {},
		
		/**
		* 切换到Form界面：约定容器对象布局为card，第一个页面为grid，第二个页面为form
		* items参数：
		* define: 当前功能定义对象
		* grid: 当前grid控件
		* record: 记录数据
		* store: 存储对象
		*/
		showForm: function(items) {
			var me = this;
			var define = items.define;
			var nodeid = items.define.nodeid;
			//页面布局对象
			var ct = this.apps[nodeid];//items.grid.ownerCt.ownerCt;
			if (!ct) {
				//JxHint.alert(jx.cloud.text15);//'没有找到页面容器对象！'
				return;
			}
			
			//加载数据到表单对象中
			var formLoad = function(page){
				var form = page.getForm();
				form.myGrid = items.grid;
				form.myStore = items.store;
				
				//设置外键值
				form.fkName = items.grid.fkName;
				form.fkValue = items.grid.fkValue;
				
				//如果记录为空，表示新增记录
				if (items.record == null) {
					//临时采用form对象保存表单对象来处理
					page.formNode.event.create();
				} else {
					form.myRecord = items.record;
					form.loadRecord(items.record);
				}
				//如果是指定打开form则不处理，避免重复执行；快速新建需要触发initForm
				if (items.record || !ct.showType || (!items.record && ct.showType == 'form')) {
					//显示FORM时，执行初始化事件
					//按钮还未加载完，不能控制disabled属性，所以需要延时
					JxUtil.delay(500, function(){
						page.formNode.event.initForm();
					});
				}
				//重新布局页面，否则在IE11下有时会显示不全
				page.doLayout();
			};
			
			if (ct.items.getCount() == 1) {
				var lc = function(page) {
					//显示为主tab对象
					if (define.isFormTab) {
						//插入子表Tab头部的内容
						var header = page.formNode.config.subTabHeader;
						//form用tabpanel控件显示
						var tab = ct.add(me.formMainTab(nodeid, page, header));
						//激活form页面显示
						ct.getLayout().setActiveItem(1);
						
						//加载子表对象
						JxFormSub.formShowSub(page.formNode);
						//加载数据到form中
						formLoad(page);
					} else {
						var tab = ct.add({
							pagetype:'funform',
							layout:'fit',//固定填充后，form内部才能滚动
							//autoScroll:true,//支持form页面整体滚动，含工具拦
							border:false,
							items:[page]
						});
						//激活form页面显示
						ct.getLayout().setActiveItem(1);
						//加载数据到form中
						formLoad(page);
					}
				};
				
				if (define.formpage.length == 0) return;
				Jxstar.createPage(nodeid, 'formpage', null, {pageType:'form', layoutCall:lc});
			} else {
				//激活form页面显示
				ct.getLayout().setActiveItem(1);
				
				//取到form页面对象
				if (define.isFormTab) {
					page = ct.getComponent(1).getComponent(0).getComponent(0);
				} else {
					page = ct.getComponent(1).getComponent(0);
				}
				//加载数据到form中；有时表单比表格慢，page会为null
				if (page) formLoad(page);
			}
		},
		
		/**
		 * 控制子表显示在到tab中的相关标志
		 * funid: 
		 * titles: [] 数组格式，要求两个标题
		 **/
		setMainTab: function(funid, titles) {
			var define = Jxstar.findNode(funid);
			//标志form子表显示效果
			define.isFormTab = true;
			define.tabTitles = titles;
		},
		
		/**
		 * 控制子表显示在到tab中
		 * funid: 功能ID
		 * form: 表单对象
		 * header: 显示在子表tab中的头信息，用[]存储
		 **/
		formMainTab: function(funid, form, header) {
			var define = Jxstar.findNode(funid);
			var subfunid = define.subfunid;
			if (subfunid == null || subfunid.length == 0) return;
			//在Form多Tab布局中，表示不显示在子表tab中的子功能
			var nfid = define.notTabFunId || '';
			//是否缺省展开form中的所有子功能
			var subExpand = define.subExpand || false;
			
			var items = header||[];
			var subfunids = subfunid.split(',');
			for (var i = 0, n = subfunids.length; i < n; i++) {
				var subid = subfunids[i];
				if (subid.length == 0) continue;
				if (nfid.length > 0 && nfid.indexOf(subid) >= 0) continue;
				
				var subdefine = Jxstar.findNode(subid);
				var subtitle = subdefine.nodetitle;
				
				//标志此功能在form中显示
				//在GridNode.js中构建表格时不带边框，而且分页工具栏显示在顶部。
				subdefine.showInForm = true;
				
				//第一个子表展开，后面的子表折叠
				var csed = (i > 0);
				//缺省展开form中的所有子功能
				if (subExpand) csed = false;
				
				var config = {
					title:subtitle, showType:'inform', baseCls:'xs-panel', data:subid, 
					cls:'sub_panel', border:false, layout:'fit', anchor:'100%', height:200,
					hideCollapseTool:true, collapsible:true, collapsed:csed, style:'margin-right:5px;'
				};
				if (define.isCloud) {
					subdefine.isCloud = true;
					config.iconCls = 'x-tool-toggle';
				}
				items[items.length] = config;
			}
			
			var titles = define.tabTitles;
			if (!titles || titles.length < 2) {
				JxHint.alert(jx.cloud.text14);//'表单标题设置必须2个以上！'
				return;
			}
			
			var me = this;
			return {
				pagetype:'funform', xtype:'tabpanel', activeTab:0, border:false, 
				deferredRender:false, cls:'form-tab', //标记是form主tab控件，样式特殊处理
				items:[
					{title:titles[0], pagetype:'formtab', autoScroll:true, items:[form]},
					{title:titles[1], pagetype:'formsub', autoScroll:true, items:items}
				],
				listeners: {tabchange:function(tab, p){
					var type = p.initialConfig.pagetype;
					//切换到子表tab时，也要触发初始化事件，刷新子表、顶部标题信息
					if (type == 'formsub') {
						form.formNode.event.initForm();
					}
				}}
			};
		},
		
		/**
		 * 控制表单工具显示到tab标签的右边
		 * page: 表单页面
		 **/
		showTabTooler: function(page){
			var tbar = page.getTopToolbar();
			var el = tbar.el.up('div');
			
			//取到显示工具栏的tab标题栏
			var tab = page.ownerCt.ownerCt;
			if (!tab.isXType('tabpanel')) return;
			var wrap = tab.header.child('.x-tab-strip-wrap');
			//重新设置标题栏的高度、添加显示form工具的div
			wrap.setHeight(59);
			var div = wrap.createChild({tag:'div', height:40, cls:'x-tab-toolbar pull-right ', html:''});
			
			//把工具栏插入此位置
			div.insertFirst(el);
			//显示form工具栏区域的宽度在工具栏事件加载完成后设置
		},
		
		/**
		 * 子表内嵌在form中，按钮显示到标题栏的右边
		 * grid: 子表格对象
		 **/
		addTools: function(subgrid){
			var me = this;
			var panel = subgrid.ownerCt;
			var node = subgrid.gridNode;
			if (node.param.showTools) {
				me.showPageBar(subgrid, panel);//构建分页栏
				me.showPageTool(subgrid, panel, node);//构建分页按钮
				return;
			}
			//事件定义对象
			var ei = node.event;
			//构建分页栏
			me.showPageBar(subgrid, panel);

			var params = 'funid=queryevent&eventcode=query_loadtb&selpfunid='+node.parentNodeId;
				params += '&selfunid='+ node.nodeId + '&selpagetype='+node.pageType;
			
			var hdCall = function(json) {
				if (json == null) return;
				//取按钮数组
				var items = json.buttons;
				//取权限信息
				var right = json.right;
								
				//保存扩展按钮
				var myItems = [], extItems = [];
				
				//给按钮对象分配事件
				for (var i = 0, n = items.length; i < n; i++){
					//处理按钮多语言文字
					JxLang.eventLang(node.nodeId, items[i]);
					
					//按钮显示类型[tool|menu]
					var showType = items[i].showType;
					
					if (items[i].method.length > 0) {
						var h = ei[items[i].method];
						if (h == null) continue;
						var a = items[i].args;
						//自定义方法用事件代码作为参数
						if (items[i].method == 'customEvent') {
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
					
					//如果是显示到菜单，则添加扩展栏中
					if (showType == 'menu') {
						extItems[extItems.length] = items[i];
					} else {
						var cls = items[i].iconCls;
						if (cls.indexOf('eb_') == 0) {
							var hascss = JxUtil.getRule('.'+cls+'::before');
							items[i].id = hascss ? cls : 'eb_empty';
						} else {
							items[i].id = cls;
						}
						items[i].qtip = items[i].text;
						myItems[myItems.length] = items[i];
					}
				}
				
				myItems = myItems.concat([
				{
					id:'space1',
					hidden: (extItems.length == 0)
				},{
					id:'x-tool-prev',
					qtip: '上一页',
					hidden: true,
					handler: function(event, toolEl, panel){
						subgrid.pagebar.movePrevious();
					}
				},{
					id:'x-tool-next',
					qtip: '下一页',
					hidden: true,
					handler: function(event, toolEl, panel){
						subgrid.pagebar.moveNext();
					}
				}/*,{
					id:'x-tool-refresh',
					qtip: '刷新数据',
					handler: function(event, toolEl, panel){
						subgrid.pagebar.doRefresh();
					}
				}*/]);
				
				//添加扩展按钮
				if (extItems.length > 1) {
					var extMenu = new Ext.menu.Menu({items: extItems});
					myItems[myItems.length] = {
						id:'eb_more',
						qtip: jx.cloud.text13,//'更多'
						menu: extMenu,
						handler: function(e, t){
							//alert(t.id);
							extMenu.show(t);
							//menu.showAt([el.getX(), el.getY()+20]);	
						}
					};
				} else {
					//如果只有一个按钮则直接显示
					if (extItems.length == 1) {
						var item = extItems[0];
						var cls = item.iconCls||'';
						if (cls.indexOf('eb_') == 0) {
							var hascss = JxUtil.getRule('.'+cls+'::before');
							item.id = hascss ? cls : 'eb_empty';
						} else {
							item.id = cls;
						}
						item.qtip = item.text;
						myItems[myItems.length] = item;
					}
				}
				
				var addbar = function(p, node){
					var nn = JxUtil.newId()+'_qv';
					var el = p.insertFirst({tag:'div',style:'height:27px;width:250px;float:right;'});
					var bar = new Ext.Container({renderTo:el,name:nn,layout:'fit'});
					Jxstar.addBaseQry(node, bar);
				};
				//添加按钮到标题栏中
				var type = panel.ownerCt.getXType();
				if (type == 'tabpanel') {//内嵌tab控件，子表按钮显示到tab标签后面
					var nid = node.nodeId;
					var tab = panel.ownerCt;
					var wrap = tab.header.child('.x-tab-strip-wrap');
					var toolbar = wrap.createChild({tag:'div', cls:'x-tab-toolbar '+nid, html:''});
					if (!panel.isVisible()) toolbar.hide();
					panel.tabtooler = toolbar;
					
					//子功能添加通用查询
					if (node.param.hasQuery == true) addbar(toolbar, node);
					//添加按钮对象
					me.tabTools(subgrid, toolbar, myItems);
				} else {
					//子功能添加通用查询
					if (node.param.hasQuery == true) addbar(panel.header, node);
					//添加按钮对象
					panel.addTool.apply(panel, myItems);
				}
			};

			Request.dataRequest(params, hdCall);
		},
		
		//显示子表分页栏
		showPageBar: function(subgrid, panel){
			//支持按功能设置每页数量，默认20条
			var psize = subgrid.gridNode.param.pageSize || 20;
			//添加一个隐藏的分页工具栏
			var pbar = new Ext.PagingToolbar({
				store: subgrid.getStore(),
				displayInfo: false,
				pageSize: psize,
				hidden: true,
				ct: panel,//保存容器对象
				//{total:记录数,activePage:当前页码,pages:总页数}
				listeners: {change:function(t, pd){
					var ct = t.ct;//显示子表的panel
					var bar = ct.header;
					if (!bar) {
						bar = ct.tabtooler;
						if (!bar) return;
					}
					//记录数大于一页时，显示分页按钮
					var pe = bar.child('i.x-tool-prev');
					var ne = bar.child('i.x-tool-next');
					//var re = bar.child('i.x-tool-refresh');
					
					var show = (pd.pages > 1);
					if (pe) {pe.up('button').setVisible(show);}
					if (ne) {ne.up('button').setVisible(show);}
					if (pe) {pe.up('button').dom.disabled = (t.cursor == 0);}
					if (ne) {ne.up('button').dom.disabled = ((t.cursor+t.pageSize) >= pd.total);}
					
					//子表记录条数显示在标题后
					var te = bar.child('span.xs-panel-header-text');
					if (!te) {
						//取tab标题
						var tp = panel.findParentByType('tabpanel');
						if (tp) {
							var ul = tp.header.child('ul.x-tab-strip');
							var idx = tp.items.indexOf(panel);
							//取第index个标题
							var lis = ul.query('li');
							if (lis.length >= idx) {
								var el = Ext.get(lis[idx]);
								te = el.child('span.x-tab-strip-text');
							}
						}
					}
					if (te) {
						var n = te.child('em');
						if (n) n.remove();
						var cls = (pd.total == 0) ? 'default' : 'primary';
						te.insertHtml('beforeEnd', '<em class="text-'+ cls +'" style="display:inline;">&nbsp;('+pd.total+')</em>');
					}
					//有记录时展开panel，否则折叠
					//if (pd.total > 0 && ct.collapsed) ct.expand(false);
				}}
			});
			
			//绑定分页栏，在工具栏按钮事件中需要用
			subgrid.pagebar = pbar;
			subgrid.on('destroy', function(){
				pbar.destroy();
				delete subgrid.pagebar;
			});
		},
		
		//showTools云布局时，单独显示分页栏与查询栏
		showPageTool: function(subgrid, panel, node){
			var me = this;
			var myItems = [{
					id:'x-tool-prev',
					qtip: '上一页',
					hidden: true,
					handler: function(event, toolEl, panel){
						subgrid.pagebar.movePrevious();
					}
				},{
					id:'x-tool-next',
					qtip: '下一页',
					hidden: true,
					handler: function(event, toolEl, panel){
						subgrid.pagebar.moveNext();
					}
				}];
				
			var type = panel.ownerCt.getXType();
			if (type == 'tabpanel') {//内嵌tab控件，子表按钮显示到tab标签后面
				var nid = node.nodeId;
				var tab = panel.ownerCt;
				var wrap = tab.header.child('.x-tab-strip-wrap');
				var toolbar = wrap.createChild({tag:'div', cls:'x-tab-toolbar '+nid, html:''});
				if (!panel.isVisible()) toolbar.hide();
				panel.tabtooler = toolbar;
				
				//添加按钮对象
				me.tabTools(subgrid, toolbar, myItems);
			} else {
				//添加按钮对象
				panel.addTool.apply(panel, myItems);
			}
		},
		
		/**
		 * private 子表按钮显示到tab标题后面
		 * bar: 显示按钮的容器
		 * items: 按钮配置信息
		 **/
		tabTools: function(grid, bar, items){
			var tpl = Ext.Panel.prototype.toolTemplate;
			var createHandler = function(t, tc, grid){
				return function(e){
					if(tc.stopEvent !== false){
						e.stopEvent();
					}
					if(tc.handler){
						tc.handler.call(tc.scope || t, e, t, grid, tc);
					}
				};
			};
			
			for(var i = 0, a = items, len = a.length; i < len; i++) {
				var tc = a[i];
				var t = tpl.insertFirst(bar, tc, true);
				t.enableDisplayMode('block');//添加此属性，保证隐藏的按钮不占位
				grid.mon(t, 'click', createHandler(t, tc, grid));
				
				if(tc.hidden){
					t.hide();
				}
				if(tc.qtip){
					if(Ext.isObject(tc.qtip)){
						Ext.QuickTips.register(Ext.apply({
							  target: t.id
						}, tc.qtip));
					} else {
						t.dom.qtip = tc.qtip;
					}
				}
			}
		}
		
	});//Ext.apply

})();
