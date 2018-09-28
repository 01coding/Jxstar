Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
		var items = [{
		border:false,
		layout:'form',
		autoHeight:true,
		cls:'x-form-main',
		items:[{
			anchor:'100%',
			border:false,
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.99,
				layout:'form',
				items:[
					{xtype:'textarea', fieldLabel:'判断条件', name:'wf_condition__cond_where', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:90, maxLength:200},
					{xtype:'hidden', fieldLabel:'是否定制类', name:'wf_condition__use_class', defaultval:'0', anchor:'62%'},
					{xtype:'hidden', fieldLabel:'条件ID', name:'wf_condition__condition_id', anchor:'62%'},
					{xtype:'hidden', fieldLabel:'过程ID', name:'wf_condition__process_id', anchor:'62%'},
					{xtype:'hidden', fieldLabel:'流转ID', name:'wf_condition__line_id', anchor:'62%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'wf_condition'
	};

	
	
	
	return new Jxstar.FormNode(config);
}