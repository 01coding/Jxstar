<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page import="java.io.*" %>
<%
	File file = null;
	FileInputStream ins = null;
	ServletOutputStream bos = response.getOutputStream();
	try {
		String picfile = (String) request.getSession().getAttribute("picfile");
		file = new File(picfile);
		ins = new FileInputStream(file);
		
		int len = 0;
		byte[] buf = new byte[256];
		while ((len = ins.read(buf, 0, 256)) > -1) {
			bos.write(buf, 0, len);
		}
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		try {
			if (ins != null) {ins.close(); ins = null;}
			if (bos != null) {bos.flush(); bos.close(); bos = null;}
			//upload and then remove attachments
			//file.delete();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
%>
