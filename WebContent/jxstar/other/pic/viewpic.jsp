<%@ page language="java" pageEncoding="utf-8"%>
<%
	String picfile = (String) request.getSession().getAttribute("picfile");
%>
<html>
<script type="text/javascript">
	var repai = function() {
		window.location.href = './index.html';
	};
	
	var upload = function() {
		var jx = window.top.Jxstar;
		if (jx && jx.uploadPic) {
			jx.uploadPic('<%=picfile%>', window.frameElement.gridId);
		}
	};
</script>
  <body bgcolor="#ffffff" style="margin:12px;">
  <image width="400" height="300" src="./readpic.jsp">
  <button style="margin:10 10 0 100px;width:80px;" onclick="upload();">上&nbsp传</button>
  <button style="margin:10 100 0 10px;width:80px;" onclick="repai();">重&nbsp拍</button>
  </body>
</html>
