<%@page contentType="text/plain;charset=UTF-8"%>
<jsp:directive.page import="java.text.SimpleDateFormat" />
<jsp:directive.page import="java.util.Date" />
<jsp:directive.page import="java.io.FileOutputStream" />
<jsp:directive.page import="java.io.File" />
<jsp:directive.page import="java.io.BufferedInputStream" />
<jsp:directive.page import="java.io.ByteArrayOutputStream"/>
<jsp:directive.page import="org.p3p.image.encrypt.JpegEncrypt"/>

<%
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	String rootPath = org.jxstar.util.RealPath.getRealPath(application);
	String cdstr = sdf.format(new Date());
	String filename = cdstr + ((int) (Math.random() * 100000 + 10000))
			+ ".jpg";

	int v = 0;
	BufferedInputStream inputStream = new BufferedInputStream(
			request.getInputStream());
	byte[] bytes = new byte[1024];
	ByteArrayOutputStream baos = new ByteArrayOutputStream();
	while ((v = inputStream.read(bytes)) > 0) {
		baos.write(bytes, 0, v);
	}
	inputStream.close();
	baos.close();
	// 加入认证
	byte[] tmp = baos.toByteArray();
	JpegEncrypt en = new JpegEncrypt();
	byte[] tmp1 = en.encrypt(cdstr + "-tony", tmp);
	tmp = null;
	filename = rootPath + "/jxstar/other/photo/upload/" + filename;
	File f1 = new File(filename);
	FileOutputStream fos = new FileOutputStream(f1);
	fos.write(tmp1);
	fos.close();
	// String keyword=en.decrypt(f1);
	// System.out.println("解密后："+keyword);
	System.out.println("拍照图片：" + filename);
	// 回调前台方法onUploadSuccess
	out.write(filename);
%>
