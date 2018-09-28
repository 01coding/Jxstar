
	config.initpage = function(gridNode){
		var event = gridNode.event;
		//导入字段后，修改主表为修改状态
		event.on('afterimport', function(ge) {
			//目标功能外键值
			var parentId = ge.grid.destParentId;
			//目标功能ID
			var destFunId = ge.grid.destNodeId;
			
			if (destFunId == 'dm_fieldcfg' && parentId && parentId.length > 0) {
				var params = 'funid=sel_fieldcfg&pagetype=editgrid&eventcode=impfield&tableid='+ parentId;
				Request.postRequest(params, null);
			}
		});
	};