Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'功能代号', width:114, sortable:true}, field:{name:'app_role_fun__app_funcode',type:'string'}},
	{col:{header:'功能名称', width:100, sortable:true}, field:{name:'app_fun__fun_name',type:'string'}},
	{col:{header:'是否快捷', width:100, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'app_role_fun__is_fast',type:'string'}},
	{col:{header:'查询权限', width:100, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'app_role_fun__is_query',type:'string'}},
	{col:{header:'编辑权限', width:100, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'app_role_fun__is_edit',type:'string'}},
	{col:{header:'删除权限', width:100, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'app_role_fun__is_delete',type:'string'}},
	{col:{header:'其它权限', width:100, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'app_role_fun__is_other',type:'string'}},
	{col:{header:'设置ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_role_fun__role_funid',type:'string'}},
	{col:{header:'*功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_role_fun__app_funid',type:'string'}},
	{col:{header:'*角色ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'app_role_fun__role_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '0',
		funid: 'app_role_fun'
	};
	
	
	config.eventcfg = {		
    dataImportParam: function() {
        var roleId = this.grid.fkValue;

        var options = {
            whereSql: 'fun_state =? and not exists (select * from app_role_fun where app_fun.app_funid = app_role_fun.app_funid and app_role_fun.role_id = ?)',
            whereValue: '1;'+roleId,
            whereType: 'string;string'
        };
        return options;
    }
}
		
	return new Jxstar.GridNode(config);
}