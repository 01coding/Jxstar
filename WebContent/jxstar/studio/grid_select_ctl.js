Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'控件代号', width:128, sortable:true}, field:{name:'v_combo_control__control_code',type:'string'}},
	{col:{header:'控件名称', width:156, sortable:true}, field:{name:'v_combo_control__control_name',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '1',
		funid: 'sel_combo'
	};
	
	
	//添加自定义查询按钮	config.toolext = function(node, tbar, extItems){		//查询表信息		var query = function(value) {			var wheresql = '(control_code like ? or control_name like ?)';			var wheretype = 'string;string';			var wherevalue = '%'+ value +'%;%'+ value +'%';			Jxstar.loadData(node.page, {where_sql:wheresql, where_value:wherevalue, where_type:wheretype, is_query:1});		};			var field = new Ext.form.TextField({width:150});		field.on('specialkey', function(field, e){			if (e.getKey() == e.ENTER) {				query(field.getValue());			}		});				tbar.insert(1, field);		tbar.insert(2, {			iconCls:'eb_qry', 			tooltip:jx.fun.qrysel,	//'查询选择控件'			handler:function(){				query(field.getValue());			}		});		tbar.insert(3, {			iconCls:'eb_clear', 			tooltip:'清除',	//'清除'			handler:function(){				node.event.clearRecord();			}		});		tbar.insert(4, '-');	};
		
	return new Jxstar.GridNode(config);
}