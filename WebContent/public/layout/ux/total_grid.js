/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 构建统计报表表格
 * 
 * @author TonyTan
 * @version 1.0, 2011-01-01
 */
JxTotalGrid = {};
(function(){

	Ext.apply(JxTotalGrid, {
	
	/**
	* public 返回表格对象
	* data -- 参数格式{toolfn:fn, cols:[{col_code:, display:, format:, combo_code:, is_show:, col_width:},...], 
	*                  groups:[{header:, colspan:, align:'center'},...], reportId:''}
	**/
	createGrid: function(config) {
		var self = this;
		if (!config.cols) {
			alert('统计报表没有定义字段！');
			return;
		}
		
		//构建store
		var fields = self.createFields(config.cols);
		var store = new Ext.data.Store({
			reader: new Ext.data.JsonReader({
				root: 'root',
				totalProperty: 'total'
			}, fields)
		});
		
		//构建表格分组标题
		var group, titles = config.groups;
		if (titles.length > 0) {
			titles[0].colspan += 1;
			group = new Ext.ux.grid.ColumnHeaderGroup({rows: [titles]});
		}
		
		//单元格选择
		var sm = new Ext.grid.CellSelectionModel();
		
		//构建表格
		var totalgrid = new Ext.grid.GridPanel({
			columns: self.createColumns(config.cols),
			border:false,
			loadMask: true,
			columnLines: true,	//显示列分隔线
			sm: sm,
			store: store,
			stripeRows: true,	//显示斑马线
			enableHdMenu: false,
			enableColumnMove: false,
			plugins: group
		});
		//添加数据钻取事件
		totalgrid.on('cellclick', self.showDrill);
		
		if (typeof config.cellsEvent == "function") config.cellsEvent(totalgrid);
		
		return totalgrid;
	},
	
	//更新工具栏中的统计参数
	updateToolbars: function(config, tbar) {
		var self = this;
		var etp = tbar.get(0);
		if (etp && etp.initialConfig.text == ' ') {tbar.remove(etp);}
		
		//构建工具栏，由于有相关控件的数据
		//所以在后台直接生成工具栏返回前台
		if (typeof config.toolfn == 'string') {
			config.toolfn = window.eval("("+config.toolfn+")");
		}
		var vbar = config.toolfn();
		var vtp = vbar.get(0);
		if (vtp.initialConfig.text == ' ') {vbar.remove(vtp);}
		//把后台构建的工具栏元素copy到前台对象中
		vbar.items.each(function(item){
			tbar.addButton(item);
		}); 
		
		//处理多语言
		self.langTotal(config, tbar);
		
		//添加统计、另存数据
		tbar.addButton({iconCls:'eb_stat', text:jx.group.stat, handler:function(){self.exeStat(config.nodeid, tbar, config);}});//'统计' '另存数据'
		tbar.addButton({iconCls:'eb_expxls', text:jx.group.saveas, handler:function(){
			var grid = tbar.ownerCt.findByType('grid')[0];
			Request.exportCSV(grid, jx.group.statdata+'.csv', false);
		}});
		tbar.doLayout();
		
		//给缺省值
		self.setToolDefault(tbar);
	},
	
	//执行统计
	exeStat: function(nodeid, tbar, config) {
		var self = this;
		var ct = tbar.ownerCt;
		//取表格对象
		var grid = ct.findByType('grid')[0];
		
		var params = '';
		var novalid = false;
		
		//执行外部扩展的统计前事件
		if (config.beforeStat) {
			if (config.beforeStat(grid, config) === false) return;
		}
		
		//取工具栏中的参数值与有效性
		tbar.items.each(function(item){
			if (item.isXType('field')) {
				if (item.isValid() == false) {
					novalid = true;
					return false;
				}
				var val = item.getValue();
				val = Ext.isDate(val) ? val.dateFormat('Y-m-d H:i:s') : val;
				params += '&' + item.getName() + '=' + val;
			}
		});
		if (novalid) {
			JxHint.alert(jx.event.datavalid);
			return;
		}
		
		//统计后加载数据
		var hdcall = function(data) {
			//如果有动态列，则需要重构表格对象
			if (data.cols && data.cols.length > 0) {
				ct.remove(grid, true);
				grid.destroy(); grid = null;
				grid = self.createGrid(data);
				ct.add(grid);
				ct.doLayout();
			}
			
			var cm = grid.getColumnModel();
			//显示所有隐藏的列
			for (var i = 0, len = cm.config.length; i < len; i++) {
				if (cm.isHidden(i) && !(cm.config[i].ishidden)) {
					cm.setHidden(i, false);
				}
			}
			
			//如果有需要动态隐藏的列[field1, field2...]
			if (data.delcols) {
				var cols = data.delcols;
				for (var i = 0, n = cols.length; i < n; i++) {
					var index = cm.getIndexById(cols[i]);
					if (index > -1) {
						cm.setHidden(index, true);
					}
				}
			}
			
			grid.getStore().loadData(data);
			
			//执行外部扩展的统计事件
			if (config.afterStat) {
				config.afterStat(grid, config);
			}
		};
		
		//扩展外部统计参数
		if (typeof config.extParam == 'string') {
			params += config.extParam;
		} else if (typeof config.extParam == 'function') {
			params += config.extParam(grid);
		}
		
		//发送后台请求
		if (config.statParam) {//取外部参数
			params = config.statParam + params;
		} else {
			params = 'funid=sysevent&pagetype=grid&eventcode=totalexe&rpt_funid=' + nodeid + params;
		}
		
		Request.postRequest(params, hdcall);
	},
	
	/**
	 * private 构建表格列信息
	 * 如果列定义中含有: drillparam 参数，表示需要数据钻取，用蓝色下划线表示
	 * 隐藏字段要往后面放，否则分组标题会显示不正确
	 **/
	createColumns: function(cols) {
		var columns = [], self = this, cnt = 0;
		//添加行选控件
		var rn = new Ext.grid.RowNumberer({
			renderer : function(v, p, record, rowIndex){
				if(this.rowspan){
					p.cellAttr = 'rowspan="'+this.rowspan+'"';
				}
				if (record.get(cols[0].col_code) == '合计') {
					return '';
				}
				return rowIndex+1;
			}
		});

		columns[cnt++] = rn;
		
		var hcols = [];
		for (var i = 0; i < cols.length; i++) {
			var code = cols[i].col_code;
			var format = cols[i].format;
			
			var col = {header:cols[i].display, id:code, dataIndex:code, width:cols[i].col_width};
			if (cols[i].drillparam) {
				col.drillparam = cols[i].drillparam;
			}
			var cr = cols[i].renderer;
			if (cr) {
				if (typeof cr == 'string') {
					col.renderer = window.eval("("+cr+")");
				}
			} else {
				self.setRenderer(format, col);
			}
			if (cols[i].hidden) {
				col.hidden = true;
				col.ishidden = true;
				hcols[hcols.length] = col;
			} else {
				columns[cnt++] = col;
			}
		}
		
		//添加隐藏的字段
		if (hcols.length > 0) {
			columns = columns.concat(hcols);
		}
		
		return columns;
	},
	
	//private 给报表参数赋缺省值
	setToolDefault: function(tbar) {
		//取工具栏中的参数
		tbar.items.each(function(item){
			if (item.isXType('field')) {
				var defaultval = item.defaultval;
				if (typeof defaultval == 'string' && defaultval.indexOf('fun_') == 0) {
					var val = eval('JxDefault.' + defaultval.split('fun_')[1]);
					item.setValue(val);
				}
			}
		});
	},
	
	/** 
	 * grid event 'cellclick' define:
	 * 显示钻取数据明细表格，如果有多个统计数据区域，则每个统计数据区域都需要定义钻取规则；
	 * 注意：数据分类与横向分类中的“分类标示字段”必须填写，否则不能使用分类ID作为参数；
	 *       而且纵向分类中的类别ID字段也必须在字段明细表中定义，否则也会找不到分类值；
	 * options的参数有：
	 * fun_id:
	 * use_field:钻取数据的链接显示位置
	 * where_sql:显示where
	 * where_type:string;string...
	 * where_value:[param_name1];[param_name2]...
	 * xfield:
	 * yfield:
	 **/
	showDrill: function(myGrid, rowIndex, colIndex) {
		var cm = myGrid.getColumnModel();
		//根据当前点击的列，取到过滤条件对象
		var options = cm.config[colIndex].drillparam;
		if (!options) return;
		
		var ct = myGrid.findParentBy(function(item){
			if (item.initialConfig.name == 'layout_total') return true;
		});
		//取得页面参数值
		var statParam = {};
		var tbar = ct.getTopToolbar();
		tbar.items.each(function(item){
			if (item.isXType('field')) {
				var name = item.getName();
				var value = item.getValue();
				if (Ext.isDate(value)) value = value.format('Y-m-d');
				statParam[name] = value;
			}
		});
		
		//解析查询参数值，参数值来源有：工具栏中的页面参数、纵向分类ID、横向分类ID
		var values = [], where_value = '';
		if (!Ext.isEmpty(options.where_value)) {
			values = options.where_value.split(';');
			for (var i = 0, n = values.length; i < n; i++) {
				if (values[i].length > 2 && values[i].indexOf('[') >= 0 && values[i].indexOf(']') >= 0) {
					var one_value = null;
					//可能参数值是这种形式：%[name1]%;%[name2]%
					var val = values[i], param = '', lefted = false, rgExp = /\[\S+\]/g;
					var vals = val.split(rgExp);//IE中为空没有值，FF中为空会有值
					if (vals.length > 0) {
						if (vals.length == 1) {//在IE中可能会出现只有一边有值，则需要标记是在哪一边
							lefted = !(val.charAt(0) == '[')//说明值在右边
						}
						var matchs = val.match(rgExp);//返回的是数组
						val = matchs[0];
					}
					//处理参数值中的字段名
					param = val.substring(1, val.length-1);
					
					//取横向分类ID，根据当前点击的列，根据表格列模型数据找到分类ID值
					if (!Ext.isEmpty(options.xfield) && param == options.xfield) {
						var colid = cm.getColumnId(colIndex);
						if (colid != null && colid.length > 0) {
							var ids = colid.split('__');
							if (ids.length > 1) {
								one_value = ids[1];
								//如果是点击合计字段，则清空值
								if (one_value == 'sum') one_value = '';
							}
						}
					} 
					//从当前记录值中取
					if (one_value == null) { 
						var record = myGrid.getStore().getAt(rowIndex);
						if (record) {
							one_value = record.get(param);
						}
					}
					
					if (one_value == null) {
					//取工具栏中的统计参数值
						one_value = statParam[param];
					}
					if (one_value == null) {
						JxHint.alert(String.format(jx.print.nofindp, param));//'没有找到钻取数据的【{0}】参数值！'
						return;
					}
					if (vals.length == 2) {
						where_value += vals[0] + one_value + vals[1] + ';';
					} else if (vals.length == 1) {
						if (lefted) {
							where_value += vals[0] + one_value + ';';
						} else {
							where_value += one_value + vals[0] + ';';
						}
					} else {
						where_value += one_value + ';';
					}
				} else {
					where_value += values[i] + ';';
				}
			}
		}
		if (where_value.length > 0) {
			where_value = where_value.substring(0, where_value.length-1);
		}

		//过滤条件
		var where_sql = options.where_sql;
		var where_type = options.where_type;
		var where_value = where_value;
		//alert('where_sql=' + where_sql + ';where_type=' + where_type + ';where_value=' + where_value);
		//显示数据
		if (options.show_mode == 'win') {
			//通过弹出窗口方式打开
			var hdcall = function(grid) {
				JxUtil.delay(500, function(){
					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type, query_type:'1'});
				});
			};

			//显示数据
			var define = Jxstar.findNode(options.fun_id);
			Jxstar.showData({
				filename: define.gridpage,
				title: define.nodetitle,
				pagetype: 'query',
				width: 800,
				nodedefine: define,
				callback: hdcall
			});
		} else {
			//通过普通页面方式打开
			var pageParam = {pageType:'query', whereSql:where_sql, whereValue:where_value, whereType:where_type, isNotRight:true}; 
			Jxstar.createNode(options.fun_id, pageParam);
		}
	},
	
	//private 构建数据显示样式
	setRenderer: function(format, config) {
		if (format == 'text') return;
		
		if (format == 'int') {
			if (config.drillparam) {
				config.renderer = function(value) {
					var fn = JxUtil.formatInt();
					return '<span class="x-ashow">' + fn(value) + '</span>';
				}
			} else {
				config.renderer = JxUtil.formatInt();
			}
			return;
		} else if (format.indexOf('number') >= 0) {
			var n = 2;
			if (format.length > 6) n = format.charAt(6);
			if (config.drillparam) {
				config.renderer = function(value) {
					var fn = JxUtil.formatNumber(n);
					return '<span class="x-ashow">' + fn(value) + '</span>';
				}
			} else {
				config.renderer = JxUtil.formatNumber(n);
			}
			return;
		} else if (format.indexOf('money') >= 0) {
			var n = 2;
			if (format.length > 5) n = format.charAt(5);
			if (config.drillparam) {
				config.renderer = function(value) {
					var fn = JxUtil.formatMoney(n);
					return '<span class="x-ashow">' + fn(value) + '</span>';
				}
			} else {
				config.renderer = JxUtil.formatMoney(n);
			}
			return;
		}
		
		var str = 'Y-m-d';
		if (format == 'datetime') {
			str = 'Y-m-d H:i:s';
		} else if (format = 'datemin') {
			str = 'Y-m-d H:i';
		} else if (format = 'datemonth') {
			str = 'Y-m';
		} else if (format = 'date') {
			str = 'Y-m-d';
		} else if (format = 'dateyear') {
			str = 'Y';
		}
		if (format.indexOf('date') >= 0) {
			config.renderer = function(value) {
				return value ? value.format(str) : '';
			}
		}
	},
	
	//private 构建数据字段信息
	createFields: function(cols) {
		var fields = [], self = this;
		for (var i = 0; i < cols.length; i++) {
			var format = cols[i].format;
			var dataType = self.getDataType(format);
			
			fields[i] = {name:cols[i].col_code, type:dataType};
		}
		
		return fields;
	},
	
	//private 取数据类型
	getDataType: function(format) {
		if (format == 'text') {
			return 'string';
		}
		if (format.indexOf('number') > -1 || format.indexOf('money') > -1) {
			return 'float';
		}
		if (format.indexOf('date') > -1) {
			return 'date';
		}
		if (format == 'int') {
			return 'int';
		}
		return 'string';
	},
	
	//private 处理统计标题的多语言
	langTotal: function(config, toolbar) {
		var reportId = config.reportId;
		var reportType = config.reportType;
		//处理查询标题的多语言
		toolbar.items.each(function(item){
			if (item.getXType() == 'tbtext') {
				var key = item.getItemId();
				var text = item.initialConfig.text;
				text = JxLang.otherText('totaltitle', 'param__'+reportId+'__'+key, text);
				item.setText(text);
			}
		});
		//处理字段标题的多语言
		var cols = config.cols;
		for (var i = 0; i < cols.length; i++) {
			var key = cols[i].col_code;
			var text = cols[i].display;
			cols[i].display = JxLang.otherText('totaltitle', 'field__'+reportId+'__'+key, text);
		}
		//处理分组标题
		var groups = config.groups;
		for (var i = 0; i < groups.length; i++) {
			var key = groups[i].areaIndex;
			var text = groups[i].header;
			groups[i].header = JxLang.otherText('totaltitle', 'area__'+reportId+'__'+key, text);
		}
	}
	
	});//Ext.apply

})();