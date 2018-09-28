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