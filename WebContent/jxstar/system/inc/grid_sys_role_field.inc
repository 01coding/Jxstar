	config.eventcfg = {		
		dataImportParam: function() {
			var fkValue = this.grid.fkValue;			var funId = this.grid.selFunId;			var options = {				whereSql: 'fun_id = ? and col_id not in (select col_id from sys_role_field where role_fun_id = ?)',				whereValue: funId+';'+fkValue,				whereType: 'string;string'			};			return options;		}		
	};