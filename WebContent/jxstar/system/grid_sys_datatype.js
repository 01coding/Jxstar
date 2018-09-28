Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*数据名称', width:127, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'sys_datatype__dtype_name',type:'string'}},
	{col:{header:'*权限字段', width:112, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'sys_datatype__dtype_field',type:'string'}},
	{col:{header:'*来源功能', width:107, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:25, allowBlank:false
		})}, field:{name:'sys_datatype__funid',type:'string'}},
	{col:{header:'*来源字段', width:181, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'sys_datatype__fun_field',type:'string'}},
	{col:{header:'*显示字段', width:186, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'sys_datatype__fun_vfield',type:'string'}},
	{col:{header:'设置ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_datatype__dtype_id',type:'string'}},
	{col:{header:'控件代码', width:100, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'sys_datatype__control_code',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '1',
		funid: 'sys_datatype'
	};
	
	
	config.eventcfg = {		
		/**		* 批量添加		**/		addtype : function(eventCode) {				var records = this.grid.getSelectionModel().getSelections();			if (!JxUtil.selected(records)) return;			var self = this;			var hdcall = function() {				//取选择记录的主键值				var params = 'funid='+ self.define.nodeid;				for (var i = 0; i < records.length; i++) {					params += '&keyid=' + records[i].get(self.define.pkcol);				}								//添加选择的功能ID				params += '&selfunid=' + self.grid.fkValue;				//设置请求的参数				params += '&pagetype='+eventCode+'&eventcode='+eventCode;				//发送请求				Request.postRequest(params, null);			};			//'确定执行当前操作吗？'			Ext.Msg.confirm(jx.base.hint, jx.event.doyes, function(btn) {				if (btn == 'yes') hdcall();			});		}		
	};
		
	return new Jxstar.GridNode(config);
}