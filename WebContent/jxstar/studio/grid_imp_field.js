Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataimpsrc = Jxstar.findComboData('impsrc');
	var Datadatatype = Jxstar.findComboData('datatype');
	var Datayesno = Jxstar.findComboData('yesno');

	var cols = [
	{col:{header:'序号', width:54, sortable:true, align:'right',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.NumberField({
			decimalPrecision:0, maxLength:22
		}),renderer:JxUtil.formatInt()}, field:{name:'imp_field__field_no',type:'int'}},
	{col:{header:'*字段名称', width:97, sortable:true, editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'imp_field__field_name',type:'string'}},
	{col:{header:'字段标题', width:111, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'imp_field__field_title',type:'string'}},
	{col:{header:'*来源', width:66, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Dataimpsrc
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Dataimpsrc[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataimpsrc.length; i++) {
				if (Dataimpsrc[i][0] == value)
					return Dataimpsrc[i][1];
			}
		}}, field:{name:'imp_field__data_src',type:'string'}},
	{col:{header:'位置', width:57, sortable:true, editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'imp_field__field_pos',type:'string'}},
	{col:{header:'*数据类型', width:77, sortable:true, align:'center',
		editable:true, hcss:'color:#0077FF;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datadatatype
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false, allowBlank:false,
			value: Datadatatype[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datadatatype.length; i++) {
				if (Datadatatype[i][0] == value)
					return Datadatatype[i][1];
			}
		}}, field:{name:'imp_field__data_type',type:'string'}},
	{col:{header:'必填?', width:55, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datayesno
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datayesno[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datayesno.length; i++) {
				if (Datayesno[i][0] == value)
					return Datayesno[i][1];
			}
		}}, field:{name:'imp_field__is_must',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'imp_field__field_id',type:'string'}},
	{col:{header:'定义ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'imp_field__imp_id',type:'string'}},
	{col:{header:'非新增值', width:65, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#2E6DA4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datayesno
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datayesno[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datayesno.length; i++) {
				if (Datayesno[i][0] == value)
					return Datayesno[i][1];
			}
		}}, field:{name:'imp_field__is_param',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '0',
		funid: 'imp_field'
	};
	
	config.param.notNullFields = 'imp_field__data_src;imp_field__field_name;imp_field__data_type;';
	
	config.initpage = function(gridNode){
		var grid = gridNode.page;
		grid.on('rowclick', function(g, rowindex, e) {
			var frm = Ext.get('frm_designer_import').dom;
			if (frm == null) return;
			var seldiv = frm.contentWindow.getSelectDiv();
			if (seldiv != null) {
				var record = g.getStore().getAt(rowindex);
				
				seldiv.oldRecord = seldiv.curRecord;
				seldiv.curRecord = record;
				seldiv.titleField = 'imp_field__field_title';
				seldiv.positionField = 'imp_field__field_pos';
			}
		});
	};
	
	config.eventcfg = {
	
		createField: function(){
			var self = this;
			var fkValue = self.grid.fkValue;
			var hdcall = function() {
				self.grid.getStore().reload();
			};
			
			var params = 'funid=imp_field&imp_id='+ fkValue +'&pagetype=editgrid&eventcode=createfield';
			
			//发送请求
			Request.postRequest(params, hdcall);
		},
        
        checkParam: function(){
			var self = this;
			var fkValue = self.grid.fkValue;
			var hdcall = function(data) {
                var isql = data.insert_sql;
                var more = data.more_param;
                var fields = data.fielda.split(',');
                var params = data.fieldb.split(',');
                var len = fields.length;
                if (len < params.length) len = params.length;
				
                var rows = '';
                var EMP = '<span style="color:red;">[空]</span>';
                
                for (var i = 0; i < len; i++) {
                    var f = (i >= fields.length) ? EMP:fields[i];
                    var p = (i >= params.length) ? EMP:params[i];
                    if (p == '[null param]') {
                        p = '<span style="color:red;">[null param]</span>';
                    }
                    
                    rows += '<tr class="tr_xx"><td>'+f+'</td><td>'+p+'</td></tr>';
                }
                var html = '<style>tr.tr_xx {height: 20px;} tr.tr_xx td {width: 50%; border: #555555 solid 1px; }</style>';
                html += '<div style="line-height:20px;font-size:13px;padding:5px;">'+isql+'</div>';
                if (more.length > 0) {
                    html += '<div style="color:red;">--too many params: '+more+' !!</div>';
                }
                html += '<table style="width:96%;margin:5px;"><tr class="tr_xx"><td>字段名</td><td>参数值</td></tr>' + rows + '</table>';
                
                if (html.indexOf('too many') >= 0 || html.indexOf('[空]') >= 0 || html.indexOf('[null param]') >= 0) {
                    html += '<div style="color:red;">--SQL与参数检查不合规，请核对红色字体部分！</div>';
                } else {
                    html += '<div style="color:red;">--SQL与参数检查正确！</div>';
                }
                
                var win = new Ext.Window({
                    title:'检查SQL',
                    width:500,
                    height:600,
                    //modal: true,
					autoScroll: true,
					closeAction: 'close',
                    items:[{xtype:'box',html:html}]
                });
                win.show();
			};
			
			var params = 'funid=imp_field&imp_id='+ fkValue +'&eventcode=checkparam';
			
			//发送请求
			Request.postRequest(params, hdcall);
		}
	};
		
	return new Jxstar.GridNode(config);
}