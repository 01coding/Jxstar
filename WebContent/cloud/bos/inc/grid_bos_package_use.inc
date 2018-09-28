config.eventcfg = {		
    dataImportParam: function() {
        var packId = this.grid.fkValue;

        var options = {
            whereSql: 'bos_tenant_id not in (select bos_tenant_id from bos_package_use where pack_id = ?)',
            whereValue: packId,
            whereType: 'string'
        };
        return options;
    }
}