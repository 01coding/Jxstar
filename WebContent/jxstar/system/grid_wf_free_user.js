Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'序号', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:5
		})}, field:{name:'wf_free_user__free_index',type:'string'}},
	{col:{header:'编号', width:100, sortable:true}, field:{name:'wf_free_user__user_code',type:'string'}},
	{col:{header:'姓名', width:100, sortable:true}, field:{name:'wf_free_user__user_name',type:'string'}},
	{col:{header:'部门', width:150, sortable:true}, field:{name:'wf_free_user__dept_name',type:'string'}},
	{col:{header:'用户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_free_user__user_id',type:'string'}},
	{col:{header:'部门ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_free_user__dept_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_free_user__free_id',type:'string'}},
	{col:{header:'数据ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_free_user__data_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_free_user__fun_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'wf_free_user'
	};
	
	
	config.eventcfg = {
		dataImportParam: function(){
			var pfunid = this.grid.gridNode.parentNodeId;
            return {extendParam:'extparam_pfunid='+pfunid};
		}
        
    };
		
	return new Jxstar.GridNode(config);
}