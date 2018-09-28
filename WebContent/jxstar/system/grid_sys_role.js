Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datarbustype = Jxstar.findComboData('rbustype');
	var Dataroletype = Jxstar.findComboData('roletype');

	var cols = [
	{col:{header:'角色编号', width:136, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'sys_role__role_no',type:'string'}},
	{col:{header:'*角色名称', width:140, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'sys_role__role_name',type:'string'}},
	{col:{header:'角色描述', width:311, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:200
		})}, field:{name:'sys_role__role_memo',type:'string'}},
	{col:{header:'*模板名称', width:113, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TriggerField({
			maxLength:50,
			editable:false, allowBlank:false,
			triggerClass:'x-form-search-trigger', 
			onTriggerClick: function() {
				if (this.menu == null) {
					var selcfg = {"pageType":"combogrid", "nodeId":"plet_templet", "layoutPage":"", "sourceField":"plet_templet.templet_name;templet_id", "targetField":"sys_role.templet_name;templet_id", "whereSql":"", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"","fieldName":"sys_role.templet_name"};
					this.menu = Jxstar.createComboMenu(this);
					JxSelect.createComboGrid(selcfg, this.menu, 'node_sys_role_editgrid');
				}
				this.menu.show(this.el);
			}
		})}, field:{name:'sys_role__templet_name',type:'string'}},
	{col:{header:'所属单位', width:114, sortable:true, defaultval:'fun_getOrgName()', editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TriggerField({
			maxLength:50,
			editable:false,
			triggerClass:'x-form-search-trigger', 
			onTriggerClick: function() {
				if (this.menu == null) {
					var selcfg = {"pageType":"combogrid", "nodeId":"sys_dept1", "layoutPage":"", "sourceField":"sys_dept.dept_name;dept_id", "targetField":"sys_role.dept_name;dept_id", "whereSql":"dept_level = '1'", "whereValue":"", "whereType":"", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"","fieldName":"sys_role.dept_name"};
					this.menu = Jxstar.createComboMenu(this);
					JxSelect.createComboGrid(selcfg, this.menu, 'node_sys_role_editgrid');
				}
				this.menu.show(this.el);
			}
		})}, field:{name:'sys_role__dept_name',type:'string'}},
	{col:{header:'角色ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_role__role_id',type:'string'}},
	{col:{header:'模板ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_role__templet_id',type:'string'}},
	{col:{header:'部门ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_role__dept_id',type:'string'}},
	{col:{header:'版本', width:100, sortable:true, hidden:true, align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datarbustype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datarbustype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datarbustype.length; i++) {
				if (Datarbustype[i][0] == value)
					return Datarbustype[i][1];
			}
		}}, field:{name:'sys_role__bus_type',type:'string'}},
	{col:{header:'类型', width:100, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataroletype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataroletype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataroletype.length; i++) {
				if (Dataroletype[i][0] == value)
					return Dataroletype[i][1];
			}
		}}, field:{name:'sys_role__role_type',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'sys_role'
	};
	
	
	config.eventcfg = {				setFun: function() {			var records = this.grid.getSelectionModel().getSelections();			if (!JxUtil.selectone(records)) return;						var role_id = records[0].get('sys_role__role_id');			//过滤条件			var where_sql = 'plet_fun.role_id = ?';			var where_type = 'string';			var where_value = role_id;						//显示数据			var hdcall = function(grid) {				JxUtil.delay(500, function(){					//处理树形页面的情况					if (!grid.isXType('grid')) {						grid = grid.getComponent(1).getComponent(0);					}					//设置外键值					grid.fkFunId = 'sys_role';					grid.fkValue = where_value;					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});				});			};					var define = Jxstar.findNode('plet_fun');			//显示数据			Jxstar.showData({				filename: define.gridpage,				title: define.nodetitle, 				pagetype: 'editgrid',				nodedefine: define,				callback: hdcall			});		}			};
		
	return new Jxstar.GridNode(config);
}