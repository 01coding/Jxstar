/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * 可以上传图片、删除图片、显示图片的控件
 */
Ext.ux.form.JxImageField = Ext.extend(Ext.form.DisplayField, {
	/**
     * @cfg {String} imgStyle
     */
	imgStyle: '',
    /**
     * @cfg {String} addbtnCls
     */
	addbtnCls: 'fa x-tool-plus',
    /**
     * @cfg {String} delbtnCls
     */
	delbtnCls: 'fa x-tool-minus',
    /**
     * @cfg {String} addbtnCfg
     */
    /**
     * @cfg {String} delbtnCfg
     */
    /**
     * @cfg {String} readOnly
     */
	 
	 blankText : 'This field is required',
	 
	 allowBlank : true,
	 
	 value : '',
	 
    // private
    initComponent: function(){
        Ext.ux.form.JxImageField.superclass.initComponent.call(this);

        this.addEvents(
		/**
		* @param {Jxstar.GridEvent} this
		**/
		'beforesave', 
		/**
		* @param {Jxstar.GridEvent} this
		**/
		'aftersave',
		/**
		* @param {Jxstar.GridEvent} this
		* @param {Ext.data.Record[]} records
		**/
		'beforedelete', 
		/**
		* @param {Jxstar.GridEvent} this
		* @param {JSON[]} data
		**/
		'afterdelete'
		);
    },

    // private
    onRender : function(ct, position){
		Ext.ux.form.JxImageField.superclass.onRender.call(this, ct, position);
		
        this.wrap = this.el.wrap({cls:'x-form-field-wrap x-form-image-wrap'});
        this.el.hide();
		this.el.dom.removeAttribute('name');
        this.createImage();

		this.addbtn = this.wrap.createChild(this.addbtnCfg ||
                {tag: "i", cls: "x-form-image-btn x-tool " + this.addbtnCls, title: '上传图片', style:'padding:7px;right:38px;'});
		this.delbtn = this.wrap.createChild(this.delbtnCfg ||
                {tag: "i", cls: "x-form-image-btn x-tool " + this.delbtnCls, title: '删除图片', style:'padding:7px;right:12px;'});				
		this.initBtn();
		//在table布局中用
		this.wrap.setHeight(ct.getHeight()+10);
		
		this.resizeEl = this.positionEl = this.wrap;
    },
	
	// private
    afterRender : function(){
        Ext.ux.form.JxImageField.superclass.afterRender.call(this);
		if(this.rendered){
			this.loadImage(Ext.BLANK_IMAGE_URL);
		}
    },
    // private
    onResize : function(w, h){
        Ext.ux.form.JxImageField.superclass.onResize.call(this, w, h);
		//在fieldset中计算宽度不准，要减少10
        this.wrap.setWidth(w-10);
    },
	
    getErrors: function(value) {
        var errors = [];
        if (this.allowBlank == false && (value.length < 1 || value === this.emptyText)) {
            errors.push(this.blankText);
        }
		return errors;
	},
    isValid : function(){
        var valid = Ext.form.DisplayField.superclass.isValid.call(this);
		return valid;
    },
    validate : function(){
		var valid =  Ext.form.DisplayField.superclass.validate.call(this);
		return valid;
    },
	getRawValue : function() {
		return this.value;
	},
	getValue : function(){
        return this.getRawValue();
    },
    setValue : function(v){
		this.value = v;
        return this;
    },

    createImage : function() {
        this.imageEl = this.wrap.createChild({
            id: this.getImageId(),
            name: this.name||this.getId(),
            cls: 'x-form-image',
            tag: 'img',
            style: this.imgStyle,
            src: this.getImageUrl()
        });
    },
	
    getImageId : function(){
        return this.id + '-img';
    },
	
	getImageUrl : function(){
		return this.imageUrl || '';
	},
	
    initBtn : function(){
        this.mon(this.addbtn, 'click', this.onAddClick, this);
        this.addbtn.addClassOnOver(this.addbtnCls + '-over');
		
		this.mon(this.delbtn, 'click', this.onDelClick, this);
        this.delbtn.addClassOnOver(this.delbtnCls + '-over');
        
        var imgel = this.imageEl;
        //点击图片时显示放大的图片
        imgel.on('click', function(e){
        	JxAttach.previewImage('image_field', '浏览图片', imgel.dom.src);
        });
    },
	
    // private
    onDestroy : function(){
		Ext.destroy(this.imageEl, this.addbtn, this.delbtn, this.wrap);
		Ext.ux.form.JxImageField.superclass.onDestroy.call(this);
    },
	
    onDisable: function(){
        Ext.ux.form.JxImageField.superclass.onDisable.call(this);
        this.doDisable(true);
    },
    
    onEnable: function(){
        Ext.ux.form.JxImageField.superclass.onEnable.call(this);
        this.doDisable(false);
    },
	
    setReadOnly : function(readOnly){
		Ext.ux.form.JxImageField.superclass.setReadOnly.call(this, readOnly);
        this.doDisable(readOnly);
    },
    
    // private
    doDisable: function(disabled){
		if (this.addbtn && this.delbtn) {
			if (disabled) {
				this.addbtn.addClass(this.disabledClass);
				this.delbtn.addClass(this.disabledClass);
			} else {
				this.addbtn.removeClass(this.disabledClass);
				this.delbtn.removeClass(this.disabledClass);
			}
		}
		this.disabled = disabled;
    },
    
	// 加载附件中的图片
	loadImage : function(imageUrl){
		if (imageUrl) {
			this.imageUrl = imageUrl;
		} else {
			var param = JxAttach.attachParam(this, 'fdown');
			if (param == null) return;
			
			param = param.params;
			//加载图片前的事件
			if (this.loadImageParam) {
				param = this.loadImageParam(this);
			}
			
			this.imageUrl = Jxstar.path + '/fileAction.do?' + param + '&dataType=byte&nousercheck=1&dc=' + (new Date()).getTime();
		}
		this.imageEl.dom.src = this.imageUrl;
	},
	
	clearImage : function() {
		this.setValue('');
		if (this.imageEl) {
			this.imageUrl = Ext.BLANK_IMAGE_URL;
			this.imageEl.dom.src = this.imageUrl;
		}
	},
	
	//删除附件中的图片，并清空此控件中的图片
	onDelClick : function(){
		if (this.disabled) return;
		var self = this;
		var image_small_use = self.image_small_use||'0';
		var image_small_size = self.image_small_size||'600';
		var fdelete = self.deletecode ||'fdelete';
		
		var hdcall = function() {
			var param = JxAttach.attachParam(self, fdelete);
			if (param == null) return;
			//删除附件前事件
			if (self.fireEvent('beforedelete', self, param) == false) return;
			
			//设置业务状态值
			var audit0 = '0', audit6 = '6';
			if (param.define.status) {
				audit0 = param.define.status['audit0'];
			}
			var audit = audit0;
			if (param.define.auditcol.length > 0) {
				audit = param.form.get(param.define.auditcol);
			}
			if (audit != audit0 && audit != audit6) {
				JxHint.alert(jx.util.auditnd);//业务记录已提交，不能删除附件！
				return;
			}
			
			//清除附件字段值
			var hdcall = function() {
				//删除附件后事件
				self.fireEvent('afterdelete', self, param);
				
				self.loadImage();
			};
			
			
			// add by cch
			if(image_small_use == "1"){
				param.params += '&image_small_use=1&image_small_size='+image_small_size;
			}
			//发送删除请求
			Request.postRequest(param.params, hdcall);
		};
		
		//确定删除选择的记录吗？
		Ext.Msg.confirm(jx.base.hint, '确定删除当前图片附件吗？', function(btn) {
			if (btn == 'yes') hdcall();
		});
	},
	
	//上传图片，并显示在此控件中
	onAddClick : function(){
		if (this.disabled) return;
		//新增用于图片压缩。add by cch
		var image_small_use = this.image_small_use||'0';
		var image_small_size = this.image_small_size||'600';
		var fcreate = this.createcode || 'fcreate';
		var imageField = this;
		var imageName = this.name;
		var queryForm = new Ext.form.FormPanel({
				layout:'form', 
				labelAlign:'right',
				labelWidth:80,
				border:false, 
				baseCls:'x-plain',
				autoHeight: true,
				bodyStyle: 'padding: 20px 10px 0 10px;',
				items: [{
					anchor: '95%',
					allowBlank: false,
					xtype: 'fileuploadfield',
					useType: 'file',
					fieldLabel: jx.event.selfile,	//选择文件
					name: imageName,
					labelSeparator:'*', 
					buttonText: '',
					buttonCfg: {
						iconCls: 'upload_icon'
					}
				}]
			});

		//创建对话框
		var self = this;
		var win = new Ext.Window({
			title:jx.event.uptitle,	//上传附件
			layout:'fit',
			width:400,
			height:170,
			resizable: false,
			modal: true,
			closeAction:'close',
			items:[queryForm],

			buttons: [{
				text:jx.base.ok,	//确定
				handler:function(){
					var form = queryForm.getForm();
					if (!form.isValid()) return;
					var imageValue = form.get(imageName);
					
					var param = JxAttach.attachParam(imageField, fcreate);
					if (param == null) return;
					//上传附件前事件
					if (self.fireEvent('beforesave', self, param) == false) return;
					
					//上传参数
					var params = param.params + '&attach_name='+ encodeURIComponent(imageValue);
					// add by cch
					if(image_small_use == "1"){
						params += '&image_small_use=1&image_small_size='+image_small_size;
					}
					
					//上传成功后关闭窗口并显示图片
					var hdCall = function() {
						win.close();
						//上传附件后事件
						self.fireEvent('aftersave', self, param);
						//设置文件名，并标记不修改
						imageField.setValue(imageValue);
						imageField.originalValue = imageValue;
						//把文件名写入记录对象，防止刷新界面时不加载图片
						if (param.form && param.form.myRecord) {
							var record = param.form.myRecord;
							record.set(imageName, imageValue);
							record.commit();
						}
						
						imageField.loadImage();
					};
					//上传附件
					Request.fileRequest(form, params, hdCall);
				}
			},{
				text:jx.base.cancel,	//取消
				handler:function(){win.close();}
			}]
		});
		win.show();
	}
});

Ext.reg('imagefield', Ext.ux.form.JxImageField);