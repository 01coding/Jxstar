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