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
					{xtype:'trigger', fieldLabel:'子过程', name:'wf_subprocess__sub_process',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:50, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', editable:false,
						onTriggerClick: function() {
							var selcfg = {"pageType":"combogrid", "nodeId":"wf_process", "layoutPage":"", "sourceField":"wf_process.process_name;process_id", "targetField":"wf_subprocess.sub_process;sub_processid", "whereSql":"process_state < '3' and process_id <> ?", "whereValue":"[wf_subprocess.process_id]", "whereType":"string", "isSame":"0", "isShowData":"1", "isMoreSelect":"0","isReadonly":"1","queryField":"","likeType":"","fieldName":"wf_subprocess.sub_process"};
							JxSelect.createSelectWin(selcfg, this, 'node_wf_subprocess_form');
						}},
					{xtype:'hidden', fieldLabel:'过程ID', name:'wf_subprocess__process_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'主键', name:'wf_subprocess__wfsub_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'子过程ID', name:'wf_subprocess__sub_processid', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'节点ID', name:'wf_subprocess__node_id', anchor:'100%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'wf_subprocess'
	};

	
	
	
	return new Jxstar.FormNode(config);
}