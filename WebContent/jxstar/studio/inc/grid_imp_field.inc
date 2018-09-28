
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
