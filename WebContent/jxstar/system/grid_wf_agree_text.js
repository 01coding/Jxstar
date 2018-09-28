Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*模版内容', width:506, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:200, allowBlank:false
		})}, field:{name:'wf_agree_text__agree_text',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'wf_agree_text__text_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'wf_agree_text'
	};
	
	config.param.selectModel = 'nocheck';

	
		
	return new Jxstar.GridNode(config);
}