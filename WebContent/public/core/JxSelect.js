/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 处理选择控件的数据赋值。
 * 
 * @author TonyTan
 * @version 1.0, 2010-11-22
 */
JxSelect = {};

(function(){

	Ext.apply(JxSelect, {
		/**
		* 创建下拉选择数据的窗口对象
		* 
		* config: 选择数据的配置，参数有：						
			pageType: 'combogrid',
			nodeId: 'jz_type_v',
			isSame: '0',	//是否同名赋值
			isMoreSelect: '', //是否可以多选
			sourceField: 'jz_type.type_name;type_id',
			targetField: 'jz_list.type_name;type_id',
			whereSql: '',
			whereValue: '',
			whereType: ''
		* targetFlag: 目标对象类别标识，可能是node_funid_editgrid或node_funid_form
		*/
		createSelectWin: function(config, parentField, targetFlag) {
			if(parentField.readOnly || parentField.disabled){
				return;
			}
			//处理多语言选择窗口配置信息
			JxLang.langSelectConfig(config);
			
			//如果是多选，页面类型改为
			var ismore = false;
			if (config.isMoreSelect == '1') {
				ismore = true;
				config.pageType = 'selgrid';
			}
			
			var self = this;
			var nodeId = config.nodeId;
			
			//功能对象信息
			var define = Jxstar.findNode(nodeId);
			if (define == null) {
				JxHint.alert(String.format(jx.star.nopage, nodeId));	//'没有定义【{0}】功能页面信息！'
				return;
			}
			
			//取创建页面的函数
			var hdCall = function(f) {
				var page = f(define, {pageType:config.pageType});
				//创建表格对象
				if (typeof page.showPage == 'function') {
					page = page.showPage(config.pageType);
				}
				//设置页面高度
				//page.height = 495;
				//-------------------增加多项的选择区域-------------------
				var items = [page], ly = 'fit', w = 750, h = 500;
				if (ismore) {
					w = 800; h = 560;
					ly = 'border';
					items = [
						{region:'south', xtype:'box', style:'border-top:1px solid #F0AD4E; background-color:#FFF;', height:68, 
							id:'xsel_more_data', html:'<ul></ul>'},
						{region:'center', xtype:'container', layout:'fit', items:[page]}
					];
					JxSelect.selectMoreData = {};//初始化数据
				}
				//----------------------------------------------------
				//创建对话框
				var	win = new Ext.Window({
					title: jx.base.select+define.nodetitle,	//'选择'
					layout: ly,
					width: w,
					height: h,
					border: false,
					modal: true,
					closeAction: 'close',
					items: items
				});
				win.show();
				
				//如果是布局页面，grid显示会延时，所以需要延时函数
				JxUtil.delay(500, function(){
					//如果page不是grid，则认为是树形页面，取左边的grid
					var selgrid = page;
					if (!selgrid.isXType('grid')) {
						selgrid = selgrid.getComponent(1);
						if (selgrid == null) {
							JxHint.alert(jx.star.nogrid);	//'选择功能页面不能识别表格，请检查！'
							return false;
						} else {
							selgrid = selgrid.getComponent(0);
						}
					}
					var whereValue = config.whereValue;
					
					//解析选择窗口中的[table.field];{table.field}参数
					whereValue = self.parseWhereValue(whereValue, parentField, targetFlag);
					
					//显示表格对象后再加载数据才稳定
					if (selgrid.isShow == '1') {
						Jxstar.loadData(selgrid, {where_sql:config.whereSql, where_value:whereValue, where_type:config.whereType});
					} else {
						//不做缺省查询，但也要保留选择的where条件，在查询中能带上这个查询条件
						selgrid.jxstarParam.old_wsql = config.whereSql||'';
						selgrid.jxstarParam.old_wtype = config.whereType||'';
						selgrid.jxstarParam.old_wvalue = config.whereValue||'';
					}
					//添加选择数据的方法
					selgrid.on('rowdblclick', function(grid, n, event){
						
						//取选择的来源记录数据
						var srcRecords = JxUtil.getSelectRows(grid);
						//从选择区域中取数据
						if (ismore) srcRecords = JxSelect.getMoreData();
						
						if (srcRecords == null || srcRecords.length == 0) {
						//如果选择的记录为空，则说明是清空选择的数据
							var store = grid.getStore();
							srcRecords = []; srcRecords[0] = JxUtil.emptyRecord(store);
						} else {
							//如果不是多选，则只取第一天记录的值
							if (!ismore) srcRecords = [srcRecords[0]];
						}
						
						//修改前的值
						var orgValue = parentField.getValue();
						//取选择字段的容器对象，根据它判断是在grid控件中还是在查询控件中
						var fieldCt = parentField.ownerCt;
						//查询值或统计参数值的输入控件赋值
						if (fieldCt && fieldCt.initialConfig.name && fieldCt.initialConfig.name.indexOf('_qv') > 0) {
							self.setControlData(srcRecords, parentField, config.sourceField, config.targetField);
						} else {
							//取目标grid或form，根据ID查找
							var tagRecord = self.selectTagRecord(parentField, targetFlag);
							//给目标表赋值
							self.setSelectData(srcRecords, tagRecord, config.isSame, config.sourceField, config.targetField);
							//触发 grid.afteredit 事件
							if (targetFlag.indexOf('_editgrid') > 0) {
								self.fireAfterEdit(parentField, tagRecord, config);
							}
						}
						//隐藏选择的窗口
						win.close();
						//触发值改变事件
						parentField.fireEvent('change', parentField, parentField.getValue(), orgValue);
					});
					
					//-----------------多选添加数据，勾选选择、取消清除-----------------
					if (ismore) {
						var sm = selgrid.getSelectionModel();
						var fieldn = JxSelect.getMoreField(config.sourceField);
						sm.on('rowselect', function(xs, index, r){
							JxSelect.selRowData(fieldn, define.pkcol, r);
						});
						sm.on('rowdeselect', function(xs, index, r){
							JxSelect.delMoreData(fieldn, define.pkcol, r);
						});
					}//---------------------------------------------------------
				});
			};

			//异步从JS文件加载功能对象
			var pathname = config.layoutPage;
			if (pathname == null || pathname.length == 0) {
				pathname = define.gridpage;
			}
			if (pathname == null || pathname.length == 0){
				JxHint.alert(String.format(jx.star.nopage, nodeId));	//'没有定义【{0}】功能页面信息！'
				return;
			}
			Request.loadJS(pathname, hdCall);
		},
		
		//多选的记录
		selectMoreData: {},
		//取标签字段名
		getMoreField: function(srcField) {
			if (srcField.length == 0) {
				alert('找不到标签字段，不能添加！');
				return null;
			}
			var srcNames = srcField.split(';');
			if (srcNames[0].length == 0) {
				alert('找不到标签字段，不能添加！');
				return null;
			}
			return srcNames[0].replace('.', '__');
		},
		//添加或删除选择的记录
		selRowData: function(fieldn, fkey, record) {
			if (!record) return;
			var id = record.get(fkey);
			if (!id) {
				alert('找不到主键，不能添加！'); return;
			}
			var selx = Ext.get('xsel_more_data').child('ul');
			var sid = selx.first('#'+id);
			if (sid) {
				//JxSelect.delMoreData(fieldn, fkey, record);
			} else {
				var seln = selx.insertHtml('beforeEnd', '<li class="x-seldata" id="'+ id +'">'+ record.get(fieldn) +'</li>', true);
				var deln = seln.insertHtml('beforeEnd', '<span class="top-fun-img"><i class="fa eb_remco bigger-110"></i></span>', true);
				deln.on('click', function(){
					JxSelect.delMoreData(fieldn, fkey, record);
				});
				JxSelect.selectMoreData[id] = record;
			}
		},
		delMoreData: function(fieldn, fkey, record) {
			var id = record.get(fkey);
			if (!id) {
				alert('找不到主键，不能移除！'); return;
			}
			var selx = Ext.get('xsel_more_data').child('ul');
			var sid = selx.first('#'+id);
			if (sid) sid.remove();
			
			JxSelect.selectMoreData[id] = null;
			delete JxSelect.selectMoreData[id];
		},
		getMoreData: function() {
			var ret = [], smd = JxSelect.selectMoreData;
			for (k in smd) {
				ret.push(smd[k]);
			}
			return ret;
		},

		/**
		* 创建下拉选择数据的窗口对象
		* 
		* config: 选择数据的配置，参数有：						
			pageType: 'combogrid',
			nodeId: 'jz_type_v',
			isSame: '0',	//是否同名赋值
			sourceField: 'jz_type.type_name;type_id',
			targetField: 'jz_list.type_name;type_id',
			whereSql: '',
			whereValue: '',
			whereType: ''
		* menuDiv: 右键菜单显示块
		* targetFlag: 目标对象类别标识，可能是node_funid_editgrid或node_funid_form
		*/
		createComboGrid: function(config, menuDiv, targetFlag) {
			//处理多语言选择窗口配置信息
			JxLang.langSelectConfig(config);
			
			var self = this;
			var nodeId = config.nodeId;
			var parentField = menuDiv.parentField;
			//如果只读则不显示
			menuDiv.on('beforeshow', function(){
				if (parentField.readOnly) return false;
			});
			
			//功能对象信息
			var define = Jxstar.findNode(nodeId);
			if (define == null) {
				JxHint.alert(String.format(jx.star.nopage, nodeId));	//没有定义【{0}】功能页面信息！
				return;
			}
			
			//刷新表格中的数据
			var refreshData = function(page) {
				//解析查询参数值中的[]字段变量，如果在查询栏中使用，则会选择不到值
				var whereValue = config.whereValue;
				//解析选择窗口中的[table.field];{table.field}参数
				whereValue = self.parseWhereValue(whereValue, parentField, targetFlag);
				//显示表格对象后再加载数据才稳定
				Jxstar.loadData(page, {where_sql:config.whereSql, where_value:whereValue, where_type:config.whereType});
			}

			//取创建页面的函数
			var hdCall = function(f) {
				var page = f(define, {pageType:config.pageType});
				//创建表格对象
				if (typeof page.showPage == 'function') {
					page = page.showPage(config.pageType);
				}
				//设置grid高度
				page.height = 328;
				//把新页面添加到目标窗口中
				menuDiv.add(page);
				//重新显示目标窗口
				menuDiv.doLayout();
				
				//创建时显示数据
				refreshData(page);
				//显示时，刷新表格中的数据
				menuDiv.on('show', function(){
					refreshData(page);
				});
				menuDiv.on('destroy', function(){
					config = null;
					targetFlag = null;
					refreshData = null;
				});
				
				//添加选择数据的方法
				page.on('rowclick', function(grid, index, e){
					//rowclick事件会执行两次，用下面的方法判断不重复执行
					if (!menuDiv.isVisible()) return false;

					//取选择的来源记录数据
					var srcRecords = JxUtil.getSelectRows(grid);
					if (srcRecords == null || srcRecords.length == 0) {
					//如果选择的记录为空，则说明是清空选择的数据
						var store = grid.getStore();
						srcRecords = []; srcRecords[0] = JxUtil.emptyRecord(store);
					} else {
						//如果不是多选，则只取第一天记录的值
						srcRecords = [srcRecords[0]];
					}
						
					//取选择字段的容器对象，根据它判断是在grid控件中还是在查询控件中
					var fieldCt = parentField.ownerCt;
					//查询值或统计参数值的输入控件赋值
					if (fieldCt && fieldCt.initialConfig.name && fieldCt.initialConfig.name.indexOf('_qv') > 0) {
						self.setControlData(srcRecords, parentField, config.sourceField, config.targetField);
					} else {
						//取目标grid或form，根据ID查找
						var tagRecord = self.selectTagRecord(parentField, targetFlag);
						//给目标表赋值
						self.setSelectData(srcRecords, tagRecord, config.isSame, config.sourceField, config.targetField);
						//触发 grid.afteredit 事件
						if (targetFlag.indexOf('_editgrid') > 0) {
							self.fireAfterEdit(parentField, tagRecord, config);
						}
					}
					//隐藏选择的窗口
					menuDiv.hide();
				});
			};

			//异步从JS文件加载功能对象
			var pathname = define.gridpage;
			if (pathname == null || pathname.length == 0){
				JxHint.alert(String.format(jx.star.nopage, nodeId));	//'没有定义【{0}】功能页面信息！'
				return;
			}
			Request.loadJS(pathname, hdCall);
		},
		
		//触发表格编辑后事件
		fireAfterEdit: function(parentField, tagRecord, config){
			var gdom = parentField.el.findParentNode('div.x-grid-panel');
			var grid = Ext.getCmp(gdom.id);
			if (grid) {
				var field = config.fieldName.replace('.', '__');
				var e = {
					grid: grid,
					record: tagRecord,
					field: field,
					originalValue: parentField.getValue(),
					value: tagRecord.get(field)
				};
				grid.fireEvent("afteredit", e);
			}
		},
		
		//解析选择窗口中的[table.field];{table.field}参数
		parseWhereValue: function(whereValue, parentField, targetFlag) {
			var self = this;
			//如果含{table.field}表示，从父Form中取值，一般是Grid编辑的明细表中取父form
			if (whereValue != null && whereValue.indexOf('\{') >= 0) {
				var getRecord = function(subgrid) {
					if (!subgrid) return null;
					
					var form = JxUtil.getParentForm(subgrid);
					var tagRecord = null;
					//可编辑子表且没有主form对象时，form为null
					if (form) tagRecord = form.myRecord;
					
					//如果主表单没有打开，form.myRecord为null，则取表格记录
					if (!tagRecord) {
						var mGrid = JxUtil.getParentGrid(subgrid);
						if (mGrid) {
							var records = JxUtil.getSelectRows(mGrid);
							if (records && records.length > 0) {
								tagRecord = records[0];
							}
						}
					}
					return tagRecord;
				};
				if (targetFlag.indexOf('grid') >= 0) {
					var gdom = parentField.el.findParentNode('div.x-grid-panel');
					var subgrid = Ext.getCmp(gdom.id);
					
					var tagRecord = getRecord(subgrid);
					if (tagRecord) {
						whereValue = JxUtil.parseWhereValue(whereValue, tagRecord, true);
					}
				}
				//弹出子窗口subform中从父表中取值
				if (targetFlag.indexOf('form') >= 0) {
					var form = parentField.ownerCt;
					if (form.isXType('form') == false) {
						form = form.findParentByType('form');
					}
					var subgrid = form.getForm().myGrid;
					
					var tagRecord = getRecord(subgrid);
					if (tagRecord) {
						whereValue = JxUtil.parseWhereValue(whereValue, tagRecord, true);
					}
				}
			}
			//解析查询参数值中的[]字段变量，如果在查询栏中使用，则会选择不到值
			if (whereValue != null && whereValue.indexOf('[') >= 0) {
				var tagRecord = self.selectTagRecord(parentField, targetFlag);
				whereValue = JxUtil.parseWhereValue(whereValue, tagRecord);
			}
			return whereValue;
		},
		
		/**
		* private 取目标grid或form，根据ID查找。选择窗口或下拉GRID控件使用。
		* parentField -- 当前选择控件的字段对象
		* targetFlag -- 当前选择控件所在的PanelID，现在取消通过Ext.getCmp(targetFlag)的方式找控件
		*/
		selectTagRecord: function(parentField, targetFlag) {
			var tagRecord;
			if (targetFlag.indexOf('grid') >= 0) {
				var gdom = parentField.el.findParentNode('div.x-grid-panel');
				var grid = Ext.getCmp(gdom.id);
				if (grid) {
					var last = grid.lastEdit;
					if (last) {//防止标记到了下一行，实际触发原记录
						tagRecord = grid.getStore().getAt(last.row);
					} else {
						var selRecord = JxUtil.getSelectRows(grid);
						if (selRecord && selRecord.length > 0) {
							tagRecord = selRecord[0];
						}
					}
				}
			} else {
				var form = parentField.ownerCt;
				//有些自定义的form页面，字段的容器对象就是form
				if (form.isXType('form') == false) {
					form = form.findParentByType('form');
				}
				
				if (form) {
					tagRecord = form.getForm();
				}
			}
			if (Ext.isEmpty(tagRecord)) {//'没有找到目标记录对象，不能选择！'
				JxHint.alert(jx.star.notag);
			}
			
			return tagRecord;
		},
	
		/**
		* 处理选择表格数据的赋值方法，
		* 
		* srcRecords: 来源记录，是一个数组
		* fieldCtl: 目标选择控件
		* sourceField: 来源字段
		* targetField: 目标字段，如果是统计参数，不能添加表名
		*/
		setControlData: function(srcRecords, fieldCtl, srcField, tagField) {
			var self = this;
			var fieldCt = fieldCtl.ownerCt;
			//统计条件值输入控件
			if (fieldCt.isXType('toolbar')) {
				var srcNames = srcField.split(';');
				var tagNames = tagField.split(';');
				if (srcNames[0].length == 0 || tagNames[0].length == 0) {
					JxHint.alert(jx.star.noselfield);
					return false;
				}
				//取来源字段的表名
				var srcTable = srcNames[0].split(".")[0];
				
				for(var i = 0, n = srcNames.length; i < n; i++) {
					if (srcNames[i].length == 0 || 
						tagNames[i] == null || tagNames[i].length == 0) continue;
						
					//构建来源数据字段名
					var srcTmps = srcNames[i].split(".");
					if(srcTmps.length > 1){
						srcName = srcTmps[0] + '__' + srcTmps[1];
						srcTable = srcTmps[0];
					}else{
						srcName = srcTable + "__" + srcNames[i];
					}
					//取来源字段的值
					var srcValue = self.getValue(srcRecords, srcName);
					
					//找到目标控件
					var tagName = tagNames[i].replace('.', '__');
					var fields = fieldCt.find('name', tagName);
					if (fields == null || fields.length == 0) continue;
					//给目标控件赋值
					fields[0].setValue(srcValue);
				}
			} else {
			//查询值输入控件
				var srcName = srcField.split(';')[0].replace('.', '__');
				if (srcName == null || srcName.length == 0) {
					JxHint.alert(jx.star.nosrc);	//'没有定义来源字段，不能选择记录！'
					return false;
				}
				
				var srcValue = self.getValue(srcRecords, srcName);
				fieldCtl.setValue(srcValue);
			}
		},

		/**
		* 处理选择表格数据的赋值方法，
		* 
		* srcRecords: 来源记录，是一个数组
		* tagRecord: 目标记录
		* isSame: 是否同名赋值 '1', '0'
		* sourceField: 来源字段，格式：tablename.field;field;tablename1.field...
		* targetField: 目标字段，格式：tablename.field;field;tablename1.field...
		*/
		setSelectData: function(srcRecords, tagRecord, isSame, sourceField, targetField) {
			var self = this;
			//来源字段名、目标字段名
			var srcFieldName, tagFieldName;

			//如果允许同名字段赋值，则先处理同名字段的值
			var tagData = tagRecord.data;
			if (tagData == null) {//为空说明是form
				tagData = tagRecord.getFieldValues();
			}
			if (isSame == '1'){
				for(srcFieldName in srcRecords[0].data) {
					var srctmp = srcFieldName.split("__")[1];
					for(tagFieldName in tagData) {
						var tagtmp = tagFieldName.split("__")[1];
						//auditing字段的值不赋值
						if (srctmp.indexOf('auditing') < 0 && srctmp == tagtmp) {
							//取值赋给目标数据对象
							tagRecord.set(tagFieldName, self.getValue(srcRecords, srcFieldName));
						}
					}
				}
			}

			//如果定义了来源字段名与目标字段名根据对应关系赋值
			if (sourceField != null && sourceField.length > 0) {
				//分解来源字段名与目标字段名
				var srcFields = sourceField.split(";");
				var tagFields = targetField.split(";");
				//第一个字段名必需带表名
				var srcTableName = srcFields[0].split(".")[0];
				var tagTableName = tagFields[0].split(".")[0];

				//根据每个字段，取来源数据写入目标数据对象中
				for (var i = 0; i < srcFields.length; i++) {
					if (srcFields[i].length == 0 || 
						tagFields[i] == null || tagFields[i].length == 0) continue;
					//构建来源数据字段名
					var srcTmps = srcFields[i].split(".");
					if(srcTmps.length > 1){
						srcFieldName = srcTmps[0] + '__' + srcTmps[1];
						srcTableName = srcTmps[0];
					}else{
						srcFieldName = srcTableName + "__" + srcFields[i];
					}

					//构建目标数据字段名
					var tagTmps = tagFields[i].split(".");
					if(tagTmps.length > 1){
						tagFieldName = tagTmps[0] + '__' + tagTmps[1];
						tagTableName = tagTmps[0];
					}else{
						if(tagFields[i].indexOf('__') > 0){
							tagFieldName = tagFields[i];
						} else {
							tagFieldName = tagTableName + "__" + tagFields[i];
						}
					}

					//取值赋给目标数据对象
					tagRecord.set(tagFieldName, self.getValue(srcRecords, srcFieldName));
				}
			}
		},
		
		//构建查询combosel控件
		//值必须是选择的，则会造成其它附带字段值没法清空
		initCombo: function(funId, combo, targetFlag, isAll) {
			var self = this;
			//继续添加初始参数
			combo.pageSize = 10;
			combo.minListWidth = 350;
			combo.typeAhead = false;
			combo.minChars = 0;
			combo.itemSelector = 'div.search-item';
			combo.queryParam = 'where_value';//后台查询值的参数名
			combo.loadingText = '正在查询...';
			combo.listEmptyText = '没有找到数据...';
			//当数据比较多时，会造成不能选择值，值比较少的控件适合用这种方式
			combo.isAll = combo.isAll || isAll || (Jxstar.systemVar.edit__combo__all == '1');
			
			var colCode = combo.getName();
			//从后台取设计信息，构建控件元素
			//{selcfg:{},fields:[{name:'funall_default__func_name'},{}...],design:[{n:funall_default__func_name,w:165,h:false},{}...]}
			//selcfg:{nodeId:'sys_dept', sourceField:'sys_dept.dept_name;dept_id', targetField:'mat_app.dept_name;sys_user.dept_id', 
			//whereSql:"", whereValue:'', whereType:'', isSame:'0', queryField:'', likeType:''};
			var endcall = function(data) {
				//查询数据的功能ID
				var config = data.selcfg;
				if (!config || !data.fields) {//'智能选择字段【{0}】定义信息为空！'
					JxHint.alert(String.format(jx.star.selnot, colCode));
					return;
				}
				
				var qryFunId = config.nodeId;
				var qf = config.queryField||'', sf = config.sourceField||'';
				if (qf.length == 0 && sf.length == 0) {//'智能选择字段【{0}】扩展信息中必须定义来源字段或者查询字段！'
					JxHint.alert(String.format(jx.star.selsrc, colCode));
					return;
				}
				//要支持可以查询多个字段的值
				var qryParam = self.comboWhere(config);
				
				var e = encodeURIComponent;
				var url = Jxstar.path + '/commonAction.do?eventcode=query_data&funid=queryevent&pagetype=grid';
					url += '&query_funid='+ qryFunId +'&where_sql='+ e(qryParam.where_sql) +'&where_type='+ 
						   qryParam.where_type +'&user_id='+Jxstar.session['user_id'];
				
				//创建数据对象
				var store = new Ext.data.Store({
					proxy: new Ext.data.HttpProxy({
						method: 'POST',
						url: url
					}),
					reader: new Ext.data.JsonReader({
						root: 'data.root',
						totalProperty: 'data.total'
					}, data.fields)
				});
				combo.store = store;
				
				//把日期字段提出来，处理日期字段显示格式
				var dfs = {}, dfn = 0;
				Ext.each(data.fields, function(item) {
					if (item.type == 'date') {
						dfn++;
						dfs[item.name] = item;
					}
				});
				
				//计算合计表格宽度，构建字段
				var ds = data.design, tw = 0, xt = [], j = 0;
				Ext.each(ds, function(item) {
					if (!item.h) {
						tw += item.w;
						//符合条件的是日期字段
						if (dfn > 0 && dfs[item.n]) {
							var f = dfs[item.n].dateFormat;
							xt[j++] = '<td style="width:'+ item.w +'px;">{[values.'+ item.n +' ? values.'+ item.n +'.format("'+ f +'") : ""]}</td>';
						} else {
							xt[j++] = '<td style="width:'+ item.w +'px;">{'+ item.n +'}</td>';
						}
					}
				});
				
				//根据查询功能的Grid设计文件解析出来
				var tpl = new Ext.XTemplate(
					'<tpl for="."><div class="search-item" style="width:'+ tw +'px;border-bottom:1px dotted #a3bae9;">',
						'<table border=0 style="width:100%;font-size:13px;"><tr>',
						xt.join(''),
						'</tr></table>',
					'</div></tpl>');
				combo.tpl = tpl;
				
				//都采用类似查询
				combo.on('beforequery', function(qe){
					var cb = qe.combo;
					var isAll = cb.isAll;//是否显示所有数据
					var lt = config.likeType;//匹配模式：all, left
					var qv = '', ov = '';
					//一个值可以查询多个字段
					for (var i = 0; i < qryParam.plen; i++) {
						ov = isAll ? '%;' : (((lt == 'left') ? '':'%') + qe.query + '%;');
						qv += ov;
					}
					
					//在查询的时候，解析选择窗口中的[table.field];{table.field}参数
					qryParam.where_value = self.parseWhereValue(config.whereValue, cb, targetFlag);
					
					//组合查询值
					var pv = qryParam.where_value;
					if (qv.length > 0) {
						qv = qv.substr(0, qv.length-1);
						
						if (pv && pv.length > 0) {
							qv = pv + ';' + qv;
						}
					} else {
						qv = pv;
					}
					qe.query = qv;
				});
				
				//智能选择控件赋值
				var setData = function(cb, record, isend) {
					//取选择字段的容器对象，根据它判断是在grid控件中还是在查询控件中
					var fieldCt = cb.ownerCt;
					//查询值或统计参数值的输入控件赋值
					if (fieldCt && fieldCt.initialConfig.name && fieldCt.initialConfig.name.indexOf('_qv') > 0) {
						self.setControlData([record], cb, config.sourceField, config.targetField);
					} else {
						//取目标grid或form，根据ID查找
						var tagRecord = self.selectTagRecord(cb, targetFlag);
						//给目标表赋值
						self.setSelectData([record], tagRecord, config.isSame, config.sourceField, config.targetField);
						
						//如果是EditGrid，则需给combo赋值
						if (targetFlag.indexOf('grid') >= 0) {
							cb.setValue(tagRecord.get(cb.getName()));
							//触发编辑后事件
							if (isend) self.fireAfterEdit(cb, tagRecord, config);
						}
					}
				};
				
				//选择记录赋值到表单中，记录当前选择的值
				combo.on('select', function(cb, record, index){
					setData(cb, record);
					cb.selValue = cb.getValue();
				});
				//当没有选择时，记录原值
				combo.on('focus', function(cb){
					cb.selValue = cb.getValue();
				});
				
				//如果不是只读，则清空选择值，然后保留输入值
				var readonly = config.isReadonly;
				//如果值为空或不是选择的值，则清空记录
				combo.on('blur', function(cb){
					if (targetFlag.indexOf('form') >= 0) {
						var value = cb.getValue();
						if (value.length == 0 || (cb.selValue && cb.selValue != value)) {
							var record = JxUtil.emptyRecord(store);
							setData(cb, record);
						}
						if (readonly == '0') {
							cb.setValue(value);
						}
					}
				});
				
				//处理EditGrid中，编辑完成时的数据校验
				if (targetFlag.indexOf('grid') >= 0) {
					var editor = combo.gridEditor;
					if (editor) {
						//如果是必填字段，清空值时不会执行此事件
						editor.on('complete', function(ed, value, start){
							//如果原值与新值都为空，则不处理
							if (Ext.isEmpty(value) && Ext.isEmpty(start)) return;
							//如果值为空或不是选择的值，则清空记录
							var incb = ed.field;
							if (value.length == 0 || (value != start && value != incb.selValue)) {
								var record = JxUtil.emptyRecord(store);
								setData(incb, record, true);
							}
							if (readonly == '0') {
								ed.setValue(value);
							}
						});
					}
				}
				
				//EditGrid中，显示combo时会执行initList，所以需要重新绑定
				if (combo.list) {
					combo.view.tpl = combo.tpl;
					//选false，重新绑定store，否则分页栏无效
					combo.bindStore(store, false);
				}
			};
			
			//从后台取设计信息
			var params = 'funid=queryevent&selfunid='+ funId;
			params += '&colcode='+ colCode.replace('__', '.') +'&pagetype=grid&eventcode=query_selctl';
			Request.dataRequest(params, endcall);
		},
		
		//private 支持取多条记录中某个字段的值
		getValue: function(records, field) {
			var isMore = (records.length > 1);
			if (isMore) {
				var value = '';
				for (var i = 0, n = records.length; i < n; i++) {
					value += records[i].get(field) + ';';
				}
				return value;
			} else {
				var value = records[0].get(field);
				if (value == null) {
					var tmps = field.split("__");
					//如果设置的值为[val]格式，表示此值是常量值
					if (tmps.length > 1 && tmps[1].length > 0) {
						var name = tmps[1];
						if (name.charAt(0) == '[' && name.charAt(name.length-1) == ']') {
							value = name.substring(1, name.length-1);
						}
					}
				}
				return value;
			}
		},
		
		//private 构建智能查询的whereSql
		comboWhere: function(config) {
			var whereSql = config.whereSql;
			var whereValue = config.whereValue;
			var whereType = config.whereType;
			
			//解析查询字段的where
			var qf = config.queryField, len = 0;
			if (qf && qf.length > 0) {
				var fs = qf.split(';'), where = '', type = '';
				for (var i = 0; i < fs.length; i++) {
					if (fs[i].length > 0) {
						where += fs[i] + ' like ? or ';
						type += 'string;';
						len++;
					}
				}
				
				if (where.length > 0) {
					if (whereSql.length > 0) whereSql = '(' + whereSql + ') and '
					if (whereType.length > 0) whereType = whereType + ';';
					
					whereSql += '(' + where.substr(0, where.length - 4) + ')';
					whereType += type.substr(0, type.length - 1);
				}
			} else {
				//如果没有设置查询字段，则取来源字段的第一个字段
				var sf = config.sourceField;
				if (sf && sf.length > 0) {
					qf = sf.split(';')[0];
					if (qf.length > 0) {
						if (whereSql.length > 0) whereSql = '(' + whereSql + ') and ';
						whereSql = whereSql + qf + ' like ?';
						
						if (whereType.length > 0) whereType = whereType + ';';
						whereType = whereType + 'string';
						
						len = 1;
					}
				}
			}
			
			//传递plen，查询字段个数，用于构建whereValue
			return {where_sql:whereSql, where_value:whereValue, where_type:whereType, plen:len};
		},
		
		/**
		* 创建选择树形数据的窗口对象；要求来源字段必须填写。
		* 
		* config: 选择数据的配置，参数有：						
			pageType: 'checktree',
			nodeId: 'jz_type_v',
			isSame: '0',	//是否同名赋值
			sourceField: 'jz_type.type_name;type_id',
			targetField: 'jz_list.type_name;type_id',
			whereSql: '',
			whereValue: '',
			whereType: '',
			isMoreSelect: '0'
		* menuDiv: 右键菜单显示块
		* targetFlag: 目标对象类别标识，可能是node_funid_editgrid或node_funid_form
		*/
		createCheckTree: function(config, menuDiv, targetFlag) {
			//处理多语言选择窗口配置信息
			JxLang.langSelectConfig(config);
			
			var self = this;
			var nodeId = config.nodeId;
			var parentField = menuDiv.parentField;
			var ismore = config.isMoreSelect||'0';//是否可以多选
			var srcField = config.sourceField;
			
			//功能对象信息
			var define = Jxstar.findNode(nodeId);
			if (define == null) {
				JxHint.alert(String.format(jx.star.nopage, nodeId));	//没有定义【{0}】功能页面信息！
				return;
			}
			if (srcField.length == 0) {
				JxHint.alert('必须有来源字段定义！');
				return;
			};
			
			menuDiv.on('destroy', function(){
				config = null;
				targetFlag = null;
			});
			
			var getRecord = function(node, srcField) {
				var data = {};
				var attr = node.attributes;
				var fields = srcField.split(';');
				var table = fields[0].split('.')[0];
				for (var i = 0; i < fields.length; i++) {
					if (fields[i].length == 0) continue;
					
					var fs = fields[i].split('.');
					if (fs.length == 1) {
						data[table+'__'+fs] = attr[fs];
					} else {
						var fn = fields[i].replace('.', '__');
						data[fn] = attr[fs[1]];
					}
				}
				return new Ext.data.Record(data);
			};
			
			//添加选择数据的方法
			var seltree = function(flag) {
				//rowclick事件会执行两次，用下面的方法判断不重复执行
				if (!menuDiv.isVisible()) return false;
				
				//取选择的来源记录数据
				var srcRecords = [];
				if (ismore == '1') {//多选
					var selNodes = tree.getChecked(), first, other;
					Ext.each(selNodes, function(node){
						if (!first) {
							first = getRecord(node, srcField);
						} else {
							other = getRecord(node, srcField);
							Ext.iterate(first.data, function(key, value){
								first.data[key] += ';'+other.data[key];
							});
						}
					});
					if (first) srcRecords[0] = first;
				} else {
					var node = tree.getSelectionModel().getSelectedNode();
					if (node) srcRecords[0] = getRecord(node, srcField);
				}
				
				//清除选择的记录
				if (flag == '0') {
					var data = {};
					var fields = srcField.split(';');
					var table = fields[0].split('.')[0];
					for (var i = 0; i < fields.length; i++) {
						if (fields[i].length == 0) continue;
						
						var fs = fields[i].split('.');
						if (fs.length == 1) {
							data[table+'__'+fs] = '';
						} else {
							var fn = fields[i].replace('.', '__');
							data[fn] = '';
						}
					}
					srcRecords[0] = new Ext.data.Record(data);
				} else {
					if (srcRecords == null || srcRecords.length == 0) {
						JxHint.alert('没有选择记录！');
						return;
					}
				}
					
				//取选择字段的容器对象，根据它判断是在grid控件中还是在查询控件中
				var fieldCt = parentField.ownerCt;
				//查询值或统计参数值的输入控件赋值
				if (fieldCt && fieldCt.initialConfig.name && fieldCt.initialConfig.name.indexOf('_qv') > 0) {
					self.setControlData(srcRecords, parentField, config.sourceField, config.targetField);
				} else {
					//取目标grid或form，根据ID查找
					var tagRecord = self.selectTagRecord(parentField, targetFlag);
					//给目标表赋值
					self.setSelectData(srcRecords, tagRecord, config.isSame, config.sourceField, config.targetField);
				}
				//隐藏选择的窗口
				menuDiv.hide();
				
				var msg = '', selNodes = tree.getChecked();
				Ext.each(selNodes, function(node){
					if(msg.length > 0){
						msg += ', ';
					}
					msg += node.text;
				});
			};
			
			//查询数据URL
			var dataUrl = Jxstar.path + '/commonAction.do?eventcode=query_tree&funid=queryevent&add_grid=1';//把树形数据字段都加上，方便解析
				dataUrl += '&add_check='+ismore;
				dataUrl += '&tree_funid='+define.nodeid+'&user_id='+Jxstar.session['user_id'];
			//解析查询参数值中的[]字段变量，如果在查询栏中使用，则会选择不到值
			var whereValue = config.whereValue;
			//解析选择窗口中的[table.field];{table.field}参数
			whereValue = self.parseWhereValue(whereValue, parentField, targetFlag);
			//显示表格对象后再加载数据才稳定
			var e = encodeURIComponent;
				dataUrl += '&where_sql='+ config.whereSql +'&where_value='+ e(whereValue) +'&where_type='+ config.whereType;
				
			var tbar = new Ext.Toolbar({items:[
				{iconCls:'eb_select', text:'选择', handler:function(){seltree();}},
				{iconCls:'eb_clear', text:'清除', handler:function(){seltree('0');}},
				{iconCls:'eb_refresh', text:'刷新', handler:function(){tree.getLoader().load(tree.getRootNode());}}
				]});
			var tree = new Ext.tree.TreePanel({
				tbar:tbar,
				border:false,
				height:295,

				autoScroll:true,
				rootVisible:false,
				lines:false,
				useArrows:false,
				
				loader: new Ext.tree.TreeLoader({
					dataUrl: dataUrl
				}),
				
				root: new Ext.tree.AsyncTreeNode({id:'10', iconCls:'tree_root_ext', text:'刷新'})
			});
			//双击后选择
			if (ismore != '1') {
				tree.on('dblclick', function(n){
					seltree();
				});
			}
			
			//把新页面添加到目标窗口中
			menuDiv.add(tree);
			//重新显示目标窗口
			menuDiv.doLayout();
		}
	});//Ext.apply

})();
