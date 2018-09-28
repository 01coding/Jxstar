config.initpage = function(gridNode){
	var event = gridNode.event;
	
	var grid = gridNode.page;
    //因为需要使用复制功能，所以where中不能用[parent_funid]
    grid.subWhereSql = function(){
        return "fun_id = '"+ gridNode.parentNodeId +"' and data_id = ?";
    };

};

config.eventcfg = {

	//重新分配
	newNode: function(){
		var self = this;
		var hdcall = function(){
			
			//取选择记录的主键值
			var params = 'funid='+ self.grid.gridNode.nodeId;
			
			params += '&pkeyid=' + self.grid.fkValue +'&pfunid='+self.grid.gridNode.parentNodeId;
			

			//设置请求的参数
			params += '&pagetype=grid&eventcode=newnode';

			//执行处理的内容
			var endcall = function(data) {
				//重新加载数据
				self.grid.getStore().reload();
			};
			//发送请求
			Request.postRequest(params, endcall);
		};
		//确定执行当前操作吗？
		Ext.Msg.confirm(jx.base.hint, '重新分配将删除当前的分配人？', function(btn) {
			if (btn == 'yes') hdcall();
		});
	}
};