config.eventcfg = {
	//设置默认
	setDefault: function(){
		var self = this;
		var grid = this.grid;
		
		var records = JxUtil.getSelectRows(grid);
		if(!JxUtil.selected(records)) return false;
		if(!JxUtil.selectone(records)) return false;
	
		if(records[0].get('sys_attach_store__is_default') == 1){
			JxHint.alert(jx.bus.text44);//'选中记录已是默认库，不能操作！'
			return false;
		}
	
		var hdcall = function(){
			var params = 'funid='+ self.define.nodeid + '&pagetype=grid' + '&eventcode=setDefault';
			params += '&keyid='+records[0].get(self.define.pkcol);
			
			var endcall = function(data){
				grid.getStore().reload();
			}
			Request.postRequest(params, endcall);
		}
		Ext.Msg.confirm(jx.base.hint, jx.bus.text45, function(btn) {//'确定设置默认附件库？'
			if (btn == 'yes') hdcall();
		});
	}
};