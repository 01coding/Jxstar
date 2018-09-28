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
