Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datapletcolno = Jxstar.findComboData('pletcolno');
	var Datapletcolnum = Jxstar.findComboData('pletcolnum');

	var cols = [
	{col:{header:'*显示名称', width:168, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'plet_portlet__portlet_title',type:'string'}},
	{col:{header:'显示序号', width:94, sortable:true, hidden:true, defaultval:'10', align:'right',renderer:JxUtil.formatInt()}, field:{name:'plet_portlet__portlet_no',type:'int'}},
	{col:{header:'所属列', width:79, sortable:true, hidden:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datapletcolno
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datapletcolno[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datapletcolno.length; i++) {
				if (Datapletcolno[i][0] == value)
					return Datapletcolno[i][1];
			}
		}}, field:{name:'plet_portlet__col_no',type:'string'}},
	{col:{header:'折叠?', width:58, sortable:true, hidden:true, defaultval:'0'}, field:{name:'plet_portlet__collapse',type:'string'}},
	{col:{header:'栏目名称', width:100, sortable:true}, field:{name:'plet_portlet__type_name',type:'string'}},
	{col:{header:'模板ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'plet_portlet__templet_id',type:'string'}},
	{col:{header:'栏目ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'plet_portlet__type_id',type:'string'}},
	{col:{header:'内容ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'plet_portlet__portlet_id',type:'string'}},
	{col:{header:'栏目代号', width:100, sortable:true}, field:{name:'plet_portlet__type_code',type:'string'}},
	{col:{header:'对象名称', width:161, sortable:true}, field:{name:'plet_portlet__object_name',type:'string'}},
	{col:{header:'参数值', width:126, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:25
		})}, field:{name:'plet_portlet__object_id',type:'string'}},
	{col:{header:'显示列数', width:100, sortable:true, hidden:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datapletcolnum
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datapletcolnum[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datapletcolnum.length; i++) {
				if (Datapletcolnum[i][0] == value)
					return Datapletcolnum[i][1];
			}
		}}, field:{name:'plet_portlet__col_num',type:'string'}},
	{col:{header:'图标CSS', width:128, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'plet_portlet__iconcls',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'plet_portlet'
	};
	
	
	config.eventcfg = {				setFun: function() {			var records = this.grid.getSelectionModel().getSelections();			if (!JxUtil.selectone(records)) return;						var typecode = records[0].get('plet_portlet__type_code');			if (typecode != 'portlet_fun' && typecode != 'portlet_icon') {				JxHint.alert(jx.sys.funlink);	//'只有常用功能栏目才需要设置！'				return;			}			//过滤条件			var where_sql = 'plet_fun.portlet_id = ?';			var where_type = 'string';			var where_value = records[0].get('plet_portlet__portlet_id');						//显示数据			var hdcall = function(grid) {				JxUtil.delay(500, function(){					//处理树形页面的情况					if (!grid.isXType('grid')) {						grid = grid.getComponent(1).getComponent(0);					}					//设置外键值					grid.fkFunId = 'plet_portlet';					grid.fkValue = where_value;					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});				});			};					var define = Jxstar.findNode('plet_fun');			//显示数据			Jxstar.showData({				filename: define.gridpage,				title: define.nodetitle, 				pagetype: 'editgrid',				nodedefine: define,				callback: hdcall			});		}			};
		
	return new Jxstar.GridNode(config);
}