JxMask = function(target, settings){
    this.target = target || document.body;
    this.settings = $.extend({
        opacity: 0.8,
        z: 10000,
        bgcolor: '#000'
    }, settings);
};

JxMask.prototype = {
    show: function(){
        var me = this;
        this.maskDiv = $('<div > </div>').appendTo(me.target).css({
            position: 'absolute', 
            top: '0px', 
            left: '0px', 
            'z-index': me.settings.z, 
            width: $(me.target).width(), 
            height: $(me.target).height(), 
            'background-color': me.settings.bgcolor,
            opacity: me.settings.opacity
        }).show();
    },
    
    hide: function(){
        this.maskDiv.hide();
        $(this.maskDiv).remove();
    }
};