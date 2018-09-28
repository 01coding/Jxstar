	config.eventcfg = {		
		dataImportParam: function() {
			var roleId = this.grid.fkValue;			var options = {				whereSql: 'user_id not in (select user_id from sys_user_role where role_id = ?)',				whereValue: roleId,				whereType: 'string'			};			return options;		}		
	};