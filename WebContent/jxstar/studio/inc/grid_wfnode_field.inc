
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