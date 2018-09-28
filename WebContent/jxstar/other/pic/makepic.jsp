<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page import="java.io.*" %>
<%@ page import="java.awt.image.BufferedImage" %>
<%@ page import="javax.imageio.stream.ImageOutputStream" %>
<%@ page import="javax.imageio.*" %>
<%@ page import="com.sun.image.codec.jpeg.*" %>

<html>
  <body>
<%
	//取保存文件的路径
	String realPath = org.jxstar.util.RealPath.getRealPath(application);
	String fileFlag = Long.toString(java.util.Calendar.getInstance().getTimeInMillis()) + Integer.toString((int) (Math.random() * 1000));
	String picfile = realPath + "/jxstar/other/pic/tmp/pic"+ fileFlag +".jpg";
	
	String width = request.getParameter("width");
	String height = request.getParameter("height");
	int w = Integer.parseInt(width);
	int h = Integer.parseInt(height);
	try {
		BufferedImage bf = new BufferedImage(w, h,
				BufferedImage.TYPE_INT_RGB);
		for (int i = 0; i < bf.getHeight(); i++) {
			String data = request.getParameter("px" + i);
			String[] ds = data.split(",");
			for (int j = 0; j < bf.getWidth(); j++) {
				int d = Integer.parseInt(ds[j], 16);
				bf.setRGB(j, i, d);
			}
		}
		
		ImageWriter writer = null;
		ImageTypeSpecifier type = ImageTypeSpecifier
				.createFromRenderedImage(bf);
		Iterator iter = ImageIO.getImageWriters(type, "jpg");
		if (iter.hasNext()) {
			writer = (ImageWriter) iter.next();
		}
		IIOImage iioImage = new IIOImage(bf, null, null);
		ImageWriteParam param = writer.getDefaultWriteParam();
		//param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
		//param.setCompressionQuality(0.2f);
		
		FileOutputStream fos = new FileOutputStream(picfile);
		ImageOutputStream outs = ImageIO.createImageOutputStream(fos);
		writer.setOutput(outs);
		writer.write(null, iioImage, param);
		outs.close();
		fos.close();
	} catch (Exception e) {
		e.printStackTrace();
	}
	request.getSession().setAttribute("picfile", picfile);
	response.sendRedirect("./viewpic.jsp");
%>
  </body>
</html>
