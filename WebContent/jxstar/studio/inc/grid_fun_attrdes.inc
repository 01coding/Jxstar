	config.eventcfg = {
		dataImportParam: function() {
			var funId = this.grid.fkValue;
			var attrType = this.grid.attr_type;
			
			var options = {
				whereSql: 'attr_type = ? and attr_name not in (select attr_name from fun_attr where fun_id = ?)',
				whereValue: attrType+';'+funId,
				whereType: 'string;string'
			};
			return options;
		}
	};