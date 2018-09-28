/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 树形表格控件。
 * 
 * @author TonyTan
 * @version 1.0, 2016-01-01
 */

JxTreeGrid = {};

JxTreeGrid.remove = function(define, n, tree, o) {
	//设置请求的参数
	var params = 'funid='+ define.nodeid + '&eventcode=deltree&keyid=' + n.id;
	
	//删除后要处理的内容
	var endcall = function(data) {
		n.remove(true);
	};

	//发送请求
	Request.postRequest(params, endcall);
};

JxTreeGrid.save = function(define, n, tree, o) {
	var params = 'funid='+ define.nodeid;
	//添加外键值
	var fkn = tree.fkName;
	if (fkn && fkn.length > 0) {
		var fkv = tree.fkValue ? tree.fkValue : '';
		if (fkv.length == 0) {
			JxHint.alert('当前记录没有外键值，不能保存！');
			return;
		}
		params += '&fkValue=' + fkv;
	}
	//添加主功能ID
	var pfunId = tree.parentNodeId;
	if (!Ext.isEmpty(pfunId)) {
		params += '&pfunid=' + pfunId;
	}
	
	var parentId = n.parentNode.id;
	//添加父结点id与级别列
	params += '&parentId=' + parentId + '&levelCol=' + n.attributes.node_level;
	
	var cm = tree.columns, table = define.tablename, fn, v, e = encodeURIComponent;
	//添加字段信息
	for (var i = 0, len = cm.length; i < len; i++) {
		fn = cm[i].dataIndex;
		if (fn && fn.length > 0 && fn != 'id') {
			v = n.attributes[fn];
			if (Ext.isEmpty(v)) v = '';
			v = Ext.isDate(v) ? v.dateFormat('Y-m-d') : v;
			params += '&' + table+'__'+fn + '=' + e(v);
		}
	}
	
	//设置主键值
	params += '&keyid=' + (n._isNewTreeGridNode ? '' : n.id);
	
	//设置请求的参数
	params += '&eventcode=savetree';
	
	//保存后要处理的内容
	var endcall = function(data) {
		var cm = tree.columns;
		Ext.iterate(o.changes, function(name, value) {
			var index = 0, c;
			for (var i = 0, len = cm.length; i < len; i++) {
				c = cm[i];
				if (c.dataIndex == name) {
					index = i;
					break;
				}
			}
			Ext.fly(n.ui.elNode.childNodes[index]).removeClass('x-grid3-dirty-cell');
		});
		//修改ID，给主键赋值、级别赋值
		if (data && data.length > 0 && data[0].keyid) {
			n.id = data[0].keyid;
			var pk = define.pkcol.split('__');
			if (pk.length > 1) {
				n.attributes[pk[1]] = n.id;
			}
			var lv = n.attributes['node_level'].split('.')[1];
			//n.attributes[lv] = n.id.length/4;
			n.attributes[lv] = JxUtil.calTreeLevel(n.id);
		}
	};

	//发送请求
	Request.postRequest(params, endcall);
};

//自定义树形查询方法
JxTreeGrid.myQuery = function(tree, wheres, isquery) {
	var root = tree.getRootNode();
	var loader = tree.getLoader();
	
	if (root.pager) {
		root.pager.remove();
		root.pager = null;
	}
	
	var gnode = tree.gridNode;
	var psize = gnode ? gnode.mainPageSize : 50;
	//更新加载
	loader.clearOnLoad = true;
	root.queryParams = {start:0, limit:psize, where_sql:wheres[0], where_value:wheres[1], where_type:wheres[2], is_search:isquery};
	
	var fn = null;
	if (isquery == '1') fn = function(n){n.expand(true)};
	loader.load(root);
};

//支持模拟上下滚动条
JxTreeGrid.downScroller = function(tree, node, psize) {
	if (tree.downser) {
		var sb = tree.downBar
		//如果数量大于1页，则显示，否则隐藏
		if (node.total < psize) {
			sb.hide(); 
			node.fx = null;
			tree.innerBody.scrollTo('top', 0);
			tree.downser = false;
			return;
		} else {
			sb.show();
		}
		
		var total = node.total * 31 + 31;
		var hc = total-17;//内容高度
		var sbar = sb.child('div.x-scroll-updiv');
		
		var hi = tree.outerCt.getHeight()-52;//区域高度
		sb.maxScrollTop = (hc - hi);
		if (hi < hc) {
			//设置滑动块的宽度为真实文档宽度，用系统滚动条触发文档滚动
			sbar.setHeight(hc);
		}
		
		return;
	} else {
		if (node.total < psize) return;
	}
	tree.downser = true;
	
	tree.getLoader().on('load', function(l, n){
		if (!tree.downser) return;
		tree.top_pos = null;
		tree.loading = false; 
		JxUtil.delay(100, function(){
			tree.renderTask = null;
		});
		
		//到底显示底部数据
		var sb = tree.downBar;
		if (sb.maxScrollTop <= sb.dom.scrollTop) {
			tree.innerBody.scrollTo('top', sb.maxScrollTop);
			if (node.pager) {
				var h = '<span style="color:#2B7DBC;">共 '+ node.total+' 条</span>';
				node.pager.update(h);
			}
		} else {
			//向上翻页时，要重新指定scrolltop显示位置
			if (n.fx == -1) {
				var t = (tree.maxScrollTop/2) + (tree.innerBody.getHeight()/2-25);
				tree.innerBody.scrollTo('top', t);
			} else if (n.fx == 1) {
				var t = (tree.maxScrollTop/2) - (tree.innerBody.getHeight()/2-25);
				tree.innerBody.scrollTo('top', t);
			} else {
				tree.innerBody.scrollTo('top', 0);
			}
		}
		
		//重新指定模拟滚动条的显示位置
		if (n.fx != 2) {
			var t = Math.floor(n.queryParams.start/n.total * sb.maxScrollTop);
			sb.disscroll = true;
			sb.scrollTo('top', t);
			setTimeout(function(){sb.disscroll = false;}, 10);
		}
		
		//重新计算
		tree.maxScrollTop = tree.innerCt.getHeight() - tree.innerBody.getHeight() + 50;
	});
	
	var ct = tree.body;
	var cf = {tag:'div', cls:'x-treegrid-upbar', html:'<div class="x-scroll-updiv"></div>'};
	var sb = ct.createChild(cf);
	tree.downBar = sb;
	var pos = function(t){
		var w = t.outerCt.getWidth();
		var h = t.outerCt.getHeight();
		t.downBar.setHeight(h-52);//减去标题栏与底部滚动条的高度
		t.downBar.setLeft((w-18)+'px');
	};
	pos(tree);

	tree.on('resize', function(t){
		pos(t);
	});
	
	var ph = psize * 31;
	var fndown = function(st){
		var pi = Math.floor(st / ph);//加载第几页的数据
		
		if (node.pager) {
			var ci = node.pager.curPageIndex;
			if (ci != pi) {
				var c = pi * psize;
				node.fx = 2;//指定某页
				node.queryParams.start = c;
								
				if (tree.renderTask == null) {
					tree.renderTask = new Ext.util.DelayedTask(function(){
						console.log('....................scrollTop='+st+', start='+c+', fx='+node.fx);
						
						doUpdate();
					});
					tree.renderTask.delay(1000);
				}
			}
		}
	};
	
	var doUpdate = function(){
		if (tree.loading) return;
		tree.loading = true;
		
		var l = tree.getLoader();
		if (l) l.load(node);
	};

	var hi = tree.outerCt.getHeight()-52;//区域高度
	
	var total = node.total * 31 + 31;
	var hc = total-17;//内容高度
	var sbar = sb.child('div.x-scroll-updiv');
	//console.log('................fndown height='+hi+'; all height='+hc);
	sb.maxScrollTop = (hc - hi);
	if (hi < hc) {
		//设置滑动块的宽度为真实文档宽度，用系统滚动条触发文档滚动
		sbar.setHeight(hc);
		sb.on('scroll', function(e){
			if (sb.disscroll === true) return;
			//if (node.fx == 1 || node.fx == -1) return;//
			var st = sb.dom.scrollTop;//max scroll top = (hc - hi)
			fndown(st);
		});
	}
	
	//累加方式加载数据
	var updateFn = function(scrollLeft, scrollTop){
		if (!tree.downser) return;
		//横向滚动时不加载数据，向上滚动时不加载数据
		if (!tree.top_pos) {
			tree.top_pos = scrollTop;
			return;
		} else {
			if (tree.top_pos == scrollTop || tree.top_pos > scrollTop) {
				//上滚
				if (tree.renderTask == null && scrollTop < 400) {
					tree.renderTask = new Ext.util.DelayedTask(function(){
						var c = node.queryParams.start - psize;
						if (c < 0) {tree.renderTask = null; return;}
						node.fx = -1;//向上翻页
						node.queryParams.start = c;
						
						console.log('.....................max='+tree.maxScrollTop+', scrollTop='+scrollTop+', start='+c+', fx='+node.fx);
					
						doUpdate();
					});
					tree.renderTask.delay(100);
				}
			} else {
				//下滚
				if (tree.renderTask == null && scrollTop > (tree.maxScrollTop - 400)) {
					tree.renderTask = new Ext.util.DelayedTask(function(){
						if (node.queryParams.start > node.total) {
							tree.renderTask = null;
							return;
						}
						var c = node.queryParams.start + psize;
						node.fx = 1;//向下翻页
						node.queryParams.start = c;
						
						console.log('.....................max='+tree.maxScrollTop+', scrollTop='+scrollTop+', start='+c+', fx='+node.fx);
					
						doUpdate();
					});
					tree.renderTask.delay(100);
				}
			}
		}
		
		setTimeout(function(){tree.top_pos = scrollTop;},0);
	};
	
	tree.maxScrollTop = tree.innerCt.getHeight() - tree.innerBody.getHeight() + 50;
	//滚动到底加载新的数据
	tree.on('bodyscroll', updateFn);
};


//支持滚动时累计加载更多树形数据
/*tree.on('bodyscroll', );*/
//增加滚动时自动加载树数据
JxTreeGrid.loadTreeData = function(tree, node, psize, isclear){
	var ih, te, inh;
	var loader = tree.getLoader();
	
	var root = tree.getRootNode();
	root.autoScrollLoad = true;//根节点设置滚动自动加载数据
	//不能放到load的回调方法中，会造成重复加载数据
	loader.on('load', function(){
		tree.top_pos = null;
		tree.loading = false; 
		JxUtil.delay(100, function(){
			tree.renderTask = null;
		});
	});
	
	//替换方式更新数据
	var updateData1 = function(scrollLeft, scrollTop){
		if (!ih) ih = tree.innerBody.getHeight();
		if (!te)  te = tree.innerBody.down('table.x-treegrid-root-table');
		if (!inh)  inh = Ext.get(te).getHeight();
		
		if (!tree.top_pos) {
			tree.top_pos = scrollTop; return;
		} else {
			//水平滚动不加载
			if (tree.top_pos == scrollTop) return;
		}
		//向下滚动
		if ((ih+scrollTop-45) > inh) {
			doUpdate(1);
		}
		//向上滚动
		if (scrollTop > 5 && scrollTop < 30 && tree.top_pos > scrollTop) {
			doUpdate(-1);
		}
		tree.top_pos = scrollTop;
	};
	//累加方式加载数据
	var updateData2 = function(scrollLeft, scrollTop){
		//横向滚动时不加载数据，向上滚动时不加载数据
		if (!tree.top_pos) {
			tree.top_pos = scrollTop;
			return;
		} else {
			if (tree.top_pos == scrollTop || tree.top_pos > scrollTop) return;
		}
		
		if (tree.renderTask == null) {
			tree.renderTask = new Ext.util.DelayedTask(doUpdate, tree);
			tree.renderTask.delay(100);
		}
		tree.top_pos = scrollTop;
	};
	
	var updateFn = isclear ? updateData1 : updateData2;
	tree.on('bodyscroll', updateFn);
	
	//fx 加载方向： 1 表示下一页, -1 表示上一页
	var doUpdate = function(fx){
		if (!node.pager) return;
		if (tree.loading) return;
		tree.loading = true;
		
		if (fx == null) fx = 1;
		
		var c;
		if (fx > 0) {
			c = node.queryParams.start + psize;
			if (c >= node.total) {
				node.pager.update('<span style="color:#2B7DBC;">共 '+ node.total +' 条</span>');
				return;
			}
		} else {
			c = node.queryParams.start - psize;
			if (c < 0) return;
		}
		
		node.pager.curPageIndex = Math.floor(c/psize) + 1;//当前进入第几页
		node.pager.update('<span style="color:red;">正在加载...</span>');
		node.queryParams.start = c;
		console.log('..........loader data start='+c);
		
		loader.load(node);
	};
	
};

//是否构建临时分页工具栏
JxTreeGrid.createNodePager = function(node, psize, isclear, loader){
	//如果当前节点数据超过1页，则显示记录数与分页链接
	if (node.pager) {
		node.pager.remove();
		node.pager = null;
	}
	
	//不构建分页工具栏
	if (!node.total || node.total <= psize) return;
			
	var qm = node.queryParams;
	var ct, t = node.ui.getEl();
	if (t.tagName == 'TABLE' && t.className == 'x-treegrid-root-table') {
		ct = Ext.get(t).up('div.x-treegrid-root-node');//根节点
	} else {
		ct = Ext.get(t).down('tr.x-tree-node-ct td');//子节点
	}
	
	var e = Math.min(node.total, (qm.start+node.count));
	var h = '', auto = node.autoScrollLoad;//root才有此属性
	if (auto) {
		h = '<span style="color:red;">正在加载 ('+(qm.start+1)+' - '+e+') ...</span>';
	} else {
		var s = isclear ? (qm.start+1) : 1;
		h = '<span><a class="next">更多...</a><span>&nbsp&nbsp( 共 '+ node.total+' 条, 正显示 '+ s +' - '+ e +')</span>';
		if (isclear) h += '&nbsp&nbsp<a class="prev"><i class="x-fa fa fa-reply"></i></a>';
		h += '</span>';
	}
	
	//临时解决大数据加载显示
	var tree = node.getOwnerTree();
	if (tree.downser) {
		if (node.total > (qm.start+node.count)) {
			h = '<span style="color:#585858;">正在加载...</span>';
		} else {
			h = '<span style="color:#2B7DBC;">共 '+ node.total+' 条</span>';
		}
	}
	
	var cf = {tag:'div', cls:'x-tree-node-paging', html:h};
	node.pager = ct.createChild(cf);
	node.pager.curPageIndex = Math.floor(qm.start/psize) + 1;//当前进入第几页
	
	//设置分页栏的显示与隐藏
	node.pager.setVisibilityMode(Ext.Element.DISPLAY);
	//绑定翻页事件
	var pload = function(c){
		node.pager.update('<span style="color:red;">正在加载...</span>');
		node.queryParams.start = c;
		loader.load(node, function(n){n.expand()});
	};
	if (!auto) {
		//设置分页栏的显示位置，需要与节点标题对齐
		var te = node.ui.getTextEl();
		if (te) {//根节点为空
			var x = Ext.get(te).getX();
			node.pager.down('span').setX(x);
		}
		
		var pn = node.pager.child('a.next');
		var pv = node.pager.child('a.prev');
		if (pn) {
			pn.on('click', function(){
				var c = node.queryParams.start + psize;
				if (c >= node.total) return;
				pload(c);
			});
		}
		
		if (isclear && pv) {
			pv.on('click', function(){
				var c = node.queryParams.start - psize;
				if (c < 0) return;
				pload(c);
			});
		}
	}
};

//----------------------------------------------------------
var _updateLockNodeCls = function(u, method, cls){
	var tree = u.node.getOwnerTree();
	var l = tree.locker;
	if (l && l.locked){
		var id = u.node.ui.getEl().id;
		var as = l.lockInner.query('[itemid='+id+'] tr');
		if (as.length > 0) {
			Ext.fly(as[0])[method](cls);
		}
	}
};
Ext.tree.TreeNodeUI.prototype.onOver = function(e){
		this.addClass('x-tree-node-over');
		//add by ----------------
		_updateLockNodeCls(this, 'addClass', 'x-tree-node-over');
    };
Ext.tree.TreeNodeUI.prototype.onOut = function(e){
        this.removeClass('x-tree-node-over');
		//add by ----------------
		_updateLockNodeCls(this, 'removeClass', 'x-tree-node-over');
    };
Ext.tree.TreeNodeUI.prototype.onSelectedChange = function(state){
        if(state){
            this.focus();
            this.addClass("x-tree-selected");
			_updateLockNodeCls(this, 'addClass', 'x-tree-selected');
        }else{
            //this.blur();
            this.removeClass("x-tree-selected");
			_updateLockNodeCls(this, 'removeClass', 'x-tree-selected');
        }
    };
	
TreeLocker = function(config){
	this.tree = config.tree;
	
	this.lockBody = null;//模拟锁定层
	this.lockInner = null;//内容区域，滑动区
	this.scrollBar = null;//模拟滚动条
	
	this.locked = false;//当前是否锁定列状态
	this.lockNum = 0;//锁定列数
};
TreeLocker.prototype.getLockWidth = function(colIndex){
	var w = 0;
	var cols = this.tree.columns;
	if (colIndex > cols.length) colIndex = cols.length;
	if (colIndex > 10) colIndex = 10;
	
	for (var i = 0; i < colIndex; i++) {
		if (cols[i].width) {
			w += cols[i].width+1;
		}
	}
	return w-1;
};

TreeLocker.prototype.copyHead = function(colIndex){
	var hd = this.tree.innerHd;
	var tds = hd.query('td.x-treegrid-hd');
	if (tds.length == 0) return;
	
	var ct = this.lockBody.child('tr.x-grid3-hd-row');
	var cols = this.tree.columns;
	var hw = 0;
	for (var i = 0; i < colIndex; i++) {
		var cf = {tag:'td', cls:'x-treegrid-hd', html:tds[i].innerHTML};
		var td = ct.createChild(cf);
		var w = cols[i].width;
		hw += w;
		td.setWidth(w+1);
	}
	//设置table宽度保证标题不晃动
	var ht = ct.up('table', 2);
	ht.setWidth(hw);
};
TreeLocker.prototype.copyRow = function(colIndex){
	var ct = this.tree.innerBody;
	var ht = ct.dom.innerHTML;
	//避免ID重复
	var re = / id="ext-gen/igm;
	ht = ht.replace(re, ' itemid="ext-gen'); 
	this.lockInner.update(ht);
};
TreeLocker.prototype.lock = function(colIndex){
	if (this.locked) return;
	this.locked = true;
	this.lockNum = colIndex;
	
	var me = this;
	var tree = this.tree;
	var lockWidth = this.getLockWidth(colIndex);
	
	if (!this.lockBody) {
		var ct = tree.body;
		var buf = [
				'<div class="x-grid3-header">',
					'<div class="x-treegrid-header-inner">',
						'<div class="x-grid3-header-offset">',
							'<table style="table-layout: fixed;" cellspacing="0" cellpadding="0" border="0">',
								'<thead><tr class="x-grid3-hd-row"></tr></thead>',
							'</table>',
						'</div>',
					'</div>',
                '</div>',
                '<div class="x-treegrid-root-node">',
                '</div>'
			];
		var cf = {tag:'div', cls:'x-treegrid-lockdiv x-tree-arrows', html:buf.join('')};
		var lb = ct.createChild(cf);
		lb.setHeight(tree.outerCt.getHeight());
		lb.setWidth(lockWidth);
		this.lockBody = lb;
		
		//设置内容区的高度，这样滑动才有效果
		var iner = this.lockBody.down('div.x-treegrid-root-node');
		iner.setHeight(tree.innerBody.getHeight()-17);
		this.lockInner = iner;
		
		//拷贝标题
		this.copyHead(colIndex);
		//拷贝内容
		this.copyRow(colIndex);
	}
	if (!this.scrollBar) {
		var ct = tree.body;
		var buf = ['<div class="x-scroll-leftdiv">',
                '</div>',
                '<div class="x-scroll-rightdiv">',
                    '<div class="x-scroll-rightbar"></div>',
                '</div>'];
		var cf = {tag:'div', cls:'x-treegrid-scrollbar', html:buf.join('')};
		var sb = ct.createChild(cf);
		var w = tree.outerCt.getWidth();
		var h = tree.outerCt.getHeight();
		sb.setWidth(w);
		sb.setTop((h-16)+'px');
		this.scrollBar = sb;
		
		//滑块左占位区
		var left = sb.down('div.x-scroll-leftdiv');
		left.setWidth(lockWidth);
		//滑块右占位区
		var right = sb.down('div.x-scroll-rightdiv');
		var rw = w - lockWidth;
		right.setWidth(rw);
		
		//因为DD.onDrag事件总是造成滑开丢失，所以用系统滑块
		var cwd = tree.innerCt.getWidth() - lockWidth - 5;
		var sbar = sb.child('div.x-scroll-rightbar');
		if (rw < cwd) {
			//设置滑动块的宽度为真实文档宽度，用系统滚动条触发文档滚动
			sbar.setWidth(cwd);
			right.on('scroll', function(e){
				var sl = right.dom.scrollLeft;
				tree.innerBody.scrollTo('left', sl);
			});
		}
		
	}
	
	//调整锁定区的位置与大小
	tree.on('resize', function(t){
		var l = t.locker, lb = l.lockBody;
		var h = t.outerCt.getHeight();
		lb.setHeight(h);
		var w = l.getLockWidth(l.lockNum);
		lb.setWidth(w);
		
		var sb = l.scrollBar;
		var w1 = t.outerCt.getWidth();
		sb.setWidth(w1);
		sb.setTop((h-16)+'px');
		
		//滑块左占位区
		var left = sb.down('div.x-scroll-leftdiv');
		left.setWidth(w);
		//滑块右占位区
		var right = sb.down('div.x-scroll-rightdiv');
		var rw = w1 - w;
		right.setWidth(rw);
	});
	
	//上下滚动同时滚动模拟层
	var scrollFn = function(scrollLeft, scrollTop){
		me.lockInner.scrollTo('top', scrollTop);
	};
	tree.scrollFn = scrollFn;
	tree.on('bodyscroll', scrollFn);
	//设置模拟层的初始滚动位置
	var top = this.tree.innerBody.getScroll().top;
	this.lockInner.scrollTo('top', top);
};
TreeLocker.prototype.unlock = function(){
	var tree = this.tree;
	this.locked = false;
	this.lockNum = 0;
	this.lockInner = null;
	
	if (this.lockBody) {
		this.lockBody.remove();
		this.lockBody = null;
	}
	if (this.scrollBar) {
		this.scrollBar.remove();
		this.scrollBar = null;
	}
	
	tree.un('bodyscroll', tree.scrollFn);
	tree.scrollFn = null;
};
TreeLocker.prototype.updateData = function(){
	if (!this.locked) return;
	
	var ht = this.lockInner.down('table');
	ht.remove();
	var pb = this.lockInner.down('div.x-tree-node-paging');
	if (pb) pb.remove();
	
	//拷贝内容
	this.copyRow(this.lockNum);
	
	var top = this.tree.innerBody.getScroll().top;
	this.lockInner.scrollTo('top', top);
};
