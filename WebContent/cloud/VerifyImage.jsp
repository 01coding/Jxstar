<%@ page contentType="image/jpeg" import="org.jxstar.util.VerifyImage" pageEncoding="UTF-8"%>
<%
	try {
		request.setAttribute("check_num", "5");//输出几种类型的验证码
		VerifyImage.createImage(request, response);//输出图片方法
		response.getOutputStream().flush();
		out.clear();
		out = pageContext.pushBody();
	} catch (Exception e) {
		e.printStackTrace();
	}
%>
