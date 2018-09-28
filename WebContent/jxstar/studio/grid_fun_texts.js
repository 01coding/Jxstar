Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Datapropsrc = Jxstar.findComboData('propsrc');
	var Datatexttype = Jxstar.findComboData('texttype');

	var cols = [
	{col:{header:'*键值', width:251, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:100, allowBlank:false
		})}, field:{name:'funall_text__prop_key',type:'string'}},
	{col:{header:'文字描述', width:178, sortable:true}, field:{name:'funall_text__prop_value',type:'string'}},
	{col:{header:'来源', width:89, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datapropsrc
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datapropsrc[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datapropsrc.length; i++) {
				if (Datapropsrc[i][0] == value)
					return Datapropsrc[i][1];
			}
		}}, field:{name:'funall_text__prop_src',type:'string'}},
	{col:{header:'类型', width:100, sortable:true, hidden:true, defaultval:'sys', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datatexttype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datatexttype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datatexttype.length; i++) {
				if (Datatexttype[i][0] == value)
					return Datatexttype[i][1];
			}
		}}, field:{name:'funall_text__sys_type',type:'string'}},
	{col:{header:'英文描述', width:338, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:500
		})}, field:{name:'funall_text__prop_value_en',type:'string'}},
	{col:{header:'T1描述', width:167, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:200
		})}, field:{name:'funall_text__prop_value_t1',type:'string'}},
	{col:{header:'属性ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'funall_text__prop_id',type:'string'}},
	{col:{header:'T2描述', width:100, sortable:true, hidden:true}, field:{name:'funall_text__prop_value_t2',type:'string'}},
	{col:{header:'T3描述', width:100, sortable:true, hidden:true}, field:{name:'funall_text__prop_value_t3',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '0',
		funid: 'fun_texts'
	};
	
	config.param.notNullFields = 'funall_text__prop_value;funall_text__prop_key;';
	
	//添加自定义查询按钮
	config.toolext = function(node, tbar, extItems){
		if (node.state == '1') return;
		
		var qry = function(radio, checked) {
			if (!checked) return;
			
			var value = radio.initialConfig.value;
			node.page.src_type = value;
			Jxstar.loadData(node.page, {where_sql:'prop_src = ?', where_value:value, where_type:'string', is_query:0});
		};
	
		var items = [
			'-', 
			{xtype:'radio', boxLabel:jx.bus.text61, value:'2', name:'src_type', handler:qry, checked:true},//'菜单标题'
			{xtype:'radio', boxLabel:jx.bus.text62, value:'3', name:'src_type', handler:qry},//'事件标题'
			{xtype:'radio', boxLabel:jx.bus.text63, value:'4', name:'src_type', handler:qry},//'字段标题'
			{xtype:'radio', boxLabel:jx.bus.text64, value:'5', name:'src_type', handler:qry},//'其他标题'
			'-'
		];
		tbar.insertButton(0, items);
		
		JxUtil.delay(800, function(){
			node.page.src_type = '2';
			Jxstar.loadData(node.page, {where_sql:'prop_src = ?', where_value:'2', where_type:'string', is_query:0});
		});
	};
	
	config.eventcfg = {
		take: function(){
			var me = this;
			var type = me.grid.src_type||'2';
			var params = 'funid=fun_texts&pagetype=editgrid&eventcode=take&type='+ type;

			//生成文件后自动加载该文件
			var hdcall = function() {
				me.grid.getStore().reload();
			};

			//发送请求
			Request.postRequest(params, hdcall);
		},
		
		createjs: function(){
			var me = this;
			var type = me.grid.src_type||'2';
			var params = 'funid=fun_texts&pagetype=editgrid&eventcode=createjs&type='+ type +'&lang=zh&projectpath=' + 
							Jxstar.session['project_path'];

			//生成文件后自动加载该文件
			var hdcall = function() {
				jx = null;
				Request.loadJS('/public/locale/jxstar-lang-zh.js');
			};

			//发送请求
			Request.postRequest(params, hdcall);
		},
		
		createjse: function(lang){
			var me = this;
			var type = me.grid.src_type||'2';
			var params = 'funid=fun_texts&pagetype=editgrid&eventcode=createjse&type='+ type +'&lang='+ lang +'&projectpath=' + 
							Jxstar.session['project_path'];
			//发送请求
			Request.postRequest(params, null);
		},
        
        createfield: function(){
			var params = 'funid=fun_texts&pagetype=editgrid&eventcode=createjse&type=4&lang=&projectpath=' + 
							Jxstar.session['project_path'];
			//发送请求
			Request.postRequest(params, null);
        },
        
        load: function(){
			var params = 'funid=fun_textb&pagetype=editgrid&eventcode=load';

			//发送请求
			Request.postRequest(params, null);
		}
	};
		
	return new Jxstar.GridNode(config);
}