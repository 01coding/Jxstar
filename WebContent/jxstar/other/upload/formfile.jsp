<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page import="org.jxstar.util.resource.JxText" %>
<%@ page import="org.jxstar.util.resource.JsMessage" %>
<%
String dataId = request.getParameter("dataid");
String dataFunId = request.getParameter("datafunid");
String tableName = request.getParameter("tablename");
String userId = request.getParameter("user_id");
String winId = request.getParameter("winid");
String disable = request.getParameter("disable");
if (disable == null) disable = "false";
String attach_type = request.getParameter("attach_type");
if (attach_type == null) attach_type = "";

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
			padding:10px 0;
		}
		.btn-wraper {
			float: left;
			width: 95px;
			padding-left: 40px;
		}
		#drop-area {
			background-color:#f2f2f2;
			font-size:18px;
			color:#888;
			padding:25px;
			text-align:center;
		}
		#file-list {
			margin: 0;
			padding: 0;
			min-height: 35px;
			background-color:#fff;
			width:350px;
			float: left;
			list-style: none;
		}
		#file-list li {
			margin-bottom:5px;
			background-color:#f9f9f9;/*#dff0d8*/
			padding:3px 5px 2px 5px;
		}
		#file-list li.new-file {
			background-color:#FCF8E3;
		}
		#file-list li.old-file .progress {
			display: none;
		}
		#file-list .loading {
			padding: 8px;
			display: block;
			font-size: 12px;
			color: #585858;
		}
		.file-name {
			line-height:30px;
		}
		.file-name a {
			color: #2B7DBC;
			text-decoration:none;
		}
		.file-name a:hover {
			color: #FF6600;
			text-decoration:underline;
		}
		
		.file-dis {
			display: none;
		}
		.file-close {
			color: #FF0000;
			float: right;
			padding: 0 5px;
			line-height: 20px;
			margin-top: 5px;
		}
		.file-close:hover {
			color: #FFF;
			cursor: pointer;
			background-color: #D15B47;
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
			border-color:#398439;
		}
		.btn-success:hover {
			color:#fff;
			background-color:#449d44;
			border-color:#398439;
		}
		.btn {
			display:inline-block;
			padding:6px 12px;
			font-size:13px;
			font-weight:400;
			line-height:1.42857143;
			text-align:center;
			cursor:pointer;
			border-radius:4px;
			border:1px solid transparent;
		}
		.btn-dis {
			opacity: .6;
		}
    </style>
</head>
<body>
	<div class="wraper">
		<div class="btn-wraper">
			<input type="button" class="btn btn-success" value="<%=JsMessage.getValue("web.upload.text1")%>" id="browseBtn" /><!--添加附件-->
		</div>
		<ul id="file-list">
			<span class="loading"><%=JsMessage.getValue("web.upload.text2")%> ...</span><!--正在加载附件-->
		</ul>
	</div>
	<iframe id="frmhiddenxx" name="frmhiddenxx" style="display:none;"></iframe>
	<script>
	var disabled = ('true' == '<%=disable%>');
	var attach_type = '<%=attach_type%>';
	
	var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
		browse_button : 'browseBtn',
		url : '<%=contextPath%>/fileAction.do',
		flash_swf_url : 'js/Moxie.swf',
		silverlight_xap_url : 'js/Moxie.xap',
		//drop_element : 'drop-area',
		file_data_name : 'attach_path',//指定上传控件名称
		multipart_params: {
			funid:'sys_attach',
			pagetype:'editgrid',
			eventcode:'create',
			attach_name:'',
			attach_field:'',
			attach_type:attach_type,
			dataid:'<%=dataId%>',
			datafunid:'<%=dataFunId%>',
			user_id:'<%=userId%>'
		}
	});
	uploader.init(); //初始化
	
	//重新计算表单高度
	var formSize = function() {
		var win = window.top.Ext.getCmp('<%=winId%>');
		var lis = $('#file-list > li');
		var size = lis.size();
		if (size == 0) {
			win.setHeight(40+15);
		} else {
			win.setHeight($('#file-list').height()+15);
		}
		//触发外部控件大小
		win.fireEvent('aftersize');
	};
	//添加文件
	var addFiles = function(files, isnew) {
		var fn = function(){$('#file-list > .loading').remove();};
		if (files.length > 0) {
			fn();
		} else {
			setTimeout(fn, 300);
		}
		
		var discls = disabled ? 'file-dis' : '';
		var newcls = isnew ? 'new-file' : 'old-file';
		for(var i = 0, len = files.length; i<len; i++){
			var file_name = files[i].name; //文件名
			//构造html来更新UI
			var html = '<li id="file-' + files[i].id +'" dataid="'+ files[i].id +'" class="'+ newcls +'">'+
				'<p class="file-name"><a href="#">' + file_name + '</a><span class="file-close '+discls+'" title="删除附件">X</span></p>'+
				'<p class="progress"></p>'+
				'</li>';
			$(html).appendTo('#file-list');
		}
		//加点延时，否则高度会有点不准
		setTimeout(formSize, 300);
		
		var cls = isnew ? '.new-file' : '';
		//绑定删除附件事件
		$('#file-list > li'+cls+' > p > span.file-close').click(function(){
			var btn = $(this);
			var me = btn.parent('p').parent('li');
			var dataid = me.attr('dataid');
			if (me.hasClass('faild-file')) {
				me.remove();
				//移除上传对象
				var file = uploader.getFile(me.attr('id'));
				uploader.removeFile(file);
				formSize();
			} else {
				//删除附件中的文件
				if (confirm('确定删除附件吗？') == true) {
					var hdcall = function(data){
						me.remove();
						formSize();
					};
					var params = 'funid=sys_attach&keyid='+ dataid +'&eventcode=delete';
					postRequest(params, hdcall);
				}
			}
		});
		//绑定下载事件
		$('#file-list > li'+cls+' > p > a').click(function(){
			var li = $(this).parent('p').parent('li');
			var dataid = li.attr('dataid');
			if (dataid && dataid.length == 0) return;
			
			var url = '<%=contextPath%>/fileAction.do?user_id=<%=userId%>'+
					  '&funid=sys_attach&keyid='+ dataid +'&eventcode=down&dataType=byte'+
			 		  '&_dc=' + (new Date()).getTime();//添加时间戳，避免浏览器缓存
			document.getElementById('frmhiddenxx').src = url;
		});
	};

	//绑定文件添加进队列事件
	uploader.bind('FilesAdded',function(uploader,files){
		addFiles(files, true);
		
		//添加文件后直接上传
		uploader.start();
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
			$('#file-'+file.id).addClass('faild-file');
		} else {
			var msg = '上传文件成功！';
			$('#file-'+file.id).append('<p class="success">'+ msg +'</p>');
			$('#file-'+file.id).attr('dataid', result.data.attachId);
			//上传结束后关闭
			var tt = uploader.total;
			if (tt.queued == 0 && tt.failed == 0 && tt.percent == 100) {
				var win = window.top.Ext.getCmp('<%=winId%>');
				if (win) {
					win.fireEvent('afterupload');
				}
			}
		}
	});

	//显示当前功能的附件
	var showFile = function(){
		var dataid = '<%=dataId%>';
		if (dataid.length == 0) return;
		var tablename = '<%=tableName%>';
		
		//从后台查询任务信息
		var params = 'funid=queryevent&eventcode=query_attach'+
					 '&tablename='+ tablename +'&keyids='+ dataid + '&attach_type='+ attach_type;
		var hdcall = function(files){
			for (var i = 0; i < files.length; i++) {
        		files[i].id = files[i].attach_id;
        		files[i].name = files[i].attach_name;		        		
        	}
        	addFiles(files);
		};
		postRequest(params, hdcall);
	};
	
	//公共后台请求方法
	var postRequest = function(params, hdcall){
		params += '&user_id=<%=userId%>';
		
		$.ajax({
            url: '<%=contextPath%>/fileAction.do',
            data: params,
            method: 'post',
            
			success:function(data) {
				try{
					data = JSON.parse(data);
				} catch(e) {
					alert("JSON格式错误：\n"+data+"\nJSON解析异常：\n"+e.message);
					return;
				}
		        if(data.success ){
		        	if (hdcall) hdcall(data.data);
		         }else{
		         	if(data.message.length==0){
		         		alert("附件操作失败！");
		         	}else{
		         		alert(data.message);
		         	}
		         }
		      },
		    error: function (XMLHttpRequest, textStatus, errorThrown) {
	            alert("附件操作失败：" + XMLHttpRequest.status+textStatus);
	        }
		});
	};

	//加载当前记录的附件
	showFile();
	//标记不可以编辑附件
	if (disabled) {
		$('#browseBtn').addClass('btn-dis');		
		$('#browseBtn').attr('disabled', true);
	}
	
	</script>
</body>
</html>