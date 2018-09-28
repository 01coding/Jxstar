	
	config.eventcfg = {
		addfun : function() {
			var self = this;
			var records = JxUtil.getSelectRows(self.grid);
			if (!JxUtil.selected(records)) return;
			
			//取选择记录的主键值
			var params = 'funid='+ self.define.nodeid;
			for (var i = 0; i < records.length; i++) {
				params += '&keyid=' + records[i].get(self.define.pkcol);
			}
			
			var fkg = self.grid.fkGrid;
			var pfunid = self.grid.fkFunId;
			var dataId = self.grid.fkValue;
			//设置请求的参数
			params += '&pagetype=selgrid&eventcode=addfun&srcFunId='+ pfunid +'&srcDataId='+ dataId;
			
			//删除后要处理的内容
			var endcall = function(data) {
				self.grid.getStore().reload();
				//目标表刷新
				if (fkg) {
					fkg.getStore().reload();
				}
			};
			
			//发送请求
			Request.postRequest(params, endcall);
		}
	};