/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 
 * 
 * @author TonyTan
 * @version 1.0, 2013-05-13
 */
 
Jxstar.currentPage = function(define) {
	//同步加载文件
	if (typeof CodeMirror == "undefined") {
		JxUtil.loadCss('/lib/codemirror/codemirror.css');
		JxUtil.loadJS('/lib/codemirror/codemirror.js');
		JxUtil.loadJS('/lib/codemirror/mode/sql.js');
		JxUtil.loadJS('/lib/codemirror/mode/htmlmixed.js');
		JxUtil.loadJS('/lib/codemirror/mode/javascript.js');
		JxUtil.loadJS('/lib/codemirror/jsformat.js');
	}
	var querybar = {xtype:'box', itemId:'queryfilenameitem', width:250, html:
				'<input id="queryfilename" style="font-size: 14px; width:250px; padding-left:10px; padding-right:25px; border-radius: 5px !important; height:30px !important;" '+
					'class="x-form-text x-form-field" type="text" placeholder="回车查询：文件夹名称" ></input>'+
				'<i id="queryfilenamei" class="ace-icon fa eb_query x-btn-qryi"></i>'
			};
	var refresh_bar = new Ext.Toolbar({items:[{text:'刷新',handler:function(){treepanel.root.reload();}}]});
	var tbar =  new Ext.Toolbar({items:[
		{text:'上传',handler:function(){fupload();}},
		{text:'新建文件夹',handler:function(){addfolder();}},
		{text:'重载class',handler:function(){reloadclass();}},
		//{text:'测试class',handler:function(){testclass();}},
		'->',querybar
	]});
	
	//动态加载文件夹树
	var treepanel = new Ext.tree.TreePanel({
					tbar:refresh_bar,
					region:'west',
					autoScroll:true,
					split:true,
					width:180,
					rootVisible:false,
					lines:false,
					loader:new Ext.tree.TreeLoader({
						dataUrl: Jxstar.path + '/commonAction.do?funid=data_file&eventcode=getFileTree&user_id='+Jxstar.session['user_id'],
					}),
					root: new Ext.tree.AsyncTreeNode({
						 text: '文件',
						 id: 'null',
						 expanded:true,
						 leaf : false					 
					}),
					listeners: {
						click: function(n) {//n.attributes.text
							getFileList(n.attributes.id);
						}
					}
					
	});
	var centerpanel = new Ext.Panel({tbar:tbar,region:'center',autoScroll:true});
	var layout = new Ext.Container({
			layout:'border',
			items:[treepanel,centerpanel]
	});
	//查询事件绑定
	JxUtil.delay(500, function(){
		var qEvent = new Ext.get('queryfilename');
		if(qEvent){
			qEvent.on('keydown', function(e, t){
				if (e.getKey() == e.ENTER) {
					var qValue = qEvent.dom.value;
					var path = centerpanel.el.child('.x-work-table');
					if(path !=null &&path.length!=0){
						path = path.getAttribute("path")
					}else{
						JxHint.alert('查询文件路径出错！');
						return;
					}
					var  hdcall = function(data){
						var html = createFileList(data);
						centerpanel.update(html);
						addEvent();
					}
					var params = "funid=data_file&eventcode=queryFiles&realpath="+path+"&qvalue="+qValue;
					Request.postRequest(params,hdcall);
					e.preventDefault();//避免在IE中出发分页combo控件事件
				}
			});
		}
	});
	//重载class
    function reloadclass() {
        var params = "funid=data_file&eventcode=loadcls";
		Request.postRequest(params,null);
    }
	//文件上传
	function fupload(){
		var path = centerpanel.el.child('.x-work-table');
		if(path !=null &&path.length!=0){
			path = path.getAttribute("path")//当前文件夹路径
		}else{
			JxHint.alert('查询文件路径出错！');
			return;
		}
		var funId = 'data_file';
		var eventcode = 'uploadFile';
		var e = encodeURIComponent;

		var winid = 'win_'+JxUtil.newId();
		var href = Jxstar.path+'/jxstar/other/upload/upload.jsp?winid='+winid+'&extparam='+e(path)
				 +'&funid='+funId+'&eventcode='+eventcode+'&user_id='+Jxstar.session['user_id'];
		
		var ifrHtml = '<iframe frameborder="no" style="display:none;border-width:0;width:100%;height:100%;" ></iframe>';
		var win = new Ext.Window({
			id:winid,
			title: '上传文件', 
			layout: 'fit',
			width: 600,
			height: 300,
			constrainHeader: true,
			resizable: true,
			border: false,
			modal: true,
			closeAction: 'close',
			autoScroll: false,
			items: [{
				xtype:'container',
				html: ifrHtml
			}]
		});
		win.show();
		var frm = win.getEl().child('iframe');
			frm.dom.src = href + '&_dc=' + (new Date()).getTime();//避免缓存
			frm.show();
		win.on('close', function(){getFileList(path);});

	}
	
	//获取文件及文件夹列表，并显示
	function getFileList(path){
		if(!path||path == 'null'){
			path = '';
		}
		var hdcall = function(data){
			var html = createFileList(data);
			centerpanel.update(html);
			addEvent();
		}
		var params = "funid=data_file&eventcode=getFileList&realpath="+path;
		Request.postRequest(params,hdcall);
	}
	
	
	//添加事件
	function addEvent(){
		//为文件夹添加点击  遍历下级功能
		var folders = centerpanel.el.child('.x-work-table').select('.folders');
		folders.on('dblclick', function(e){
			var path;
			if(e.getTarget().tagName !='TR'){
				path = Ext.get(e.getTarget()).parent('tr').getAttribute("path");
			}else{
				path = Ext.get(e.getTarget()).getAttribute("path");
			}
			getFileList(path);
		});
		//为文件添加点击阅读功能
		var files = centerpanel.el.child('.x-work-table').select('.mfiles');
		files.on('dblclick',function(e){
			e.preventDefault();
			var path;
			var name;
			if(e.getTarget().tagName !='TR'){
				path = Ext.get(e.getTarget()).parent('tr').getAttribute("path");
				name = Ext.get(e.getTarget()).parent('tr').getAttribute("filename");
			}else{
				 path = Ext.get(e.getTarget()).getAttribute("path");
				 name = Ext.get(e.getTarget()).getAttribute("filename");
			}
			var sufix = name.substring(name.lastIndexOf('.')+1);
			if(sufix != 'txt'&& sufix != 'js'&&sufix != 'jsp'&&sufix != 'properties'&&sufix != 'css'&&sufix != 'inc'&&sufix != 'html'&&sufix != 'htm'&&sufix != 'xml'&&sufix != 'mf'){
				JxHint.alert('暂不支持在线阅读该类型的文件！');
				return;
			}
			openTextWin(path,name);
		});
		
		//为文件添加阅读和下载功能  -点击图标
		var  imgs = centerpanel.el.child('.x-work-table').select('.isfile');
		imgs.on('click',function(e){
			e.preventDefault();
			var tr = Ext.get(e.getTarget()).parent('tr');
			var table = Ext.get(e.getTarget()).parent('table');
			var menu = new Ext.menu.Menu({items:[{text:'阅读',handler:function(){
					var path = tr.getAttribute("path");
					var name = tr.getAttribute("filename");
					openTextWin(path,name);
			}},
			{text:'下载',handler:function(){
					var filepath = tr.getAttribute("path");
					var userId = Jxstar.session['user_id'];
					var url = Jxstar.path + '/fileAction.do?funid=data_file&eventcode=downloadFile&dataType=byte&filepath='+filepath+'&user_id='+userId;
					Ext.fly('frmhidden').dom.src = url + '&_dc=' + (new Date()).getTime();//添加时间戳，避免浏览器缓存
			}},
			{text:'重命名',handler:function(){
				var path = tr.getAttribute("path");
				var name = tr.getAttribute("filename");	
				var td = tr.child('td');
				var hdcall = function(text){
					var params = 'funid=data_file&eventcode=rename&filepath='+ encodeURIComponent(path) +'&filename='+ encodeURIComponent(text);
					var endcall = function(data) {
						tr.dom.setAttribute("path",path.replace(name,text));
						tr.dom.setAttribute("filename",text);
						td.dom.innerHTML = '<span class="fa fa-file blue" style="margin-left:7px;margin-right:3px;"></span>'+text;
					};
					//发送请求
					Request.postRequest(params, endcall);
				};
				var mb = Ext.MessageBox.prompt(jx.base.hint, '请输入新的文件名称：', function(btn, text) {
					if (btn != 'ok') return;
					if (text.length == 0) {
						JxHint.alert('必须输入文件名称！');
						return;
					}
					hdcall(text);
				},null,null,name);
				mb.getDialog().setWidth(500);
			}},
			{text:'删除',handler:function(){
					var path = tr.getAttribute("path");
					var tablepath = table.getAttribute("path");
					var hdcall = function(){
						getFileList(tablepath);
					}
					var params = "funid=data_file&eventcode=deletefile&filepath="+path;
					Request.postRequest(params,hdcall);
				}}
			]
			});
			var xy = e.getXY();
            menu.showAt([xy[0]+20, xy[1]-10]);
		});
		
		
		//为文件夹添加删除功能  -点击图标
		var folderImgs = centerpanel.el.child('.x-work-table').select('.isfolder');
		folderImgs.on('click',function(e){
			e.preventDefault();
			var tr = Ext.get(e.getTarget()).parent('tr');
			var table = Ext.get(e.getTarget()).parent('table');
			var foldermenu = new Ext.menu.Menu({items:[
			/*	{text:'重命名',handler:function(){
					var path = tr.getAttribute("path");
					var name = tr.getAttribute("filename");	
					var td = tr.child('td');
					var hdcall = function(text){
						var params = 'funid=data_file&eventcode=rename&filepath='+ encodeURIComponent(path) +'&filename='+ encodeURIComponent(text);
						var endcall = function(data) {
							tr.dom.setAttribute("path",path.replace(name,text));
							tr.dom.setAttribute("filename",text);
							td.dom.innerHTML = '<span class="fa fa-file blue" style="margin-left:7px;margin-right:3px;"></span>'+text;
						};
						//发送请求
						Request.postRequest(params, endcall);
					};
					var mb = Ext.MessageBox.prompt(jx.base.hint, '请输入新的文件名称：', function(btn, text) {
						if (btn != 'ok') return;
						if (text.length == 0) {
							JxHint.alert('必须输入文件名称！');
							return;
						}
						hdcall(text);
					},null,null,name);
					mb.getDialog().setWidth(500);
				}},*/
				{text:'删除',handler:function(){
					var mb = Ext.MessageBox.confirm("警告","本操作确认会删除该文件夹及其目录下的所有文件，且不可回滚，‘是’将执行删除",function(btn){
						if (btn != 'yes') return;
						var path = tr.getAttribute("path");
						var tablepath = table.getAttribute("path");
						var hdcall = function(){
							getFileList(tablepath);
						}
						var params = "funid=data_file&eventcode=delfolder&filepath="+path;
						Request.postRequest(params,hdcall);
					});
					mb.getDialog().setWidth(500);
				}}
			]});
			var xy = e.getXY();
			foldermenu.showAt([xy[0]+20, xy[1]-10]);
		});
	}
	
	//打开阅读窗口
	function openTextWin(path,name){
		if(name.indexOf(".jar") != -1||name.indexOf(".xls") != -1){
			JxHint.alert('该文件不支持阅读！');
			return ;
		}
	    var mode ="text";
		if(name.indexOf('.htm') != -1||name.indexOf('.jsp') != -1){
			mode = 'html';
		}else if(name.indexOf('.sql') != -1){
			mode = 'text/x-sql';
		}else if(name.indexOf('.js') != -1|| name.indexOf('.inc') != -1){
			mode = 'text/typescript';
		}
		var hdcall = function(data){
			var edit;
			var textarea = new Ext.Container({
					layout:'border',
					items:[{
						region: 'center', 
						layout:'fit',
						items:[{xtype:'textarea'}]
					}]
					
			});
			 JxUtil.delay(500, function(){
				var t = textarea.getComponent(0).body.first().dom;
				edit = CodeMirror.fromTextArea(t, {
					value : "",
					readOnly : true,
					lineNumbers : true,
					matchBrackets : true,//匹配关闭括弧
					autoCloseBrackets : true,//自动创建关闭括弧
					indentUnit : 4,//缩进字符个数
					mode : mode
				});
				 if(data.data.length != 0 ){
					text = JxUtil.numToStr(data.data);
					edit.setValue(text);
				}
				edit.setSize("100%","100%");
				edit.focus(); 
			}); 
			var win = new Ext.Window({
				title:name,	
				layout:'fit',
				width:800,
				height:600,
				resizable: false,
				modal: true,
				closeAction:'close',
				items:[textarea]			
			});
			win.show();
		}
		var params = "funid=data_file&eventcode=getFileText&realpath="+path;
		Request.postRequest(params,hdcall);
	
	}
	//创建文件和文件夹列表的html
	function createFileList(data){
		var msgJson = data.data;
		var path = data.path;
		var tableTpl = new Ext.Template(
			'<table class="x-work-table" path="'+path+'">',
				'<tr style="background-color:#fafdff">',
					'<th style="padding-left:15px;">',
					'名称',
					'</th>',
					'<th style="padding-left:5px;">',
					'修改时间',
					'</th>',
					'<th style="padding-left:5px;">',
					'文件类型',
					'</th>',
					'<th>',
					'文件大小',
					'</th>',
					'<th>',
					'</th>',
				'</tr>',
				'{rows}',
			'</table>'
		);
		var rowTpl1 = new Ext.Template(
				'<tr class="folders" path={filepath}>',
					'<td width="400" >',
					'<span class="fa fa-folder orange2" style="margin-left:7px;margin-right:3px;">',
					'</span>',
					'{filename}',
					'</td>',
					'<td width="180" class="small">',
					'{lastModified}',
					'</td>',
					'<td width="100" class="small">',
					'{filetype}',
					'</td>',
					'<td width="90" class="small">',
					'{filesize}',
					'</td>',
					'<td  class="small">',
					'<span class="x-action-col-icon isfolder fa fa-cog" ext:qtip="操作">',
					'</span>',
					'</td>',
				'</tr>'
		);
		
		var rowTpl2 = new Ext.Template(
				'<tr class="mfiles" path="{filepath}" filename="{filename}">',
					'<td width="400">',
					'<span class="fa fa-file blue" style="margin-left:7px;margin-right:3px;">',
					'</span>',
					'{filename}',
					'</td>',
					'<td width="180" class="small">',
					'{lastModified}',
					'</td>',
					'<td width="100" class="small">',
					'{filetype}',
					'</td>',
					'<td width="90" class="small">',
					'{filesize}',
					'</td>',
					'<td  class="small">',
					'<span class="x-action-col-icon isfile fa fa-cog" ext:qtip="操作">',
					'</span>',
					'</td>',
				'</tr>'
		);
		
		var rows = [];
		for (var i = 0; i < msgJson.length; i++) {
			if(msgJson[i]['filetype'] == '文件夹'){
				rows[i] = rowTpl1.apply(msgJson[i]);
			}else{
				rows[i] = rowTpl2.apply(msgJson[i]);
			}
		}
		
		return tableTpl.apply({rows:rows.join('')});
	
	}
	
	//新建文件夹
	function addfolder() {
		var hdcall = function(text){
			//取当前文件路径
			var path = centerpanel.el.child('.x-work-table').getAttribute('path');
			var e = encodeURIComponent;
			var params = 'funid=data_file&eventcode=addfolder&file_path='+ e(path) +'&file_name='+ e(text);
			var endcall = function(data) {
				getFileList(path);
			};
			//发送请求
			Request.postRequest(params, endcall);
		};
		Ext.MessageBox.prompt(jx.base.hint, '请输入文件夹名称：', function(btn, text) {
				if (btn != 'ok') return;
				if (text.length == 0) {
					JxHint.alert('必须输入文件夹名称！');
					return;
				}
				
				hdcall(text);
			});
		}
	
	//初始化获取文件及文件夹列表  默认路径
	getFileList();
	return layout;
};


