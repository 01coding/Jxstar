config.eventcfg = {
	cancel: function(){
        var records = this.grid.getSelectionModel().getSelections();
        if (!JxUtil.selectone(records)) return;

        var self = this;
        var hdcall = function() {
            //取选择记录的主键值
            var params = 'funid=bos_tenant&eventcode=cancel';
            	params += '&keyid=' + records[0].get(self.define.pkcol);
			
            //执行处理的内容
            var endcall = function(data) {
                
                self.grid.getStore().reload();
            };

            //发送请求
            Request.postRequest(params, endcall);
        };
      	
        Ext.Msg.confirm(jx.base.hint, '注销后此租户的账号不能登录系统，确定吗？', function(btn) {
            if (btn == 'yes') hdcall();
        });
    },
    
    enable: function(){
        var records = this.grid.getSelectionModel().getSelections();
        if (!JxUtil.selectone(records)) return;

        var self = this;
        var hdcall = function() {
            //取选择记录的主键值
            var params = 'funid=bos_tenant&eventcode=enable';
            	params += '&keyid=' + records[0].get(self.define.pkcol);
			
            //执行处理的内容
            var endcall = function(data) {
                
                self.grid.getStore().reload();
            };

            //发送请求
            Request.postRequest(params, endcall);
        };
      	
        Ext.Msg.confirm(jx.base.hint, '将恢复此租户的账号正常登录使用，确定吗？', function(btn) {
            if (btn == 'yes') hdcall();
        });
	},
    
    clear: function(){
        var records = this.grid.getSelectionModel().getSelections();
        if (!JxUtil.selectone(records)) return;

        var self = this;
        var hdcall = function() {
            //取选择记录的主键值
            var params = 'funid=bos_tenant&eventcode=clear';
            	params += '&keyid=' + records[0].get(self.define.pkcol);
			
            //执行处理的内容
            var endcall = function(data) {
                
                self.grid.getStore().reload();
            };

            //发送请求
            Request.postRequest(params, endcall);
        };
      	
        Ext.Msg.confirm(jx.base.hint, '将清除此租户所有业务数据与配置信息，确定吗？', function(btn) {
            if (btn == 'yes') hdcall();
        });
    },
    
    upuser: function(){
        var records = this.grid.getSelectionModel().getSelections();
        if (!JxUtil.selectone(records)) return;

        var self = this;
        var hdcall = function() {
            //取选择记录的主键值
            var params = 'funid=bos_tenant&eventcode=upuser';
            	params += '&keyid=' + records[0].get(self.define.pkcol);
			
            //执行处理的内容
            var endcall = function(data) {
                
                self.grid.getStore().reload();
            };

            //发送请求
            Request.postRequest(params, endcall);
        };
      	
        Ext.Msg.confirm(jx.base.hint, '确定同步租户账号sys_user到bos_user表中吗？', function(btn) {
            if (btn == 'yes') hdcall();
        });
    }
}