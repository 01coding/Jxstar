<!DOCTYPE html>
<html lang="zh-CN">
<head>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page import="org.jxstar.util.config.SystemVar" %>
<%@ page import="org.jxstar.security.LicenseVar" %>
<%@ page import="org.jxstar.util.resource.JxText" %>
<%@ page import="org.jxstar.util.resource.JsMessage" %>
<%
	String contextpath = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+contextpath+"/";  
	String dbType = org.jxstar.dao.util.DBTypeUtil.getDbmsType();
	String svnNum = SystemVar.getValue("index.svn", "");
	String indexType = SystemVar.getValue("index.type", "0");
	String indexName = SystemVar.getValue("index.name", "Jxstar云开发平台");
	String indexBottom = SystemVar.getValue("index.bottom", "");
	String useMinJs = SystemVar.getValue("index.useminjs", "0");//开启可以提高文件加载效率
	String verNo = SystemVar.getValue("sys.version.no", "");
	String verType = LicenseVar.getValue(LicenseVar.VERSION_TYPE, "SE");
	String useCase = SystemVar.getValue("page.query.case", "0");
	boolean connValid = org.jxstar.dao.util.ConnValid.hasValid();
	if (!connValid) {
		response.sendRedirect(contextpath+"/error.jsp?errorCode=index.dbnostart");
	}
	String loginCss = "resources/css/login.css";
	if (indexType.equals("1")) loginCss = "resources/project/css/login.css";
	String allVarJs = SystemVar.getVarJs();
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
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
	
	<title><%=indexName%>-<%=verNo%></title>
	
	<!-- 加base标签会造成流程图显示为黑色 -->
	<!--<base href="<%=basePath%>" />-->
	<link rel="shortcut icon" type="image/vnd.microsoft.icon" href="cloud/resources/images/favicon.png">

	<link rel="stylesheet" type="text/css" href="<%=loginCss%>" />
	
	<link rel="stylesheet" href="cloud/resources/css/bootstrap.css" />
	<link rel="stylesheet" href="cloud/resources/css/font-awesome.css" />
	<link rel="stylesheet" href="cloud/resources/css/cloud.css" />

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
<body>
	<iframe id="frmhidden" name="frmhidden" style="display:none;"></iframe>
	<div id="loading" class="login_loading">
		<img src="resources/images/jxstar32.gif" width="32" height="32"
		style="margin-right:8px;float:left;vertical-align:bottom;"/>
		<span id="loading-msg">正在加载样式文件...</span>
	</div>
	
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
		<script type="text/javascript" src="lib/ext/ux/FixTableLayout.js"></script>
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
		<script type="text/javascript" src="public/core/JxPivotExp.js"></script>
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