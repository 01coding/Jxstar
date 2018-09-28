Ext.ns('App');

Ext.onReady(function() {App.Gantt.init(); });

App.Gantt = {
    
    // Initialize application
    init : function(serverCfg) {  
        Ext.QuickTips.init();      
    
        var start = new Date(2010,0,1),
            end = Sch.util.Date.add(start, Sch.util.Date.MONTH, 10);
       
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
                    {name:'BaselineStartDate', type : 'date', dateFormat:'c'},
                    {name:'BaselineEndDate', type : 'date', dateFormat:'c'},
                    {name:'PercentDone'},
                    {name:'ParentId', type: 'auto'},
                    {name:'IsLeaf', type: 'bool'},

                    // Your task meta data goes here
                    {name:'Responsible'}
                ]
            )
        });
        
        var dependencyStore = new Ext.data.JsonStore({   
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
        
        var g = new Sch.gantt.GanttPanel({
            height : 600,
            width: 1000,
            renderTo : Ext.getBody(),
            leftLabelField : 'Name',
            highlightWeekends : false,
            showTodayLine : true,
            loadMask : true,
            enableDependencyDragDrop : false,
            showBaseline : true,

            startDate : start, 
            endDate : end, 
            viewPreset : 'monthAndYear',
            
            // Setup your static columns
            columns : [
                {
                    header : 'Tasks', 
                    sortable:true, 
                    dataIndex : 'Name', 
                    locked : true,
                    width:250, 
                    editor : new Ext.form.TextField()
                }
            ],
            taskStore : store,
            dependencyStore : dependencyStore,
            plugins : [new Sch.plugins.Pan()],
            stripeRows : true,

            tbar : [
                {
                    text : 'Show baseline',
                    enableToggle : true,
                    pressed : true,
                    handler : function() {
                        g.el.toggleClass('sch-ganttpanel-showbaseline');
                    }
                }
            ]
        });
    }
};
