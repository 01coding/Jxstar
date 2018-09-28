/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.ns('Ext.ux.form');

/**
 * @class Ext.ux.form.FileUploadField
 * @extends Ext.form.TextField
 * Creates a file upload field.
 * @xtype fileuploadfield
 */
Ext.ux.form.FileUploadField = Ext.extend(Ext.form.DisplayField,  {
    /**
     * @cfg {String} buttonText The button text to display on the upload button (defaults to
     * 'Browse...').  Note that if you supply a value for {@link #buttonCfg}, the buttonCfg.text
     * value will be used instead if available.
     */
    buttonText: 'Browse...',
    /**
     * @cfg {Boolean} buttonOnly True to display the file upload field as a button with no visible
     * text field (defaults to false).  If true, all inherited TextField members will still be available.
     */
    buttonOnly: false,
    /**
     * @cfg {Number} buttonOffset The number of pixels of space reserved between the button and the text field
     * (defaults to 3).  Note that this only applies if {@link #buttonOnly} = false.
     */
    buttonOffset: 3,
    /**
     * @cfg {Object} buttonCfg A standard {@link Ext.Button} config object.
     */

    // private
    readOnly: true,
	
	/**
	 * 字段使用类型：
	 * file -- 原生用法，类似file控件；
	 * field -- 表单中的上传附件字段，直接上传附件
	 */
	useType: 'field',

    /**
     * @hide
     * @method autoSize
     */
    autoSize: Ext.emptyFn,

    // private
    initComponent: function(){
        Ext.ux.form.FileUploadField.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event fileselected
             * Fires when the underlying file input field's value has changed from the user
             * selecting a new file from the system file selection dialog.
             * @param {Ext.ux.form.FileUploadField} this
             * @param {String} value The file value returned by the underlying file input field
             */
            'fileselected'
        );
    },

    // private
    onRender : function(ct, position){
        Ext.ux.form.FileUploadField.superclass.onRender.call(this, ct, position);

        this.wrap = this.el.wrap({cls:'x-form-field-wrap x-form-file-wrap'});
        this.el.addClass('x-form-file-text');
        this.el.dom.removeAttribute('name');
		this.el.dom.style.backgroundColor = '#FFCC66';
        this.createFileInput();

        var btnCfg = Ext.applyIf(this.buttonCfg || {}, {
            text: this.buttonText
        });
		//添加缺省属性
		if (this.useType == 'field') {
			btnCfg.text = '';
			btnCfg.iconCls = 'upload_icon';
		}
		
        this.button = new Ext.Button(Ext.apply(btnCfg, {
            renderTo: this.wrap,
            cls: 'x-form-file-btn' + (btnCfg.iconCls ? ' x-btn-icon' : '')
        }));

        if(this.buttonOnly){
            this.el.hide();
            this.wrap.setWidth(this.button.getEl().getWidth());
        }

        this.bindListeners();
        this.resizeEl = this.positionEl = this.wrap;
    },
    
    bindListeners: function(){	
        this.fileInput.on({
            scope: this,
            mouseenter: function() {
                this.button.addClass(['x-btn-over','x-btn-focus'])
            },
            mouseleave: function(){
                this.button.removeClass(['x-btn-over','x-btn-focus','x-btn-click'])
            },
            mousedown: function(){
				if (this.useType == 'field') {
					//添加事件，处理按钮点击前的判断事件
					JxAttach.beforeChange(this);
				}
                this.button.addClass('x-btn-click')
            },
            mouseup: function(){
                this.button.removeClass(['x-btn-over','x-btn-focus','x-btn-click'])
            },
            change: function(){
                var v = this.fileInput.dom.value;
				var len = v.length;
				if (len > 0) {
					var pos = v.lastIndexOf('\\');
					if (pos >= 0) {
						v = v.substr(pos+1, len);
					}
				}
				len = JxUtil.strlen(v);
				var max = this.maxLength || 200;
				
				if (len <= max) {
					this.setValue(v);
					this.fireEvent('fileselected', this, v); 
					
					if (this.useType == 'field') {
						//选择附件后直接上传到系统中
						JxAttach.saveAttach(this);
					}
				} else {
					JxHint.alert(jx.req.maxlen + max);
					this.fileInput.dom.value = '';
				}
            }
        }); 
    },
    
    createFileInput : function() {
        this.fileInput = this.wrap.createChild({
            id: this.getFileInputId(),
            name: this.name||this.getId(),
            cls: 'x-form-file',
            tag: 'input',
            type: 'file',
            size: 1
        });
    },
    
    reset : function(){
        this.fileInput.remove();
        this.createFileInput();
        this.bindListeners();
        Ext.ux.form.FileUploadField.superclass.reset.call(this);
    },

    // private
    getFileInputId: function(){
        return this.id + '-file';
    },

    // private
    onResize : function(w, h){
        Ext.ux.form.FileUploadField.superclass.onResize.call(this, w, h);

        this.wrap.setWidth(w-10);

        if(!this.buttonOnly){
            var w = this.wrap.getWidth() - this.button.getEl().getWidth() - this.buttonOffset;
            this.el.setWidth(w);
        }
    },

    // private
    onDestroy: function(){
        Ext.ux.form.FileUploadField.superclass.onDestroy.call(this);
        Ext.destroy(this.fileInput, this.button, this.wrap);
    },
    
    onDisable: function(){
        Ext.ux.form.FileUploadField.superclass.onDisable.call(this);
		this.doDisable(true);
    },
    
    onEnable: function(){
        Ext.ux.form.FileUploadField.superclass.onEnable.call(this);
		this.doDisable(false);
    },
    
    // private
    doDisable: function(disabled){
		if (this.fileInput) {
			this.fileInput.dom.disabled = disabled;
		}
		if (this.button) {
			this.button.setDisabled(disabled);
		}
    },
	
    setReadOnly : function(readOnly){
		Ext.ux.form.FileUploadField.superclass.setReadOnly.call(this, readOnly);
		this.doDisable(readOnly);
    },

    // private
    preFocus : Ext.emptyFn,

    // private
    alignErrorIcon : function(){
        this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
    },
	
    getRawValue : function(){
        return this.value;
    },

    setRawValue : function(v){
		if (!Ext.isEmpty(v)) {
			var pos = v.lastIndexOf('\\');
			if (pos >= 0) {
				v = v.substr(pos+1, v.length);
			}
		} else {
			v = '';
		}
		this.value = v;
		this.originalValue = v;
		
		if (this.useType == 'field') {
			if(this.htmlEncode){
				v = Ext.util.Format.htmlEncode(v);
			}
			//计算附件标题显示长度
			var len = 12;
			if (this.el) {
				var w = this.el.getWidth();
				if (w > 120) len = Math.round(w/15);
			}
			v = Ext.util.Format.ellipsis(v, len);
			var myHtml = "<span onclick='JxAttach.deleteAttach(this)' class='clear_attach' title='删除文件'>&nbsp;&nbsp;&nbsp;&nbsp;</span>"+
						 "<a class='file_link' onclick='JxAttach.showAttach(this)' title='"+ this.value +"'>"+v+"</a>";
						 
			if (this.rendered) this.el.dom.innerHTML = (Ext.isEmpty(v) ? '' : myHtml);
		} else {
			if (this.rendered) this.el.dom.innerHTML = v;
		}
		
		return v;
    }
});

Ext.reg('fileuploadfield', Ext.ux.form.FileUploadField);

// backwards compat
Ext.form.FileUploadField = Ext.ux.form.FileUploadField;
