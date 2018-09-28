<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page import="org.jxstar.util.resource.JxText" %>
<%@ page import="org.jxstar.util.resource.JsMessage" %>
<%
String dataId = request.getParameter("dataid");
String dataFunId = request.getParameter("datafunid");
String userId = request.getParameter("user_id");
String winId = request.getParameter("winid");

String funid = request.getParameter("funid");
if (funid == null) funid = "sys_attach";
String eventcode = request.getParameter("eventcode");
if (eventcode == null) eventcode = "create";
String extparam = request.getParameter("extparam");
if (extparam == null) extparam = "";

String contextPath = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+"/";

if (userId == null || userId.length() == 0) {
	response.sendRedirect(contextPath + "/index.jsp");
}

//记录当前线程的语言类型
boolean uselang = JxText.langUsed();
String currLang = (String) request.getSession().getAttribute("currLang");
if (uselang && currLang != null && currLang.length() > 0) {
	JxText.setLang(currLang);
}
%>
<!DOCTYPE html>
<html>
<head>
	<!--<base href="<%=basePath%>">-->
	
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
	
	<title>plupload</title>
	<script src="js/jquery-1.10.2.min.js"></script>
	<script src="js/plupload.full.min.js"></script>
	<style>
		body {
			font-size:13px;
		}
		body,p,div {
			padding:0;
			margin:0;
		}
		.wraper {
			padding:30px 0;
		}
		.btn-wraper {
			text-align:center;
		}
		.btn-wraper input {
			margin:0 10px;
		}
		#drop-area {
			background-color:#f2f2f2;
			font-size:18px;
			color:#888;
			padding:25px;
			text-align:center;
		}
		#file-list {
			width:350px;
			margin:20px auto;
		}
		#file-list li {
			margin-bottom:10px;
			background-color:#dff0d8;
			padding:5px;
		}
		.file-name {
			line-height:30px;
		}
		.progress {
			height:5px;
			font-size:0;
			line-height:5px;
			background:orange;
			width:0;
		}
		.tip1 {
			text-align:center;
			font-size:14px;
			padding-top:10px;
		}
		.tip2 {
			text-align:center;
			font-size:13px;
			padding-top:10px;
			color:#b00
		}
		.catalogue {
			position:fixed;
			_position:absolute;
			_width:200px;
			left:0;
			top:0;
			border:1px solid #ccc;
			padding:10px;
			background:#eee
		}
		.catalogue a {
			line-height:30px;
			color:#0c0
		}
		.catalogue li {
			padding:0;
			margin:0;
			list-style:none;
		}
		.faild {
			color:red;
		}
		.success {
			color:green;
		}
		.btn-success {
			color:#fff;
			background-color:#5cb85c;
			border-color:#4cae4c;
		}
		.btn-success:focus,.btn-success.focus {
			color:#fff;
			background-color:#449d44;
			border-color:#255625;
		}
		.btn-success:hover {
			color:#fff;
			background-color:#449d44;
			border-color:#398439;
		}
		.btn {
			display:inline-block;
			padding:6px 12px;
			margin-bottom:0;
			font-size:13px;
			font-weight:400;
			line-height:1.42857143;
			text-align:center;
			white-space:nowrap;
			vertical-align:middle;
			-ms-touch-action:manipulation;
			touch-action:manipulation;
			cursor:pointer;
			-webkit-user-select:none;
			-moz-user-select:none;
			-ms-user-select:none;
			user-select:none;
			background-image:none;
			border:1px solid transparent;
			border-radius:4px;
		}
    </style>
</head>
<body>
	<div class="wraper">
		<div class="btn-wraper">
			<input type="button" class="btn btn-success" value="1-<%=JsMessage.getValue("web.upload.text3")%>" id="browseBtn" /><!--选择文件-->
			<input type="button" class="btn btn-success" value="2-<%=JsMessage.getValue("web.upload.text4")%>" id="uploadBtn" /><!--确定上传-->
		</div>
		<ul id="file-list">

		</ul>
	</div>
	<div id="drop-area">
		<span><%=JsMessage.getValue("web.upload.text5")%></span><!--选择文件拖动到此区域可以上传！-->
	</div>
	<script>
	var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
		browse_button : 'browseBtn',
		url : '<%=contextPath%>/fileAction.do',
		flash_swf_url : 'js/Moxie.swf',
		silverlight_xap_url : 'js/Moxie.xap',
		drop_element : 'drop-area',
		file_data_name : 'attach_path',//指定上传控件名称
		multipart_params: {
			funid:'<%=funid%>',
			pagetype:'editgrid',
			eventcode:'<%=eventcode%>',
			extparam:'<%=extparam%>',
			attach_name:'',
			attach_field:'',
			dataid:'<%=dataId%>',
			datafunid:'<%=dataFunId%>',
			user_id:'<%=userId%>'
		}
	});
	uploader.init(); //初始化

	//绑定文件添加进队列事件
	uploader.bind('FilesAdded',function(uploader,files){
		for(var i = 0, len = files.length; i<len; i++){
			var file_name = files[i].name; //文件名
			//构造html来更新UI
			var html = '<li id="file-' + files[i].id +'"><p class="file-name">' + file_name + '</p><p class="progress"></p></li>';
			$(html).appendTo('#file-list');
		}
	});

	//绑定文件上传进度事件
	uploader.bind('UploadProgress',function(uploader,file){
		$('#file-'+file.id+' .progress').css('width',file.percent + '%');//控制进度条
	});
	
	//提示错误信息
	uploader.bind('FileUploaded',function(uploader,file,responseObject){
		//responseObject:
		//response：服务器返回的文本
		//responseHeaders：服务器返回的头信息
		//status：服务器返回的http状态码，比如200
		var result = eval("("+responseObject.response+")");
		if (!result.success) {
			var msg = '上传失败: ' + result.message;
			$('#file-'+file.id).append('<p class="faild">'+ msg +'</p>');
		} else {
			var msg = '上传文件成功！';
			$('#file-'+file.id).append('<p class="success">'+ msg +'</p>');
			//上传结束后关闭
			var tt = uploader.total;
			if (tt.queued == 0 && tt.failed == 0 && tt.percent == 100) {
				var win = window.top.Ext.getCmp('<%=winId%>');
				if (win) {
					win.fireEvent('afterupload');
					win.close();
				}
			}
		}
	});

	//上传按钮
	$('#uploadBtn').click(function(){
		if (uploader.files.length == 0) {
			alert('没有选择文件，不能上传！');
			return;
		}
		
		uploader.start(); //开始上传
	});

	</script>
</body>
</html>