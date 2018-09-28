Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datatenstate = Jxstar.findComboData('tenstate');
	var Datatenant_type = Jxstar.findComboData('tenant_type');
	var Datarbustype = Jxstar.findComboData('rbustype');

	var cols = [
	{col:{header:'状态', width:87, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datatenstate
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Datatenstate[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datatenstate.length; i++) {
				if (Datatenstate[i][0] == value)
					return Datatenstate[i][1];
			}
		}}, field:{name:'bos_tenant__auditing',type:'string'}},
	{col:{header:'租户名称', width:176, sortable:true}, field:{name:'bos_tenant__tenant_name',type:'string'}},
	{col:{header:'租户类型', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datatenant_type
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datatenant_type[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datatenant_type.length; i++) {
				if (Datatenant_type[i][0] == value)
					return Datatenant_type[i][1];
			}
		}}, field:{name:'bos_tenant__tenant_type',type:'string'}},
	{col:{header:'版本类型', width:100, sortable:true, hidden:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datarbustype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datarbustype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datarbustype.length; i++) {
				if (Datarbustype[i][0] == value)
					return Datarbustype[i][1];
			}
		}}, field:{name:'bos_tenant__bus_type',type:'string'}},
	{col:{header:'注册时间', width:156, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'bos_tenant__edit_date',type:'date'}},
	{col:{header:'失效时间', width:166, sortable:true, hidden:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d H:i');
		}}, field:{name:'bos_tenant__invalid_date',type:'date'}},
	{col:{header:'用户数量', width:100, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'bos_tenant__user_num',type:'int'}},
	{col:{header:'到期日期', width:135, sortable:true, align:'center',
		renderer:function(value) {
			return JxUtil.renderDate(value, 'Y-m-d');
		}}, field:{name:'bos_tenant__end_date',type:'date'}},
	{col:{header:'备注', width:239, sortable:true}, field:{name:'bos_tenant__memo',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'bos_tenant__bos_tenant_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'bos_tenant'
	};
	
	config.param.notNullFields = 'bos_tenant__auditing;bos_tenant__tenant_name;';
	
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
		
	return new Jxstar.GridNode(config);
}