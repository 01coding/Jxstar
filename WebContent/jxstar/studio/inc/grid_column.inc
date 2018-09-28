//设置扩展属性
    var setext = function(colid) {
		//加载Form数据
        var hdcall = function(page) {
            //设置外键键
            page.getForm().fkName = 'fun_colext__col_id';
            page.getForm().fkValue = colid;

            //加载显示数据
            var options = {
                where_sql: 'fun_colext.col_id = ?',
                where_type: 'string',
                where_value: colid,
                callback: function(data) {
                    //如果没有数据则执行新增
                    if (data.length == 0) {
                        page.formNode.event.create();
                    } else {
                        var r = page.formNode.event.newRecord(data[0]);

                        page.getForm().myRecord = r;
                        page.getForm().loadRecord(r);
                    }
                }
            };
            Jxstar.queryData('fun_colext', options) 
        };

        //显示数据
        var define = Jxstar.findNode('fun_colext');
        Jxstar.showData({
            filename: define.formpage,
            title: define.nodetitle,
            callback: hdcall
        });
    };

	cols.insert(0, {col:
		{header:'扩展', width:50, align:'center', 
			renderer: function(value, metaData, record) {
                var html = '<a title="设置扩展属性"><i class="fa fa-cog"></i></a>';
				return html;
			},
			listeners: {click: function(col, grid, row, e){
				var target = e.getTarget();
				var rec = grid.getStore().getAt(row);
				var colid = rec.get('fun_col__col_id');
				setext(colid);
			}}
		}
	});

	config.initpage = function(gridNode){
		var grid = gridNode.page;
		//表格编辑后事件
		grid.on('afteredit', function(event) {
			if (event.field == 'fun_col__data_type') {
				var r = event.record;
				var datatype = r.get('fun_col__data_type');
				if (datatype == 'string') {
					r.set('fun_col__col_control', 'text');
					r.set('fun_col__format_id', 'text');
				} else if (datatype == 'int') {
					r.set('fun_col__col_control', 'number');
					r.set('fun_col__format_id', 'int');
				} else if (datatype == 'double') {
					r.set('fun_col__col_control', 'number');
					r.set('fun_col__format_id', 'number');
				} else if (datatype == 'date') {
					r.set('fun_col__col_control', 'date');
					r.set('fun_col__format_id', 'date');
				}
			}
		});
        
        //加载数据后再更新属性图标颜色
        grid.getStore().on('load', function (st, records) {
            var qfunid = grid.fkValue;
            var hdcall = function(datas) {
                for (var i = 0; i < datas.length; i++) {
                    var index = st.find('fun_col__col_id', datas[i]);
                    if (index >= 0) {
                        var d = grid.getView().getCell(index, 2);
                        Ext.get(d).query('i.fa')[0].style.color = '#D15B47';
                    }
                }
            };
            var param = 'funid=sys_fun_col&eventcode=getset&qfunid='+qfunid;
            Request.dataRequest(param, hdcall);
        });
	};

	config.eventcfg = {		
		dataImportParam: function() {
			var pg = JxUtil.getParentGrid(this.grid);
			var records = pg.getSelectionModel().getSelections();
			if (!JxUtil.selectone(records)) return;

			var funId = records[0].get('fun_base__fun_id');
			var tableName = records[0].get('fun_base__table_name');
			
			var options = {
				whereSql: 'table_name = ? and col_code not in (select col_code from fun_col where fun_id = ?)',
				whereValue: tableName+';'+funId,
				whereType: 'string;string'
			};
			return options;
		}
	};
