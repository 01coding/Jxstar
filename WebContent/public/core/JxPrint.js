/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 报表打印选择窗口。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */
 
JxPrint = {};
(function(){

	Ext.apply(JxPrint, {
	/**
	* 是否有报表定义信息
	**/
	hasReport: false,
	
	/**
	* public 显示报表选项对话框
	*
	* pageNode -- 当前功能的表格定义对象
	**/
	showWindow: function(pageNode) {
		var self = this;
		var funid = pageNode.nodeId;
		
		var hdCall = function(data) {
			var lsReport = [];
			
			if (data == null || data.length == 0) {
				self.hasReport = false;
				lsReport[0] = {baseCls:'x-plain', border:false, html:'<font color="red">'+ jx.print.noreport +'</font>'};	//没有报表定义信息！
			} else {
				self.hasReport = true;
				for (var i = 0, n = data.length; i < n; i++) {
					var item = {boxLabel: data[i].report_name,
								xtype: 'radio',
								name: 'reportId',
								inputValue: data[i].report_id,
								checked: false};
								
					if (i == 0) item.checked = true;
								
					lsReport[i] = item;
				}
			}
			
			self.createWindow(funid, lsReport, pageNode);
		};
		
		//从后台取报表定义信息
		var params = 'funid=rpt_list&pagetype=grid&eventcode=listdata&selfunid='+ funid;
		//报表列表根据部门控制
		var isdept = Jxstar.systemVar.sys__report__dept||'0';
		if (isdept == '1' && (JxDefault.getRoleId() != 'administrator')) {
			params += '&deptid=' + JxDefault.getDeptId();
		} else {
			params += '&deptid=';
		}
		
		Request.dataRequest(params, hdCall);
	},
		
	/**
	* private 创建报表选项对话框
	*
	* funid -- 当前功能ID
	* lsReport -- 当前功能的报表定义信息
	**/
	createWindow: function(funid, lsReport, pageNode) {
		var vitem = [{
					boxLabel: jx.print.outxls,	//'输出Excel'
					name: 'printType',
					inputValue: 'xls',
					checked: true
				},{
					boxLabel: jx.print.outhtm,	//'输出HTML',
					name: 'printType',
					inputValue: 'html'
				}];
		//是否支持插件打印
		var isplug = Jxstar.systemVar.sys__report__isplug||'0';
		if (isplug == '1') {
			vitem[vitem.length] = {
					boxLabel: '输出WEB',
					name: 'printType',
					inputValue: 'web'
				};
		}
		//是否支持pdf打印
		var ispdf = Jxstar.systemVar.sys__attach__pdfprint||'0';
		if (ispdf == '1') {
			vitem[vitem.length] = {
					boxLabel: '输出PDF',
					name: 'printType',
					inputValue: 'pdf'
				};
		}
		
		var printForm = new Ext.form.FormPanel({
			style: 'padding-top:10px;',
			border: false,
			frame: false,
			baseCls: 'x-plain',
			items: [{
				baseCls:'xf-panel',
				title:jx.print.seltemp,	//'选择报表模板'
				autoHeight:true,
				hideLabels:true,
				style:'margin-left:10px;',
				items:lsReport
			},{
				baseCls:'xf-panel',
				title: jx.print.outtype, 		//'选择输出类型'
				autoHeight:true,
				defaultType: 'radio',
				hideLabels: true,
				style: 'margin-left:10px;',
				items: vitem
			},{
				baseCls:'xf-panel',
				title: jx.print.outrang, 		//'选择输出范围'
				autoHeight:true,
				defaultType: 'radio',
				hideLabels: true,
				style: 'margin-left:10px;',
				items: [{
					boxLabel: jx.print.outrec, 	//'输出选择的记录'
					name: 'printScope',
					inputValue: 'select',
					checked: true
				},{
					boxLabel: jx.print.outall, 	//'输出当前所有记录'
					name: 'printScope',
					inputValue: 'query'
				}]
			}]
		});
		
		var self = this;
		//创建对话框
		var win = new Ext.Window({
			title:	jx.print.ptitle, 	//'输出报表选项'
			width:300,
			height:480,
			autoScroll:true,
			resizable: false,
			modal: true,
			closeAction:'close',
			items:[printForm],

			buttons: [{
				text:jx.base.ok,		//'确定'
				disabled:(!self.hasReport),
				handler:function(){
					JxPrint.printReport(funid, printForm.getForm(), pageNode);
					win.close();
				}
			},{
				text:jx.base.cancel,	//'取消'
				handler:function(){win.close();}
			}]
		});
		win.show();
	},
	
	/**
	* private 向后台发出打印报表的请求
	*
	* funId -- 当前功能ID
	* form -- 打印报表选项信息
	**/
	printReport: function(funId, form, pageNode) {
		//取选择的报表ID
		var reportId = form.findField('reportId').getGroupValue();
		
		//取选择的输出类型
		var printType = form.findField('printType').getGroupValue();
		
		//取选择的数据范围
		var printScope = form.findField('printScope').getGroupValue();
		
		this.exePrint(pageNode, funId, reportId, printType, printScope, '0');
	},
	
	/**
	* public 直接打印需要调用的公共方法。
	* 
	**/
	exePrint: function(pageNode, funId, reportId, printType, printScope, printMode) {
		reportId = reportId||'';
		printType = printType||'xls';
		printScope = printScope||'select';
		printMode = printMode||'0';
		
		var whereSql = '';
		var whereValue = '';
		var whereType = '';
		var queryType = '0';
		if (printScope == 'select') {
			whereSql = this.selectWhere(pageNode);
			if (whereSql.length == 0) {
				JxHint.alert(jx.print.selectno);	//'没有选择一条记录，不能执行此操作！'
				return false;
			}
			//选择模式不处理归档
			queryType = '1';
		} else if (printScope == 'query') {
			var wheres = this.queryWhere(pageNode);
			whereSql = wheres[0];
			whereValue = wheres[1];
			whereType = wheres[2];
			queryType = wheres[3];
		} else {
			return false;
		}
		
		//扩展事件用的参数
		var data = {reportId:reportId, printType:printType, printScope:printScope, printMode:printMode};
		//触发打印前事件
		if (pageNode.event.fireEvent('beforeprint', pageNode.event, data) == false) return false;
		
		//请求参数
		var e = encodeURIComponent; //编码
		var params = 'funid='+ funId +'&reportId='+ reportId +'&printType='+((printType=='html'||printType=='web')?'html':printType)+'&printMode='+printMode+'&queryType='+ queryType;
		var paramWhere = '&whereSql='+e(whereSql)+'&whereValue='+e(whereValue)+'&whereType='+ whereType;
		if (reportId.length == 0) {
			params += '&isDefault=1';
		}
		params += '&user_id=' + Jxstar.session['user_id'];
		
		//扩展打印请求参数
		if (typeof pageNode.event.dataPrintParam == 'function') {
			var ret = pageNode.event.dataPrintParam(data);
			if (ret && ret.length > 0) {
				if (ret.charAt(0) != '&') {
					ret = '&' + ret;
				}
				params += ret;
			}
		}
		
		//发送后台请求
		var href = Jxstar.path + "/reportAction.do?" + params;
		
		if ('xls' == printType) {//如果选择的记录数达200条，则用GET方式会造成显示不了下载文件问题
			var postParams = {whereSql:whereSql, whereValue:whereValue, whereType:whereType};
			this.postExpReport(href, postParams);
		} else if ('html' == printType) {
			var url = Jxstar.path + "/report/html/htmlprint.jsp";
			window.tmp_print_title = "打印窗口";
			window.tmp_print_params = params + paramWhere;
			window.open(url);
		} else if ('web' == printType) {
			var url = href + paramWhere;
			this.LODOP_WEB(url);
		} else if ('pdf' == printType) {
			//支持异地输出pdf报表，会话信息处理？
			var appurl = Jxstar.systemVar.sys__attach__pdfurl||'';
			if (appurl.length == 0) {
				appurl = Jxstar.path;
			} else {
				params += '&nocheck=1';
			}
			appurl += "/reportAction.do?" + params;
			var postParams = {whereSql:whereSql, whereValue:whereValue, whereType:whereType};
			this.postExpReport(appurl, postParams, printType);
		}
		
		//触发打印后事件
		pageNode.event.fireEvent('afterprint', pageNode.event, data);
	},
	
	//通过post方式导出xls报表
	postExpReport: function(href, postParams, printType) {
		//如果没有form则自动创建
		var fd = Ext.get('frmExpReport');
		if (!fd) {
			fd = Ext.DomHelper.append(Ext.getBody(), {
					tag:'form', 
					method:'post', 
					id:'frmExpReport', 
					name:'frmExpReport',
					target:(printType=='pdf' ? '_blank' : 'frmhidden'),
					cls:'x-hidden',
					cn:[{tag:'input',name:'exp_text',id:'exp_text',type:'hidden'},
						{tag:'input',name:'whereSql',id:'whereSql',type:'hidden'},
						{tag:'input',name:'whereValue',id:'whereValue',type:'hidden'},
						{tag:'input',name:'whereType',id:'whereType',type:'hidden'}]
				}, true);
		}
		//POST请求参数
		var pps = postParams||{};
		fd.child('#whereSql').set({value:pps.whereSql||''});
		fd.child('#whereValue').set({value:pps.whereValue||''});
		fd.child('#whereType').set({value:pps.whereType||''});
		
		//URL请求参数
		fd.dom.action = href;
		fd.dom.submit();
	},
	
	/**
	* private 取当前查询结果的where子句
	**/
	queryWhere: function(pageNode) {
		var wheres = [4];
		//取当前where子句
		var dsOption = pageNode.page.getStore().lastOptions.params || {}; 
		wheres[0] = dsOption.where_sql || '';
		wheres[1] = dsOption.where_value || '';
		wheres[2] = dsOption.where_type || '';
		wheres[3] = dsOption.query_type || '0';
		
		return wheres;
	},

	/**
	* private 取当前选择记录的where子句
	**/
	selectWhere: function(pageNode) {	
		var page = pageNode.page;
	
		var where = '';
		var pkcol = pageNode.define.pkcol;
		if(pageNode.pageType.indexOf("form") > -1) {
			var keyid = page.getForm().findField(pkcol).getValue();
			if (keyid != null && keyid.length > 0) {
				where = "'" + keyid + "'";
			}
		} else {
			var records = page.getSelectionModel().getSelections();
			if (records.length > 0) {
				for (var i = 0, n = records.length; i < n; i++) {
					where += "'" + records[i].get(pkcol) + "',";
				}
				where = where.substring(0, where.length - 1);
			}
		}
		
		if (where.length > 0) {
			where = pkcol.replace('__', '.') + ' in (' + where + ')';
		}
		return where;
	},
	
	LODOP_IFRAME: null,
	LODOP_WEB: function(url) {
		var me = this;
		
		//加载插件对象
		if (typeof getLodop == 'undefined') {
			JxUtil.loadJS('/report/html/LodopFuncs.js', true);
		}
		
		LODOP = getLodop();
		if (!LODOP) {
			alert('没有安装打印插件，安装完成后需要重新登录系统，插件才能生效！');
			return;
		}
		
		var ifrm = me.LODOP_IFRAME;
		if (!ifrm) {
			ifrm = me.LODOP_IFRAME = document.createElement("iframe");
            ifrm.setAttribute("width",0);
            ifrm.setAttribute("height",0);
			ifrm.setAttribute("frameborder",0);
			document.documentElement.appendChild(ifrm);
		}
		ifrm.style.display = '';
		
		var mm = new Ext.LoadMask(Ext.getBody());
		mm.show();
		
		ifrm.src = url;
		//表格加载完后再预览
		if (JxExt.isIE) {//方法也可以attachEvent("onload"
			ifrm.onreadystatechange = function() {
				if (this.readyState == "complete") {
					mm.hide(); mm = null;
					me.LODOP_PREVIEW();
				}
			};
		} else {
			ifrm.onload = function(){
				me.LODOP_PREVIEW();
				mm.hide(); mm = null;
			};
		}
	},
	LODOP_PREVIEW: function() {
		var me = this;
		LODOP.PRINT_INIT("WEB打印预览");
		
		var ifrm = me.LODOP_IFRAME;
		var idoc = ifrm.contentWindow.document;
		var heads = idoc.getElementsByTagName("HEAD");
		var istyle;
		if (heads && heads.length > 0) {
			var istyle = heads[0].getElementsByTagName("STYLE");
			if (istyle && istyle.length > 0) istyle = istyle[0];
		}
		
		//Excel2003转换的表格直接是table，Excel2007转换的第一页是DIV，新页是直接添加table
		var tables = idoc.body.getElementsByTagName("TABLE");
		if (!tables || tables.length == 0) {
			alert('没有找到页面TABLE对象！');
			return;
		} else {
			//alert(tables[0].clientWidth+';'+tables[0].clientHeight+';'+tables[0].offsetHeight+';'+tables[0].offsetWidth);
			var w = tables[0].clientWidth;
			var h = tables[0].clientHeight;
			
			var strHTML = "<table border='0' width='100%' >";
			for (var i = 0; i < tables.length; i++) {
				//复制一份style对象
				if (istyle) {
					tables[i].appendChild(istyle.cloneNode(true));
				}
				strHTML=strHTML+"<tr><td>";
				strHTML=strHTML+tables[i].outerHTML;
				strHTML=strHTML+"</td></tr>";
			}
			strHTML=strHTML+"</table>";
			LODOP.ADD_PRINT_TABLE(0,0,w,h,strHTML);
			//采用PRINT_HTM方式会保存原始大小；采用PRINT_TABLE会缩小只显示一页
			//LODOP.ADD_PRINT_HTM(0,0,w,h,tables[i].outerHTML);
			//LODOP.NewPage();
		}
		ifrm.style.display = 'none';
		
		LODOP.SET_SHOW_MODE("HIDE_PAPER_BOARD",true);//隐藏走纸板
		LODOP.PREVIEW();	
	}
	

	});//Ext.apply

})();
