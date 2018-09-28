Ext.ux.DDRegion = function(id, sGroup, config) {
    this.cont = config.cont;
    Ext.ux.DDRegion.superclass.constructor.apply(this, arguments);
};

Ext.extend(Ext.ux.DDRegion, Ext.dd.DD, {
    cont: null,
    init: function() {
        Ext.ux.DDRegion.superclass.init.apply(this, arguments);
        this.initConstraints();
    },
    initConstraints: function() {
        var region = Ext.get(this.cont).getRegion();

        var el = this.getEl();
        var xy = Ext.get(el).getXY();

        var width = parseInt(Ext.get(el).getStyle('width'), 10);
        var height = parseInt(Ext.get(el).getStyle('height'), 10);

        var left = xy[0] - region.left;
        var right = region.right - xy[0] - width;

        var top = xy[1] - region.top;
        var bottom = region.bottom - xy[1] - height;

        this.setXConstraint(left, right, 10);
        this.setYConstraint(top, bottom, 10);
    }
});