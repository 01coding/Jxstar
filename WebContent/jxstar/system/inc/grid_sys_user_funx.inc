	config.eventcfg = {		
		dataImportParam: function() {
			var userId = this.grid.fkValue;			var options = {				whereSql: 'fun_id not in (select fun_id from sys_user_funx where user_id = ?)',				whereValue: userId,				whereType: 'string'			};			return options;		}		
	};