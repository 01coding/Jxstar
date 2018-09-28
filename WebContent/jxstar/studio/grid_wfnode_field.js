Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datanodefield1 = Jxstar.findComboData('nodefield1');
	var Datanodefield2 = Jxstar.findComboData('nodefield2');

	var cols = [
	{col:{header:'字段代码', width:159, sortable:true}, field:{name:'wf_node_field__col_code',type:'string'}},
	{col:{header:'字段名称', width:170, sortable:true}, field:{name:'wf_node_field__col_name',type:'string'}},
	{col:{header:'*编辑类型', width:100, sortable:true, align:'center',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datanodefield1
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Datanodefield1[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datanodefield1.length; i++) {
				if (Datanodefield1[i][0] == value)
					return Datanodefield1[i][1];
			}
		}}, field:{name:'wf_node_field__edit_type',type:'string'}},
	{col:{header:'*显示类型', width:100, sortable:true, align:'center',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datanodefield2
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Datanodefield2[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datanodefield2.length; i++) {
				if (Datanodefield2[i][0] == value)
					return Datanodefield2[i][1];
			}
		}}, field:{name:'wf_node_field__show_type',type:'string'}},
	{col:{header:'节点ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_node_field__node_id',type:'string'}},
	{col:{header:'过程ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_node_field__process_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_node_field__wf_fieldid',type:'string'}},
	{col:{header:'节点主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_node_field__wfnode_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'wf_node_field'
	};
	
	
	config.eventcfg = {		
    dataImportParam: function() {
        var wf_funid = this.grid.wf_funid;
        var options = {
            whereSql: 'fun_col.fun_id = ?',
            whereValue: wf_funid,
            whereType: 'string'
        };
        return options;
    },
    
    //预览表单界面
    prview: function() {
        var tab = this.grid.findParentByType('tabpanel');
        var pform = tab.getComponent(0).getComponent(0).getForm();
        var wf_funid = pform.wf_funid;
        var node_id = pform.get('wf_nodeattr__node_id');
        var process_id = pform.get('wf_nodeattr__process_id');
        
        Jxstar.createNode(wf_funid, {isfast:true, nodeid:node_id, processid:process_id});
    }
};
		
	return new Jxstar.GridNode(config);
}