Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Datanewstype = Jxstar.findComboData('newstype');
	var Dataaudit = Jxstar.findComboData('audit');
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
				columnWidth:0.5775,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'公告标题', name:'oa_news__news_title', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'hidden', fieldLabel:'部门ID', name:'oa_news__dept_id', defaultval:'fun_getDeptId()', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.2063,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'信息类型', name:'oa_news__cont_type', defaultval:'1',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Datanewstype
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Datanewstype[0][0]},
					{xtype:'hidden', fieldLabel:'主键', name:'oa_news__news_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'发布人ID', name:'oa_news__edit_userid', defaultval:'fun_getUserId()', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'置顶？', name:'oa_news__is_top', defaultval:'0', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.2063,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'状态', name:'oa_news__state',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataaudit
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataaudit[0][0]}
				]
			}
			]
		},{
			anchor:'100%',
			border:false,
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.99,
				layout:'form',
				items:[
					{xtype:'textarea', fieldLabel:'公告内容', name:'oa_news__news_cont', allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', anchor:'100%', height:540, maxLength:Number.MAX_VALUE}
				]
			}
			]
		},{
			anchor:'100%',
			border:false,
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'textfield', fieldLabel:'发布人', name:'oa_news__edit_user', defaultval:'fun_getUserName()', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'datefield', fieldLabel:'发布时间', name:'oa_news__edit_date', defaultval:'fun_getToday()', format:'Y-m-d H:i', anchor:'100%', readOnly:true}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				items:[
					{xtype:'combo', fieldLabel:'发布单位', name:'oa_news__dept_name', defaultval:'fun_getDeptName()',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:50, allowBlank:false, labelStyle:'color:#0077FF;', labelSeparator:'*', editable:true,
						listeners:{afterrender: function(combo) {
							JxSelect.initCombo('oa_news', combo, 'node_oa_news_form');
						}}},
					{xtype:'textfield', fieldLabel:'编号', name:'oa_news__news_code', readOnly:true, anchor:'100%', maxLength:20}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'oa_news'
	};

	config.param.formWidth = 700;
	config.param.labelAlign = 'top';

	config.param.showFormSub = true;
	config.param.items[0].style = 'padding:10px 0;margin:0 auto;';
	
	//修改控件类型
	var isret = false;
	var findcfg = function(datas) {
		if (isret) return;
		for (var i = datas.length-1; i >= 0; i--) {
			if (datas[i].name == 'oa_news__news_cont') {
				var heitem = datas[i];
				if (heitem) {
					delete heitem.width;
					heitem.xtype = 'imghtmleditor';
					heitem.anchor = '100%';
					heitem.maxLength = 20000;
				}
				isret = true; return;
			} else {
				if (datas[i].items && datas[i].items.length > 0) {
					findcfg(datas[i].items);
				}
			}
		}
	};
	findcfg(items);
	
	config.initpage = function(fn){
		var fe = fn.event;
		
		fe.on('initother', function(fe){
			var field = fe.form.findField('oa_news__news_cont');
			var value = field.getValue();
			value = value.replace(/'/g, '"');//防止数据修改提示
			field.originalValue = value;
		});
	};
	
	config.eventcfg = {
		
		setuser: function() {
			var keyid = this.getPkField().getValue();
			if (keyid == null || keyid.length == 0) {
				JxHint.alert(jx.event.nosave);
				return;
			}

			//过滤条件
			var where_sql = 'oa_news_obj.news_id = ?';
			var where_type = 'string';
			var where_value = keyid;
			
			//加载数据
			var hdcall = function(grid) {
				JxUtil.delay(500, function(){
					grid.fkValue = where_value;
					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
				});
			};

			//显示数据
			var define = Jxstar.findNode('oa_news_obj');
			Jxstar.showData({
				filename: define.gridpage,
				title: define.nodetitle,
				pagetype: 'subgrid',
				nodedefine: define,
				callback: hdcall
			});
		}
	}
	
	return new Jxstar.FormNode(config);
}