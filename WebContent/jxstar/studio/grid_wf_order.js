Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataregstatus = Jxstar.findComboData('regstatus');

	var cols = [
	{col:{header:'序号', width:59, sortable:true}, field:{name:'wf_order__order_no',type:'string'}},
	{col:{header:'功能ID', width:175, sortable:true}, field:{name:'wf_order__fun_id',type:'string'}},
	{col:{header:'审批标题', width:182, sortable:true}, field:{name:'wf_order__fun_name',type:'string'}},
	{col:{header:'审批单ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_order__order_id',type:'string'}},
	{col:{header:'状态', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataregstatus
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataregstatus[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataregstatus.length; i++) {
				if (Dataregstatus[i][0] == value)
					return Dataregstatus[i][1];
			}
		}}, field:{name:'wf_order__order_audit',type:'string'}},
	{col:{header:'外部系统代号', width:100, sortable:true}, field:{name:'wf_order__sys_code',type:'string'}},
	{col:{header:'外部系统名称', width:162, sortable:true}, field:{name:'wf_order__sys_name',type:'string'}},
	{col:{header:'扩展脚本', width:100, sortable:true, hidden:true}, field:{name:'wf_order__order_inc',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'wf_order'
	};
	
	
	config.initpage = function(gridNode){		var event = gridNode.event;		var grid = gridNode.page;					};		config.eventcfg = {				//设置字段		setField : function(){			var records = this.grid.getSelectionModel().getSelections();			if (!JxUtil.selectone(records)) return;						var self = this;			var dataId = records[0].get('wf_order__order_id');			var funId = records[0].get('wf_order__fun_id');				//过滤条件			var where_sql = 'wf_order_field.order_id = ?';			var where_type = 'string';			var where_value = dataId;						//加载数据			var hdcall = function(grid) {				//显示数据				JxUtil.delay(500, function(){					//设置外键值与父功能ID					grid.fkName = 'wf_order_field__order_id';					grid.fkValue = dataId;					grid.parentNodeId = self.define.nodeid;					grid.orderFunId = funId;					//删除GRID的自定义参数					grid.on('beforedestroy', function(gp){						gp.fkName = null;			delete gp.fkName;						gp.fkValue = null;			delete gp.fkValue;						gp.parentNodeId = null;		delete gp.parentNodeId;						gp.orderFunId = null;						gp = null;						return true;					});									if (grid.isShow == '1') {						//初始化显示						Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});					} else {						//不做缺省查询，但也要保留选择的where条件，在查询中能带上这个查询条件						grid.jxstarParam.old_wsql = where_sql||'';						grid.jxstarParam.old_wtype = where_value||'';						grid.jxstarParam.old_wvalue = where_type||'';					}				});			};			//显示数据			var define = Jxstar.findNode('wf_order_field');			Jxstar.showData({				filename: define.gridpage,				title: define.nodetitle,				pagetype: 'grid',				nodedefine: define,				callback: hdcall			});					}			};
		
	return new Jxstar.GridNode(config);
}