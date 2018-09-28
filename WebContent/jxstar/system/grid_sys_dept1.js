Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'部门名称', width:182, sortable:true}, field:{name:'sys_dept__dept_name',type:'string'}},
	{col:{header:'部门编码', width:105, sortable:true}, field:{name:'sys_dept__dept_code',type:'string'}},
	{col:{header:'部门类别', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_dept__dept_type',type:'string'}},
	{col:{header:'备注', width:184, sortable:true}, field:{name:'sys_dept__memo',type:'string'}},
	{col:{header:'是否注销', width:67, sortable:true, hidden:true}, field:{name:'sys_dept__is_novalid',type:'string'}},
	{col:{header:'部门ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_dept__dept_id',type:'string'}},
	{col:{header:'部门级别', width:100, sortable:true, colindex:10000, hidden:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'sys_dept__dept_level',type:'int'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '1',
		funid: 'sys_dept1'
	};
	
	
	//添加自定义查询按钮	config.toolext = function(node, tbar, extItems){		//查询表信息		var query = function(value) {			var wheresql = '(dept_code like ? or dept_name like ?)';			var wheretype = 'string;string';			var wherevalue = '%'+ value +'%;%'+ value +'%';			Jxstar.loadData(node.page, {where_sql:wheresql, where_value:wherevalue, where_type:wheretype, is_query:1});		};			var field = new Ext.form.TextField({width:150});		field.on('specialkey', function(field, e){			if (e.getKey() == e.ENTER) {				query(field.getValue());			}		});				tbar.insert(1, field);		tbar.insert(2, {			iconCls:'eb_qry', 			tooltip:jx.fun.qrysel,	//'查询选择控件'			handler:function(){				query(field.getValue());			}		});		tbar.insert(3, {			iconCls:'eb_clear', 			tooltip:'清除',	//'清除'			handler:function(){				node.event.clearRecord();			}		});		tbar.insert(4, '-');	};
		
	return new Jxstar.GridNode(config);
}