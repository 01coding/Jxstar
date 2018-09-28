
	cols[cols.length] = {col:
		{header:jx.bus.text48, width:50, xtype:'actioncolumn', align:'center', items:[{//'上传'
				icon: 'resources/images/icons/button/upload.gif',
				tooltip: jx.bus.text49,//'上传图片',
				handler: function(grid, rowIndex, colIndex) {
					var sm = grid.getSelectionModel();
					if (sm.selectRow) {
						sm.selectRow(rowIndex);
					} else {
						sm.select(rowIndex, colIndex);
					}
					var ge = grid.gridNode.event;
					ge.addAttach('img_file');
				}
			}]
		}
	};
	
	cols[cols.length] = {col:
		{header:jx.bus.text50, width:40, align:'center', //'预览'
			renderer: function(value, metaData, record) {
				var dataId = record.get('wf_signet__signet_id');
				//取图片的路径
				var showUrl = function(dataId) {
					var params = 'funid=sys_attach&pagetype=editgrid&eventcode=fdown';
					params += '&attach_field=img_file&dataid='+ dataId;
					params += '&table_name=wf_signet&datafunid=sys_sign_dept';
					
					var url = Jxstar.path+'/fileAction.do?' + params + '&dataType=byte&nousercheck=1&dc=' + (new Date()).getTime();
					return url;
				};
				//显示图片
				JxUtil.showImage = function(img) {
					var el = Ext.get(img);
					if (el.toolTip) {el.toolTip.show(); return;}
					
					var url = showUrl(el.getAttribute('dataId'));
					var html = '<img src="'+ url +'">';
					var cfg = {
						target: el,
						autoWidth: true,
						autoHeight: true,
						html: html,
						anchor: 'left',//设置该参数，可以自动控制tip显示位置，防止图片被挡住
						dismissDelay: 15000
					};
					//IE下面tip显示错位，不能使用autoWidth参数
					if (Ext.isIE) {
						cfg.autoWidth = false;
						cfg.width = 50;
					}
					el.toolTip = new Ext.ToolTip(cfg);
					el.toolTip.show();
				};
				
				var html = '<img src="'+ showUrl(dataId) +'" dataId="'+ dataId +'" onmouseover="JxUtil.showImage(this);" style="width:30px; height:30px; cursor:pointer;">';
				return html;
			}
		}
	};
	
	config.initpage = function(gridNode){
		var event = gridNode.event;
		event.on('beforeaudit', function(ge){
			var records = JxUtil.getSelectRows(ge.grid);
			for (var i = 0; i < records.length; i++) {
				var img_file = records[i].get('wf_signet__img_file');
				if (img_file.length == 0) {
					JxHint.alert(jx.bus.text51);//'要提交的记录没有上传印章图片，不能启用！'
					return false;
				}
			}
			return true;
		});
	};
	