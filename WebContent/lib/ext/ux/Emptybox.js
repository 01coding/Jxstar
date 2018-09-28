/**
 * reference Ext.form.Checkbox
 **/
Ext.form.Emptybox = Ext.extend(Ext.form.Field,  {

	//key is tag: 'input' type: 'check'
    defaultAutoCreate : { tag: 'label', html: ' '},

    actionMode : 'wrap',

    markInvalid : Ext.emptyFn,

    clearInvalid : Ext.emptyFn,

    onRender : function(ct, position){
        Ext.form.Emptybox.superclass.onRender.call(this, ct, position);
        if(this.inputValue !== undefined){
            this.el.dom.value = this.inputValue;
        }
        this.wrap = this.el.wrap({cls: 'x-form-empty-wrap'});
        if(this.boxLabel){
            this.wrap.createChild({tag: 'label', htmlFor: this.el.id, cls: 'x-form-cb-label', html: this.boxLabel});
        }

        // Need to repaint for IE, otherwise positioning is broken
        if(Ext.isIE){
            this.wrap.repaint();
        }
        this.resizeEl = this.positionEl = this.wrap;
    },

    onDestroy : function(){
        Ext.destroy(this.wrap);
        Ext.form.Emptybox.superclass.onDestroy.call(this);
    },

    initValue : Ext.emptyFn,

    getValue : function(){
        return '';
    },

    onClick : Ext.emptyFn,

    setValue : function(v){
        return this;
    },
	
	isDirty : function(){
		return false;
	}
});
Ext.reg('emptybox', Ext.form.Emptybox);
