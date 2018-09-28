<%@ page contentType="text/html; charset=UTF-8"%>
<%
	String contextpath = request.getContextPath();
	String user_id = request.getParameter("user_id");
	
	String reportId = request.getParameter("reportId");
	String designFunId = request.getParameter("designFunId");
%>
<html>
<style type='text/css'>
.wall_top {
	vertical-align:middle;
	text-align:center;
	font-family:tahoma,arial;
	font-size:13px;
	color:#15428b;
	background-color:#fff;
	position:absolute;
	top:0px;
	left:0px;
	height:18px;
	width:1000px;
}
.wall_left {
	vertical-align:middle;
	text-align:center;
	font-family:tahoma,arial;
	font-size:13px;
	color:#15428b;
	background-color:#fff;
	position:absolute;
	top:18px;
	left:0px;
	height:1000px;
	width:22px;
}
.wall_center {
	background-color:#fff;
	position:absolute;
	top:18px;
	left:22px;
	height:1000px;
	width:1000px;
}
.tw_sub {
	border:1px solid #99bbe8;
	border-width:0 0 0 1px;
	position:absolute;
	height:18px;
	top:0px;
	background-color:#d0def0;
    background-image:url('<%=contextpath%>/resources/images/icons/fam/twall_bg.gif');
}
.lw_sub {
	border:1px solid #99bbe8;
	border-width:1 0 0 0px;
	position:absolute;
	width:22px;
	left:0px;
	background-color:#d0def0;
    background-image:url('<%=contextpath%>/resources/images/icons/fam/lwall_bg.gif');
}
.sel_rpttd {
	border:1px dashed red;
	top:-100px;
	left:-100px;
	width:20px;
	height:20px;
	position:absolute;
}
.xls_emp{
	border-style:solid;
	border-color:#dbdbdb;
	border-width:1 0 0 1px;
	color:red;
}
.xls_table {
	border-collapse:collapse;
	table-layout:fixed;
	border:1px solid #dbdbdb;
	cursor:pointer;
}
</style>
<script language="javascript">
	var CONTEXTPATH = "<%=contextpath%>";
	var USERID = "<%=user_id%>";
	
	var reportId = "<%=reportId%>";
	var designFunId = "<%=designFunId%>";
</script>
<head>
    <!--Ext lib and UX components-->
	<script type="text/javascript" src="<%=contextpath%>/lib/ext/adapter/ext-base.js"></script>
	<script type="text/javascript" src="<%=contextpath%>/lib/ext/ext-all.jsgz"></script>
	<script type="text/javascript" src="<%=contextpath%>/lib/ext/locale/ext-lang-zh.js"></script>

    <title>JXstar XlsToHtml</title>
</head>
<body>
<div id='rpt_wall_top' class='wall_top'></div>
<div id='rpt_wall_left' class='wall_left'></div>
<div id='rpt_wall_center' class='wall_center'></div>
</body>

<script language="javascript">
	readDesign(designFunId, reportId);
	
	/**
	 * 显示模板文件
	 **/
	function readDesign(funId, reportId) {
		var params = '&funid='+ funId +'&pagetype=grid&eventcode=loadfile&reportId='+ reportId;
		//在chrome中，显示的表格宽高都是根据字体大小显示的，
		//是因为在update加载文件是执行了scripts造成的暂不处理该问题。
		var hdCall = function(data) {
			//添加设计边框
			fillReportWall();
			
			//添加选择td的标志
			Ext.fly('rpt_wall_center').insertHtml('beforeEnd', '<div id=\'sel_rpttddiv\' class=\'sel_rpttd\'></div>');
			
			//给所有td添加事件
			Ext.fly('rpt_wall_center').select('td').on('click', function(){clickTd(this)});
		};
		
		fileUpdate('rpt_wall_center', params, hdCall);
	}
	
	/**
	 * 加载模板文件
	 **/
	function fileUpdate(targetId, params, hdCall) {
		params = params||'';
		//添加用户名判断
		if (params.indexOf('&user_id=') < 0) {
			params += '&user_id=' + USERID;
		}
		//添加数据类型
		if (params.indexOf('&dataType=') < 0) {
			params += '&dataType=byte';
		}
	
		Ext.get(targetId).load({
			method: 'POST',
			url:CONTEXTPATH + '/fileAction.do',
			scripts:true, 
			nocache:true,//不缓存文件
			callback:function(el, success, response, options) {
				if (success == true) {
					if (hdCall != null) hdCall(response.responseText);
				} else {
					alert(response);
				}
			},
			params:params
		});
	}
	
	/**
	 * 给设计模板的上边框与左边框添加序号
	 **/
	function fillReportWall() {
		//报表模板
		var xlsTable = Ext.fly('rpt_wall_center').first('.xls_table', true);
		if (xlsTable == null) return;
		
		//取每行的高度
		var rowhs = [];
		for (var i = 0, n = xlsTable.rows.length; i < n; i++) {
			rowhs[i] = xlsTable.rows[i].offsetHeight;
		}
		fillLeftWall(rowhs);	
		
		//取每列的宽度
		var colws = [];
		var cells = xlsTable.rows[0].cells;
		for (var i = 0, n = cells.length; i < n; i++) {
			colws[i] = cells[i].offsetWidth;
		}
		fillTopWall(colws);
	}
	
	/**
	 * 给头部添加序号
	 * tops -- 每列的宽度
	 **/
	function fillTopWall(tops) {
		var th = '', left = 22;
		for (var i = 0, n = tops.length; i < n; i++) {
			if (i > 0) left += tops[i-1];
		
			th += "<div id='top_wall_"+ i +"' class='tw_sub' style='width:"+ tops[i] +"px;left:"+ left +"px'>"+ i +"</div>"
		}
		Ext.fly('rpt_wall_top').insertHtml('beforeEnd', th);
	}
	
	/**
	 * 给左边框添加序号
	 * lefts -- 每行的高度
	 **/
	function fillLeftWall(lefts) {
		var th = '', top = 0;
		for (var i = 0, n = lefts.length; i < n; i++) {
			if (i > 0) top += lefts[i-1];
		
			th += "<div id='left_wall_"+ i +"' class='lw_sub' style='height:"+ lefts[i] +"px;top:"+ top +"px;'>"+ i +"</div>"
		}
		Ext.fly('rpt_wall_left').insertHtml('beforeEnd', th);
	}
	
	/**
	 * 给iframe外部调用，找到当前选择的单元格
	 **/
	function getSelectDiv() {
		return Ext.get('sel_rpttddiv');
	}
	
	/**
	 * 点击表格单元的事件
	 **/
	function clickTd(seltd) {
		var td = Ext.get(seltd);
		//如果字体不为红色，表示不是空白内容区，不能设置
		var color = td.getStyle('color');
		if (color != 'rgb(255, 0, 0)' && color != 'red') {
			alert('当前选择的单元格不是内容区域，请选择空白栏！');
			return;
		}
		//选中标志
		var div = Ext.get('sel_rpttddiv');
		
		//设置选中标志的当前位置
		div.setX(td.getX());
		div.setY(td.getY());
		div.setWidth(td.getWidth());
		div.setHeight(td.getHeight());
		
		//如果选择了新的记录，则清除历史值
		if (div.oldRecord != null && div.curRecord != div.oldRecord) {
			div.curTd = null;
		}
		
		//如果选中了字段记录，则设置字段的位置信息
		//div.curRecord表示当前选择的记录；div.titleField表示标题字段、positionField表示位置字段
		if (div.curRecord != null) {
			//恢复原td的属性
			if (div.curTd != null) {
				//div.curTd.dom.innerHTML = div.oldTdHtml;
				div.curTd.dom.innerHTML = '';
			}
			//记录当前选中的td
			div.curTd = td;
			//原记录改为当前记录
			div.oldRecord = div.curRecord;
		
			//字段标签
			var display = div.curRecord.get(div.titleField);
			//保存原内容，设置新的内容
			//div.oldTdHtml = td.dom.innerHTML;
			td.dom.innerHTML = display;
			
			//设置当前位置
			div.curRecord.set(div.positionField, seltd.id);
		}
	}
</script>
</html>
