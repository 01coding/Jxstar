<%@ page contentType="text/html; charset=UTF-8"%><%@ page import="com.jxstar.extend.AudioTool" %><%String amrpath = request.getParameter("amrpath");response.setHeader("Content-Type", "audio/wav");AudioTool.setFFMPegPath("c:/ffmpeg.exe");AudioTool.setTmpRoot("c:/");AudioTool.outWav(amrpath, response);%>