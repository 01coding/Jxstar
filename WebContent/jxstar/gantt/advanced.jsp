<%@ page contentType="text/html; charset=UTF-8"%>
<%
	String contextpath = request.getContextPath();
	String user_id = request.getParameter("user_id");
	String dataid = request.getParameter("dataid");
%>
<html>
<script language="javascript">
	var CONTEXTPATH = "<%=contextpath%>";
	var USERID = "<%=user_id%>";
	var DATAID = "<%=dataid%>";
</script>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>Jxstar Gantt</title>
	
	<link rel="stylesheet" type="text/css" href="<%=contextpath%>/lib/ext/resources/css/ext-all.cssgz" />
	
	<link rel="stylesheet" type="text/css" href="<%=contextpath%>/lib/ext/ux/css/Spinner.css" />
    <link rel="stylesheet" type="text/css" href="<%=contextpath%>/lib/ext/ux/css/LockingGridView.css" />
	
	<link rel="stylesheet" type="text/css" href="<%=contextpath%>/lib/ext-gantt/css/sch-gantt-all.css" />
    <link rel="stylesheet" type="text/css" href="<%=contextpath%>/lib/ext-gantt/css/examples.css" />
	<link href="advanced.css" rel="stylesheet" type="text/css" />
	
    <!--Ext lib and UX components-->
	<script type="text/javascript" src="<%=contextpath%>/lib/ext/adapter/ext-base.js"></script>
	<script type="text/javascript" src="<%=contextpath%>/lib/ext/ext-all.jsgz"></script>
	<script type="text/javascript" src="<%=contextpath%>/lib/ext/locale/ext-lang-zh.js"></script>
	
	<!--Gantt components-->
	<script type="text/javascript" src="<%=contextpath%>/lib/ext/ux/LockingGridView.js"></script>
    <script type="text/javascript" src="<%=contextpath%>/lib/ext/ux/Spinner.js"></script>
    <script type="text/javascript" src="<%=contextpath%>/lib/ext/ux/SpinnerField.js"></script>

    <script type="text/javascript" src="<%=contextpath%>/lib/ext-gantt/js/sch-gantt-base-debug.jsgz"></script>
    <script type="text/javascript" src="<%=contextpath%>/lib/ext-gantt/js/sch-gantt-all-debug.jsgz"></script>

    <!--Application files-->
    <script src="jxgantt.js" type="text/javascript"></script>
    <script src="advanced.js" type="text/javascript"></script>

	<style>
		.x-btn button {
			padding: 2px 12px;
		}
		.x-btn-icon .x-btn-small .x-btn-text,
		.x-btn-text-icon .x-btn-icon-small-left .x-btn-text {
			height: 30px;
		}
	</style>
</head>
<body>
</body>
</html>
