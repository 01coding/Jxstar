	
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
