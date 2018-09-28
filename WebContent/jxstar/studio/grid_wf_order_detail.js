Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*序号', width:55, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:10, allowBlank:false
		})}, field:{name:'wf_order_detail__fun_no',type:'string'}},
	{col:{header:'*功能ID', width:164, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:25, allowBlank:false
		})}, field:{name:'wf_order_detail__fun_id',type:'string'}},
	{col:{header:'*信息标题', width:136, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'wf_order_detail__fun_name',type:'string'}},
	{col:{header:'列1标题', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'wf_order_detail__col1_title',type:'string'}},
	{col:{header:'列1宽度%', width:75, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:10
		})}, field:{name:'wf_order_detail__col1_width',type:'string'}},
	{col:{header:'列2标题', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'wf_order_detail__col2_title',type:'string'}},
	{col:{header:'列2宽度%', width:73, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:10
		})}, field:{name:'wf_order_detail__col2_width',type:'string'}},
	{col:{header:'列3标题', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'wf_order_detail__col3_title',type:'string'}},
	{col:{header:'列3宽度%', width:69, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:10
		})}, field:{name:'wf_order_detail__col3_width',type:'string'}},
	{col:{header:'审批单ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_order_detail__order_id',type:'string'}},
	{col:{header:'明细ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_order_detail__detail_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '1',
		funid: 'wf_order_detail'
	};
	
	
	config.initpage = function(gridNode){		var event = gridNode.event;		var grid = gridNode.page;					};		config.eventcfg = {				//设置字段		setField : function(){			var selm = this.grid.getSelectionModel();			var records = selm.getSelections();			if (records.length == 0) {				selm.selectFirstRow();				records = selm.getSelections();				if (!JxUtil.selectone(records)) return;			}						var self = this;			var dataId = records[0].get('wf_order_detail__detail_id');			var funId = records[0].get('wf_order_detail__fun_id');				//过滤条件			var where_sql = 'wf_order_detcol.detail_id = ?';			var where_type = 'string';			var where_value = dataId;						//加载数据			var hdcall = function(grid) {				//显示数据				JxUtil.delay(500, function(){					//设置外键值与父功能ID					grid.fkName = 'wf_order_detcol__detail_id';					grid.fkValue = dataId;					grid.parentNodeId = self.define.nodeid;					grid.orderDetFunId = funId;					//删除GRID的自定义参数					grid.on('beforedestroy', function(gp){						gp.fkName = null;			delete gp.fkName;						gp.fkValue = null;			delete gp.fkValue;						gp.parentNodeId = null;		delete gp.parentNodeId;						gp.orderDetFunId = null;						gp = null;						return true;					});									if (grid.isShow == '1') {						//初始化显示						Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});					} else {						//不做缺省查询，但也要保留选择的where条件，在查询中能带上这个查询条件						grid.jxstarParam.old_wsql = where_sql||'';						grid.jxstarParam.old_wtype = where_value||'';						grid.jxstarParam.old_wvalue = where_type||'';					}				});			};			//显示数据			var define = Jxstar.findNode('wf_order_detcol');			Jxstar.showData({				filename: define.gridpage,				title: define.nodetitle,				pagetype: 'grid',				nodedefine: define,				callback: hdcall			});					}			};
		
	return new Jxstar.GridNode(config);
}