Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'功能名称', width:162, sortable:true}, field:{name:'fun_base__fun_name',type:'string'}},
	{col:{header:'编辑权限', width:75, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'sys_role_fun__is_edit',type:'string'}},
	{col:{header:'打印权限', width:69, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'sys_role_fun__is_print',type:'string'}},
	{col:{header:'审批权限', width:75, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'sys_role_fun__is_audit',type:'string'}},
	{col:{header:'设置ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_role_fun__role_fun_id',type:'string'}},
	{col:{header:'角色ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_role_fun__role_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_role_fun__fun_id',type:'string'}},
	{col:{header:'其它权限', width:74, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'sys_role_fun__is_other',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '0',
		funid: 'sys_role_fun'
	};
	
	
	config.eventcfg = {		
		dataImportParam: function() {
			var roleId = this.grid.fkValue;			var options = {				whereSql: 'fun_id not in (select fun_id from sys_role_fun where role_id = ?)',				whereValue: roleId,				whereType: 'string'			};			return options;		},				clearSql: function(selfunid) {			var params = 'selfunid=' + selfunid + '&funid=sys_role_fun';			params += '&pagetype=grid&eventcode=clearsql';			//发送请求，清除数据权限SQL缓存			Request.postRequest(params, null);		},

		setData: function(){
			var records = this.grid.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;
			var pkcol = this.define.pkcol;			var selfunid = records[0].get(pkcol);						//过滤条件			var where_sql = 'sys_role_data.role_fun_id = ?';			var where_type = 'string';			var where_value = selfunid;						//加载数据			var hdcall = function(grid) {				//显示数据				JxUtil.delay(500, function(){					//设置外键值					grid.fkValue = where_value;					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});				});			};			var srcDefine = Jxstar.findNode('sys_role_data');			//显示数据			Jxstar.showData({				filename: srcDefine.gridpage,				title: srcDefine.nodetitle, 				pagetype: 'subgrid',				nodedefine: srcDefine,				callback: hdcall			});						//清除数据权限SQL缓存			this.clearSql(selfunid);
		},				hideCol: function(){			var records = this.grid.getSelectionModel().getSelections();			if (!JxUtil.selectone(records)) return;			var pkcol = this.define.pkcol;			var roleFunId = records[0].get(pkcol);			var funId = records[0].get('sys_role_fun__fun_id');						//过滤条件			var where_sql = 'sys_role_field.role_fun_id = ?';			var where_type = 'string';			var where_value = roleFunId;						//加载数据			var hdcall = function(grid) {				//显示数据				JxUtil.delay(500, function(){					//设置外键值					grid.fkValue = roleFunId;					grid.selFunId = funId;					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});				});			};			var srcDefine = Jxstar.findNode('sys_role_field');			//显示数据			Jxstar.showData({				filename: srcDefine.gridpage,				title: srcDefine.nodetitle, 				pagetype: 'subgrid',				nodedefine: srcDefine,				callback: hdcall			});		},				setOtherEvent: function(){			var records = this.grid.getSelectionModel().getSelections();			if (!JxUtil.selectone(records)) return;			var pkcol = this.define.pkcol;			var selfunid = records[0].get(pkcol);						//过滤条件			var where_sql = 'sys_role_event.role_fun_id = ?';			var where_type = 'string';			var where_value = selfunid;						//加载数据			var hdcall = function(grid) {				//显示数据				JxUtil.delay(500, function(){					//设置外键值					grid.fkValue = where_value;					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});				});			};			var srcDefine = Jxstar.findNode('sys_role_event');			//显示数据			Jxstar.showData({				filename: srcDefine.gridpage,				title: srcDefine.nodetitle, 				pagetype: 'subgrid',				nodedefine: srcDefine,				callback: hdcall			});		},				addDataType: function(pageType){			var title = jx.sys.moreadd;	//'批量添加'			if (pageType == 'deltype') title = jx.sys.moredel;	//'批量删除'						var records = this.grid.getSelectionModel().getSelections();			if (!JxUtil.selected(records)) return;			var selfunid = '';			var pkcol = this.define.pkcol;			if (records.length > 0) {				for (var i = 0, n = records.length; i < n; i++) {					selfunid += records[i].get(pkcol) + ',';				}				selfunid =selfunid.substring(0, selfunid.length - 1);			}						//加载数据			var hdcall = function(grid) {				//显示数据				JxUtil.delay(500, function(){					//设置外键值					grid.fkValue = selfunid;					Jxstar.loadData(grid, {where_sql:'', where_value:'', where_type:''});				});			};			//显示数据			Jxstar.showData({				filename: '/jxstar/system/grid_sys_datatype.js',				title: title+jx.sys.dataright,	//'数据权限'				pagetype: pageType,				nodedefine: Jxstar.findNode('sys_datatype'),				callback: hdcall			});						//清除数据权限SQL缓存			this.clearSql(selfunid);		},				/**		* 设置指定列所有记录的值		* type -- 列名		* value -- 列的值		**/		setColValue: function(type, value) {			var fieldName = 'sys_role_fun__is_'+type;						var store = this.grid.getStore();			for (var i = 0, n = store.getCount(); i < n; i++) {				var record = store.getAt(i);								record.set(fieldName, value);			}		}		
	};
		
	return new Jxstar.GridNode(config);
}