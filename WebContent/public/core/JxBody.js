/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 系统首页处理类，登录成功后动态加载。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

(function(){
	Ext.QuickTips.init();  
	
	//欢迎提示信息
	var welcome = jx.base.welcome + ' ' + JxDefault.getUserName() +' ['+ JxDefault.getDeptName() +']';
	if (JxLang.type != 'zh') {
		welcome = jx.base.welcome + ' ' + JxDefault.getUserNameLang() +' ['+ JxDefault.getDeptNameLang() +']';
	}
	//处理工作代理
	var proxyuser = Jxstar.session['proxy_user_name'];
	if (JxLang.type != 'zh') proxyuser = Jxstar.session['proxy_user_code'];
	if (proxyuser) {
		welcome += '('+ proxyuser +'-'+ jx.base.proxy +')';//代理
	}
	
	//菜单是否折叠状态
	var csed = Ext.util.Cookies.get('menu_collapsed');
	var homeid= 'fun_home_tab';
	var funHtml = 
		'<ul class="main_tab_strip" style="float:left;">' +
			'<li class="top-fun-text x-unselectable" title="'+ jx.base.onepage +'" itemid="'+ homeid +'">' +
			'<span unselectable="on"><i class="fa eb_home bigger-120"></i>'+ jx.base.onepage +'</span></li>' +//首页
		'</ul>';
	var headHtml = 
		"<div class='top_bg' id='top_center'>" + 
			"<div class='top_sysbtn'>"+ funHtml +
				"<span class='main_tab_down'>" +
					"<i class='fa fa-angle-double-down'></i>" +
				"</span>"+
			"</div>"+
		"</div>";

	var imgpath = './resources/images/top-app.png';
	var lw = 134, ilw = Jxstar.systemVar.index__logo__width;
	
	if (Jxstar.systemVar.indexType == '1') {//如果是项目
		imgpath = './resources/project/images/top-app.png';

		if (ilw && ilw.length > 0) {
			lw = ilw;
		} else {
			lw = 64;//项目LOGO缺省长度，产品LOGO缺省长度146
		}
	}
	
	//是否显示业务导航
	var showwf = Jxstar.systemVar.index__show__wfnav||'0';
	var wfhidden = 'hidden', wfwidth = 215;
	if (showwf != '0') {
		wfhidden = ''; 
		wfwidth = 270;
	}
	
    var topPanel = new Ext.Panel({
		region:'north',
        layout:'border',
		height:60,
		border:false,
		cls:'shadow',
		style:'z-index:10;',
	    items:
		[{
			width:(csed=='1')?56:200,
			region:'west',
			xtype:'box',
			border:false,
	        id:'top_left_img',//fa-angle-double-left
	        html: "<div id='main_logo_bg' class='top_bg"+((csed=='1')?' collpse':'')+"'>"+
	        	  "<img id='main_logo' class='main_logo' src='"+ imgpath +"'/>"+
	        	  "<span id='main_collpse' class='main_collpse pull-right'>"+
	        	  	"<i class='fa fa-bars bigger-130' title='"+jx.cloud.text10+"'></i>"+//收缩功能导航
	        	  "</span>"+
	        	  "</div>"
	    },{
	        region:'center',
			xtype:'box',
			border:false,
			html:headHtml
	    },{
			width:wfwidth,
			region:'east',
			xtype:'box',
			border:false,
			cls:'top-nav',//通知 办公 社区
	        html: '<div role="navigation" class="top-nav navbar-buttons navbar-header pull-right x-unselectable">'+
			'<ul style="line-height:55px;" class="nav ace-nav">'+
			'<li class="blue top-menu-oa '+ wfhidden +'" style="width:55px;" onclick="JxUtil.showWfnav(this);" title="'+ jx.base.busnav +'"><a unselectable="on"><i class="ace-icon fa fa-flag-o bigger-130"></i></a></li>'+
			'<li id="main_msg_icon" class="blue top-menu-msg" style="width:65px;" title="'+ jx.cloud.text7 +'"><a  unselectable="on"><i class="ace-icon fa fa-bell bigger-130"></i><span class="badge badge-important pull-top hidden"></span></a></li>'+
			'<li class="grey top-menu-rss hidden"><a unselectable="on"><i class="ace-icon fa fa-globe bigger-160"></i>'+
			jx.cloud.text9+'</a></li>'+
			'<li class="blue top-menu-user"><a unselectable="on"><img src="cloud/resources/images/user.jpg" class="nav-user-photo"><span class="user-info">谭志斌<br><small>东宏软件公司</small></span><i class="ace-icon fa fa-caret-down"></i></a></li></ul>'+
			'</ul></div>'
	    }]
	});
	
	//创建首页功能显示区域
	var sysMainTab = new Ext.Panel({
		id:'sys_main_tab',
		region:'center',
		layout:'card',
		activeItem:0,
		border:false,
		cls:'x-main-tab',
		items:[{
			id:homeid,
			label:jx.base.onepage, //首页
			layout:'fit',
			border:false
		}]
	});
	
	//功能标签对象
	var mainTab = null;
	//保存到全局对象中
	Jxstar.sysMainTab = sysMainTab;
	//添加激活当前页面的方法，item类型可以是tab、tabid、number
	sysMainTab.activate = function(item){
		if (typeof item == "number") {
			item = sysMainTab.get(item);
		} else if (typeof item == "string") {
			item = Ext.getCmp(item);
		}
		//激活当前功能
		mainTab.activeTab(item.id, item.label);
	};
	
	//关闭当前功能
	JxUtil.delay(200, function(){
		//功能标签管理对象
		var config = {tabct:topPanel.getEl().child('.main_tab_strip'), funct:sysMainTab, homeid:homeid};
		mainTab = new JxMainTab(config);
		mainTab.initHome();
		Jxstar.funMainTab = mainTab;
	});
	
	//构建菜单树
	var dataUrl = Jxstar.path + '/commonAction.do?funid=queryevent&eventcode=query_menu&user_id='+Jxstar.session['user_id'];
	var treeMenu = new Ext.tree.TreePanel({
		id: 'tree_main_menu',
		region:'west',
		title:jx.base.funmenu,//'功能菜单',
		baseCls:'xme-panel',
		iconCls:'main-menu-tree',
		bodyCssClass:'menu_bg',
		margins:'0 0 0 0',
		//split:true,
		width:(csed=='1')?56:200,
		//minSize:200,
		//maxSize:300,
		border:false,
		animate:false,//改为不显示动画，处理二级菜单中靠有的箭头图标显示有点晃动的问题
		//collapsible:true,
		
		tools:[{//添加刷新按钮可以重新加载功能菜单
			id:'refresh',
			handler: function(event, tool, tree){
				tree.getLoader().load(tree.getRootNode());
			}
		}],
		
		//autoScroll: true,
		bodyStyle:'overflow-y:hidden;overflow-x:hidden;',
		rootVisible: false,
		lines: false,
		useArrows: true,
		
		loader: new Ext.tree.TreeLoader({dataUrl: dataUrl, listeners:{
			load:function(loader, node, response){
				node.eachChild(function(item){
					var iconcls = item.attributes.iconcls;
					if (!iconcls || iconcls.length == 0) {
						iconcls = 'fun-menu-icon';
					}
					var html = '<i class="menu-icon-v fa fa-chevron-down"></i><i class="menu-icon fa '+ iconcls +'"></i><span class="txt">' + item.text + '</span>';
					item.setText(html);
				});
				var menuJson = response.responseData;
				JxUtil.putRightNodes(menuJson);
				treeMenu.menuData = menuJson;//侧滑菜单需要用到
				
				//加载滚动条
				JxMenu.addScroll(treeMenu);
			}
		}}),
		root: new Ext.tree.AsyncTreeNode({id:'xnode-11', text:'main_menu_root'})
	});
	
	//打开功能
	treeMenu.on('click', function(node){
		//把同级别的上一个节点收缩
		if (!node.isLeaf()) {
			var rs = node.parentNode.childNodes;
			for (var i = 0, n = rs.length; i < n; i++) {
				if (node.id != rs[i].id && rs[i].isExpanded()) {
					rs[i].collapse();
				}
			}
		}
		
		if (node.isLeaf()) {
			Jxstar.createNode(node.id);	
		} else {
			if (node.isExpanded()) {
				node.collapse();
			} else {
				node.expand();
			}
		}
	});
	
	//创建首页页面布局
	var viewport = new Ext.Viewport({
		layout:'border',
		style:'background-color:#FFF;',/*E5E5E5*/
		items:[topPanel, treeMenu, sysMainTab]
	});
	//方便在代理工作切换时销毁此对象
	Jxstar.viewport = viewport;
	//初始化主菜单事件
	JxMenu.init(treeMenu);
	
	//创建protel功能界面
	var funTab = sysMainTab.getComponent(0);
	JxPortalExt.createPortals(funTab);
	
	//点logo刷新菜单与首页
	Ext.fly('main_logo').on('click', function(){
		mainTab.showHome();
		//重新加载首页
		funTab.removeAll(funTab.getComponent(0), true);
		JxPortalExt.createPortals(funTab);
		
		//重新加载菜单
		treeMenu.getLoader().load(treeMenu.getRootNode());
		
		//重新加载消息
		JxMenu.updateNum();
	});

	//关闭右键事件
	Ext.getDoc().on('contextmenu', function(e){e.stopEvent();});
	//关闭F5刷新事件
	Ext.getDoc().on('keydown', function(e){
		if (e.getKey() == 116){
			e.stopEvent(); 
			if (Ext.isIE) {event.keyCode = 0;}//用于IE
			alert(jx.base.body1);//'本系统采用无刷新技术，可以点击软件中的刷新按钮查看最新数据！'
			return false;
		}
	});
	
	window.onbeforeunload = function(ev){
		if (JxUtil.isLogout) return;	//正常退出系统
		//通过刷新退出系统
		JxUtil.logout(true);
		if (Ext.isIE) return jx.base.body2;//'执行浏览器刷新操作会退出系统！';
		return false;
	};
	
	sysMainTab.doLayout();
	
	//显示IM图标消息
	JxUtil.loadIM(sysMainTab);
	
	//显示代理工作连接
	JxMenu.showProxy();
	
	//加载顶部公共菜单事件
	JxMenu.showTopMenu(topPanel);
	
	//执行外部扩展的登录后事件
	if (Jxstar.afterLogin) Jxstar.afterLogin();
	
	//启动会话效验
	SessionTimer.SESSION_TIMEOUT = Jxstar.session.maxInterval;
	SessionTimer.resetTimer();
	SessionTimer.startTimer();
})();