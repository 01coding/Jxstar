/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 主菜单构建工具类。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

JxMenu = {};
(function(){
	//系统样式风格
	JxMenu.style = 'black';
	//主菜单是否树形展示
	JxMenu.istree = false;
	
	//自动隐藏菜单
	var autoHide = function(m, e, item) {
		var rt = e.getRelatedTarget();
		if (!rt) return;
		if (!rt.contains(e.getTarget()) && !m.getEl().contains(rt)) {
			//下面这句if语句，是判断鼠标是否移动到子菜单上。
			if (!Ext.get(e.getTarget()).hasClass('x-menu-item')){
				m.hide();
			}
		} else if(rt.contains(m.getEl().dom)) {
			//下面这句if语句，是判断鼠标是否移动到子菜单上。
			if (!Ext.get(e.getTarget()).hasClass('x-menu-item-icon') && !Ext.get(e.getTarget()).hasClass('x-menu-item')){
				m.hide();
			}
		}
	};
	
	//绑定鼠标滑到菜单上就显示下级菜单
	var addover = function(node, treeMenu){
		if (treeMenu.isCollapsed) {
			//折叠状态在一级菜单上绑定事件
			if (node.id == 'xnode-11' && !node.hasmv) {
				node.eachChild(function(item){
					Ext.get(item.ui.getEl()).on('mouseenter', function(){
						if (this.isLeaf()) return;
						if (!treeMenu.isCollapsed || this.isExpanded()) return;
						this.fireEvent('click', this);
					}, item);
				});
				node.hasmv = true;
			}
		} else {
			//展开状态在二级菜单上绑定事件
			if (node.attributes.cls == 'one-menu' && !node.hasmv) {
				node.eachChild(function(item){
					Ext.get(item.ui.getEl()).on('mouseenter', function(){
						//如果是折叠状态、或是叶子节点则不显示
						if (this.isLeaf()) return;
						if (treeMenu.isCollapsed || this.isExpanded()) return;
						this.fireEvent('click', this);
					}, item);
				});
				node.hasmv = true;
			}
		}
	};
	
	//收缩主菜单
	var collpse = function(treeMenu) {
		if (treeMenu.isCollapsed) {
			treeMenu.setWidth(200);
			var nodes = treeMenu.root.childNodes;
			for (var i = 0; i < nodes.length; i++) {
				var li = nodes[i].ui.getEl();
				li.querySelector('div.one-menu').classList.remove('collpse');
			}
			Ext.getCmp('top_left_img').setWidth(200);
			Ext.fly('main_logo_bg').removeClass('collpse');
			Jxstar.viewport.doLayout();
			
			treeMenu.isCollapsed = false;
		} else {
			treeMenu.root.collapse(true);//把展开的节点都收起
			treeMenu.setWidth(56);
			var nodes = treeMenu.root.childNodes;
			for (var i = 0; i < nodes.length; i++) {
				var li = nodes[i].ui.getEl();
				li.querySelector('div.one-menu').classList.add('collpse');
			}
			Ext.getCmp('top_left_img').setWidth(56);
			Ext.fly('main_logo_bg').addClass('collpse');
			Jxstar.viewport.doLayout();
			
			treeMenu.isCollapsed = true;
		}
		//绑定事件
		addover(treeMenu.root, treeMenu);
		//保存到会话中
		Ext.util.Cookies.set('menu_collapsed', treeMenu.isCollapsed?'1':'0');
	};
	
	//给菜单更新设置的图标
	//必须在node显示时修改text才有效，所以需要在每次展开事件中调用此方法
	var addIcon = function(node){
		var itc = (!Ext.isTrident && Ext.isGecko) ? 'itc' : '';
	
		if (node.isLeaf()) {
			if (node.text.indexOf('fun-icon') < 0) {
				var iconcls = node.attributes.iconcls;
				if (!iconcls || iconcls.length == 0) {
					iconcls = 'fa-funicon';
				}
				var s = '<i class="fun-icon fa '+ iconcls +'"></i>' + node.text;
				node.setText(s);
			}
		} else {
			if (node.attributes.cls != 'one-menu' && node.text.indexOf('funmd-icon') < 0) {
				var iconcls = node.attributes.iconcls;
				if (!iconcls || iconcls.length == 0) {
					iconcls = 'fa-folder-o';
				}
				var cls = JxMenu.istree ? 'funmdy-icon ' : 'funmdx-icon ';
				var s = '<i class="'+cls+itc+' fa fa-caret-right"></i><i class="funmd-icon fa '+ iconcls +'"></i>' + node.text;
				node.setText(s);
			}
			node.eachChild(function(item){
				addIcon(item);
			});
		}
	};
	
	//菜单展开前处理事件
	var preexpand = function(node, treeMenu) {
		//构建子菜单
		var submm = function(mds, curMenuId, curItem) {
			if (!mds || mds.length == 0) return;
			
			var items = [];
			for (var i = 0; i < mds.length; i++) {
				if (curMenuId.indexOf(mds[i].id) == 0) {//前缀相同，表示在同一模块中
					if (curMenuId == mds[i].id) {
						var sms = [], sdd = mds[i].children;//取下级菜单数据
						for (var j = 0; j < sdd.length; j++) {
							var cls = sdd[j].cls;
							var iconcls = sdd[j].iconcls;
							if (!iconcls || iconcls.length == 0) iconcls = 'fa-funicon';
							var s = sdd[j].text;
							if (s.indexOf('fun-icon') < 0) {
								s = '<i class="fun-icon fa '+ iconcls +'"></i>' + s;
							}
							var sub = {itemId:sdd[j].id, text:s, cls:cls};
							//处理子子菜单
							if (cls == 'two-menu') {
								var s = sdd[j].text;
								if (s.indexOf('funmd-icon') < 0) {
									sub.text = '<i class="funmdx-icon fa fa-caret-right"></i><i class="funmd-icon fa fa-folder-o"></i>' + s;
								} else {
									sub.text = s;
								}
								submm(sdd, sdd[j].id, sub);
							}
							sms[sms.length] = sub;
						}
						if (sms.length > 0) {
							var mm = new Ext.menu.Menu({width:200, cls:'x-menu x-menu-two', items:sms});
							mm.on('mouseout', autoHide);
							curItem.menu = mm;
							mm.on('click', function(m, item){
								var id = item.getItemId();
								var cls = item.initialConfig.cls;
								if (cls == 'three-menu') {
									Jxstar.createNode(id);
								}
							});
						}
						return;
					} else {
					//如果不是当前级别则继续查找下级
						submm(mds[i].children, curMenuId, curItem);
					}
				}
			}
		};
		//添加功能的图标
		addIcon(node);
		
		//折叠状态时，如果是第一级菜单，并且有子菜单，则显示侧滑菜单
		//展开状态时，如果是第二级菜单，并且有子菜单，则显示侧滑菜单
		if ((node.attributes.cls == 'two-menu') || 
			(treeMenu.isCollapsed && node.attributes.cls == 'one-menu')) {
			if (!node.menu) {
				var items = [];
				node.eachChild(function(item){
					var cls = item.attributes.cls;
					var s = item.text;
					if (s.indexOf(' itc ') > 0) s = s.replace(' itc ', ' ');
					
					var mitem = {itemId:item.id, text:s, cls:cls};
					//处理子菜单
					if (cls == 'two-menu') {
						submm(treeMenu.menuData, item.id, mitem);
					}
					items[items.length] = mitem;
				});
				if (node.attributes.cls == 'one-menu') {
					var ss = node.text.split('>');
					var sss = ss[ss.length-2].split('<');
					items.insert(0, {itemId:node.id, text:sss[0], disabled:true});
				}
				node.menu = new Ext.menu.Menu({width:200, cls:'x-menu x-menu-two', items:items});
				node.menu.on('mouseout', autoHide);
				//添加打开功能事件
				node.menu.on('click', function(m, item){
					var id = item.getItemId();
					var cls = item.initialConfig.cls;
					if (cls == 'three-menu') {
						Jxstar.createNode(id);
					}
				});
			}
			var fix = treeMenu.isCollapsed ? 55 : 199;
			var el = Ext.get(node.ui.getEl());
			node.menu.showAt([el.getX()+fix, el.getY()-1]);
			return false;
		}
		return true;
	};
	
	Ext.apply(JxMenu, {
		/**
		* public 主菜单显示时要处理的事件
		*/
		init: function(treeMenu) {
			var isfirst = true;
			//主菜单显示方式[tree|slip]
			JxMenu.istree = Jxstar.systemVar.index__menu__mode == 'tree';
			
			//绑定菜单收缩展开事件
			Ext.fly('main_collpse').on('click', function() {
				collpse(treeMenu);
			});
			
			//菜单是否折叠状态
			var csed = Ext.util.Cookies.get('menu_collapsed');
			treeMenu.on('expandnode', function(node) {
				if (csed=='1' && isfirst) {
					collpse(treeMenu);
					isfirst = false;
				}
				if (!JxMenu.istree || treeMenu.isCollapsed) addover(node, treeMenu);
			});
			
			treeMenu.on('beforeexpandnode', function(node) {
				if (JxMenu.istree && !treeMenu.isCollapsed) {
					addIcon(node);
				} else {
					return preexpand(node, treeMenu);
				}
			});
			
		},
		
		/**
		* public 创建TOP菜单的代理工作连接
		*/
		showProxy: function() {
			//如果当前是代理状态，则显示退出代理的链接
			var proxy_id = Jxstar.session['proxy_id'];
			if (proxy_id) {
				//标记当前用户是代理状态
				Jxstar.isProxyUser = true;
				return;
			}
			
			var hdCall = function(data) {
				//标记当前用户有代理设置
				Jxstar.hasProxyUser = (data.total > 0);
			};
			
			//当前用户ID与当前日期-1天
			var userid = Jxstar.session['user_id'];
			var ed = (new Date()).add(Date.DAY, -1).format('Y-m-d');
			var params = 'eventcode=query_data&funid=queryevent&pagetype=grid'+
						'&query_funid=sys_proxy&where_sql=auditing=1 and user_id = ? and end_date > ?'+
						'&where_type=string;date&where_value='+userid+';'+ed;
			Request.dataRequest(params, hdCall);
		},
		selProxy: function() {
			var hdcall = function(grid) {
				//当前用户ID与当前日期-1天
				var userid = Jxstar.session['user_id'];
				var ed = (new Date()).add(Date.DAY, -1).format('Y-m-d');
				
				var options = {
					where_sql: 'auditing=1 and user_id = ? and end_date > ?',
					where_type: 'string;date',
					where_value: userid+';'+ed
				};
				Jxstar.loadData(grid, options);
			};
			var define = Jxstar.findNode('sys_proxy_sel');
			Jxstar.showData({
				filename: define.gridpage,
				title: define.nodetitle,
				pagetype: 'selgrid',
				width: 600,
				height: 300,
				callback: hdcall
			});
		},
		
		/**
		* public 退出代理 
		*/
		outProxy: function() {
			var proxy_id = Jxstar.session['proxy_id'];
			var to_userid = Jxstar.session['user_id'];
			var proxy_userid = Jxstar.session['proxy_user_id'];
			//退出代理
			JxMenu.loginProxy(to_userid, proxy_userid, '0', proxy_id);
		},
		
		/**
		* public 进入代理工作或退出代理工作
		* to_userid -- 被代理人ID
		* proxy_userid -- 当前用户ID
		* isin -- 是否进入代理：1 进入, 0 退出
		* proxy_id -- 如果是退出代理，则需要此值
		*/
		loginProxy: function(to_userid, proxy_userid, isin, proxy_id) {
			var login_url = Jxstar.path + '/jxstar/other/jsp/workproxy.jsp?proxy_in='+ isin 
				+'&to_userid=' + to_userid + '&proxy_userid=' + proxy_userid;
			if (proxy_id) {
				login_url += '&proxy_id=' + proxy_id;
			}
			//代理登陆成功
			var f_success = function(data) {
				//销毁原主界面对象
				Jxstar.viewport.destroy();
				Jxstar.viewport = null;
				//删除部分遗漏控件
				var mm = Ext.getCmp('main_user_menu');
				if (mm) mm.destroy();
				delete Jxstar.isProxyUser;
				delete Jxstar.hasProxyUser;
				
				//保留原来的一些会话信息
				data.maxInterval = Jxstar.session.maxInterval;
				data.sessionId = Jxstar.session.sessionId;
				Jxstar.session = data;
				
				Request.loadJS('/public/core/JxBody.js');
			};
			
			Ext.Ajax.request({
				method: 'POST',
				url: login_url,
				success: function(response) {
					var result = Ext.decode(response.responseText);
					if (result.success == true || result.success == 'true') {
						JxHint.hint(jx.util.exesus + result.message);//执行成功：

						//成功执行后重新打开系统主页面
						f_success(result.data);
					} else {
						var msg = result.message;
						JxHint.alert(jx.util.exefa + msg);//'执行失败：'
					}
				},
				failure: function(response) {
					response.srcdesc = 'JxMenu.js?login_url='+login_url;
					JxUtil.errorResponse(response);
				}
			});
		},
		
		//更新用户头像
		updatePhoto: function(img) {
			var userid = Jxstar.session['user_id'];
			var params = 'funid=sys_attach&eventcode=qryatt&attachfield=user_photo';
				params += '&tablename=sys_user&dataid='+ userid;
			Request.dataRequest(params, function(data){
				if (data && data.attachId) {
					var params = 'funid=sys_attach&eventcode=downPhoto&keyid='+ data.attachId;
						params += '&dataType=byte&image_small_use=1&image_small_size=120&nousercheck=1&dc=' + (new Date()).getTime();
					img.src = Jxstar.path+'/fileAction.do?'+params;
				}
			});
		},
		
		//更新未阅消息数量
		updateNum: function() {
			var params = 'funid=oa_msg&eventcode=getnum';
			Request.dataRequest(params, function(data){
				var numdom = document.getElementById("main_msg_icon").querySelector("span.badge");
				if (numdom) {
					if (!data || !data.num || data.num == 0) {
						data.num = '';
						Ext.fly(numdom).addClass('hidden');
					} else {
						Ext.fly(numdom).removeClass('hidden');
					}
					numdom.innerHTML = data.num;
				}
			});
		},
		
		//显示未阅消息
		showMsg: function(from) {
			var id = 'xx_main_msg_win';
			var win = Ext.getCmp(id);
			if (win != null) return;
			
			var w = 450;
			var jv = Jxstar.viewport;
			var js = Jxstar.sysMainTab;
			var hdCall = function(f) {
				var page = f();
				var win = new Ext.Window({
					id: id,
					title: '通知',
					x: jv.getWidth()-w,
					y: jv.getComponent(0).getHeight()+1,
					width: w,
					height: js.getHeight(),
					constrainHeader: true,
					border: false,
					modal: false,
					closeAction: 'close',
					autoScroll: true,
					tools: [
						{id:'fa-cube', qtip:'标记全部已阅', handler: function(){page.readall();}},
						{id:'fa-search', qtip:'查看更多', handler: function(e, target, cell){
								var userid = Jxstar.session['user_id'];
								Jxstar.createNode('oa_msg', {pageType:'query', isNotRight:'1', whereSql:"to_userid = ?", whereType:'string', whereValue:userid});
								win.close();
						}}],
					items: [page]
				});
				win.show(from);
			};
			var url = '/jxstar/oa/pub/plet_oa_msg.js';
			Request.loadJS(url, hdCall);
		},
		
		changeTheme: function(item) {
			var t = item.initialConfig.value;
			JxMenu.setTheme(t);
			Ext.util.Cookies.set('menu_theme', t);
		},
		
		setTheme: function(t) {
			if (!t) {
				t = Ext.util.Cookies.get('menu_theme');
			}
			
			var h = document.getElementsByTagName('head')[0];
			var dt = Jxstar.domTheme;
			if (dt) {
				h.removeChild(dt);
				Jxstar.domTheme = null;
			}
			if (t == 'green') {
				Jxstar.domTheme = JxUtil.loadCss('/resources/css/main-green.css', true);
			} else if (t == 'gray') {
				Jxstar.domTheme = JxUtil.loadCss('/resources/css/main-gray.css', true);
			}
			return t;
		},
		
		//加载顶部公共菜单事件
		showTopMenu: function(topPanel) {
			//初始化租户信息
			var ts = localStorage.getItem('select_tenants');
			if (ts) {
				Jxstar.tenants = JSON.parse(ts);
				localStorage.removeItem('select_tenants');
			}
			
			var topCmp = topPanel.getComponent(2);
			//显示消息记录
			var msgDiv = topCmp.el.child('li.top-menu-msg');
			msgDiv.on('click', function(){
				JxMenu.showMsg(msgDiv);
			});
			
			JxMenu.updateNum();
			//设置60秒刷新一次通知数量
			setInterval(function(){JxMenu.updateNum();}, 1000*60);
			
			var tt, suse = Jxstar.systemVar.index__style__use;
			if (suse == '1') {
				tt = JxMenu.setTheme();
				if (!tt || tt.length == 0) tt = 'black';
				JxMenu.style = tt;
			}
			
			//显示用户信息菜单
			var userDiv = topCmp.el.child('li.top-menu-user');
			//修改头像
			var img = userDiv.child('img.nav-user-photo').dom;
			this.updatePhoto(img);
			//修改公司信息
			var d = JxDefault.getDeptName();
			var u = JxDefault.getUserName();
			//处理工作代理
			var proxyuser = Jxstar.session['proxy_user_name'];
			if (JxLang.type != 'zh') proxyuser = Jxstar.session['proxy_user_code'];
			if (proxyuser) {
				u += '('+ proxyuser +'-'+ jx.base.proxy +')';//代理
				u = '<span title="'+u+'">'+u+'</span>';
			}
			
			var str = u +'<br><small title="'+d+'">'+d+'</small>';
			userDiv.child('span.user-info').dom.innerHTML = str;
			userDiv.on('click', function(){
				var usermenu = Ext.getCmp('main_user_menu');
				if (!usermenu) {
					var items = [
						{text:jx.cloud.text1, handler:function(){JxUtil.showUser();}},//'个人设置'
						{text:jx.base.lineuser, handler:function(){JxUtil.onLineUser();}},//'在线用户'
						{text:jx.sys.modpwd, handler:function(){JxUtil.setPass(JxDefault.getUserId());}},'-',//'修改密码'
						{text:jx.base.exitsys1, handler:function(){JxUtil.logout();}}//'退出系统'
					];
					
					//添加风格设置
					if (suse == '1') {
						items.insert(1, {text:jx.cloud.text2, menu: {items: [//'风格设置'
		                        {
		                            text: jx.cloud.text3,//'黑色风格'
		                            value: 'black',
		                            checked: (tt=='black'),
		                            group: 'theme',
		                            handler: JxMenu.changeTheme
		                        }, {
		                            text: jx.cloud.text4,//'绿色风格'
		                            value: 'green',
		                            checked: (tt=='green'),
		                            group: 'theme',
		                            handler: JxMenu.changeTheme
		                        }, {
		                            text: jx.cloud.text5,//'深蓝风格'
		                            value: 'gray',
		                            checked: (tt=='gray'),
		                            group: 'theme',
		                            handler: JxMenu.changeTheme
		                        }]}
						});
					}
					
					if (Jxstar.tenants) {//'切换公司'
						items.insert(2, {text:jx.cloud.text6, handler:function(){JxUtil.showTenants();}});
					}
					//退出代理
					if (Jxstar.isProxyUser === true) {
						items.insert(3, {text:jx.index.mtext2, handler:function(){JxMenu.outProxy();}});
					} else {
						//代理工作
						if (Jxstar.hasProxyUser === true) {
							items.insert(3, {text:jx.index.mtext1, handler:function(){JxMenu.selProxy();}});
						}
					}
					
					usermenu = new Ext.menu.Menu({id:'main_user_menu', items:items});
					//usermenu.on('mouseout', autoHide);
				}
				usermenu.showAt([userDiv.getX(), userDiv.getY()+60]);
			});
		},
		
		//给主菜单添加滚动条
		addScroll: function(treeMenu) {
			var mainBox = treeMenu.body.dom;
			var contentBox = treeMenu.body.child('ul.x-tree-root-ct', true);
			new JxScrollBar({mainBox:mainBox, contentBox:contentBox, 
				onInit:function(s){
					treeMenu.on('expandnode', function(){
						s.resizeScorll();
					});
					treeMenu.on('resize', function(){
						s.resizeScorll();
					});
				}
			});
		}
		
	});//Ext.apply
	
	//显示流程导航
	JxUtil.showWfnav = function(t) {
		var el = Ext.get(t);
		var hdCall = function(data) {
			if (data != null) data = data.root; 
			if (data == null || data.length == 0) return;
			
			var items = [];
			for (var i = 0, n = data.length; i < n; i++) {
				var gid = data[i].wfnav_graph__graph_id;
				var title = data[i].wfnav_graph__graph_name;
				if (JxLang.type != 'zh') {
					var t = joLang.wftitle['wfnav__'+gid];
					if (t && t.length > 0) title = t;
				}
				items[i] = {text:title, itemId:gid, handler:function(b){
					JxWfGraph.showGraphFun(b.getItemId(), null, false, b.text);
				}};
			}
			
			var menu = new Ext.menu.Menu({items:items});
			menu.showAt([el.getX(), el.getY()+60]);	
		};
		var where_sql = encodeURIComponent('auditing = 1');
		var params = 'eventcode=query_data&funid=queryevent&pagetype=grid'+
			'&query_funid=wfnav_graph&where_sql=' + where_sql;
		Request.dataRequest(params, hdCall);
	};
})();

/*自定义滚动条*/
JxScrollBar = function(config) {
	Ext.apply(this, config);
	this.init();
	JxScrollBar.superclass.constructor.call(this, config);
};
(function(){
	var _wheelData = -1;//上次滚轮位置
	var _showBared = false;//是否需要显示滚动条
	
	function bind(node, type, handler) {
		if (node.addEventListener) {
			node.addEventListener(type, handler, false);
		} else if (node.attachEvent) {
			node.attachEvent('on' + type, handler);
		} else {
			node['on' + type] = handler;
		}
	}
	function mouseWheel(node, handler) {
		bind(node, 'mousewheel', function(event) {
			var data = -getWheelData(event);
			handler(data);
			if (document.all) {
				window.event.returnValue = false;
			} else {
				event.preventDefault();
			}
		});
		//火狐
		bind(node, 'DOMMouseScroll', function(event) {
			var data = getWheelData(event);
			handler(data);
			event.preventDefault();
		});
		function getWheelData(event) {
			var e = event || window.event;
			return e.wheelDelta ? e.wheelDelta : e.detail * 40;
		}
	}
	//创建滚动条
	var _createScroll = function(mainBox, className) {
		var _scrollBox = document.createElement('div')
		var _scroll = document.createElement('div');
		var span = document.createElement('span');
		_scrollBox.appendChild(_scroll);
		_scroll.appendChild(span);
		_scroll.className = className;
		mainBox.appendChild(_scrollBox);
		return _scroll;
	};
	
	//拖动滚动条
	var _tragScroll = function(element, mainBox, contentBox, color, color_over) {
		
		element.onmousedown = function(event) {
			var mainHeight = mainBox.clientHeight;
			
			var _scrollTop = element.offsetTop;
			var e = event || window.event;
			var top = e.clientY;
			document.onmousemove = scrollGo;
			document.onmouseup = function(event) {
				this.onmousemove = null;
			}
			function scrollGo(event) {
				var e = event || window.event;
				var _top = e.clientY;
				var _t = _top - top + _scrollTop;
				if (_t > (mainHeight - element.offsetHeight)) {
					_t = mainHeight - element.offsetHeight;
				}
				if (_t <= 0) {
					_t = 0;
				}
				element.style.top = _t + "px";
				contentBox.style.top = -_t
						* (contentBox.offsetHeight / mainBox.offsetHeight)
						+ "px";
				_wheelData = _t;
			}
		}
		element.onmouseover = function() {
			this.style.background = color_over;
		}
		element.onmouseout = function() {
			this.style.background = color;
		}
	};
	
	//鼠标滚轮滚动，滚动条滚动
	var _wheelChange = function(element, mainBox, contentBox) {
		var flag = 0, wheelFlag = 0;
		mouseWheel(
			mainBox,
			function(data) {
				if (!_showBared) return;
					
				wheelFlag += data;
				if (_wheelData >= 0) {
					flag = _wheelData;
					element.style.top = flag + "px";
					wheelFlag = _wheelData * 12;
					_wheelData = -1;
				} else {
					flag = wheelFlag / 12;
				}
				if (flag <= 0) {
					flag = 0;
					wheelFlag = 0;
				}
				if (flag >= (mainBox.offsetHeight - element.offsetHeight)) {
					flag = (mainBox.clientHeight - element.offsetHeight);
					wheelFlag = (mainBox.clientHeight - element.offsetHeight) * 12;
				}
				element.style.top = flag + "px";
				contentBox.style.top = -flag
						* (contentBox.offsetHeight / mainBox.offsetHeight)
						+ "px";
			});
	};
	
	Ext.extend(JxScrollBar, Ext.util.Observable, {
		color_box : '#32404E',	//滚动条的颜色
		color_div : '#222',		//滚动条轨道的颜色
		color_div_over : '#222',//光标进入滚动条的颜色
		
		mainBox : null,			//固定高度盒子
		contentBox : null,		//超出高度盒子，需要滚动的内容
		scrollDivClassName : 'menu_scrolldiv',	//滚动条的样式
		scrollDiv : null,		//滚动条
		
		init : function() {
			var t = JxMenu.style;//根据风格调整滚动条的颜色
			if (t == 'green' || t == 'gray') {
				this.color_box = '#C7C7CC';
				this.color_div = '#929292';
				this.color_div_over = '#797979';
			}
			
			this.scrollDiv = _createScroll(this.mainBox, this.scrollDivClassName);
			this.resizeScorll();
			_tragScroll(this.scrollDiv, this.mainBox, this.contentBox, this.color_div, this.color_div_over);
			_wheelChange(this.scrollDiv, this.mainBox, this.contentBox);
			
			if (this.onInit) {this.onInit(this);}
		},
		
		//调整滚动条
		resizeScorll : function() {
			var me = this;
			var element = me.scrollDiv;
			var mainBox = me.mainBox;
			var contentBox = me.contentBox;
			
			var p = element.parentNode;
			var conHeight = contentBox.offsetHeight;
			var _width = mainBox.clientWidth;
			var _height = mainBox.clientHeight;
			var _sw = element.offsetWidth;
			if (_sw == 0) _sw = 8;//没有显示时宽度为0
			var _left = _width - _sw;
			//console.log('_width='+_width+';_sw='+_sw);
			p.style.width = _sw + "px";
			p.style.height = _height + "px";
			p.style.left = _left + "px";
			p.style.position = "absolute";
			p.style.background = me.color_box;
			//contentBox.style.width = (mainBox.offsetWidth - _sw) + "px";
			var _scrollHeight = parseInt(_height * (_height / conHeight));
			
			if (_scrollHeight >= mainBox.clientHeight) {
				_showBared = false;
				p.style.display = "none";
				p.style.top = "0px";
				contentBox.style.top = "0px";
			} else {
				_showBared = true;
				p.style.display = "";
			}
			element.style.height = _scrollHeight + "px";
			
			if (_showBared) {
				mainBox.onmouseover = function() {
					p.style.display = "";
				}
				mainBox.onmouseout = function() {
					p.style.display = "none";
				}
			} else {
				mainBox.onmouseover = null;
				mainBox.onmouseout = null;
			}
		}
	});
})();