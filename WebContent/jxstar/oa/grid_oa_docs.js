Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datafilerange = Jxstar.findComboData('filerange');

	var cols = [
	{col:{header:'文件名', width:236, sortable:true}, field:{name:'oa_docs__docs_name',type:'string'}},
	{col:{header:'修改时间', width:160, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'oa_docs__edit_date',type:'date'}},
	{col:{header:'类型', width:100, sortable:true}, field:{name:'oa_docs__docs_type',type:'string'}},
	{col:{header:'大小', width:100, sortable:true, align:'right',renderer:JxUtil.formatNumber(2)}, field:{name:'oa_docs__docs_size',type:'float'}},
	{col:{header:'上传人', width:100, sortable:true}, field:{name:'oa_docs__edit_user',type:'string'}},
	{col:{header:'所属部门', width:100, sortable:true, hidden:true}, field:{name:'oa_docs__dept_name',type:'string'}},
	{col:{header:'阅读权限', width:100, sortable:true, hidden:true}, field:{name:'oa_docs__read_right',type:'string'}},
	{col:{header:'下载权限', width:100, sortable:true, hidden:true}, field:{name:'oa_docs__down_right',type:'string'}},
	{col:{header:'是否文件夹', width:100, sortable:true, hidden:true}, field:{name:'oa_docs__is_folder',type:'string'}},
	{col:{header:'文件范围', width:100, sortable:true, hidden:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datafilerange
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datafilerange[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datafilerange.length; i++) {
				if (Datafilerange[i][0] == value)
					return Datafilerange[i][1];
			}
		}}, field:{name:'oa_docs__file_range',type:'string'}},
	{col:{header:'上传人ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_docs__edit_userid',type:'string'}},
	{col:{header:'文件ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_docs__docs_id',type:'string'}},
	{col:{header:'父ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_docs__parent_id',type:'string'}},
	{col:{header:'部门ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_docs__dept_id',type:'string'}},
	{col:{header:'附件ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'oa_docs__attach_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '0',
		funid: 'oa_docs'
	};
	
	config.param.selectModel = 'nocheck';
	config.param.hidePageTool = true;
	config.param.noRowNum = true;

	var nodegrid, rangeEl, tbargrid;
	
	//不显示斑马线
	config.param.pageConfig = {stripeRows:false};
	
	//查询记录： 0 公司、1 部门、2 自己
	var queryDocs = function(fran, docs_id) {
		var grid = nodegrid.page;
		if (!docs_id) docs_id = '';
		
		var wheresql = 'file_range = ? and parent_id is null';
		var wheretype = 'string';
		var wherevalue = fran;
		if (docs_id && docs_id.length > 0) {
			wheresql = 'file_range = ? and parent_id = ?';
			wheretype = 'string;string';
			wherevalue = fran+';'+docs_id;
		}
		Jxstar.loadData(grid, {where_sql:wheresql, where_value:wherevalue, where_type:wheretype});
		//设置当前文件夹ID
		rangeEl.dom.setAttribute('data-parentid', docs_id);
		//更新文件路径
		updatePaths(docs_id);
		
		//修改过滤条件，方便查询与高级搜索可以搜索子文件夹中的文件
		grid.jxstarParam.old_wsql = 'file_range = ? and (parent_id is null or parent_id like ?)';
		grid.jxstarParam.old_wtype = 'string;string';
		grid.jxstarParam.old_wvalue = fran+';'+docs_id+'%';
	};
	//取当前文档类型
	var getRange = function(){
		return rangeEl.dom.getAttribute('data-value');
	};
	//取当前文件路径ID
	var getParentId = function(){
		return rangeEl.dom.getAttribute('data-parentid');
	};
	//更新文件路径bar
	var updatePaths = function(docs_id){
		var pbars = tbargrid.get('bar_file_paths');
		
		if (!docs_id || docs_id.length == 0) {
			if (pbars.el) pbars.el.dom.innerHTML = '';
			return;
		}
		//var paths = [{docs_id:'10', docs_name:'公司知识库'},{docs_id:'1010', docs_name:'标书模板'}];//文件路径数据，存储{docs_id:'', docs_name:''}
		
		var params = 'funid=oa_docs&eventcode=getpath&docs_id='+ docs_id;
		var endcall = function(paths) {
			var html = '';
			for (var i = 0; i < paths.length; i++) {
				html += '&nbsp;&#8260;&nbsp;<a data-docsid="'+ paths[i].docs_id +'" class="x-ashow">'+ paths[i].docs_name +'</a>';
			}
			if (pbars.el) pbars.el.dom.innerHTML = html;
		};
		//发送请求
		Request.dataRequest(params, endcall, {wait:false});
	};
	//图片扩展名
	var isImage = function(type){
		return (type.indexOf('png') >= 0 || type.indexOf('jpg') >= 0 || type.indexOf('gif') >= 0 || type.indexOf('bmp') >= 0);
	};
	
	//====================处理文档权限指定人员设置=================================
	//显示指定人员表格
	var userGrid, menuDiv;
	var createUser = function(){
		if (menuDiv) return;
		menuDiv = new Ext.menu.Menu({width:450, height:350});
		
		var define = Jxstar.findNode('oa_docs_obj');
		var hdcall = function(f){
			var page = f(define, {pageType:'subgrid'});
			//创建表格对象
			if (typeof page.showPage == 'function') {
				page = page.showPage('subgrid', 'oa_docs');
			}
			//设置grid高度
			page.height = 320;
			//把新页面添加到目标窗口中
			menuDiv.add(page);
			
			userGrid = page;
		};
		
		Request.loadJS(define.gridpage, hdcall);
	};
	
	
	
	//显示指定人员并刷新数据
	var showUser = function(fkValue, pos){
		menuDiv.showAt(pos);
		menuDiv.doLayout();
		Jxstar.loadSubData(userGrid, fkValue);
	};
	
	
	//显示指定人员表格
	var userGrid1, menuDiv1;
	var createUser1 = function(){
		if (menuDiv1) return;
		menuDiv1 = new Ext.menu.Menu({width:450, height:350});
		
		var define = Jxstar.findNode('oa_docs_obj1');
		var hdcall = function(f){
			var page = f(define, {pageType:'subgrid'});
			//创建表格对象
			if (typeof page.showPage == 'function') {
				page = page.showPage('subgrid', 'oa_docs');
			}
			//设置grid高度
			page.height = 320;
			//把新页面添加到目标窗口中
			menuDiv1.add(page);
			
			userGrid1 = page;
		};
		
		Request.loadJS(define.gridpage, hdcall);
	};
	
	
	
	//显示指定人员并刷新数据
	var showUser1 = function(fkValue, pos){
		menuDiv1.showAt(pos);
		menuDiv1.doLayout();
		Jxstar.loadSubData(userGrid1, fkValue);
	};
	
	
	
	//====================处理文档查询方法=================================
	config.toolext = function(node, tbar, extItems){
		tbargrid = tbar;
		nodegrid = node;
		
		var fr = Jxstar.findComboData('filerange'), items = [];
		for (var i = 0; i < fr.length; i++) {
			items[i] = {itemId:fr[i][0], text:fr[i][1], handler:function(b){
				var v = b.initialConfig;
				rangeEl.dom.setAttribute('data-value', v.itemId);
				rangeEl.child('a').update(v.text);
				
				//查询不同知识库中的文档
				queryDocs(v.itemId);
			}};
		}
		var menu = new Ext.menu.Menu({items:items});
		
		var did = 'sel_file_range';
		var box = new Ext.BoxComponent({width:140, style:'color:#478FCA;', html:
				'<i class="ace-icon fa fa-bank orange2" style="font-size:20px;width:36px;"></i>'+
				'<span id="'+did+'" data-value="0" data-parentid="" style="color:#478FCA; font-size:16px;">'+
					'<a href="javascript:void(0);" data-docsid="" class="x-ashow">公司知识库</a>'+
					'<i class="ace-icon fa fa-caret-down" style="width:30px; color:#478FCA; cursor:pointer;"></i>'+
				'</span>'
			});
		
		tbar.insert(0, box);
		var boxp = new Ext.BoxComponent({itemId:'bar_file_paths', xtype:'box', style:'color:#478FCA; font-size:15px;', html:''});
		tbar.insert(1, boxp);
		tbar.insert(2, '-');
		
		box.on('afterrender', function(){
			var fdi = tbar.el.child('#'+did);
			rangeEl = fdi;
			if (fdi) {
				fdi.child('i').on('click', function(e, t){
					e.preventDefault();
					menu.showAt([fdi.getX(), fdi.getY()+25]);
				});
			} else {
				alert('box error!');
			}
			
			//初始显示公司知识库
			queryDocs('0');
			
			box.el.on('click', pathClick);
		});
		boxp.on('afterrender', function(){
			boxp.el.on('click', pathClick);
		});
		
		//绑定路径点击事件
		var pathClick = function(e, t){
			e.preventDefault();
			if (t.className == "x-ashow") {
				var fran = getRange();
				var docs_id = t.getAttribute('data-docsid');
				queryDocs(fran, docs_id);
			}
		};
	};
	
	//====================处理文档操作方法与权限设置=================================
	var menu = new Ext.menu.Menu({items:[
		{text:'删除', handler:function(){
			var docs_id = menu.docsRecord.get('oa_docs__docs_id');
			var is_folder = menu.docsRecord.get('oa_docs__is_folder');
			
			var hdcall = function() {
				var params = 'funid=oa_docs&keyid=' + docs_id;
				params += '&pagetype=grid&eventcode=delete';
				var endcall = function(data) {
					nodegrid.page.getStore().reload();
				};
				Request.postRequest(params, endcall);
			};
			
			var hint = '删除后不能找回文件，确定删除吗？';
			if (is_folder == '1') {
				hint = '文件夹与内部文件都将删除，且不能找回，确定删除吗？';
			}
			
			//确定删除选择的记录吗？
			Ext.Msg.confirm(jx.base.hint, hint, function(btn) {
				if (btn == 'yes') hdcall();
			});
		}},
		{text:'重命名', handler:function(){
			var docs_id = menu.docsRecord.get('oa_docs__docs_id');
			var docs_name = menu.docsRecord.get('oa_docs__docs_name');
				
			var hdcall = function(text){
				var e = encodeURIComponent;
				var params = 'funid=oa_docs&eventcode=update&docs_id='+ docs_id +'&docs_name='+ e(text);
				var endcall = function(data) {
					menu.docsRecord.set('oa_docs__docs_name', text);
					menu.docsRecord.commit();
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
			},null,null,docs_name);
			mb.getDialog().setWidth(500);
		}},
		{text:'修改权限', handler:function(){
			var docs_id = menu.docsRecord.get('oa_docs__docs_id');
			var readright = menu.docsRecord.get('oa_docs__read_right');
			var downright = menu.docsRecord.get('oa_docs__down_right');
			
			createUser();//避免创建延时，提前创建grid（阅读）
			createUser1();//避免创建延时，提前创建grid（下载）
			var hand = function(radio, checked){
				var val = radio.initialConfig.value;
				var name = radio.initialConfig.name;
				if (name == 'm_read') {
					readright = val;
				} else {
					downright = val;
					if(val == '0'){
						readright = '0';
						Ext.getCmp('m_read').setValue(true);
					}
				}
				if (val == '2') {
					if (name == 'm_read') {
						showUser(docs_id, radio.getPosition());
						Ext.getCmp('readper0').setValue(true);
					} else {
						showUser1(docs_id, radio.getPosition());
						Ext.getCmp('downper0').setValue(true);
					}
				}
			};
			
			var win = new Ext.Window({
				title: '修改权限', 
				width: 650,
				height: 200,
				closeAction: 'close',
				items: [{xtype:'toolbar', items:[
    				{xtype:'tbtext', text:'设置阅读权限：'},
					{xtype:'radio',id:'m_read', boxLabel:'所有人员可见', value:'0', name:'m_read', listeners:{'focus':hand}, checked:(readright == '0')},
					{xtype:'radio', boxLabel:'本部人员', value:'1', name:'m_read', hidden:true, listeners:{'focus':hand}, checked:(readright == '1')},
					{xtype:'radio',id:'readper0', boxLabel:'指定人员', value:'2', name:'m_read', listeners:{'focus':hand}, checked:(readright == '2')},
					{xtype:'radio', boxLabel:'仅自己', value:'6', name:'m_read', listeners:{'focus':hand}, checked:(readright == '6')}
				]},
				{xtype:'toolbar', items:[
    				{xtype:'tbtext', text:'设置下载权限：'},
					{xtype:'radio', boxLabel:'所有人员可见', value:'0', name:'m_down', listeners:{'focus':hand}, checked:(downright == '0')},
					{xtype:'radio', boxLabel:'本部人员', value:'1', name:'m_down',hidden:true, listeners:{'focus':hand}, checked:(downright == '1')},
					{xtype:'radio', boxLabel:'指定人员', value:'2', name:'m_down', id:'downper0',listeners:{'focus':hand}, checked:(downright == '2')},
					{xtype:'radio', boxLabel:'仅自己', value:'6', name:'m_down', listeners:{'focus':hand}, checked:(downright == '6')}
				]}],
				buttons:[{
					text:jx.base.ok,	//'确定'
					handler:function(){
						var param = 'funid=oa_docs&eventcode=uright&docs_id='+ docs_id +'&read_right=' + readright+'&down_right=' + downright;
						Request.postRequest(param, function(){
							menu.docsRecord.set('oa_docs__read_right', readright);
							menu.docsRecord.set('oa_docs__down_right', downright);
							menu.docsRecord.commit();
							win.close();
						});
					}
				},{
					text:jx.base.cancel,	//'取消'
					handler:function(){win.close();}
				}]
			});
			win.show();
		}}
	
	]});
	
	var blankCol = new Ext.grid.ActionColumn({
		align:'left', 
		width: 90,
		items: []
	});
	cols.insert(7, {col:blankCol});
	
	var blank = cols[7];
	blank.col.renderer = function(val,metaData,record){
		var isme = (record.get('oa_docs__edit_userid') == Jxstar.session['user_id']);
		var isdir = record.get('oa_docs__is_folder');
		if(isdir == '1'){
			val = isme ? '<i class="x-grid3-rowicon fa fa-cog " handle-id="menu" ext:qtip="操作"></i>' : '';
			return val;
		} else {
			val = isme ? '<i class="x-grid3-rowicon fa fa-cog "  handle-id="menu" ext:qtip="操作"></i>&nbsp;&nbsp;' : '';
			val += '<i class="x-grid3-rowicon fa fa-download " handle-id="download" ext:qtip="下载"></i>&nbsp;&nbsp;';
			val += '<i class="x-grid3-rowicon fa fa-book " handle-id="read" ext:qtip="阅读"></i>';
			return val;
		}
	};
	
	
	//====================处理文档信息显示样式=================================
	for (var i = 0; i < cols.length; i++) {
		var f = cols[i].field;
		if (f && f.name.indexOf('__docs_size') > 0) {
			cols[i].col.renderer = function(val, metaData, record) {
				var isdir = record.get('oa_docs__is_folder');
				if (isdir == '0') {
					val = val+' KB';
				} else {
					val = '';
				}
				return val;
			};
		}
		
		if (f && f.name.indexOf('__docs_name') > 0) {
			cols[i].col.renderer = function(val, metaData, record) {
				var isdir = record.get('oa_docs__is_folder');
				var type = record.get('oa_docs__docs_type');
				var icon = 'fa-folder orange2';
				if (isdir == '0') {
					if (type.indexOf('xls') >= 0) {
						icon = 'fa-file-excel-o';
					} else if (type.indexOf('doc') >= 0) {
						icon = 'fa-file-word-o';
					} else if (type.indexOf('ppt') >= 0) {
						icon = 'fa-file-powerpoint-o';
					} else if (type.indexOf('pdf') >= 0) {
						icon = 'fa-file-pdf-o';
					} else if (type.indexOf('zip') >= 0 || type.indexOf('rar') >= 0) {
						icon = 'fa-file-zip-o';
					} else if (isImage(type)) {
						icon = 'fa-file-image-o';
					} else if (type.indexOf('txt') >= 0 || type.indexOf('ini') >= 0) {
						icon = 'fa-file-text-o';
					} else {
						icon = 'fa-file';
					}
					icon = icon+' blue';
				}
				//<a href="javascript:void(0);" class="x-ashow">&nbsp;'+ val +'&nbsp;</a>
				val = '<i class="x-grid3-rowicon fa '+icon+'"></i>&nbsp;'+ val +'&nbsp;';
				return val;
			};
		}
		
		if (f && f.name.indexOf('__docs_type') > 0) {
			cols[i].col.renderer = function(val, metaData, record) {
				var isdir = record.get('oa_docs__is_folder');
				if (isdir == '0') {
					val = val.toUpperCase() + ' 文件';
				} else {
					val = '文件夹';
				}
				return val;
			};
		}
	};
	
	config.initpage = function(gridNode){
		var grid = gridNode.page;
		//解除所有表格事件
		grid.purgeListeners();
		
		//绑定图标点击事件
		grid.on('cellclick',function(grid, rowIndex, coli, e){
			if(coli != 7){
				return;
			}
			var el = e.target;
			var handleId = el.getAttribute("handle-id");
			if(handleId == "menu"){
				menu.docsRecord = grid.getStore().getAt(rowIndex);
            	grid.getSelectionModel().selectRow(rowIndex);
            	
            	var edit_userid = menu.docsRecord.get('oa_docs__edit_userid');
            	var is_folder = menu.docsRecord.get('oa_docs__is_folder');
            	if (is_folder == '1') {
            		if (edit_userid == Jxstar.session['user_id']) {
            			menu.items.itemAt(0).show();
            			menu.items.itemAt(1).show();
            		} else {
            			return;//没有可操作菜单，不需要显示
            			menu.items.itemAt(0).hide();
            			menu.items.itemAt(1).hide();
            		}
            		
            		menu.items.itemAt(2).hide();
            	} else {
	            	var range = menu.docsRecord.get('oa_docs__file_range');
	            	var edit_userid = menu.docsRecord.get('oa_docs__edit_userid');
					var down_right = menu.docsRecord.get('oa_docs__down_right');
					var dept_id = menu.docsRecord.get('oa_docs__dept_id');
	            	if (edit_userid == Jxstar.session['user_id']) {
	            		menu.items.itemAt(0).show();
	            		menu.items.itemAt(1).show();
	            		//只要公司、部门知识库才需要设置权限
	            		if (range == '0' || range == '1') {
	            			menu.items.itemAt(2).show();
	            		} else {
	            			menu.items.itemAt(2).hide();
	            		}
	            	} else {
	            		menu.items.itemAt(0).hide();
	            		menu.items.itemAt(1).hide();
	            		menu.items.itemAt(2).hide();
	            	}
            	} 
          		
            	var xy = e.getXY();
            	menu.showAt([xy[0]-30, xy[1]+10]);
			}else if(handleId == "download"){
				var datas = grid.getStore().getAt(rowIndex);
				if(datas.get('oa_docs__is_folder')=='1'){
					Ext.Msg.alert('提示','暂不支持文件夹的下载。');
					return;
				}
				var edit_userid = datas.get('oa_docs__edit_userid');
				var down_right = datas.get('oa_docs__down_right');
				var dept_id = datas.get('oa_docs__dept_id');
				//下载权限为本部和指定人 判断是否符合条件
				var flag = true;
			    if(down_right == '2' && edit_userid != Jxstar.session['user_id']){
					//遍历个人对象
					var docs_id = datas.get('oa_docs__docs_id');
					var callback = function(data){
						var userid = Jxstar.session['user_id'];
						var deptid = Jxstar.session['dept_id'];
						for(var i = 0 ; i<data.root.length;i++){
							var item = data.root[i];
							if(userid == item.oa_docs_obj__obj_id&& item.oa_docs_obj__obj_type == '1'){
							var attach_id = datas.get('oa_docs__attach_id');
							var params = 'funid=sys_attach&keyid='+ attach_id +'&pagetype=editgrid&eventcode=down';
							Request.attachDown(params);
								break;
							}
							if(deptid == item.oa_docs_obj__obj_id&& item.oa_docs_obj__obj_type == '0'){
							var attach_id = datas.get('oa_docs__attach_id');
							var params = 'funid=sys_attach&keyid='+ attach_id +'&pagetype=editgrid&eventcode=down';
							Request.attachDown(params);
								break;
							}
							if(i == data.root.length -1){
								Ext.Msg.alert('提示','没有权限下载。');
								return;
							}
						}
					}
					var params ='eventcode=query_data&funid=queryevent&query_funid=oa_docs_obj1';
					params += '&where_sql= oa_docs_obj.docs_id = ? and oa_docs_obj.right_type = 1 ';
					params += '&where_type=string';
					params += '&where_value='+docs_id;
					Request.dataRequest(params, callback);
					
				}else if (down_right == '1' && Jxstar.session['dept_id'] != dept_id){
					Ext.Msg.alert('提示','没有权限下载。');
					return;
				}else if(down_right == '6' && edit_userid != Jxstar.session['user_id']){
					Ext.Msg.alert('提示','没有权限下载。');
					return;
				}else{
					var attach_id = datas.get('oa_docs__attach_id');
					var params = 'funid=sys_attach&keyid='+ attach_id +'&pagetype=editgrid&eventcode=down';
					Request.attachDown(params);
				}
			}else if(handleId == "read"){
				var datas = grid.getStore().getAt(rowIndex);
				var type = datas.get('oa_docs__docs_type');
				var docs_name = datas.get('oa_docs__docs_name');
				var attach_id = datas.get('oa_docs__attach_id');
				if(datas.get('oa_docs__is_folder')=='1'){
					Ext.Msg.alert('提示','不支持文件夹阅读。');
					return;
				}
				
				var edit_userid = datas.get('oa_docs__edit_userid');
				var read_right = datas.get('oa_docs__read_right');
				var dept_id = datas.get('oa_docs__dept_id');
				//下载权限为本部和指定人 判断是否符合条件
			    if(read_right == '2' && edit_userid != Jxstar.session['user_id']){
					//遍历个人对象
					var docs_id = datas.get('oa_docs__docs_id');
					var callback = function(data){
						var userid = Jxstar.session['user_id'];
						var deptid = Jxstar.session['dept_id'];
						for(var i = 0 ; i<data.root.length;i++){
							var item = data.root[i];
							if(userid == item.oa_docs_obj__obj_id&& item.oa_docs_obj__obj_type == '1'){
								if (isImage(type)) {
								JxAttach.previewImage(attach_id, docs_name);
								} else if (JxAttach.isPdf(docs_name)) {
									JxAttach.previewPDF(attach_id, docs_name);
								} else {
									Ext.Msg.alert('提示',docs_name + '：不支持在线阅读！');
								}
								break;
							}
							if(deptid == item.oa_docs_obj__obj_id&& item.oa_docs_obj__obj_type == '0'){
								if (isImage(type)) {
								JxAttach.previewImage(attach_id, docs_name);
								} else if (JxAttach.isPdf(docs_name)) {
									JxAttach.previewPDF(attach_id, docs_name);
								} else {
									Ext.Msg.alert('提示',docs_name + '：不支持在线阅读！');
								}
								break;
							}
							if(i == data.root.length -1){
								Ext.Msg.alert('提示','没有权限阅读。');
								return;
							}
						}
					}
					var params ='eventcode=query_data&funid=queryevent&query_funid=oa_docs_obj';
					params += '&where_sql= oa_docs_obj.docs_id = ? and oa_docs_obj.right_type = 0 ';
					params += '&where_type=string';
					params += '&where_value='+docs_id;
					Request.dataRequest(params, callback);
					
				}else if (read_right == '1' && Jxstar.session['dept_id'] != dept_id){
					Ext.Msg.alert('提示','没有权限阅读。');
					return;
				}else if(read_right == '6' && edit_userid != Jxstar.session['user_id']){
					Ext.Msg.alert('提示','没有权限阅读。');
					return;
				}else{
					if (isImage(type)) {
					JxAttach.previewImage(attach_id, docs_name);
					} else if (JxAttach.isPdf(docs_name)) {
						JxAttach.previewPDF(attach_id, docs_name);
					} else {
						Ext.Msg.alert('提示',docs_name + '：不支持在线阅读！');
					}
				}
			}
			
		});
		
		
		//绑定点击事件，查看文件
		grid.on('rowdblclick', function(g, row, e){
			if (!e) return;
			e.preventDefault();
			
			var rec = g.getStore().getAt(row);
			var fran = getRange();
			var is_folder = rec.get('oa_docs__is_folder');
			var docs_id = rec.get('oa_docs__docs_id');
			var edit_userid = rec.get('oa_docs__edit_userid');
			var down_right = rec.get('oa_docs__down_right');
			var dept_id = rec.get('oa_docs__dept_id');
			var flag = 1;
			if (is_folder == '1') {
				queryDocs(fran, docs_id);
			} else {
				if(down_right == '2' && edit_userid != Jxstar.session['user_id']){
						flag = 0;
						var callback = function(data){
							var userid = Jxstar.session['user_id'];
							var deptid = Jxstar.session['dept_id'];
							for(var i = 0 ; i<data.root.length;i++){
								var item = data.root[i];
								if(userid == item.oa_docs_obj__obj_id && item.oa_docs_obj__obj_type == '1'){
									var attach_id = rec.get('oa_docs__attach_id');
									var params = 'funid=sys_attach&keyid='+ attach_id +'&pagetype=editgrid&eventcode=down';
									Request.attachDown(params);
									return;
								}
								if(deptid == item.oa_docs_obj__obj_id && item.oa_docs_obj__obj_type == '0'){
									var attach_id = rec.get('oa_docs__attach_id');
									var params = 'funid=sys_attach&keyid='+ attach_id +'&pagetype=editgrid&eventcode=down';
									Request.attachDown(params);
									return;
								}
							}
						}
						var params ='eventcode=query_data&funid=queryevent&query_funid=oa_docs_obj1';
						params += '&where_sql= oa_docs_obj.docs_id = ? and oa_docs_obj.right_type = 1';
						params += '&where_type=string';
						params += '&where_value='+docs_id;
						Request.dataRequest(params, callback);
				
				}else if (down_right == '1' && Jxstar.session['dept_id'] != dept_id){
					flag = 0;
				}else{
					if(down_right == '6' && edit_userid != Jxstar.session['user_id']){
							flag = 0;
						}
				}
				if(flag == 1){
					//打开文件下载界面
					var attach_id = rec.get('oa_docs__attach_id');
					var params = 'funid=sys_attach&keyid='+ attach_id +'&pagetype=editgrid&eventcode=down';
					Request.attachDown(params);
				}
			}
		});
	};
	
	config.eventcfg = {
		//新建文件夹
		fadd: function() {
			var me = this;
			var hdcall = function(text){
				var fran = getRange();//取知识库类型
				var parentId = getParentId();//取当前文件路径ID
				var e = encodeURIComponent;
				var params = 'funid=oa_docs&eventcode=add&parent_id='+ parentId +'&docs_name='+ e(text) +'&file_range='+ fran;
				var endcall = function(data) {
					me.grid.getStore().reload();
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
		}, 
		
		//上传文件
		fupload: function() {
			var grid = this.grid;
			var fran = getRange();//根据不同的知识库，控制不同的权限选项
			var dataId = JxUtil.getTmpKeyId();//临时数据ID
			var dataFunId = 'oa_docs';

			var winid = 'win_'+JxUtil.newId();
			var href = Jxstar.path+'/jxstar/other/upload/upload.jsp?winid='+winid+'&dataid='+dataId+'&datafunid='+dataFunId+'&user_id='+Jxstar.session['user_id'];
			
			var ifrHtml = '<iframe frameborder="no" style="display:none;border-width:0;width:100%;height:68%;" ></iframe>'+
				'<div id="div_fupload_right" style="display:;width:100%;height:120px;background-color:#fff;border-top:2px solid #00AAEF;">'+
					'<div></div>'+
					'<div></div>'+
				'</div>';
			var win = new Ext.Window({
				id:winid,
				title: '上传文件', 
				layout: 'fit',
				width: 600,
				height: 450,
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
			win.on('close', function(){grid.getStore().reload();});
			
			//==============================================================
			var readright = '0', downright = '0';
			//关闭前根据临时数据ID从附件表中取数据生成文档记录，并更新新的数据ID；
			//根据新的数据ID更新指定人员明细数据
			win.addEvents('afterupload');
			win.on('afterupload', function(){
				var parentId = getParentId();//取当前文件路径ID
				
				var e = encodeURIComponent;
				var params = 'funid=oa_docs&eventcode=upload&parent_id='+ parentId +'&data_tmpid='+ dataId +'&file_range='+ fran;
					params += '&read_right='+readright+'&down_right='+downright;
				var endcall = function(data) {
					grid.getStore().reload();
				};
				//发送请求
				Request.postRequest(params, endcall);
			});
			
			createUser();//避免创建延时，提前创建grid(阅读)
			createUser1();//避免创建延时，提前创建grid(下载)
			//处理权限范围设置
			var hand = function(radio, checked){
				var val = radio.initialConfig.value;
				var name = radio.initialConfig.name;
				
				if (name == 'm_read') {
					readright = val;
				} else {
					downright = val;
					if(val == '0'){
						readright = '0';
						Ext.getCmp('m_read1').setValue(true);
					}
				}
				if (val == '2') {
					
					if (name == 'm_read') {
						showUser(dataId, radio.getPosition());
						Ext.getCmp('readper1').setValue(true);
					} else {
						showUser1(dataId, radio.getPosition());
						Ext.getCmp('downper1').setValue(true);
					}
				}
			};
			//添加权限控件
			var divRight = win.body.child('#div_fupload_right');
			var tb1 = new Ext.Toolbar({
				style:'margin-top:10px;',
    			renderTo: divRight.first(),
    			items:[
    				{xtype:'tbtext', text:'设置阅读权限：'},
					{xtype:'radio', boxLabel:'所有人员可见', value:'0', name:'m_read',id:'m_read1', listeners:{'focus':hand}, checked:true},
					{xtype:'radio', boxLabel:'本部人员', value:'1', name:'m_read',hidden:true, listeners:{'focus':hand}},
					{xtype:'radio',id:'readper1', boxLabel:'指定人员', value:'2', name:'m_read', listeners:{'focus':hand}},
					{xtype:'radio', boxLabel:'仅自己', value:'6', name:'m_read', listeners:{'focus':hand}}
				]
    		});
    		var tb2 = new Ext.Toolbar({
    			renderTo: divRight.last(),
    			items:[
    				{xtype:'tbtext', text:'设置下载权限：'},
					{xtype:'radio', boxLabel:'所有人员可见', value:'0', name:'m_down', listeners:{'focus':hand}, checked:true},
					{xtype:'radio',hidden:true, boxLabel:'本部人员', value:'1', name:'m_down', listeners:{'focus':hand}},
					{xtype:'radio',id:'downper1',boxLabel:'指定人员', value:'2', name:'m_down',listeners:{'focus':hand}},
					{xtype:'radio', boxLabel:'仅自己', value:'6', name:'m_down', listeners:{'focus':hand}}
				]
    		});
    		//根据不同的知识库，控制不同的权限选项
    		if (fran == '1') {
    			tb1.get(2).show();
    			tb2.get(2).show();
    		}
    		if (fran == '2') {
    			divRight.dom.style.display = 'none';
    			frm.dom.style.height = '100%';
    			readRight = '6';
    			downRight = '6';
    		}
		}
	};
		
	return new Jxstar.GridNode(config);
}