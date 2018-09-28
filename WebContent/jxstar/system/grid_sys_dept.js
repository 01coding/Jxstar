Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*部门编码', width:144, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'sys_dept__dept_code',type:'string'}},
	{col:{header:'*部门名称', width:182, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:100, allowBlank:false
		})}, field:{name:'sys_dept__dept_name',type:'string'}},
	{col:{header:'备注', width:184, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:200
		})}, field:{name:'sys_dept__memo',type:'string'}},
	{col:{header:'是否注销', width:67, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'sys_dept__is_novalid',type:'string'}},
	{col:{header:'部门ID', width:157, sortable:true, colindex:10000}, field:{name:'sys_dept__dept_id',type:'string'}},
	{col:{header:'部门级别', width:100, sortable:true, colindex:10000, hidden:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'sys_dept__dept_level',type:'int'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'sys_dept'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}