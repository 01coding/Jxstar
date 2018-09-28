Ext.ns('App');

Ext.onReady(function() {
    Ext.QuickTips.init();
    
    App.Gantt.init();
});

App.Gantt = {
    
    // Initialize application
    init : function(serverCfg) {        
        this.gantt = this.createGantt();
        
        var vp = new Ext.Viewport({
            layout : 'border',
            items : [
                {
                    region : 'north',
                    contentEl : 'north',
                    padding: '15px'
                },
                this.gantt
            ]
        });
    },
    
    beforeEdit : function(o) {
        var r = o.record;

        // Set the duration field to help the editor get the value
        if (o.field === 'Duration' && r.get('StartDate') && r.get('EndDate')) {
            var durationDays = Math.round(Sch.util.Date.getDurationInHours(r.get('StartDate'), r.get('EndDate'))/12) / 2;
            
            r.set('Duration', durationDays);
        }
    },
    
    afterEdit : function(o) {
        if (o.field === 'Duration') {
            var start = o.record.get('StartDate');
            o.record.set('EndDate', Sch.util.Date.add(start, Sch.util.Date.HOUR, o.value * 24));
        } else if (o.field === 'StartDate' && o.value) {
            var dur = o.record.get('EndDate') - o.originalValue;
            o.record.set('EndDate', Sch.util.Date.add(o.value, Sch.util.Date.MILLI, dur));
        }
    },
    
    createGantt : function() {
      
        var store = new Ext.ux.maximgb.tg.AdjacencyListStore({
            defaultExpanded : true,
    	    autoLoad : true,
            proxy : new Ext.data.HttpProxy({
                url : 'tasks.json',
                method:'GET'
            }),
		    reader: new Ext.data.JsonReader({idProperty : 'Id'}, [
                    // Mandatory fields
     	            {name:'Id'},
                    {name:'Name', type:'string'},
                    {name:'StartDate', type : 'date', dateFormat:'c'},
                    {name:'EndDate', type : 'date', dateFormat:'c'},
                    {name:'PercentDone'},
                    {name:'ParentId', type: 'auto'},
                    {name:'IsLeaf', type: 'bool'},

                    // Your task meta data goes here
                    {name:'Responsible'},
                    {name:'Duration', convert : function(v, data) { return Sch.util.Date.getDurationInDays(Date.parseDate(data.StartDate, 'Y-m-d'), Date.parseDate(data.EndDate, 'Y-m-d')); }}
                ]
            )
        });
        
        var dependencyStore = new Ext.data.JsonStore({   
            idProperty : 'Id',
            autoLoad : true,
            proxy : new Ext.data.HttpProxy({
                url : 'dependencies.json',
                method:'GET'
            }),
            fields : [
                // 3 mandatory fields
                {name:'From'},
                {name:'To'},
                {name:'Type'}
            ]
        });
        
        var g = new DemoGanttPanel({
            region : 'center',
            taskStore : store,
            dependencyStore : dependencyStore,
            //snapToIncrement : true,    // Uncomment this line to get snapping behavior for resizing/dragging.
            startDate : new Date(2010,0,4), 
            endDate : Sch.util.Date.add(new Date(2010,0,4), Sch.util.Date.WEEK, 20), 
            viewPreset : 'weekAndDayLetter'
        });
        
        
        g.on({
            dependencydblclick : function(ga, rec) {
                var from = store.getById(rec.get('From')).get('Name'),
                    to = store.getById(rec.get('To')).get('Name');
                Ext.Msg.alert('Hey', String.format('You clicked the link between "{0}" and "{1}"', from, to));
            },
            beforeedit: this.beforeEdit, 
            afteredit : this.afterEdit,
            scope : this
        });

        return g;
    }
};


// Fix onBlur bug in SpinnerField
// http://www.sencha.com/forum/showthread.php?97878-OPEN-905-Ext.ux.form.SpinnerField-change-event-does-not-fire&p=461703
if (!Ext.isIE && Ext.ux && Ext.ux.form && Ext.ux.form.SpinnerField && Ext.ux.form.SpinnerField.prototype.onBlur === Ext.emptyFn) {
    Ext.ux.form.SpinnerField.prototype.onBlur = Ext.ux.form.SpinnerField.superclass.onBlur;
}   