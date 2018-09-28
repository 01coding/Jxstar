Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'字段代码', width:202, sortable:true}, field:{name:'v_field_info__col_code',type:'string'}},
	{col:{header:'字段名称', width:153, sortable:true}, field:{name:'v_field_info__col_name',type:'string'}},
	{col:{header:'字段序号', width:69, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'v_field_info__col_index',type:'int'}},
	{col:{header:'数据类型', width:90, sortable:true, hidden:true}, field:{name:'v_field_info__data_type',type:'string'}},
	{col:{header:'控件类型', width:86, sortable:true, hidden:true}, field:{name:'v_field_info__col_control',type:'string'}},
	{col:{header:'数据样式', width:86, sortable:true, hidden:true}, field:{name:'v_field_info__format_id',type:'string'}},
	{col:{header:'表名', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'v_field_info__table_name',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '1',
		funid: 'sel_field'
	};
	
	
	//添加自定义查询按钮	config.toolext = function(node, tbar, extItems){		//查询表信息		var query = function(value) {			var wheresql = '(col_code like ? or col_name like ?)';			var wheretype = 'string;string';			var wherevalue = '%'+ value +'%;%'+ value +'%';			Jxstar.loadData(node.page, {where_sql:wheresql, where_value:wherevalue, where_type:wheretype, is_query:1});		};			var field = new Ext.form.TextField({width:150});		field.on('specialkey', function(field, e){			if (e.getKey() == e.ENTER) {				query(field.getValue());			}		});				tbar.insert(1, field);		tbar.insert(2, {			cls:'x-btn-xiao',			iconCls:'eb_qry', 			tooltip:jx.dm.qryf,	//'查询字段名'			handler:function(){				query(field.getValue());			}		});	};	config.initpage = function(gridNode){		var event = gridNode.event;		var grid = gridNode.page;				//retData的格式为：{srcFunId:'', destFunId:'', data:[{impKeyId:'', newKeyId:''}...]}		//定义功能设计器中的导入字段名后，如果不是当前表格的字段，则“更新”“编辑”都为否		event.on('afterimport', function(e, retData){			if (Ext.isEmpty(retData) || retData.data.length == 0) return;			if (retData.destFunId != 'sys_fun_col') return;						//构建新导入的字段记录ID			var newkeyid = '';			var data = retData.data;			for (var i = 0, n = data.length; i < n; i++) {				newkeyid += data[i].newKeyId + ';';			}			var params = 'funid=sel_field&newkeyid='+ newkeyid +'&pagetype=grid&eventcode=updatecol';			Request.postRequest(params, null);		});	};
		
	return new Jxstar.GridNode(config);
}