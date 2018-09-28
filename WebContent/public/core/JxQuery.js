/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 构建查询工具栏控件
 * 
 * @author TonyTan
 * @version 1.0, 2012-04-16
 */
JxQuery = {};
(function(){

	Ext.apply(JxQuery, {
	
	initQrys:[['0', '--'+jx.query['casex']+'--'], ['1', '--'+jx.query.custom]],//查询方案 自定义...
		
	/**
	 * 构建查询方案选项控件
	 */
	showCase: function(nodeg) {
		//只是把通用查询放在第二行
		if (Jxstar.systemVar.page__query__two == '1') {
			JxQuery.renderToolQry(nodeg);
			return;
		}
		
		var self = this, grid = nodeg.page;
		var tbar = grid.getBottomToolbar();
		if(!tbar) tbar = grid.getTopToolbar();
		if (!tbar) return;
		tbar.add('-');
		
		var qrys = self.initQrys;
		var qryid = JxUtil.newId() + '_qry';
		var qrycb = Jxstar.createCombo(qryid, qrys, 130);
		tbar.add(qrycb);
		qrycb.on('beforeselect', function(combo, record){
			var val = record.get('value');
			var oldv = combo.getValue();//防止重复点击
			
			if (val != oldv && val == '0') {
				self.renderToolQry(nodeg);
			} else if (val != oldv && val == '1') {
				self.openToolQry(nodeg, combo);
			} else if (val != oldv) {
				var endcall = function(data) {
					self.renderToolQry(nodeg, data.qrycond);
				}
				var params = 'funid=sys_query&queryid=' + val +'&pagetype=grid&eventcode=selcase';
				Request.dataRequest(params, endcall);
			}
		});
		//加载查询方案
		self.loadQryCase(nodeg, qrycb);
	},
	
	/**
	 * 显示自定义查询方案
	 */
	openToolQry: function(nodeg, combo) {
		var win = this.queryWindow(nodeg);
		//关闭时重新加载查询方案
		win.on('destroy', function() {
			JxQuery.loadQryCase(nodeg, combo);
		});
	},
	
	/**
	 * 从后台加载查询方案
	 */
	loadQryCase: function(nodeg, combo) {
		var endcall = function(data) {
			//alert(Ext.encode(data));
			//刷新查询方案
			var qrycase = data.qrycase, iqs = JxQuery.initQrys;
			var qrys = [iqs[0], iqs[1]];
			//只有管理员才有自定义权限
			//if (JxUtil.isAdminUser()) qrys[1] = iqs[1];
			
			Ext.each(qrycase, function(item){
				qrys[qrys.length] = [item.value, item.text];
			});
			combo.getStore().loadData(qrys);
			//设置当前方案
			if (data.qryid.length > 0) {
				if (qrycase.length > 0) combo.setValue(data.qryid);
				JxQuery.renderToolQry(nodeg, data.qrycond);
			} else {
				combo.setValue('0');
				JxQuery.renderToolQry(nodeg);
			}
		}
		var params = 'funid=sys_query&qryfunid=' + nodeg.nodeId +'&pagetype=grid&eventcode=reloadcase';
		Request.dataRequest(params, endcall);
	},
	
	/**
	 * 查询条件显示在工具栏中
	 */
	renderToolQry: function(nodeg, qrycond) {
		var grid = nodeg.page;
		var renderQry = function() {
			if (Ext.isEmpty(grid.qryCt)) {
				JxHint.alert(jx.query.nov);//'查询字段容器未显示！'
				return;
			}
			grid.qryCt.removeAll(true);
			
			var hcfgs = [], rn = 1;
			//如果有查询条件，则是查询方案，否则为通用查询
			if (qrycond) {
				if (qrycond.length > 0) {
					hcfgs = JxQuery.showQryTool(nodeg, qrycond);
					rn = hcfgs.length;
				}
			} else {
				hcfgs = JxQuery.hcfg();
		        Jxstar.addBaseQry(nodeg, hcfgs);
				//显示高级查询按钮
				if (Jxstar.systemVar.page__query__two == '1') {
					hcfgs.add({xtype:'button', iconCls:'eb_qryh', tooltip:jx.star.hqry, handler:function(){	//'高级查询'
						Jxstar.showQuery(nodeg);
					}});
				} else {
					//如果查询做归档处理，则显示归档checkbox
					if (nodeg.define.isarch == '1') {
						hcfgs.add(JxQuery.archCfg);
					}
				}
			}
			
			//添加到查询工具栏容器中
			grid.qryCt.add(hcfgs);
			
			//由于存在2行的情况，qryCt, grid.ownerCt需要doLayout
			grid.qryCt.setHeight(38*rn+10);
			grid.qryCt.doLayout();
			grid.setHeight(grid.ownerCt.getHeight());//单执行doLayout无效
			grid.ownerCt.doLayout();
		};
		
		//由于子表构建时tbar.el is null，所以在子表呈现时再触发
		if (grid.bwrap == null) {
			grid.on('render', renderQry);
		} else {
			renderQry();
		}
	},
	
	//私有方法
	hcfg: function(cfg) {//单行查询配置
		var ct = {
			name:JxUtil.newId()+'_qv',//选择窗口控件使用
			xtype:'container',
			layout:'hbox',
	    	border:false,
	    	height:38,
            layoutConfig: {
                padding:'1',
                align:'middle'
            },
            defaults:{margins:'0 0 0 5'},
            items:cfg||[]
        };
		if (cfg) {
			return ct;
		} else {
			ct.style = 'padding-top:3px';
			return new Ext.Container(ct);
		}
	},
	
	//私有属性
	archCfg: {xtype:'checkbox', boxLabel:jx.query.hasarc, style:'margin-left:5px;', width:100, name:'xx_isarch', checked:false},//'含归档数据'
	
	/**
	 * 根据配置的查询方案，显示查询面板
	 * cfg: {left_brack, colcode, colname, condtype, cond_value, right_brack, andor, coltype}
	 * row: [{cfg1}, {cfg2}, ...]
	 * datas: [{row1}, {row2}, ...]
	 */
	showQryTool: function(nodeg, qrycond) {
		if (qrycond == null || qrycond.length == 0) return [];
		
		var rowno = 0, datas = [];
		for (var i = 0, n = qrycond.length; i < n; i++) {//查询字段分行显示
			var qryrowno = qrycond[i].row_no;
			if (Ext.isEmpty(qryrowno)) qryrowno = '1';
			
			if (rowno == parseInt(qryrowno)) {
				var row = datas[rowno-1];
				row[row.length] = qrycond[i];
			} else {
				rowno = parseInt(qryrowno);//新的行号
				datas[rowno-1] = [qrycond[i]];
			}
		}
		
		var hcfgs = [];//所有查询字段控件
		var self = this, grid = nodeg.page;
		var mycols = nodeg.param.cols;
		for (var i = 0, n = datas.length; i < n; i++) {
			var rowcfg = datas[i];
			var qryrow = [];
			
			for (var j = 0, m = rowcfg.length; j < m; j++) {//构建单行查询字段
				var qrycfg = rowcfg[j];
				qrycfg.colcode = qrycfg.colcode.replace('.', '__');
				
				qryrow = self.addQryField(qrycfg, mycols, qryrow);
			}
			
			if (i == n-1) {//最后一行添加查询按钮
				qryrow[qryrow.length] = {xtype:'button', iconCls:'eb_qry', tooltip:jx.star.qry, handler:self.exeQry, data:grid};
				//如果查询做归档处理，则显示归档checkbox
				if (nodeg.define.isarch == '1') {
					qryrow[qryrow.length] = self.archCfg;
				}
			}
			hcfgs[hcfgs.length] = self.hcfg(qryrow);
		}
		
		return hcfgs;
	}, 
	
	/**
	 * 添加一行查询字段
	 */
	addQryField: function(qrycfg, mycols, qryrow) {
		var self = this;
		var label, field, coltype;
		
		for (var i = 0, c = 0, n = mycols.length; i < n; i++){
			var mc = mycols[i].col, mf = mycols[i].field; 
			if (mc == null || mf == null) continue;
			
			if (mf.name == qrycfg.colcode) {
				coltype = mf.type;
				if (!mc.hasOwnProperty('editor')) {
					if (coltype == 'string') { 
						field = {xtype:'textfield'};
					} else if (coltype == 'date') { 
						var format = JxUtil.getDateFormat(mc.renderer);//设置日期控件的样式，可能是月份样式
						field = {xtype:'datefield', format:format};
					} else {
						field = {xtype:'numberfield', maxLength:12};
					}
				} else {
					var oldcmp = mc.editor;
					//combo控件不能编辑，但可以删除选项值；combosel、combowin控件可以编辑；
					//由于db2数据库的查询值长度不能超过字段长度，才做这样的判断
					var iscombo = false;
					if (oldcmp.isXType('combo') && oldcmp.mode == 'local') {
						iscombo = true;
					}
					var newcfg = Ext.apply({}, oldcmp.initialConfig);//避免控件信息重复
					field = Ext.apply(newcfg, {allowBlank:true, editable:!iscombo, cls:'', xtype:oldcmp.getXType()});
					
					if (iscombo) {//combo控件不能编辑，但可以删除选项值；高级查询设置不需要注册此事件
						field.iscombo = iscombo;//标记是combo控件，下面的回车事件不重复注册
						field.value = '';
						field.listeners = Ext.apply(
							field.listeners||{},
							{specialkey: function(f, e){
								if (e.getKey() == e.DELETE || e.getKey() == e.BACKSPACE) {f.setValue('');}
								if (e.getKey() == e.ENTER) {self.exeQry(f);}
							}}
						);
						//添加一个空值，方便清空combo的值
						JxUtil.insertEmpty(field);
					}
				}
				
				var str = qrycfg.colname;
				//如果为空或非基础语言则取表格列标题
				if (Ext.isEmpty(str) || JxLang.type != JxLang.BASE) str = mc.header;
				str += ': ';
				
				//控制可以不显示日期范围控件
				var noshow = Jxstar.systemVar.sys__qry__date||'0';
				if (noshow == '0' && coltype == 'date') {
				//添加日期范围查询控件
					qrycfg.colname = str;
					self.dateCfgs(qryrow, qrycfg);
				} else {
				//添加一个查询字段
					var len = qryrow.length;
					qryrow[len] = {xtype:'label', text:str, cls:'x-query-label'};
					//保存查询配置值
					field.data = qrycfg;
					field.width = 130;
					field.name = qrycfg.colcode;
					//comsel控件定义时带listeners参数，所以采用apply方法
					if (!field.iscombo) {
						field.listeners = Ext.apply(
							field.listeners||{},
							{specialkey: function(f, e){if (e.getKey() == e.ENTER) {self.exeQry(f);}}}
						);
					}
					qryrow[len+1] = field;
				}
				
				break;
			}
		}
		return qryrow;
	},
	
	/**
	 * 执行查询
	 */
	exeQry: function(b) {
		var hrs = b.ownerCt;//取行容器
		var hps = hrs.ownerCt;//取查询容器
		if (b.isXType('field')) {//如果字段按回车键，则需要查找按钮
			b = hps.findByType('button')[0];
		}
		var isarch = hps.find('name', 'xx_isarch')[0];//取含归档的checkbox
		var query_type = '0';
		if (isarch && isarch.getValue() == '1') {//是否可以查询到已复核的记录
			query_type = '1';
		}
		
		var page = b.initialConfig.data;//取当前表格
		var vfs = JxQuery.getQryField(hps);//取出所有有查询值的字段
		
		var query = JxSearch.getQuery(vfs);
		//if (query == null) return false;//无查询条件时也可以查询
		Jxstar.myQuery(page, query, query_type);
	},
	
	/**
	 * 取有查询值的查询字段数据
	 */
	getQryField: function(hps) {
		var vfs = new Ext.util.MixedCollection();
		hps.items.each(function(hrs){
			hrs.items.each(function(f){
				if (f.isXType('field') && f.getName() != 'xx_isarch') {
					var v = f.getValue();
					var d = f.data;
					if (d && Ext.isEmpty(v) == false) {
						d.cond_value = v;
						vfs.add(d);
					}
				}
			});
		});
		return vfs;
	},
	
	/**
	 * 添加日期范围查询控件
	 * qryrow 查询控件行
	 * qrycfg 查询配置数据
	 */
	dateCfgs: function(qryrow, qrycfg) {
		var self = this;
		var len = qryrow.length;
		var colcode = qrycfg.colcode;
		qryrow[len++] = {xtype:'tbtext', text:qrycfg.colname};

		//今天日期
		var td = JxUtil.getToday();
		td = Date.parseDate(td, "Y-m-d");
		//昨天日期
		var yd = JxUtil.getToday(-1);
		yd = Date.parseDate(yd, "Y-m-d");
		//本周日期开始与结束日期
		var wd = JxUtil.getWeekDates();
		var wd1 = Date.parseDate(wd[0], "Y-m-d");
		var wd2 = Date.parseDate(wd[1], "Y-m-d");
		//本月日期开始与结束日期
		var md = JxUtil.getMonthDates();
		var md1 = Date.parseDate(md[0], "Y-m-d");
		var md2 = Date.parseDate(md[1], "Y-m-d");
		
		//处理查询条件信息 qrycfg:{left_brack, colcode, colname, condtype, cond_value, right_brack, andor, coltype}
		var sdata = Ext.applyIf({condtype:'>='}, qrycfg);
		if (sdata.right_brack.length > 0) {
			sdata.right_brack = '';
		}
		var edata = Ext.applyIf({condtype:'<'}, qrycfg);
		if (sdata.left_brack.length > 0) {
			edata.left_brack = '';
		}
		
		//回车直接查询
		var lsn = {specialkey: function(f, e){
			if (e.getKey() == e.ENTER) {self.exeQry(f);}
		}};
		
		//开始日期
		var sd = new Ext.form.DateField({
			xtype:'datefield',width:130,name:colcode,format: "Y-m-d",value:td,data:sdata,listeners:lsn
		}); 
		//结束日期
		var ed = new Ext.form.DateField({
			xtype:'datefield',width:130,name:colcode,format: "Y-m-d",value:td.add(Date.DAY, 1),data:edata,listeners:lsn
		});	
		
		//设置查询的开始日期与结束日期
		var rahd = function(radio){
			if(radio.checked) {
				var value = radio.inputValue;
				if(value == 'today') {
					sd.setValue(td);
					ed.setValue(td.add(Date.DAY, 1));
				} else if(value == 'yestoday') {
					sd.setValue(yd);
					ed.setValue(yd.add(Date.DAY, 1));
				} else if(value == 'toweek') {
					sd.setValue(wd1);
					ed.setValue(wd2);
				} else if(value == 'tomonth') {
					sd.setValue(md1);
					ed.setValue(md2);
				}
			}
		};
		var dateRange = [
				{xtype:'radio',boxLabel:jx.query.today,name:'dateRange',inputValue :'today',checked:true, listeners :{check:rahd}},//'今天'
				{xtype:'radio',boxLabel:jx.query.yestoday,name:'dateRange',inputValue :'yestoday', listeners :{check:rahd}},//'昨天'
				{xtype:'radio',boxLabel:jx.query.tweek,name:'dateRange',inputValue :'toweek', listeners :{check:rahd}},//'本周'
				{xtype:'radio',boxLabel:jx.query.tmonth,name:'dateRange',inputValue :'tomonth', listeners :{check:rahd}}//'本月'
			];	
		qryrow[len++] = dateRange[0];
		qryrow[len++] = dateRange[1];
		qryrow[len++] = dateRange[2];
		qryrow[len++] = dateRange[3];
		qryrow[len++] = sd;
		qryrow[len++] = {xtype:'tbtext',text:'~'};
		qryrow[len++] = ed;
	},
	
	/**
	* public 查询方案自定义界面
	* nodeg -- 当前功能的表格定义对象，用于取表格字段对象
	**/
	queryWindow: function(nodeg) {
		var self = this;
		self.funid = nodeg.nodeId;
		
		var	win = new Ext.Window({
			title:jx.query.casec,//'查询方案自定义...',
			layout:'border',
			width: 800,
			height: 450,
			constrainHeader: true,
			resizable: false,
			modal: true,
			closeAction: 'close',
			items:[{
				xtype:'container',
				region:'west',
				layout:'fit',
				width:250,
				split:true,
				margins:'2 0 2 2'
			},{
				xtype:'container',
				region:'center',
				layout:'fit',
				margins:'2 2 2 0'
			}]
		});
		//构建表格对象
		Jxstar.createPage('sys_query', 'gridpage', win.getComponent(0));
		var param2 = {pageType:'subeditgrid', parentNodeId:'sys_query'};
		Jxstar.createPage('sys_qrydet', 'gridpage', win.getComponent(1), param2);
		
		//添加主从关系
		JxUtil.delay(1000, function(){
			var mg = win.getComponent(0).getComponent(0);
			var sg = win.getComponent(1).getComponent(0);		
			
			mg.on('rowclick', function(g, n, e){
				var record = g.getStore().getAt(n);
				if (record == null) return false;
				
				var fkval = record.get('sys_query__query_id');
				Jxstar.loadSubData(sg, fkval);
			});
			mg.getStore().on('load', function(s){
				if (mg.selectKeyId == null || mg.selectKeyId.length == 0) {
					mg.getSelectionModel().selectFirstRow();
					mg.fireEvent('rowclick', mg, 0);
				}
			})
			var options = {
				where_sql:"fun_id = ? and (is_share = '1' or user_id = ?)", 
				where_value:self.funid+';'+JxDefault.getUserId(), 
				where_type:'string;string'
			};
			Jxstar.loadData(mg, options);
			
			//记录当前功能ID
			mg.qryFunId = self.funid;
			sg.qryFunId = self.funid;
		});
		
		win.show();
		return win;
	}
	
	});//Ext.apply

})();