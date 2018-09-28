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
					{xtype:'numberfield', decimalPrecision:0, fieldLabel:'达到数', name:'wf_nodeattr__agree_num', anchor:'100%', maxLength:22},
					{xtype:'textarea', fieldLabel:'自定义', name:'wf_nodeattr__custom_class', anchor:'100%', height:60, maxLength:300},
					{xtype:'hidden', fieldLabel:'属性ID', name:'wf_nodeattr__nodeattr_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'过程ID', name:'wf_nodeattr__process_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'节点ID', name:'wf_nodeattr__node_id', anchor:'100%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'wf_nodeattr1'
	};

	config.param.formWidth = '100%';

	
	
	return new Jxstar.FormNode(config);
}