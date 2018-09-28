/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 表单页面常用事件实现类。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Ext.ns('Jxstar');
Jxstar.FormEvent = function(define) {
	this.define = define;
	this.page = null;	//表单页面FormPanel
	this.form = null;	//表单对象BasicForm
	//设置业务状态值
	this.audit0 = '0';
	this.audit1 = '1';
	this.audit2 = '2';
	this.audit3 = '3';
	this.audit5 = '5';
	this.audit6 = '6';
	this.audit_b = '';
	this.audit_e = '7';//可以用于终止与注销
	if (this.define.status) {
		this.audit0 = this.define.status['audit0'];
		this.audit1 = this.define.status['audit1'];
		this.audit2 = this.define.status['audit2'];
		this.audit3 = this.define.status['audit3'];
		this.audit_b = this.define.status['audit_b'];
		this.audit_e = this.define.status['audit_e'];
	}
	this.addEvents(
		/**
		* @param {Jxstar.FormEvent} this
		**/
		'beforecreate', 
		/**
		* @param {Jxstar.FormEvent} this
		* @param {JSON[]} data
		**/
		'aftercreate', 
		/**
		* @param {Jxstar.FormEvent} this
		**/
		'beforesave', 
		/**
		* @param {Jxstar.FormEvent} this
		* @param {JSON[]} data
		**/
		'aftersave', 
		/**
		* @param {Jxstar.FormEvent} this
		**/
		'beforedelete', 
		/**
		* @param {Jxstar.FormEvent} this
		* @param {JSON[]} data
		**/
		'afterdelete', 
		/**
		* @param {Jxstar.FormEvent} this
		**/
		'beforeaudit', 
		/**
		* @param {Jxstar.FormEvent} this
		* @param {JSON[]} data
		**/
		'afteraudit', 
		/**
		* @param {Jxstar.FormEvent} this
		**/
		'beforecopy', 
		/**
		* @param {Jxstar.FormEvent} this
		* @param {JSON[]} data
		**/
		'aftercopy',
		/**
		* @param {Jxstar.FormEvent} this
		* @param eventcode
		**/
		'beforecustom', 
		/**
		* @param {Jxstar.FormEvent} this
		* @param {JSON[]} data
		* @param eventcode
		**/
		'aftercustom',
		/**
		* @param {Jxstar.FormEvent} this
		**/
		'initother',
		/**
		* @param {Jxstar.FormEvent} this
		* @param {{reportId:'', printType:'', printScope:'', printMode:''}} data
		**/
		'beforeprint',
		/**
		* @param {Jxstar.FormEvent} this
		* @param {{reportId:'', printType:'', printScope:'', printMode:''}} data
		**/
		'afterprint',
		/**
		* @param {Jxstar.FormEvent} this
		* @param eventtype: agree, back, check
		**/
		'beforecheck'
	);

	Jxstar.FormEvent.superclass.constructor.call(this, define);
};

(function(){

Ext.extend(Jxstar.FormEvent, Ext.util.Observable, {
	/**
	* public 销毁事件对象
	**/
	myDestroy : function() {
		this.define = null;		delete this.define;
		this.page = null;		delete this.page;
		this.form = null;		delete this.form;
	},

	/**
	* public
	* 设置事件对象操作的表单
	**/
	setPage : function(page) {
		this.page = page;
		this.form = page.getForm();
	},
	
	/**
	* public
	* 自定义通用事件
	**/
	customEvent : function(eventCode, notConfirm, notSelected) {
		var keyid = this.getPkField().getValue();
		if (!notSelected) {
			if (keyid == null || keyid.length == 0) {
				JxHint.alert(jx.event.nosave);	//当前记录没有保存，不能操作！
				return;
			}
		}
	
		if (this.fireEvent('beforecustom', this, eventCode) == false) return;
	
		var self = this;
		var hdcall = function() {
			//回调函数
			var endcall = function(data) {
				self.fireEvent('aftercustom', self, data, eventCode);
			};
		
			//设置请求的参数
			var params = 'funid='+ self.define.nodeid +'&keyid=' + keyid;
			params += '&pagetype=form&eventcode=' + eventCode;

			//发送请求
			Request.postRequest(params, endcall);
		};
		//'提示', '确定执行当前操作吗？'
		if (notConfirm && (notConfirm == '1' || notConfirm == true)) {
			hdcall();
		} else {
			Ext.Msg.confirm(jx.base.hint, jx.event.doyes, function(btn) {
				if (btn == "yes") hdcall();
			});
		}
	},
	
	/**
	* public
	* 表单初始化事件，显示每条记录都会执行
	* ispop -- 是否弹出窗口
	**/
	initForm: function(ispop) {
		var self = this;
		var record = self.form.myRecord;
		var toolBar = self.page.getTopToolbar();
		var formnode = self.page.formNode;
		
		if (record) {
			//记录状态
			var state = record.get(self.define.auditcol);
			if (state == null || state.length == 0) state = self.audit0;
			
			//如果是subform，则必须用父记录状态值判断
			var audit0 = self.audit0, audit2 = self.audit2, audit6 = self.audit6;	
			
			//如果子表的form，则取父表的auditing值
			var pageType = self.page.formNode.pageType;
			if (pageType == 'subform') {
				var parentGrid = JxUtil.getParentGrid(self.form.myGrid);
				if (!parentGrid) {//cloud布局中找不到父表格，改为通过form找
					parentGrid = JxUtil.getParentForm(self.form.myGrid).myGrid;
				}
				if (parentGrid) {
					var records = parentGrid.getSelectionModel().getSelections();
					if (records.length > 0) {
						var pdef = parentGrid.gridNode.define;
						if (pdef.status) {//如果父功能定义了业务状态
							audit0 = pdef.status.audit0;
							audit6 = pdef.status.audit6;
						}
						//取父记录的状态值
						state = records[0].get(pdef.auditcol);
						if (state == null || state.length == 0) state = audit0;
					}
				}
			}
			
			var dealEditState = function() {
				//没有编辑权限
				var noedit = (formnode.right.edit == '0');
				//已复核记录设置表单为只读，编辑按钮不能使用
				if (noedit || state != null) {
					//设置只读值
					var readOnly = noedit || (state != audit0 && state != audit6);
					JxUtil.disableButton(toolBar, readOnly);
						
					//修改审批中子表单的保存按钮为可以使用状态
					if(self.form.myGrid) {
						var subdef = self.form.myGrid.gridNode.define;
						var subEdit = subdef.subChkEdit||false;
					}
					
					if (pageType == 'subform' && subEdit && state == audit2) {
							var btn = JxUtil.getButton(toolBar, 'save');
							if (btn.enable) {btn.enable();} else {btn.disabled = false;}
					} else {
						JxUtil.readOnlyForm(self.form, readOnly);
					}
					
					
					//新增按钮开放可以操作，如果是子功能表单，则不处理
					if (!noedit && pageType == 'form') {
						var createBtn = JxUtil.getButton(toolBar, 'create');
						if (createBtn) createBtn.setDisabled(false);
						var unaudit = JxUtil.getButton(toolBar, 'unaudit');
						if (unaudit) unaudit.setDisabled(false);
					}
				}
			}
			//处理如果是弹出窗口，则需要等待工具栏加载完后再处理
			if (ispop == true) {
				JxUtil.delay(500, function(){
					dealEditState();
				});
			} else {
				dealEditState();
			}
		}
		//清除脏标记，设置最新的原始值
		JxUtil.clearDirty(self.form);
		
		var nodeId = self.define.nodeid;
		//支持根据租户配置不同审批节点的界面
		var iswfld = Jxstar.systemVar.saas__wf__field || '0';
		//处理审批过程中可以修改字段的显示状态
		var dataId = this.getPkField().getValue();
		if ((state == self.audit2 || state == self.audit5) && formnode.pageType.indexOf('chk') >= 0) {
			if (iswfld == '1') {//审批界面
				JxUtil.showCheckField(nodeId, dataId, self.form, '1');
			} else {
				JxUtil.showCheckEdit(nodeId, dataId, self.form);
			}
		} else {
			if (iswfld == '1') {
				var param = self.page.pageParam;
				if (param && param.processid) {//预览单据界面
					JxUtil.showCheckField(param.nodeid, param.processid, self.form, '2');
				} else {//单据界面
					var issa = Jxstar.systemVar.sys__saas__run || '0';
					if (issa == '1') {
						var b = (state == self.audit1 || state == self.audit3);//已提交或已审批后不处理可编辑
						JxUtil.showCheckField(nodeId, dataId, self.form, '0', b);
					}
				}
			}
		}
		
		//加载图片控件的图片
		if (!Ext.isEmpty(dataId)) {
			var images = self.page.findByType('imagefield');
			if (images && images.length > 0) {
				Ext.each(images, function(item){
					var v = item.getValue();
					if (v.length == 0) {
						item.loadImage(Ext.BLANK_IMAGE_URL);
					} else {
						item.loadImage();
					}
				});
			}
		}
		
		//如果字段值长度超过了field控件长度，支持显示提示信息
		var showtip = Jxstar.systemVar.edit__field__showtip || '0';
		if (showtip == '1') {
			JxUtil.delay(500, function(){
				JxUtil.fieldValueTip(self.page);
			});
		}
		
		//显示审核标志
		if (Jxstar.systemVar.edit__check__flag == '1') {
			JxUtil.showAuditFlag(self);
		}
		
		self.fireEvent('initother', self);
		return self.initOther();
	},
	
	/**
	* public
	* 表单初始化事件，用于外部扩展
	**/
	initOther : function() {},

	/**
	* public
	* 新增事件
	**/
	create : function() {
		var self = this;
		if (self.form.myRecord && self.form.isDirty()) {
			if (confirm(jx.event.saveyes)) {	//记录已被修改，是否需要先保存？
				self.save();return;
			}
		}
		//创建数据对象
		var record = self.createRecord();
		self.form.myRecord = record;
		self.form.loadRecord(record);
		self.form.clearInvalid();//新建时不显示异常信息
		
		self.form.tmpKeyId = JxUtil.getTmpKeyId();//构建临时主键，用于附件保存与子表数据外键
		
		//新增记录后开放记录可以编辑
		JxUtil.readOnlyForm(self.form, false);
		var toolBar = self.page.getTopToolbar();
		JxUtil.disableButton(toolBar, false);
		
		//清除图片控件的图片
		var images = self.page.findByType('imagefield');
		if (images && images.length > 0) {
			Ext.each(images, function(item){
				item.clearImage();
			});
		}
		//清除标志
		if (Jxstar.systemVar.edit__check__flag == '1') {
			JxUtil.showAuditFlag(self);
		}

		if (self.fireEvent('beforecreate', self) == false) return;
	},

	/**
	* private
	* 新增一个数据记录对象。
	**/
	createRecord : function() {
		var self = this;
		//表单模型
		var fm = self.form;
		
		var record = null;
		
		//功能存储对象，从grid对象中传递过来的
		var store = fm.myStore;
		if (store == null) {
			record = self.newEmptyRecord();
		} else {
			record = new (store.reader.recordType)({});
		}
		
		var cols = record.fields.keys;
		//给每个字段给缺省值
		for (var i = 0; i < cols.length; i++){
			var field = fm.findField(cols[i]);
			if (field == null) continue;
			
			var defaultval = field.defaultval;
			if (typeof defaultval == 'string' && defaultval.indexOf('fun_') == 0) {
				var val = eval('JxDefault.' + defaultval.split('fun_')[1]);
				record.set(cols[i], val);
			} else if (typeof defaultval == 'undefined') {
				if (cols[i] == self.define.auditcol) {
					record.set(cols[i], self.audit0);
				} else {
					record.set(cols[i], '');
				}
			} else {
				record.set(cols[i], defaultval);
			}
		}

		return record;
	},
	
	/**
	* public
	* 根据现有数据值创建一个数据记录对象，暂时应用于单form页面中，如：功能扩展页、字段扩展页。
	**/
	newRecord : function(data) {
		//创建空记录对象
		var record = this.newEmptyRecord();
		
		//添加记录值
		var cols = record.fields.keys;
		Ext.each(cols, function(f){
			record.set(f, data[f]);
		});

		return record;
	},
	
	/**
	* private
	* 创建一个空的数据记录对象。
	**/
	newEmptyRecord: function() {
		var fields = [];
		var fm = this.form;
		
		fm.fieldItems().each(function(f){
			if (f.isFormField) {
				var type = f.getXType();
				if (type == 'datefield') {
					type = 'date';
				} else if (type == 'numberfield') {
					type = 'float';
				} else {
					type = 'string';
				}
				
				var o = {name: f.getName(), type:type};
				fields[fields.length] = o;
			}
		});
		
		return new (Ext.data.Record.create(fields))();
	},

	/**
	* public
	* 删除事件
	**/
	del : function() {
		var self = this;		
		var keyid = self.getPkField().getValue();
		if (keyid == null || keyid.length == 0) {
			JxHint.alert(jx.event.nokey);	//当前记录没有主键值，不能操作！
			return;
		}
	
		if (this.checkAudit(self.audit1, 'del')) return;
		if (this.fireEvent('beforedelete', this) == false) return;

		//删除提交
		var hdcall = function() {
			//设置请求的参数
			var params = 'funid='+ self.define.nodeid +'&keyid=' + keyid;
			params += '&pagetype=form&eventcode=delete';

			//删除后要处理的内容
			var endcall = function(data) {
				//清除脏标记，设置最新的原始值
				JxUtil.clearDirty(self.form);
				//删除表格中的数据
				var record = self.form.myRecord;
				if (record != null) {
					var store = self.form.myStore;
					if (store != null) store.remove(record);
				}
				//删除记录后新增一条记录
				self.create();
				
				self.fireEvent('afterdelete', self, data);
			};

			//发送请求
			Request.postRequest(params, endcall);
		};
		//'确定删除当前记录吗？'
		Ext.Msg.confirm(jx.base.hint, jx.event.delyes, function(btn) {
			if (btn == "yes") hdcall();
		});
	},

	//private 保存相关子表数据；支持设置子表的外键值
	saveSub: function(mkey, isimp) {
		var subfunid = this.define.subfunid;
		if (subfunid == null || subfunid.length == 0) return;
		
		//取表单容器对象
		var ct = this.page;
		if (this.define.isFormTab) ct = this.page.findParentByType('tabpanel');
		
		var subids = subfunid.split(',');
		//找到功能的子表panel
		var subpns = ct.findBy(function(c){
			if (c.getXType() == 'editorgrid' && c.gridNode) {
				var funid = c.gridNode.nodeId;
				for (var i = 0, n = subids.length; i < n; i++) {
					if (funid == subids[i]) return true;
				}
			}
			return false;
		});
		//可编辑表格执行保存
		for (var i = 0, n = subpns.length; i < n; i++) {
			if (mkey) {
				subpns[i].gridNode.page.fkValue = mkey;
			} 
			//导入数据时只处理外键，不处理保存
			if (!isimp) {
				subpns[i].gridNode.event.editSave();
			}
		}
	},

	/**
	* public
	* 保存事件
	**/
	save : function(impcall, auditcall) {
		var self = this;

		if (this.checkAudit(self.audit1, 'save')) return;
		if (this.fireEvent('beforesave', this) == false) return;
		
		//取主键值，如果有主键值是保存，否则为新增
		var eventcode = 'save';
		var keyid = this.getPkField().getValue();
		if (keyid.length == 0) {
			eventcode = 'create';
		}
		//主表没有修改，只需执行子表数据保存
		if (eventcode == 'save' && !this.form.isDirty()) {
			self.saveSub();
			
			//自动提交提示
			if (auditcall && typeof auditcall == 'function') {
				var hs = jx.event.auditsave;//'当前数据已保存，需要自动提交吗？';
				if (!JxUtil.isModifyForm(this.page)) {
					hs = jx.event.audityes;
				}
				Ext.Msg.confirm(jx.base.hint, hs, function(btn) {
					if (btn == 'yes') {auditcall();}
				});
			}
			return;
		}
		
		//设置请求的参数
		var params = 'funid='+ this.define.nodeid + '&keyid=' + keyid;
			params += JxUtil.getFormValues(this.form, false);
			params += '&pagetype=form&eventcode=' + eventcode;
		//如果是树形结构记录保存，则必须取到树形级别字段
		var mygrid = self.form.myGrid;
		if (mygrid != null) {
			//添加树型参数
			var attr = mygrid.treeNodeAttr;
			if (attr) {
				var parentId = attr.id;
				var levelCol = attr.node_level;
				params += '&parentId=' + parentId + '&levelCol=' + levelCol;
		
				if (typeof(levelCol) == "undefined" || levelCol =="undefined") {	
					if (this.define.regtype == "treemain") {
						alert(jx.event.formop);//"请重新打开功能，等树型加载完后再操作！"
						return;
					}
				}
			}

		}
		
		//取所有修改了值的字段，保存时用
		if (eventcode !== 'create') {
			params += '&dirtyfields=' + JxUtil.getDirtyFields(this.form);
		} else {
			params += '&tmpkeyid=' + this.form.tmpKeyId;
		}

		//添加外键值
		var fkv = this.form.fkValue ? this.form.fkValue : '';
		params += '&fkValue=' + fkv;
		
		//保存后处理的内容
		var endcall = function(data) {
			var mkey = '';//取主键值
			//取其对应的数据对象，在Jxstar.openSubForm方法中赋值的;
			var record = self.form.myRecord;		
			//如果是新增记录，则反馈后台新增的主键值与编码
			//如果是保存，可能存在后台构建的值需要反馈
			for(var key in data) {
				var field, val = data[key];
				if (key == 'keyid')	{
					field = self.getPkField();
					if (field) field.osetValue(val);
					mkey = val;
				} else {
					key = key.replace('.', '__');
					field = self.form.findField(key);
					if (field) field.osetValue(val);
				}
			}
			
			if (eventcode == 'create') {
				//外键值必须赋值，否则有问题
				var fkn = self.form.fkName;
				if (fkv.length > 0 && fkn && fkn.length > 0) {
					self.form.findField(fkn).osetValue(fkv);
				}
				delete self.form.tmpKeyId;
			}

			//更新表格中的数据
			if (record != null) {
				self.form.updateRecord(record);
				record.commit();
				
				//如果是新增记录，则在表格中增加一条记录
				if (eventcode == 'create') {
					var store = self.form.myStore;
					if (store != null) {
						store.insert(0, record);
						store.commitChanges();
					}
					
					//移动表格中的数据
					var grid = self.form.myGrid;
					if (grid != null) {
						grid.getSelectionModel().selectFirstRow();
					}
					
					//添加外键值并保存子表数据
					if (impcall && typeof impcall == 'function') {//子表导入数据时临时保存主表数据
						self.saveSub(mkey, true);
						JxUtil.delay(500, function(){
							impcall();
						});
					} else {
						self.saveSub(mkey);
					}
				}
			}
			if (eventcode == 'save') {
				self.fireEvent('aftersave', self, data);
			} else {
				self.fireEvent('aftercreate', self, data);
			}
			
			//清除脏标记，设置最新原始值
			JxUtil.clearDirty(self.form);
			
			//执行子表格数据保存
			if (eventcode == 'save') {
				self.saveSub();
			}
			
			//自动提交提示
			if (auditcall && typeof auditcall == 'function') {
				Ext.Msg.confirm(jx.base.hint, jx.event.auditsave, function(btn) {//'当前数据已保存，需要自动提交吗？'
					if (btn == 'yes') {auditcall();}
				});
			}
		};
		//发送请求
		Request.postRequest(params, endcall);
	},

	/**
	* private
	* 提交时：检查是否存在已复核的记录；取消时：检查是否存在未复核记录
	* auditval -- 1 表示删除、保存、提交检查；0 表示反提交检查
	**/
	checkAudit: function(auditval, srctype) {
		var self = this;
		if (Ext.isEmpty(auditval)) auditval = self.audit1;
		if (Ext.isEmpty(srctype)) srctype = 'audit';

		//数据校验，删除时不用检查
		if (srctype != 'del') {
			//isValidBlank方法：不检查数据的必填项
			if (srctype == 'save') {
				//保存时是否检查必填项
				var chk = Jxstar.systemVar.edit__check__blank||'0';
				var valid = (chk == '1') ? self.form.isValid() : self.form.isValidBlank();
				if (!valid) {
					JxHint.alert(jx.event.datavalid);
					return true;
				}
			}
			
			//提交时检查：请确保输入的数据正确完整！
			if (srctype == 'audit' && !self.form.isValid()) {
				JxHint.alert(jx.event.datavalid);
				return true;
			}
		}
		
		var auditcol = self.define.auditcol;
		if (Ext.isEmpty(auditcol)) return false;
		var record = self.form.myRecord;
		var state = record.get(auditcol);
		if (Ext.isEmpty(state)) state = self.audit0;
		
		if (auditval == self.audit0) {
			if (state != self.audit1){
				JxHint.alert(jx.event.curaudit0);	//'当前记录不是已提交，不能操作！'
				return true;
			}
		} else if (auditval == self.audit1) {
			//调整为审批中的记录可以保存修改
			if (state != self.audit0 && state != self.audit2 && state != self.audit5 && state != self.audit6){
				JxHint.alert(jx.event.curaudit1);	//'当前记录已提交，不能操作！'
				return true;
			}
		}

		return false;
	},

	/**
	* public
	* 提交事件
	**/
	audit : function() {
		var s = Jxstar.systemVar.edit__audit__save||'0';
		if (s == '1') {
			var fn = function(){
				this.baseAudit(this.audit1, 'audit');
			};
			this.save(null, fn.createDelegate(this));
		} else {
			this.baseAudit(this.audit1, 'audit');
		}
	},

	/**
	* public
	* 取消提交事件
	**/
	unaudit : function() {
		this.baseAudit(this.audit0, 'unaudit');
	},
	
	/**
	* public
	* 退回事件
	**/
	auditBack : function() {
		if (Ext.isEmpty(this.audit_b)) {
			JxHint.alert(jx.event.auditbe);		//退回状态值为空，不能操作！
			return;
		}
		this.baseAudit(this.audit_b, 'audit_back');
	},
	
	/**
	* public
	* 注销事件
	**/
	auditCancel : function() {
		if (Ext.isEmpty(this.audit_e)) {
			JxHint.alert(jx.event.auditee);		//注销或终止状态值为空，不能操作！
			return;
		}
		this.baseAudit(this.audit_e, 'audit_cancel');
	},

	/**
	* private
	* 基础提交事件
	**/
	baseAudit : function(auditval, eventcode) {
		var keyid = this.getPkField().getValue();
		if (keyid == null || keyid.length == 0) {
			JxHint.alert(jx.event.nosave);		//'当前记录没有保存，不能操作！'
			return;
		}
		
		var self = this;
		var record = self.form.myRecord;
		if (self.form.isDirty()) {
			if (confirm(jx.event.saveyes)) {		//'记录已被修改，是否需要先保存？'
				self.save();return;
			} else {
				return;
			}
		}
		//Form内子表数据没有保存，不能提交
		if (JxUtil.checkSubGrid(self.page) == false) return;
		
		//检查必填的附件字段
		if (JxAttach.checkAttach(self.page) == false) return;

		//复核事件代码
		if (Ext.isEmpty(eventcode)) eventcode = 'audit';
		//取复核值
		if (Ext.isEmpty(auditval)) auditval = self.audit1;

		if (this.checkAudit(auditval)) return;
		if (this.fireEvent('beforeaudit', this) == false) return;

		//复核记录
		var hdcall = function() {
			//设置请求的参数
			var params = 'funid='+ self.define.nodeid +'&keyid='+ keyid;
			params += '&pagetype=form&eventcode='+eventcode+'&auditvalue='+auditval;
			
			//提交后要处理的内容
			var endcall = function(data) {
				//重新加载数据
				if (!Ext.isEmpty(data)) {
					Ext.iterate(data, function(key, value){
						record.set(key, value);
					});
					record.commit();
					self.form.loadRecord(record);
				}

				self.fireEvent('afteraudit', self, data);
				//清除脏标记，设置最新的原始值
				JxUtil.clearDirty(self.form);
				
				//调整编辑按钮与表单为只读属性
				var readOnly = (auditval == self.audit1);
				JxUtil.readOnlyForm(self.form, readOnly);
				var toolBar = self.page.getTopToolbar();
				JxUtil.disableButton(toolBar, readOnly);
				//新增按钮开放可以操作
				var createBtn = JxUtil.getButton(toolBar, 'create');
				if (createBtn) createBtn.setDisabled(false);
				//显示审核标志
				if (Jxstar.systemVar.edit__check__flag == '1') {
					JxUtil.showAuditFlag(self);
				}
				
				//提交后自动切换到表格界面
				if (s == '1') self.backGrid();
			};
			
			//处理检查项提示信息
			//result:{success:false, message:'', data:{}, extData:{}}
			var errorcall = function(result) {
				var extd = result.extData;
				if (extd && extd.checkMsg) {
					JxUtil.checkResult(extd);
				} else {
					var msg = result.message;
					if (msg.length == 0) msg = jx.req.faild;
					JxHint.alert(msg);
				}
			};

			//发送请求
			Request.postRequest(params, endcall, {errorcall:errorcall});
		};

		var shint = '';
 		if (auditval == self.audit0) {
			shint = jx.event.auditno;		//确定反复核当前记录吗？
 		} else if (auditval == self.audit_b) {
			shint = jx.event.auditback;		//确定退回当前记录吗？
 		} else if (auditval == self.audit_e) {
			shint = jx.event.auditcancel;	//确定注销当前记录吗？
 		} else {
			shint = jx.event.audityes;		//确定复核当前记录吗？
		}
		//自动提交
		var s = Jxstar.systemVar.edit__audit__save||'0';
		if (s == '1' && eventcode == 'audit') {
			hdcall();
		} else {
			Ext.Msg.confirm(jx.base.hint, shint, function(btn) {
				if (btn == "yes") hdcall();
			});
		}
	},
	
	/**
	* public
	* 显示html样式的审批表单
	**/
	viewHtmlReport : function() {
		var self = this;
		var funid = self.define.nodeid;
		var keyid = self.getPkField().getValue();
		if (keyid == null || keyid.length == 0) {
			JxHint.alert(jx.event.nosave);		//'当前记录没有保存，不能操作！'
			return;
		}
		
		var viewReport = function (reportId) {
			var pk = self.define.pkcol.replace('__', '.');
			var whereSql = pk + ' = ?';
			
			var title = self.define.nodetitle + '-' + jx.wf.form;
			var params = 'funid='+ funid +'&reportId='+ reportId +'&isCheck=true&printType=html&whereSql='+
						 whereSql +'&whereValue='+ keyid +'&whereType=string&user_id=' + Jxstar.session['user_id'];
			var url = Jxstar.path + "/report/html/htmlprint.jsp";
			
			window.tmp_print_title = title;
			window.tmp_print_params = params;
			
			window.open(url);
		};
	
		var hdCall = function(data) {
			if (data == null || data.length == 0) {
				JxHint.alert(jx.event.funnwf);//当前功能没有审批单定义！
				return;
			}
			
			viewReport(data[0].report_id);
		};
		
		//从后台取报表定义信息
		var params = 'funid=rpt_list&pagetype=grid&eventcode=checkrpt&selfunid='+ funid +'&dataid='+ keyid +'&repttype=form&wheresql=';
		Request.dataRequest(params, hdCall);
	},

	/**
	* private
	* 取当前主键值
	**/
	getPkField : function() {
		return this.form.findField(this.define.pkcol);
	},

	/**
	* public
	* 上一条
	**/
	preRecord : function() {
		var self = this;
		var record = this.form.myRecord;
		if (record != null) {
			if (self.form.isDirty()) {
				if (confirm(jx.event.saveyes)) {		//'记录已被修改，是否需要先保存？'
					self.save();return;
				}
			}

			var store = this.form.myStore;
			if (store != null) {
				var index = store.indexOf(record);
				if (index >= 1) {
					var cunidx = index-1;
					record = store.getAt(cunidx);
					this.form.myRecord = record;
					this.form.loadRecord(record);

					//移动表格中的数据
					var grid = this.form.myGrid;
					if (grid) {
						grid.getSelectionModel().selectRow(cunidx);
						grid.fireEvent('rowclick', grid, cunidx);
					}
					
					//表单初始化
					self.initForm();
					return true;
				} else {
					JxHint.alert(jx.event.firstrec);	//已经是第一条记录了！
				}
			}
		}
		return false;
	},

	/**
	* public
	* 下一条
	**/
	nextRecord : function() {
		var self = this;
		var record = self.form.myRecord;
		if (record != null) {
			if (self.form.isDirty()) {
				if (confirm(jx.event.saveyes)) {		//'记录已被修改，是否需要先保存？'
					self.save();return;
				}
			}

			var store = this.form.myStore;
			if (store != null) {
				var index = store.indexOf(record);
				if (index < 0) index = 0;//审批同意移到下一条时为-1，没找到原因
				if (index < store.getCount()-1) {
					var cunidx = index+1;
					record = store.getAt(cunidx);

					//刷新表单数据
					this.form.myRecord = record;
					this.form.loadRecord(record);

					//移动表格中的数据
					var grid = this.form.myGrid;
					if (grid) {
						grid.getSelectionModel().selectRow(cunidx);
						grid.fireEvent('rowclick', grid, cunidx);
					}
					
					//表单初始化
					self.initForm();
					return true;
				} else {
					JxHint.alert(jx.event.endrec);	//已经是最后一条记录了！
				}
			}
		}
		return false;
	},

	/**
	* public
	* 管理图文资料
	**/
	upload : function() {
		var keyid = this.getPkField().getValue();
		if (keyid == null || keyid.length == 0) {
			JxHint.alert(jx.event.nosave);
			return;
		}
		
		var self = this, define = this.define;
		//审批中是否可以添加、删除附件
		var editFile = define.editCheckFile||false;
		//没有状态字段，或未提交状态，附件可编辑
		var audit0 = '0';
		if (define.status) audit0 = define.status['audit0'];
		var state = self.form.get(define.auditcol);
		if (state == null || state.length == 0) state = audit0;
		var deled = (state == audit0 || state == '6');
		if (state == '2' && editFile) deled = true;
		
		//过滤条件，支持扩展方法（个人消息查看功能）
		var options = {};
		if (typeof this.uploadWhereParam == 'function') {
			options = this.uploadWhereParam();
		} else {
			options.where_sql = 'sys_attach.data_id = ? and sys_attach.table_name = ?';
			options.where_type = 'string;string';
			options.where_value = keyid+';'+define.tablename;
		}
		
		//加载数据
		var hdcall = function(grid) {
			//设置目标功能信息
			grid.attachDataId = keyid;
			grid.attachFunId = define.nodeid;
			grid.attachDeled = deled;
			//删除GRID的自定义参数
			grid.on('beforedestroy', function(gp){
				gp.attachDataId = null;		delete gp.attachDataId;
				gp.attachFunId = null;		delete gp.attachFunId;
				gp.attachDeled = null;		delete gp.attachDeled;
				gp = null;
				return true;
			});
			Jxstar.loadData(grid, options);
		};

		var srcDefine = Jxstar.findNode('sys_attach');
		//显示数据
		Jxstar.showData({
			filename: srcDefine.gridpage,
			title: srcDefine.nodetitle, 
			pagetype: 'editgrid',
			nodedefine: srcDefine,
			callback: hdcall
		});
	},

	/**
	* public
	* 打印当前记录
	**/
	print: function() {
		JxPrint.showWindow(this.page.formNode);
	},
	
	/**
	* public 
	* 审批同意选择的记录。
	**/
	agree: function() {
		if (this.fireEvent('beforecheck', this, 'agree') == false) return;
		
		this.basecheck('Y');
	},
	/**
	* public 
	* 退回编制人。
	**/
	chkback: function() {
		if (this.fireEvent('beforecheck', this, 'back') == false) return;
		
		this.basecheck('E');
	},
	//基础审批方法
	basecheck: function(checkType) {
		var self = this;
		var keyid = self.getPkField().getValue();
		if (keyid == null || keyid.length == 0) {
			JxHint.alert(jx.event.nokey);	//'当前记录没有主键值，不能操作！'
			return;
		}
		if (self.form.isDirty()) {
			if (confirm(jx.event.saveyes)) {//'记录已被修改，是否需要先保存？'
				self.save();return;
			}
		}

		var hdcall = function() {
			var params = 'funid=wf_assign&pagetype=chkgrid&eventcode=execheck&check_funid='+ self.define.nodeid;
			params += '&keyid=' + keyid;
			//缺省审批同意
			var checkDesc = jx.event.agree;	//同意
			if (checkType == 'E') checkDesc = jx.wf.advnew; //退回编制人
			params += '&check_type='+ checkType +'&check_desc='+ encodeURIComponent(checkDesc);
			
			//同意后表格数据刷新
			var endcall = function(data) {
				self.backGrid();
				//刷新流程中心的消息
				var xt = Ext.getCmp('x_main_tab_work');
				if (xt) {
					JxPortalExt.contentTypes['portlet_work'].refresh(xt.ownerCt);
				}
			};
			Request.postRequest(params, endcall);
		};
		//确定审批同意选择的记录吗？
		var hintDesc = jx.event.agreeyes;
		if (checkType == 'E') hintDesc = jx.event.auditback;
		Ext.Msg.confirm(jx.base.hint, hintDesc, function(btn) {
			if (btn == 'yes') hdcall();
		});
	},
	//提交后返还表格
	backGrid: function() {
		var me = this;
		var mygrid = me.form.myGrid;
		if (mygrid) {
			var store = mygrid.getStore();
			store.reload();
			if (me.define.isCloud) {
				var ct = JxCloud.apps[me.define.nodeid];
				var ly = ct.getLayout();
				ly.setActiveItem(0);
				ly.activeItem.doLayout();
			} else {
				var tab = me.page.findParentByType('tabpanel');
				if (tab) {
					tab.activate(tab.getComponent(0));
				}
			}
		}
	},
	
	/**
	* public 
	* 批量取回选择的记录。
	**/
	takecheck: function() {
		var self = this;
		var keyid = self.getPkField().getValue();
		if (keyid == null || keyid.length == 0) {
			JxHint.alert(jx.event.nokey);	//'当前记录没有主键值，不能操作！'
			return;
		}

		var hdcall = function() {
			var params = 'funid=wf_assign&pagetype=chkgrid&eventcode=takecheck&check_funid='+ self.define.nodeid;
			params += '&keyid=' + keyid;
			//缺省审批同意
			var checkType = 'Y', checkDesc = String.format(jx.event.takedesc, JxDefault.getUserName());	//该任务被【{0}】取回！
			params += '&check_type='+ checkType +'&check_desc='+ encodeURIComponent(checkDesc);
			
			Request.postRequest(params, null);
		};
		//确定取回选择的审批记录吗？
		Ext.Msg.confirm(jx.base.hint, jx.event.takeyes, function(btn) {
			if (btn == 'yes') hdcall();
		});
	},
	//审批催办
	tocheck: function() {
		var self = this;
		var keyid = self.getPkField().getValue();
		if (keyid == null || keyid.length == 0) {
			JxHint.alert(jx.event.nokey);
			return;
		}
		
		var params = 'funid=sysevent&eventcode=tocheck&check_funid='+ self.define.nodeid +'&keyid=' + keyid;
		Request.postRequest(params, null);
	},
	
	/**
	* public 
	* 弹出完成分配任务界面。
	**/
	check: function() {
		//记录当前审批的表单
		JxUtil.myCheckForm = this.page;
		if (this.fireEvent('beforecheck', this, 'check') == false) return;
		
		this.baseWf('check_work', false);
	},
	
	/**
	* public 
	* 查看审批进度
	**/
	showassign: function() {
		this.baseWf('check_work', true);
	},
	
	/**
	* public 
	* 执行审批撤销
	**/
	takecheck: function() {
		var self = this;
		
		var funId =  self.define.nodeid;
		var keyid = self.getPkField().getValue();
		if (keyid == null || keyid.length == 0) {
			JxHint.alert(jx.event.nokey);
			return;
		}
		var hdcall = function() {
			var params = 'funid=wf_task&pagetype=chkgrid&eventcode=takecheck&check_funid='+ funId +'&keyid='+ keyid;
			
			//填写任务取回标志
			var checkType = 'K', checkDesc = String.format(jx.event.takedesc, JxDefault.getUserName());	//该任务被【{0}】取回！
			params += '&check_type='+ checkType +'&check_desc='+ encodeURIComponent(checkDesc);
			
			var endcall = function(data) {
				var grid = self.form.myGrid;
				if (grid) {
					//重新加载数据
					grid.getStore().reload();
					//并返回表格
					if (self.define.isCloud) {
						var ct = JxCloud.apps[funId];
						var ly = ct.getLayout();
						ly.setActiveItem(0);
						ly.activeItem.doLayout();
					}
				}
			};
			
			Request.postRequest(params, endcall);
		};
		//确定取回选择的审批记录吗？
		Ext.Msg.confirm(jx.base.hint, jx.event.takeyes, function(btn) {
			if (btn == 'yes') hdcall();
		});
	},
	
	/**
	* private 
	* 查看流程信息的基础函数。
	**/
	baseWf: function(fileName, hideForm) {
		var self = this;
		var keyid = self.getPkField().getValue();
		if (keyid == null || keyid.length == 0) {
			JxHint.alert(jx.event.nokey);	//'当前记录没有主键值，不能操作！'
			return;
		}
		if (self.form.isDirty()) {
			if (confirm(jx.event.saveyes)) {//'记录已被修改，是否需要先保存？'
				self.save();return;
			}
		}
		
		var funId =  self.define.nodeid;
		var appData = {funId:funId, dataId:keyid, hideForm:hideForm};
		JxUtil.showCheckWindow(appData, fileName);
	},
	
	/**
	* public 
	* 查看数据修改日志。
	**/
	editLog: function() {
		var nodeid = this.define.nodeid;
		var keyid = this.getPkField().getValue();
		if (keyid == null || keyid.length == 0) {
			JxHint.alert(jx.event.nosave);
			return;
		}
		
		//过滤条件
		var options = {};
			options.where_sql = '(fun_id = ? and data_id = ?) or (pfun_id = ? and pdata_id = ?)';
			options.where_type = 'string;string;string;string';
			options.where_value = nodeid+';'+keyid+';'+nodeid+';'+keyid;
		
		//加载数据
		var hdcall = function(grid) {
			JxUtil.delay(500, function(){Jxstar.loadData(grid, options);});
		};

		var df = Jxstar.findNode('sys_log_edit');
		//显示数据
		Jxstar.showData({
			filename: df.gridpage,
			title: df.nodetitle, 
			pagetype: 'editgrid',
			nodedefine: df,
			pagetype: 'query',
			callback: hdcall
		});
	},
	
	/**
	* public 
	* 直接打印
	* printMode -- 输出模式：0 预览，1 直接打印
	* printType -- 输出类型：html|xls
	* printScope -- 输出范围：select 选择，query 当前查询结果
	* reportId -- 报表定义ID：空表示取缺省报表，非空表示取指定报表
	**/
	dirPrint: function(printMode, printScope, printType, reportId) {
		if (!Ext.isString(printMode)) {
			printMode = '0'
		}
		
		printMode = printMode||'0';
		printScope = printScope||'select';
		printType = printType||'html';
		reportId = reportId||'';
		
		var pageNode = this.page.formNode;
		var funId = this.define.nodeid;
		//pageNode, funId, reportId, printType, printScope, printMode
		JxPrint.exePrint(pageNode, funId, reportId, printType, printScope, printMode);
	}
});

})();