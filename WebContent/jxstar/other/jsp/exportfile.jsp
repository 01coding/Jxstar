<%@ page contentType="text/html; charset=UTF-8"%><%
String charset = request.getParameter("charset");
if (charset == null || charset.length() == 0) charset = "GBK";
response.setHeader("Pragma", "public");
response.setHeader("Expires", "0");
response.setHeader("Cache-Control", "must-revalidate, post-check=0, pre-check=0");
response.setHeader("Content-Type", "application/force-download");
response.setHeader("Content-Type", "text/csv;charset="+charset);
String fileName = request.getParameter("fileName");
if (fileName == null || fileName.length() == 0) fileName = "exprot.csv";
String userAgent = request.getHeader("User-Agent");
fileName = org.jxstar.control.action.ActionHelper.getAttachName(userAgent, fileName);
response.setHeader("Content-Disposition", "attachment;filename="+fileName);
String content = request.getParameter("exportContent");
if (charset.equalsIgnoreCase("GBK")) {
content = org.jxstar.util.StringUtil.convEncoding(content.getBytes("UTF-8"), "UTF-8", "GBK");
}
out.print(content);
%>