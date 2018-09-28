<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page import="org.jxstar.util.resource.JsMessage" %>
<%
	String errorCode = request.getParameter("errorCode");
	String errorInfo = JsMessage.getValue(errorCode);
	String dberror = "数据库配置无效，请检查 [/WEB-INF/classes/conf/server.xml]文件中的 DataSource 配置是否正确！";
	if (errorInfo == null || errorInfo.length() == 0) {errorInfo = dberror;}
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="utf-8" />
	<title>Jxstar软件开发平台</title>
</head>
<body>
<div style='margin-top:10px;margin-left:10px;'>
<div style='font-size:12px;color:red;'><%=errorInfo%></div>
<div style='margin-top:4px;'><a style='font-size:12px;color:green;' href='index.jsp'>返回首页</a></div>
</div>
</body>
</html>
