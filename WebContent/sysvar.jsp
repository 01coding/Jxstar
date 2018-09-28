<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page import="org.jxstar.util.config.SystemVar" %>
<%
	String varcode = request.getParameter("code");
	String varvalue = request.getParameter("value");
	String prevalue = SystemVar.getValue(varcode);
	SystemVar.setValue(varcode, varvalue);
	String postvalue = SystemVar.getValue(varcode);
%>
<html>
<head>
	<title>系统变量修改</title>
</head>
<body>
<!--http://localhost:8080/jxstar/sysvar.jsp?code=upload.server.type&value=1-->
系统变量: <%=varcode%> <b>
修改前值: <%=prevalue%> <b>
修改后值: <%=postvalue%> <b>
</body>
</html>
