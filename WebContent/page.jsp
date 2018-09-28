<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page import="org.jxstar.util.config.SystemVar,
				 org.jxstar.security.LicenseVar,
				 java.util.Map,
				 org.jxstar.util.factory.FactoryUtil,
				 org.jxstar.control.login.OneLoginUtil,
				 org.jxstar.util.resource.JxText,
				 org.jxstar.util.resource.JsMessage" %>
<!--
使用说明
1、普通功能URL http://xxxx:xxx/jxstar/page.jsp?nodeid=xxxx&usercode=xxxx
2、指定记录URL http://xxxx:xxx/jxstar/page.jsp?nodeid=xxxx&usercode=xxxx&keyid=xxxx&pagetype=grid
3、审批功能URL http://xxxx:xxx/jxstar/page.jsp?nodeid=xxxx&usercode=xxxx&keyid=xxxx&pagetype=check&isframe=1&currLang=zh
-->
<%
	String contextpath = request.getContextPath();
	//获取会话信息
	String sessionData = OneLoginUtil.getSessionData(request);
	if (sessionData.length() == 0) {
		String url = contextpath+"/index.jsp";
		String useF5 = SystemVar.getValue("sys.login.usef5", "0");
		if (useF5.equals("1")) {//解决F5环境跳转后会自动添加端口号的问题
			url = "http://" + request.getHeader("Host") + url;
		}
		//response.sendRedirect(url);
		request.getRequestDispatcher("index.jsp").forward(request, response);
	}
	
	String svnNum = SystemVar.getValue("index.svn", "");
	String indexType = SystemVar.getValue("index.type", "0");
	String indexName = SystemVar.getValue("index.name", "Jxstar云平台");
	String indexBottom = SystemVar.getValue("index.bottom", "");
	String useMinJs = SystemVar.getValue("index.useminjs", "0");//开启可以提高文件加载效率
	
	String verNo = SystemVar.getValue("sys.version.no", "");
	String verType = LicenseVar.getValue(LicenseVar.VERSION_TYPE, "SE");
	String useCase = SystemVar.getValue("page.query.case", "0");
	boolean connValid = org.jxstar.dao.util.ConnValid.hasValid();
	
	if (!connValid) {
		String url = contextpath+"/error.jsp?errorCode=index.dbnostart";
		String useF5 = SystemVar.getValue("sys.login.usef5", "0");
		if (useF5.equals("1")) {//解决F5环境跳转后会自动添加端口号的问题
			url = "http://" + request.getHeader("Host") + url;
		}
		response.sendRedirect(url);
	}
	
	String loginCss = "resources/css/login.css";
	if (indexType.equals("1")) loginCss = "resources/project/css/login.css";
	
	String allVarJs = SystemVar.getVarJs();
	//当前需要打开的功能
	String keyid = request.getParameter("keyid");
	if (keyid == null) keyid = "";
	String nodeid = request.getParameter("nodeid");
	if (nodeid == null) nodeid = "";
	String pagetype = request.getParameter("pagetype");//页面类型
	if (pagetype == null) pagetype = "";
	String isframe = request.getParameter("isframe");//是否显示功能框架
	if (isframe == null) isframe = "";
	
	//保持当前用户选择的语言类型到会话中
	String curLangType = request.getParameter("currLang");
	if (curLangType != null && curLangType.length() > 0) {
		session.setAttribute("currLang", curLangType);
		JxText.setLang(curLangType);//记录当前线程的语言类型
		
		indexName = JsMessage.getValue("index.name");
		indexBottom = JsMessage.getValue("index.bottom");
	} else {
		curLangType = "zh";
		session.setAttribute("currLang", "");
	}
	//首页是否显示语言选项
	String seLang = SystemVar.getValue("sys.lang.use", "0");
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
	
	<title><%=indexName%>-<%=verNo%></title>

	<link rel="shortcut icon" type="image/vnd.microsoft.icon" href="cloud/resources/images/favicon.png">

	<link rel="stylesheet" type="text/css" href="<%=loginCss%>" />
	
	<link rel="stylesheet" href="cloud/resources/css/bootstrap.css" />
	<link rel="stylesheet" href="cloud/resources/css/font-awesome.css" />
	<link rel="stylesheet" href="cloud/resources/css/cloud.css" />
	
	<div id="loading" class="login_loading">
		<img src="resources/images/jxstar32.gif" width="32" height="32"
		style="margin-right:8px;float:left;vertical-align:bottom;"/>
		<span id="loading-msg">正在加载样式文件...</span>
	</div>
	<iframe id="frmhidden" name="frmhidden" style="display:none;"></iframe>
	<link rel="stylesheet" type="text/css" href="lib/ext/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="resources/css/main.css" />
	<link rel="stylesheet" type="text/css" href="resources/css/labctl.css" />
	
	<%if (useMinJs.equals("1")){%>
		<link rel="stylesheet" type="text/css" href="lib/ext/ux/css/ext-ux-min.css" />
	<%} else {%>
		<link rel="stylesheet" type="text/css" href="lib/ext/ux/css/portal.css" />
		<link rel="stylesheet" type="text/css" href="lib/ext/ux/css/RowEditor.css" />
		<link rel="stylesheet" type="text/css" href="lib/ext/ux/css/fileuploadfield.css" />
		<link rel="stylesheet" type="text/css" href="lib/ext/ux/css/data-view.css" />
	<%}%>
</head>
<body scroll="no">
	<script type="text/javascript">
		document.getElementById('loading-msg').innerHTML = '正在加载系统文件...';
	</script>

	<script type="text/javascript" src="lib/ext/adapter/ext-base.js"></script>
	<script type="text/javascript" src="lib/ext/ext-all.jsgz"></script>
	<script type="text/javascript" src="lib/ext/locale/ext-lang-<%=curLangType%>.js"></script>
	<script type="text/javascript" src="lib/base64.min.js"></script>
	<%if (useMinJs.equals("1")){%>
		<script type="text/javascript" src="public/coremin/ext-ux-min.js"></script>
	<%} else {%>
		<script type="text/javascript" src="lib/ext/ux/ColumnHeaderGroup.js"></script>
		<script type="text/javascript" src="lib/ext/ux/RowExpander.js"></script>
		<script type="text/javascript" src="lib/ext/ux/RowEditor.js"></script>
		<script type="text/javascript" src="lib/ext/ux/Emptybox.js"></script>
		<script type="text/javascript" src="lib/ext/ux/FileUploadField.js"></script>
		<script type="text/javascript" src="lib/ext/ux/DateTimeField.js"></script>
	<%}%>
	<script type="text/javascript" src="public/locale/jxstar-lang-<%=curLangType%>.js"></script>
	<%if (useMinJs.equals("1")){%>
		<script type="text/javascript" src="public/coremin/jxstar-core-min.js"></script>
	<%} else {%>
		<script type="text/javascript" src="public/core/JxLang.js"></script>
		<script type="text/javascript" src="public/core/SessionTimer.js"></script>
		<script type="text/javascript" src="public/core/GridNode.js"></script>
		<script type="text/javascript" src="public/core/FormNode.js"></script>
		<script type="text/javascript" src="public/core/JxUtil.js"></script>
		<script type="text/javascript" src="public/core/JxAttach.js"></script>
		<script type="text/javascript" src="public/core/JxDefault.js"></script>
		<script type="text/javascript" src="public/core/JxLists.js"></script>
		<script type="text/javascript" src="public/core/JxGroup.js"></script>
		<script type="text/javascript" src="public/core/JxSum.js"></script>
		<script type="text/javascript" src="public/core/JxExport.js"></script>
		<script type="text/javascript" src="public/core/JxPrint.js"></script>
		<script type="text/javascript" src="public/core/JxHint.js"></script>
		<script type="text/javascript" src="public/core/JxSelect.js"></script>
		<script type="text/javascript" src="public/core/JxFormSub.js"></script>
		<script type="text/javascript" src="public/core/JxSearch.js"></script>
		<script type="text/javascript" src="public/core/JxQuery.js"></script>
		<script type="text/javascript" src="public/core/JxSender.js"></script>
		<script type="text/javascript" src="public/core/JxMainTab.js"></script>
		<script type="text/javascript" src="public/core/JxPortalExt.js"></script>
		<script type="text/javascript" src="public/portlet/portlet_chart.js"></script>
		<script type="text/javascript" src="public/portlet/portlet_fun.js"></script>
		<script type="text/javascript" src="public/portlet/portlet_news.js"></script>
		<script type="text/javascript" src="public/portlet/portlet_result.js"></script>
		<script type="text/javascript" src="public/portlet/portlet_work.js"></script>
		<script type="text/javascript" src="public/core/JxMenu.js"></script>
		<script type="text/javascript" src="public/core/JxPagerTool.js"></script>
		<script type="text/javascript" src="public/core/JxImageField.js"></script>
		<script type="text/javascript" src="public/core/Request.js"></script>
		<script type="text/javascript" src="public/core/XmlRequest.js"></script>
		<script type="text/javascript" src="public/core/GridEvent.js"></script>
		<script type="text/javascript" src="public/core/FormEvent.js"></script>
		<script type="text/javascript" src="public/core/JxExt.js"></script>
		<script type="text/javascript" src="public/core/Jxstar.js"></script>
		<script type="text/javascript" src="public/core/JxCloud.js"></script>
		<script type="text/javascript" src="public/core/JxWfGraph.js"></script>
		<script type="text/javascript" src="public/core/JxLabelPrint.js"></script>
		<script type="text/javascript" src="lib/graph/js/mxCanvas.js"></script>
	<%}%>
	<script type="text/javascript" src="public/data/NodeDefine.js"></script>
	<script type="text/javascript" src="public/data/RuleData.js"></script>
	<script type="text/javascript" src="public/locale/combo-lang-<%=curLangType%>.js"></script>
	<%if (!curLangType.equals("zh")){%>
		<script type="text/javascript" src="public/locale/fun-lang-<%=curLangType%>.js"></script>
		<script type="text/javascript" src="public/locale/event-lang-<%=curLangType%>.js"></script>
		<script type="text/javascript" src="public/locale/other-lang-<%=curLangType%>.js"></script>
		<script type="text/javascript">JxLang.type = '<%=curLangType%>';</script>
	<%}%>
	<script type="text/javascript">Ext.fly('loading').hide();</script>
	<script type="text/javascript" src="custom.js"></script>
</body>
<script type="text/javascript">
Ext.onReady(function() {
	Jxstar.isone = '1';//标识此请求是来自集成页面

	Jxstar.path = '<%=contextpath%>';
	Jxstar.systemVar.indexType = '<%=indexType%>';
	Jxstar.systemVar.verType = '<%=verType%>';
	Jxstar.systemVar.useCase = '<%=useCase%>';
	//把所有用于页面的系统变量附加到对象中
	Ext.apply(Jxstar.systemVar, Ext.decode("<%=allVarJs%>"));
	//设置EXT的常量
	Ext.BLANK_IMAGE_URL = Jxstar.path + '/lib/ext/resources/images/default/s.gif';
	
	var createNode = function(nodeId, pageParam) {
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
		
		//检查用户是否有该功能的权限，审批时不判断
		var isCheck = (pageParam && pageParam.pageType && pageParam.pageType == 'check');
		if (!isCheck && !Jxstar.validNode(nodeId)) {
			JxHint.alert(String.format(jx.star.noright, nodeId));	//'用户没有该【{0}】功能的授权！'
			return false;
		}
		
		var funTitle = define.nodetitle;
		
		//如果是审批界面，功能标题上添加'--审批'
		if (isCheck) {
			funTitle += '--' + jx.base.check;	//审批
		}
		document.getElementsByTagName('title')[0].innerHTML = funTitle;
		
		//异步加载功能对象后再显示
		var hdCall = function(f) {
			var page = f(define, pageParam);
			//如果不是layout页面，是GridNode页面，则有showPage方法
			if (typeof page.showPage == 'function') {
				pageParam = pageParam || {};
				page = page.showPage(pageParam.pageType, pageParam.parentNodeId);
			}
			
			//显示功能框架
			var isframe = '<%=isframe%>';
			if (isframe == '1') {
				var mainCt = new Ext.TabPanel({
					id:'tab_main_page',
					closeAction:'close',
					border:false,
					minTabWidth:150,
					resizeTabs:true,
					activeTab:0,
					items:[{
						id: 'fun_' + define.nodeid,
						title: define.nodetitle,
						border: false,
						layout: 'fit',
						autoScroll: true,
						iconCls: 'function',
						items: [page]
					}]
				});
				var viewport = new Ext.Viewport({
					layout:'fit',
					items:[mainCt]
				});
				Jxstar.sysMainTab = mainCt;
				mainCt.doLayout();
			} else {
				var mainCt = new Ext.Container({
					layout:'fit',
					region:'center',
					items:[page]
				});
				var viewport = new Ext.Viewport({
					layout:'fit',
					items:[mainCt]
				});
				Jxstar.sysMainTab = mainCt;
				mainCt.doLayout();
			}
			
			//显示表格对象后再加载数据才稳定
			if (page.isXType('grid')) {
				if (pageParam && pageParam.whereSql && pageParam.whereSql.length > 0) {
					Jxstar.loadData(page, {where_sql:pageParam.whereSql, where_value:pageParam.whereValue, where_type:pageParam.whereType, is_query:pageParam.isQuery});
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
	};
	
	//登陆成功
	var f_success = function(data) {
		Jxstar.session = data;
		Jxstar.session.maxInterval = <%=session.getMaxInactiveInterval()%>;
		Jxstar.session.sessionId = '<%=session.getId()%>';

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
		
		var nodeid = '<%=nodeid%>';
		var keyid = '<%=keyid%>';
		if (keyid.length == 0) {
			createNode(nodeid);
		} else {
			var define = Jxstar.findNode(nodeid);
			var keycol = define.pkcol.replace('__', '.');
			createNode(nodeid, {pageType:'<%=pagetype%>', showType:define.showform, whereSql:keycol+' = ?', whereType:'string', whereValue:keyid, queryType:'1'});
		}
		
		//启动会话效验
		SessionTimer.SESSION_TIMEOUT = Jxstar.session.maxInterval;
		SessionTimer.resetTimer();
		SessionTimer.startTimer();
	};
	
	//集成直接登录
	if (Jxstar.isone == '1') {
		var data = <%=sessionData%>;
		if (!Ext.isEmpty(data)) {
			f_success(data);
		}
	}
	
	//添加frmhidden的响应事件，用于处理文件下载的错误消息
	Ext.fly('frmhidden').on('load', function(event, dom){
		var doc = null;
		try {doc = dom.contentWindow.document;} catch(e) {}
		
		if (doc) {
			var text = doc.body.innerHTML;
			if (text == null || text.length == 0) {
				text = jx.index.downerror;
			}
			JxHint.alert(text);
		} else {
			JxHint.alert('执行完成！');
		}
	});
	
	//标记当前语言选项
	JxLang.type = '<%=curLangType%>';
	JxLang.curLang = '<%=curLangType%>';
});
</script>
<script type="text/javascript">
var doKey = function(e){//用ExtJs的事件注册时无效
	var ev = e || window.event;
	var obj = ev.target || ev.srcElement;
	var t = obj.type || obj.getAttribute('type');//获取事件源类型
	if(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea"){
		return false;
	}
};
//禁止后退键 作用于Firefox、Opera
document.onkeypress=doKey;
//禁止后退键  作用于IE、Chrome
document.onkeydown=doKey;
</script>
</html>
<%
//移除当前线程的语言类型
if (JxText.langUsed()) JxText.removeLang();
%>