Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'审批节点', width:222, sortable:true}, field:{name:'wf_free_user__node_title',type:'string'}},
	{col:{header:'*用户账号', width:129, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.ComboBox({
			maxLength:20, name:'wf_free_user__user_code', 
			editable:true, hcss:'color:#0077FF;', allowBlank:false,
			triggerClass:'x-form-search-trigger', 
			listeners:{afterrender: function(combo) {
				JxSelect.initCombo('wf_dyn_user', combo, 'node_wf_dyn_user_editgrid');
			}}
		})}, field:{name:'wf_free_user__user_code',type:'string'}},
	{col:{header:'分配用户', width:121, sortable:true}, field:{name:'wf_free_user__user_name',type:'string'}},
	{col:{header:'所属部门', width:225, sortable:true}, field:{name:'wf_free_user__dept_name',type:'string'}},
	{col:{header:'数据ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_free_user__data_id',type:'string'}},
	{col:{header:'用户ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_free_user__user_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_free_user__fun_id',type:'string'}},
	{col:{header:'部门ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_free_user__dept_id',type:'string'}},
	{col:{header:'节点ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_free_user__node_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_free_user__free_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'wf_dyn_user'
	};
	
	
	config.initpage = function(gridNode){
	var event = gridNode.event;
	
	var grid = gridNode.page;
    //因为需要使用复制功能，所以where中不能用[parent_funid]
    grid.subWhereSql = function(){
        return "fun_id = '"+ gridNode.parentNodeId +"' and data_id = ?";
    };

};

config.eventcfg = {

	//重新分配
	newNode: function(){
		var self = this;
		var hdcall = function(){
			
			//取选择记录的主键值
			var params = 'funid='+ self.grid.gridNode.nodeId;
			
			params += '&pkeyid=' + self.grid.fkValue +'&pfunid='+self.grid.gridNode.parentNodeId;
			

			//设置请求的参数
			params += '&pagetype=grid&eventcode=newnode';

			//执行处理的内容
			var endcall = function(data) {
				//重新加载数据
				self.grid.getStore().reload();
			};
			//发送请求
			Request.postRequest(params, endcall);
		};
		//确定执行当前操作吗？
		Ext.Msg.confirm(jx.base.hint, '重新分配将删除当前的分配人？', function(btn) {
			if (btn == 'yes') hdcall();
		});
	}
};
		
	return new Jxstar.GridNode(config);
}