Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*分类编码', width:150, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:80, allowBlank:false
		})}, field:{name:'store_mtype__type_code',type:'string'}},
	{col:{header:'*分类名称', width:218, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:200, allowBlank:false
		})}, field:{name:'store_mtype__type_name',type:'string'}},
	{col:{header:'级别', width:100, sortable:true, hidden:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'store_mtype__type_level',type:'int'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'store_mtype__type_id',type:'string'}},
	{col:{header:'分类描述', width:244, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:400
		})}, field:{name:'store_mtype__type_desc',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'store_mtype'
	};
	
	config.param.notNullFields = 'store_mtype__type_code;store_mtype__type_name;';
	
	config.eventcfg = {
	uplang: function(){
        var records = this.grid.getSelectionModel().getSelections();
        
        var self = this;
        //取选择记录的主键值
        var params = 'funid='+ self.define.nodeid +'&eventcode=uplang';
			for (var i = 0; i < records.length; i++) {
				params += '&keyid=' + records[i].get(self.define.pkcol);
			}

        //执行处理的内容
        var endcall = function(data) {

            
        };

        //发送请求
        Request.postRequest(params, endcall);
    },
     
    edlang: function() {
        
     
 	}
 }
		
	return new Jxstar.GridNode(config);
}