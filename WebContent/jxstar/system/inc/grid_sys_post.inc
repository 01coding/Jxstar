	cols[cols.length] = {col:
        {header:'人员', width:60, align:'center', name:'usernum', 
			renderer: function(value, metaData, record) {
				var html = '<span class="pull-right badge badge-grey"></span>'+
                    '<a title="设置岗位人员"><i class="fa fa-cog"></i></a>';
				return html;
			},
			listeners: {click: function(col, grid, row, e){
				var target = e.getTarget();
				var rec = grid.getStore().getAt(row);
				var post_id = rec.get('sys_post__post_id');
				
				//过滤条件
				var where_sql = 'sys_post_user.post_id = ?';
				var where_type = 'string';
				var where_value = post_id;

				//加载数据
				var hdcall = function(grid) {
					//显示数据
					JxUtil.delay(500, function(){
						//设置外键值
						grid.fkValue = where_value;
						Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
					});
				};

				//显示数据
				var define = Jxstar.findNode('sys_post_user');
				Jxstar.showData({
					filename: define.gridpage,
					title: define.nodetitle,
					pagetype: 'subgrid',
					nodedefine: define,
					callback: hdcall
				});
			}}
		}
	};
	config.initpage = function(gridNode){
		var event = gridNode.event;
		var grid = gridNode.page;
		
        var colnum = JxUtil.getColumnIndex(grid, 'usernum');
        
		grid.getStore().on('load', function(store, recs) {
            var allnums = {};//记录每个ID行号
            for (var i = 0; i < store.getCount(); i++) {
                var rec = store.getAt(i);
                var pid = rec.get('sys_post__post_id');
                allnums[pid] = i;
            }
            
			var params = 'funid=sys_post&eventcode=qryuser';
            var hdcall = function(result){
            	var msg = result.message;
                var data = JSON.parse(msg);//格式如：[[id,num],[id,num],...]
                for (var i = 0; i < data.length; i++) {
                    var postid = data[i][0];
                    var usernum = data[i][1];
                    
                    var rownum = allnums[postid];
                    if (typeof rownum != "undefined") {
                        var td = grid.getView().getCell(rownum, colnum);
						Ext.fly(td.firstChild).child('span.badge').update(usernum);//.addClass('flag_attach');
                    }
                }
            };

			//取人员数据
            Request.dataRequest(params, hdcall, {errorcall:hdcall});
		});
	};
