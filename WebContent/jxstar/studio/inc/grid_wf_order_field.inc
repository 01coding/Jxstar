	config.eventcfg = {
		//数据导入查询扩展
		dataImportParam: function() {
			var pform = JxUtil.getParentForm(this.grid);
			var fun_id = pform.get('wf_order__fun_id');
			//获取功能ID
			//var fun_id = this.grid.orderDetFunId;
			var options = {
				whereSql:'fun_col.fun_id = ?',
				whereType:'string',
				whereValue:fun_id
			};
			return options;
		}
		
	};