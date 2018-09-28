/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 构建动态列的表格
 * 
 * @author TonyTan
 * @version 1.0, 2014-03-06
 */
JxDynCol = function(config){
	//当前功能ID
	//config.curfunid = 'mat_size_det';
	
	//动态列从第n列开始显示
	//config.dyn_index = 0;
	
	//小计列字段名
	//config.sum_colname = 'mat_appdet__mat_num';
	
	//明细主键字段名
	//config.det_keyname = 'mat_appdet__det_id';
	
	//尺码组id字段ming
	//config.size_keyname = 'mat_base__type_id';
	
	//缺省动态列数量20，一般都不需要修改
	//config.DYNNUM = 20;
	
	Ext.apply(this, config);
};

JxDynCol.prototype = {	
	//动态列的字段名前缀
	DYNCOL: 'size_num__',

	//添加20个动态列
	initDynCols: function(cols) {
		var me = this;
		//先找到要添加列的位置，根据小计列字段名
		var index = this.findIndex(cols, me.sum_colname);
		
		//添加尺码列的字段名约定为：'size_num__'+i
		for (var i = 0; i < me.DYNNUM; i++) {
			var col = {col:{header:i, width:45, sortable:false, align:'right',
						editable:true, hcss:'color:#15428B;',hidden:true,
						editor:new Ext.form.NumberField({
							maxLength:22
						}),renderer:JxUtil.formatNumber(2)}, field:{name:me.DYNCOL+i,type:'float'}};
			
			cols.insert(index+i, col);
		}
	},
	
	//保存动态列中的数据
	saveDynData: function(grid) {
		var me = this;
		var store = grid.getStore();
		var mrow = store.getModifiedRecords();
		if (mrow.length == 0) return true;
		var keyids = '';//所有明细id，格式如：keyid,keyid,keyid...
		var sizenums = [];//所有尺码名称与尺码数量，格式如：sizename,num;sizename,num;...
		
		var params = 'funid='+me.curfunid+'&eventcode=savedata';
		for (var i = 0; i < mrow.length; i++) {
			var rec = mrow[i];

			var sid = rec.get(me.size_keyname);//取尺码组id
			var names = me.getColNames(sid, grid);//取尺码名称
			
			var sizenums = '';
			if (names.length > 0) {
				for (var j = 0; j < names.length; j++) {
					var sd = rec.get(me.DYNCOL+j);//取各尺码的数量
					if (!sd || sd.length == 0) sd = '0';
					sizenums += names[j]+','+sd+';';
				}
				if (sizenums.length > 0) sizenums = sizenums.substr(0, sizenums.length-1);
				params += '&sizenums='+sizenums;
			} else {
				continue;
			}
			
			var did = rec.get(me.det_keyname);
			keyids += did + ',';//取明细id
		}
		if (keyids.length > 0) keyids = keyids.substr(0, keyids.length-1);
		params += '&keyids='+keyids;
		
		var hdcall = function(){
			for (var i = 0, n = mrow.length; i < n; i++) {
				if (mrow[i]) mrow[i].commit();
			}
		};
		Request.postRequest(params, hdcall);
		
		return true;
	},
	
	//加载动态列中的数据
	loadDynData: function(grid) {
		var me = this;
		var v = grid.getView();
		//表格没有显示前不刷新标题
		if (!grid.rendered) return;
		
		var store = grid.getStore();
		var endcall = function(data){
			//先隐藏所有动态列
			me.hideMainHeader(grid);
			
			//后台返回的标题数据，测试数据
			/*var headers = [{dataid:'1007', cols:['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']},
						{dataid:'1006', cols:['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '50', '51', '52']},
						{dataid:'1005', cols:['46', '47', '48', '49', '50', '51']}];*/
			//显示动态列与标题
			me.showMoreHeader(data.headers, grid);
			
			//后台返回的尺码数据，测试数据
			/*var datas = {'jxstar1099073':{'XS':'12', 'S':'2', 'M':'10', 'L':'22'}, 
				'jxstar2298973':{'50':'12', '51':'2', '52':'10', 'L':'22'}, 
				'jxstar6428974':{'50':'12', '51':'2', '46':'11', '47':'32'}};*/
			//显示动态列中的数据
			me.showDynData(data.datas, grid);
			
			//显示完动态标题后的回调方法
			if (grid.headerCall) grid.headerCall(data);
		};
		
		//构建明细表ID与尺码组ID，调用后台取数据
		var cnt = store.getCount();
		var detkeyids = '';//所有明细表id
		var sizeids = '';//所有尺码组id
		for (var i = 0; i < cnt; i++) {
			var rec = store.getAt(i);
			var did = rec.get(me.det_keyname);
			if (did.length > 0) {
				detkeyids += did + ',';//取明细id
			}
			var sid = rec.get(me.size_keyname);
			if (sid.length > 0 && sizeids.indexOf(sid+',') < 0) {
				sizeids += sid + ',';//取尺码组id
			}
		}
		if (detkeyids.length > 0) detkeyids = detkeyids.substr(0, detkeyids.length-1);
		if (sizeids.length > 0) sizeids = sizeids.substr(0, sizeids.length-1);
		
		var params = 'funid='+me.curfunid+'&eventcode=qrydata&pagetype=grid&detkeyids='+detkeyids+'&sizeids='+sizeids;
		Request.postRequest(params, endcall);
	},
	
	//修改数值时自动计算右边小计与底部的合计值
	caluSumData: function(field, record, grid) {
		var me = this;
		if (field.indexOf(me.DYNCOL) < 0) return;
		
		//如果设置了合计列
		if (!Ext.isEmpty(me.sum_colname)) {
			var sum = 0;
			for (var i = 0; i < me.DYNNUM; i++) {
				var sd = record.get(me.DYNCOL+i);
				if (!sd || sd.length == 0) sd = 0;
				sum += parseFloat(sd);
			}
			record.set(me.sum_colname, sum);
		}
		
		//更新底部小计值
		me.updateBotValue(field, grid);
	},
	
	//private 在这个列前面添加尺码列
	findIndex: function(cols) {
		var me = this;
		//如果设置了开始列
		if (me.dyn_index >= 0) return me.dyn_index;
		//如果没有设置统计列
		if (Ext.isEmpty(me.sum_colname)) return 0;
		
		for (var i = 0; i < cols.length; i++) {
			var f = cols[i].field;
			if (f && f.name.indexOf(me.sum_colname) == 0) {
				return i;
			}
		}
		return 0;
	},
	
	//添加一行标题
	addDynHeader: function(datas, grid) {
		var me = this;
		var v = grid.getView();
		var hrow = v.mainHd.select('tr').last();
		//直接拷贝一个新的标题tr
		var newtr = hrow.dom.cloneNode(true);
		var th = v.mainHd.select('thead').first();
		newtr = th.insertFirst(newtr);
		
		newtr.dom.dataid = datas.dataid;
		
		var cm = grid.getColumnModel();
		//找出第一个尺码列与最后一个
		var first = cm.findColumnIndex(me.DYNCOL+'0');
		var last = cm.findColumnIndex(me.DYNCOL+(me.DYNNUM-1));
		
		var tds = newtr.select('td');
		var cnt = tds.getCount();
		
		//设置colspan属性的方式会造成列标题错位，所以采用下面这种虚拟合并列的方式
		//把非动态列的标题值清楚，并设置样式为没有左边border
		for (var i = 0; i < cnt; i++) {
			var el = Ext.get(tds.item(i));
			el.setStyle('border-bottom', '1px solid #C7C7C7');
			
			if (i < first || i > last) {
				el.first().dom.className = '';
				el.first().dom.innerHTML = '';
				el.setStyle('background-color', '#C7C7C7');
			} else {
				var index = i - first;
				if (index < datas.cols.length) {
					el.first().dom.innerHTML = datas.cols[index];
				} else {
					el.first().dom.className = '';
					el.first().dom.innerHTML = '';
				}
			}
		}
	},
	
	//标记当前选择的行
	selectHeader: function(dataid, grid) {
		var me = this;
		var bgcolor = function(tr, color) {//#deecfd #eeeeee
			var tds = tr.select('td');
			for (var i = 0; i < tds.getCount(); i++) {
				var el = Ext.get(tds.item(i));
				if (el.dom.className.indexOf(me.DYNCOL) >= 0) {
					el.setStyle('background-color', color);
				}
			}
		};
		
		var v = grid.getView();
		var hrs = v.mainHd.select('tr')
		for (var i = 0; i < hrs.getCount(); i++) {
			var el = Ext.get(hrs.item(i));
			//标记当前行
			if (dataid == el.dom.dataid) {
				bgcolor(el, '#fbec88');
			} else {
				bgcolor(el, '#eeeeee');
			}
		}
	},
	
	//显示需要的列，传入尺码值数组
	showMainHeader: function(datas, grid) {
		var me = this;
		var cm = grid.getColumnModel();
		
		//找出第一个尺码列
		var first = cm.findColumnIndex(me.DYNCOL+'0');
		for (var i = 0; i < datas.cols.length; i++) {
			cm.setHidden(first+i, false);
			cm.setColumnHeader(first+i, datas.cols[i]);
		}
		
		var v = grid.getView();
		var hrow = v.mainHd.select('tr').last();
		hrow.dom.dataid = datas.dataid;
	},
	
	//隐藏所有动态列
	hideMainHeader: function(grid) {
		var me = this;
		var cm = grid.getColumnModel();
		
		for (var i = 19; i >= 0; i--) {
			var index = cm.findColumnIndex(me.DYNCOL+i);
			if (!cm.isHidden(index)) {
				cm.setHidden(index, true);
				cm.setColumnHeader(index, i);
			}
		}
	},
	
	//显示动态列的标题
	showMoreHeader: function(headers, grid) {
		var me = this;
		//把标题最长的一个放在前面
		var newhs = [];
		for (var i = 0; i < headers.length; i++) {
			if (newhs.length > 0 && headers[i].cols.length > newhs[0].cols.length) {
				newhs.insert(0, headers[i]);
			} else {
				newhs[newhs.length] = headers[i];
			}
		}
		
		for (var i = 0; i < newhs.length; i++) {
			if (i == 0) {
				//显示需要的列
				me.showMainHeader(newhs[i], grid);
			} else {
				//添加多层标题
				me.addDynHeader(newhs[i], grid);
			}
		}
	},
	
	//显示动态列中的数据
	showDynData: function(datas, grid) {
		var me = this;
		var store = grid.getStore();
		var cnt = store.getCount();
		if (cnt == 0) return;
			
		//根据尺码组id与尺码值，找到是哪一列
		var getColName = function(sizeid, sizename, grid) {
			var v = grid.getView();
			var hrs = v.mainHd.select('tr')
			for (var i = 0; i < hrs.getCount(); i++) {
				if (sizeid == hrs.item(i).dom.dataid) {
					var tds = hrs.item(i).select('td');
					for (var j = 0; j < tds.getCount(); j++) {
						//根据标题里面的值取字段名
						if (tds.item(j).first().dom.innerHTML.indexOf(sizename) == 0) {
							var cls = tds.item(j).first().dom.className;
							if (cls.indexOf(me.DYNCOL) >= 0) {
								return me.DYNCOL+cls.split('__')[1];
							}
						}
					}
				}
			}
			return '';
		};
		
		var sumdatas = {}, sumall = 0;
		for (var i = 0; i < cnt; i++) {
			var rec = store.getAt(i);
			var detid = rec.get(me.det_keyname);//取明细id
			var sizeid = rec.get(me.size_keyname);//取尺码组id
			var ds = datas[detid];
			
			//尺码数据
			if (!Ext.isEmpty(ds)) {
				for (key in ds) {
					var colname = getColName(sizeid, key, grid);
					if (colname.length > 0) {
						rec.set(colname, ds[key]);
						sumdatas[colname] = parseFloat(sumdatas[colname]||0) + parseFloat(ds[key]||0);
						sumall += parseFloat(ds[key]||0);
					}
				}
				rec.commit();
			}
		}
		
		//更新底部的合计值
		var body = grid.getView().mainBody;
		var trs = body.select('.x-grid3-summary-table');
		if (trs && trs.getCount() > 0) {
			var tds = trs.first().select('td');
			for (key in sumdatas) {
				for (i = 0; i < tds.getCount(); i++) {
					var cls = tds.item(i).dom.className;
					if (cls.indexOf(key) >= 0) {
						tds.item(i).first().dom.innerHTML = sumdatas[key];
						break;
					}
				}
			}
			//总计赋值
			if (!Ext.isEmpty(me.sum_colname)) {
				for (i = 0; i < tds.getCount(); i++) {
					var cls = tds.item(i).dom.className;
					if (cls.indexOf(me.sum_colname) >= 0) {
						tds.item(i).first().dom.innerHTML = sumall;
						break;
					}
				}
			}
		}
	},
	
	//更新底部的合计值
	updateBotValue: function(field, grid) {
		var me = this;
		var store = grid.getStore();
		var cnt = store.getCount();
		if (cnt == 0) return;
		
		var body = grid.getView().mainBody;
		var trs = body.select('.x-grid3-summary-table');
		if (!trs) return;//如果没有设置统计字段，则不处理
		
		//如果没有合计列，则不处理
		var hassum = !Ext.isEmpty(me.sum_colname);
		
		var sum = 0, sumall = 0;
		for (var i = 0; i < cnt; i++) {
			var rec = store.getAt(i);
			
			var num = rec.get(field);
			sum += parseFloat(num||0);
			
			if (hassum) {
				var nums = rec.get(me.sum_colname);
				sumall += parseFloat(nums||0);
			}
		}
		
		//更新底部的合计值
		if (trs && trs.getCount() > 0) {
			var tds = trs.first().select('td');
			for (i = 0; i < tds.getCount(); i++) {
				var cls = tds.item(i).dom.className;
				if (cls.indexOf(field) >= 0) {
					tds.item(i).first().dom.innerHTML = sum;
				}
				if (hassum && cls.indexOf(me.sum_colname) >= 0) {
					tds.item(i).first().dom.innerHTML = sumall;
				}
			}
		}
	},
	
	//判断字段列是否可编辑
	hasColName: function(sizeid, field, grid) {
		var me = this;
		if (field.indexOf(me.DYNCOL) < 0) return true;
		
		var v = grid.getView();
		var hrs = v.mainHd.select('tr')
		for (var i = 0; i < hrs.getCount(); i++) {
			if (sizeid == hrs.item(i).dom.dataid) {
				var tds = hrs.item(i).select('td');
				for (var j = 0; j < tds.getCount(); j++) {
					//根据字段名标题里面的值
					var cls = tds.item(j).first().dom.className;
					if (cls.indexOf(field) >= 0) {
						var h = tds.item(j).first().dom.innerHTML;
						return (h.length > 0);
					}
				}
			}
		}
		return false;
	},
	
	//根据尺码组ID取所有尺码值
	getColNames: function(sizeid, grid) {
		var me = this;
		var v = grid.getView();
		var hrs = v.mainHd.select('tr')
		for (var i = 0; i < hrs.getCount(); i++) {
			if (sizeid == hrs.item(i).dom.dataid) {
				var tds = hrs.item(i).select('td');
				var names = [];
				for (var j = 0; j < tds.getCount(); j++) {
					//取字段名标题里面的值
					var cls = tds.item(j).first().dom.className;
					if (cls.indexOf(me.DYNCOL) >= 0 && 
						tds.item(j).isVisible()) {
						var html = tds.item(j).first().dom.innerHTML;
						if (html.length > 0) {
							names[names.length] = html.split('<')[0];
						}
					}
				}
				return names;
			}
		}
		return [];
	}
};