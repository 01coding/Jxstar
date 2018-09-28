Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'功能标识', width:135, sortable:true}, field:{name:'bos_package_fun__fun_id',type:'string'}},
	{col:{header:'功能名称', width:229, sortable:true}, field:{name:'fun_base__fun_name',type:'string'}},
	{col:{header:'功能包ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_package_fun__pack_id',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_package_fun__pack_fun_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'bos_package_fun'
	};
	
	
	config.eventcfg = {		
    dataImportParam: function() {
        var packId = this.grid.fkValue;

        var options = {
            whereSql: 'fun_id not in (select fun_id from bos_package_fun where pack_id = ?)',
            whereValue: packId,
            whereType: 'string'
        };
        return options;
    }
}
		
	return new Jxstar.GridNode(config);
}