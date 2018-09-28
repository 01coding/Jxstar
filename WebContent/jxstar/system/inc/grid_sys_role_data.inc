	config.eventcfg = {		
		dataImportParam: function() {
			var roleId = this.grid.fkValue;			var options = {				whereSql: 'dtype_id not in (select dtype_id from sys_role_data where role_fun_id = ?)',				whereValue: roleId,				whereType: 'string'			};			return options;		}		
	};