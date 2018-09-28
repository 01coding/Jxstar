/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 构建表单中的明细表
 * 
 * @author TonyTan
 * @version 1.0, 2012-04-16
 */
JxFormSub = {};
(function(){

	Ext.apply(JxFormSub, {
	
	//添加tabpanel
	formAddTab: function(config) {
		var fm = config.param;
		if (fm.showFormSub) {//避免重复加载明细表
			return;
		} else {
			fm.showFormSub = true;
		}
		var define = Jxstar.findNode(fm.funid);
		if (define.showFormSub === false) return;
		
		//添加一个tabpanel对象
		var subcfg = {xtype:'tabpanel', cls:'sub_tab', activeTab:0, deferredRender:false, 
			border:false, anchor:'100%', height:300, items:[], 
			//选择其他子表时要刷新数据
			listeners:{tabchange: function(tab, cmp){
				var sgrid = cmp.getComponent(0);
				if (sgrid && sgrid.fkValue) {
					Jxstar.loadSubData(sgrid, sgrid.fkValue);
				}
			}, beforetabchange: function(t, newp, curp){
				if (define.isCloud && newp.tabtooler && curp.tabtooler) {
					newp.tabtooler.show();
					curp.tabtooler.hide();
				}
			}}
		};
		
		var sid = define.subfunid;
		if (Ext.isEmpty(sid)) return;
		//如果设置不显示在tab的子功能ID，则form中只显示这些子功能ID
		var notTabFunId = define.notTabFunId || '';
		if (notTabFunId.length > 0) {
			sid = notTabFunId;
		}
		
		var j = 0;
		var sids = sid.split(',');
		for (var i = 0, n = sids.length; i < n; i++) {
			var subid = sids[i];
			if (subid.length == 0) continue;
			
			var sd = Jxstar.findNode(subid);
			sd.showInForm = true;
			if (define.isCloud) {//标记是在云布局中
				sd.isCloud = true;
			}
			
			subcfg.items[j++] = {title:sd.nodetitle, showType:'inform', data:subid, layout:'fit', hideCollapseTool:true};
		}
		if (j > 0) {
			Ext.apply(subcfg, fm.subConfig);
			fm.items[fm.items.length] = subcfg;
		}
	},
	
	//添加显示明细表的panel
	formAddSub: function(config) {
		var fm = config.param;
		if (fm.showFormSub) {//避免重复加载明细表
			return;
		} else {
			fm.showFormSub = true;
		}
		var define = Jxstar.findNode(fm.funid);
		if (define.showFormSub === false) return;
		
		var subfunid = define.subfunid;
		if (subfunid == null || subfunid.length == 0) return;
		//如果设置不显示在tab的子功能ID，则form中只显示这些子功能ID
		var notTabFunId = define.notTabFunId || '';
		if (notTabFunId.length > 0) {
			subfunid = notTabFunId;
		}
		//是否缺省展开form中的所有子功能
		var subExpand = define.subExpand || false;
		
		var cfgitems = fm.items;
		var subfunids = subfunid.split(',');
		for (var i = 0, n = subfunids.length; i < n; i++) {
			var subid = subfunids[i];
			if (subid.length == 0) continue;
			
			var subdefine = Jxstar.findNode(subid);
			var subtitle = subdefine.nodetitle;
			
			//标志此功能在form中显示
			//在GridNode.js中构建表格时不带边框，而且分页工具栏显示在顶部。
			subdefine.showInForm = true;
			
			//第一个子表展开，后面的子表折叠
			var csed = (i > 0);
			//缺省展开form中的所有子功能
			if (subExpand) csed = false;
			
			var subcfg = {
				title:subtitle, showType:'inform', baseCls:'xs-panel', data:subid, 
				cls:'sub_panel', border:false, layout:'fit', hideCollapseTool:true, collapsible:true, 
				collapsed:csed,	anchor:'100%', height:200
			};
			if (define.isCloud) {
				subdefine.isCloud = true;
				subcfg.iconCls = 'x-tool-toggle';
			}
			Ext.apply(subcfg, fm.subConfig);
			cfgitems[cfgitems.length] = subcfg;
		}
	},
	
	/**
	 * 显示明细表格，添加相关事件
	 * FormNode.initPage form页面创建后执行 或 JxCloud中创建了subTab页面后执行
	 **/
	formShowSub: function(formNode) {
		this.formShowFile(formNode);//显示子表时就需要检查附件是否需要显示在form中
		
		var fevent = formNode.event;
		var page = formNode.page;
		var fm = formNode.param;
		var define = formNode.define;
		
		//子表是否显示在tab中
		var isInTab = false;
		var subtab = null;
		
		//取明细表的panel
		var subps = page.find('cls', 'sub_panel');
		if (Ext.isEmpty(subps)) {
			var tabs = page.find('cls', 'sub_tab');
			//取tab中的所有子控件
			if (!Ext.isEmpty(tabs)) {
				subtab = tabs[0];
				subps = tabs[0].items.getRange();
				if (!Ext.isEmpty(subps)) isInTab = true;
			}
		}
		//子表统一放到第二个tab中的情况
		if (define.isCloud && page.ownerCt) {
			var tab = page.ownerCt.ownerCt;
			if (tab && tab.initialConfig.cls == 'form-tab') {
				var subs = tab.getComponent(1).find('cls', 'sub_panel');
				if (Ext.isEmpty(subps)) {
					subps = subs;
				} else {
					//可能存在部分子表放在form中，部分子表放在的子表tab中
					subps.push(subs);
				}
			}
		}
		if (Ext.isEmpty(subps)) return;
		
		//保存明细表，用于检查子表数据状况
		page.subgrids = subps;
		
		//创建明细表对象
		for (var i = 0, n = subps.length; i < n; i++) {
			var subParam = {pageType:'subgrid', parentNodeId:formNode.nodeId};
			//把按钮显示在标题栏中
			if (define.isCloud) {
				subParam.showCall = function(page){
					JxCloud.addTools(page);
				};
			}
			Jxstar.createPage(subps[i].data, 'gridpage', subps[i], subParam);
		}
		
		//每次改变form记录时重新加载明细表记录
		fevent.on('initother', function(event) {
			if (subps == null || subps.length == 0) return;
			
			var define = event.define;
			var form = event.form;
			
			var pkcol = define.pkcol;
			var pkvalue = form.get(pkcol);
			
			var showsub = function(){
				for (var i = 0, n = subps.length; i < n; i++) {
					var subp = subps[i];
					var subgrid = subp.getComponent(0);
					subgrid.parentForm = page;//保存父表单页面对象，方便取数
					
					if (pkvalue == null || pkvalue.length == 0) {
						subgrid.getStore().removeAll();
						subgrid.fkValue = '';
						//支持主表未保存添加明细表的记录
						//subgrid.disable();
						//清除子表标题中的记录数
						var pbr = subgrid.pagebar;
						if (pbr) pbr.fireEvent('change', pbr, {total:0});
					} else {
						//如果支持同时新增主表单与明细数据，则需要先提交脏数据
						var st = subgrid.getStore();
						var mrow = st.getModifiedRecords();
						if (mrow.length > 0) {
							st.commitChanges();//有修改的记录不重新刷新了
						} else {
							subgrid.enable();
							subgrid.fkValue = pkvalue;
							if (isInTab) {//如果是显示在tab中，且是后面的子表则先不显示数据
								if (subtab && (subtab.getActiveTab() ==  subp)) {
									Jxstar.loadSubData(subgrid, pkvalue);
								}
							} else {
								Jxstar.loadSubData(subgrid, pkvalue);
							}
						}
					}
					
					//可以调整明细表的大小
					if (fm.subResizable && subp.el && (subp.outRe == null)) {
						var re = new Ext.Resizable(subp.el, {
							minHeight: 180, minWidth: 600,
							listeners:{resize:function(r, w, h){
								r.innerCmp.setWidth(w);
								r.innerCmp.setHeight(h);
							}}
						});
						re.innerCmp = subp;
						subp.outRe = re;
						subp.on('destroy', function(sp){
							sp.outRe.destroy(true); sp.outRe = null; delete sp.outRe;
						});
					}
					
					//如果主记录已提交，则明细表的按钮不能使用
					if (define.auditcol.length > 0) {
						//设置业务状态值
						var audit0 = '0', audit2 = '2', audit6 = '6';
						if (define.status) {
							audit0 = define.status['audit0'];
							audit2 = define.status['audit2'];
						}
						
						var state = form.get(define.auditcol);
						if (state == null || state.length == 0) state = audit0;
						var disable = (state != audit0 && state != audit6);
						
						//工具按钮是异步加载，需要延时执行
						JxUtil.delay(500, function(sg){
							if (sg.disabled === true) disable = true;
							var tools;
							if (define.isCloud) {
								JxUtil.disCloudTool(sg, disable);
								tools = JxUtil.getCloudTool(sg);
							} else {
								tools = sg.getTopToolbar();
								JxUtil.disableButton(tools, disable);
							}
							
							//设置子表在审批过程中保存按钮是否可用
							var subdef = sg.gridNode.define;
							var subEdit = subdef.subChkEdit||false;
							if (formNode.pageType.indexOf('chk') >= 0 && subEdit && state == audit2) {
								var btn = JxUtil.getButton(tools, 'save_eg');
								if (btn) {
									if (btn.enable) {btn.enable();} else {btn.disabled = false;}
								} else {
									//没子表保存按钮就取主表保存按钮
									btn = JxUtil.getButton(page.getTopToolbar(), 'save_chk');
									if (btn.enable) {btn.enable();} else {btn.disabled = false;}
								}
							}
						}, this, [subgrid]);
					}
				}
			};
			//打开form审批界面时subgrid is null，需要延时处理
			var tmpg = subps[0].getComponent(0);
			if (tmpg) {
				showsub();
			} else {
				JxUtil.delay(500, showsub);
			}
		});
		
		//修改单据信息后要刷新明细表数据
		this.initother(fevent);
	},
	
	//刷新表单明细数据与附件数据
	initother: function(fevent) {
		if (fevent.isreg) return;
		
		fevent.on('beforecreate', function(event) {
			fevent.fireEvent('initother', fevent);
		});
		fevent.on('aftercreate', function(event) {
			fevent.fireEvent('initother', fevent);
		});
		fevent.on('afteraudit', function(event) {
			fevent.fireEvent('initother', fevent);
		});
		fevent.on('aftercustom', function(event) {
			fevent.fireEvent('initother', fevent);
		});
		//标记已经注册过了刷新事件，不要重复注册
		fevent.isreg = true;
	},
	
	/**
	 * 在form界面上添加附件显示与上传控件
	 */
	formAddFile: function(config) {
		var fm = config.param;
		var define = Jxstar.findNode(fm.funid);
		
		var winid = 'form_file_'+JxUtil.newId();
		var ifrHtml = '<iframe frameborder="no" style="display:none;border-width:0;width:100%;height:100%;" ></iframe>';
		
		var attach_type = config.param.attach_type || '';
		var cfg = {//title:'图文附件', 
				id:winid, showType:'inform', baseCls:'xs-panel', iconCls:'x-tool-toggle', attach_type:attach_type, 
				cls:'sub_file', border:false, layout:'fit', hideCollapseTool:true, collapsible:true, 
				collapsed:false, anchor:'100%', height:55, items: [{
					xtype:'container',
					html: ifrHtml
				}]
			};
		
		fm.form_fileid = winid;
		fm.items[fm.items.length] = cfg;
	},
	
	/**
	 * 显示表单中的附件数据，与子表数据加载点相同
	 **/
	formShowFile: function(formNode) {
		var winid = formNode.param.form_fileid;
		if (!winid) return;
		var fevent = formNode.event;
		
		//每次改变form记录时重新加载明细表记录
		fevent.on('initother', function(event) {
			var define = event.define;
			var form = event.form;
			//审批中是否可以添加、删除附件
			var editFile = define.editCheckFile||false;
			
			var dataId = form.get(define.pkcol);
			if (!dataId || dataId.length == 0) dataId = form.tmpKeyId;
			//取记录状态，如果不是0或6，就不可以添加、删除附件
			var audit0 = '0';
			if (define.status) audit0 = define.status['audit0'];
			var state = form.get(define.auditcol);
			if (state == null || state.length == 0) state = audit0;
			var disable = (state != audit0 && state != '6');
			if (state == '2' && editFile) disable = false;//审批中可以修改附件
			
			var cmp = Ext.getCmp(winid);
			var attach_type = cmp.initialConfig.attach_type||'';
			var href = Jxstar.path+'/jxstar/other/upload/formfile.jsp?winid='+winid+'&attach_type='+attach_type+
				'&dataid='+dataId+'&datafunid='+define.nodeid+'&disable='+disable+
				'&tablename='+define.tablename+'&user_id='+Jxstar.session['user_id'];
			
			if (!cmp.getEl()) return;
			var frm = cmp.getEl().child('iframe');
			frm.dom.src = href + '&_dc=' + (new Date()).getTime();//避免缓存
			frm.show();
		});
		
		//修改单据信息后要刷新表单中的附件数据
		this.initother(fevent);
	}
	
	});//Ext.apply

})();