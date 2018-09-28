<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page import="org.jxstar.util.PDFConver,javax.servlet.*,java.io.File" %> 
<%  
	//必须设置，否则中文文件名乱码
	request.setCharacterEncoding("UTF-8");
	//文件路径
	String fpath = request.getParameter("fpath");
	if (fpath == null) fpath = "";
	//文件名，不含文件路径
	String fname = request.getParameter("fname");
	if (fname == null || fname.length() == 0) {
		fname = "null.pdf";
	}
	
	response.setHeader("Content-Type", "application/pdf");
	//附件的中文要特殊处理
	String fileName = "";
	String userAgent = request.getHeader("User-Agent");
	if (userAgent.indexOf("msie") > -1){
		fileName = java.net.URLEncoder.encode(fname, "utf-8");
	} else {
		fileName = new String(fname.getBytes("utf-8"), "iso-8859-1");
	}
	fileName = fileName.substring(0, fileName.lastIndexOf(".")) + ".pdf";
	response.setHeader("Content-Disposition", "filename="+fileName);
	
	ServletOutputStream outs = response.getOutputStream();
	try {
		fname = fpath + fname;
		PDFConver.file2pdf(fname, outs);
		//添加下面三行，解决异常：getOutputStream() has already been called for this response
		response.flushBuffer();  
		out.clear();  
		out = pageContext.pushBody();
	} catch (Exception e) {
		e.printStackTrace();
	}
%>