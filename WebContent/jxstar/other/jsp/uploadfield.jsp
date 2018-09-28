<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page import="org.jxstar.util.config.SystemVar" %>
<%
	String contextpath = request.getContextPath();
	
	String user_id = request.getParameter("user_id");
	if (user_id == null) user_id = "";
	String dataid = request.getParameter("dataid");
	String datafunid = request.getParameter("datafunid");
	String datafield = request.getParameter("attach_field");
	
	String eventcode = request.getParameter("eventcode");
	if (eventcode == null || eventcode.length() == 0) {
		eventcode = "create";
	}
	String table_name = request.getParameter("table_name");
	if (table_name == null) table_name = "";
	
	String attach_field = datafield;
	if (datafield == null || datafield.length() == 0) {
		attach_field = "attach_path";
	} else {
		if (table_name.length() > 0) {
			attach_field = table_name+ "__" +datafield;
		}
	}
	
	
%>
<SCRIPT LANGUAGE="JavaScript">
<!--
	function select_file() {
		var file = document.getElementById("<%=attach_field%>");
		var name = document.getElementById("attach_name");
		
		var path = file.value;
		var len = path.length;
		if (len > 0) {
			var pos = path.lastIndexOf('\\');
			if (pos >= 0) {
				path = path.substr(pos+1, len);
			}
		}
		name.value = path;
	}
	
//-->
</SCRIPT>
<!--集中管理附件时，需要用到此界面上传附件-->
<html>
	<body>
	<form id="attachform" action="<%=contextpath%>/fileAction.do" method="post" enctype="multipart/form-data" target="frmhidden">
    <input id="<%=attach_field%>" name="<%=attach_field%>" type="file" width=300 size=30 onchange="select_file();">
	<br>
	<input id="attach_name" name="attach_name" value="" width=300 size=30 type="text"/>
    <input name="nousercheck" value="1" type="hidden"/>
    <input name="funid" value="sys_attach" type="hidden"/>
	<input name="pagetype" value="editgrid" type="hidden"/>
	<input name="eventcode" value="<%=eventcode%>" type="hidden"/>
	<input name="attach_field" value="<%=datafield%>" type="hidden"/>
	<input name="dataid" value="<%=dataid%>" type="hidden"/>
	<input name="user_id" value="<%=user_id%>" type="hidden"/>
	<input name="datafunid" value="<%=datafunid%>" type="hidden"/>
	<input name="table_name" value="<%=table_name%>" type="hidden"/>
    <br>
    <input type="submit" value="上传" >
    </form>
	<iframe id="frmhidden" name="frmhidden" style="display:none;"></iframe>
	</body>
</html>
<SCRIPT LANGUAGE="JavaScript">
<!--
	var ifrm = document.getElementById("frmhidden");
	var stateChg = function(){
		var doc = ifrm.contentWindow.document;
		var state = doc.readyState;
		if (state == "complete") {
			var text = doc.body.innerHTML;
			if (text != null && text.length > 0) {
				if (text.indexOf('success:false') >= 0) {
					alert(text);
				} else if (text.indexOf('success:true') >= 0) {
					document.getElementById("attachform").style.display = "none";
					document.body.innerHTML = "<div style='font-size:13px;color:green;'>执行成功，请关闭对话框！</div>";
					//由于是跨域页面，所以取不到window.top.Ext对象
				} else {
					alert('执行出现异常！' + text);
				}
			}
		}
	};
	
	if (window.addEventListener) {
		ifrm.addEventListener('load', stateChg, false);
	} else {
		ifrm.onreadystatechange = stateChg;
	}
	
//-->
</SCRIPT>