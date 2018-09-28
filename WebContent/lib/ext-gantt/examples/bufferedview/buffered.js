Ext.ns('App');

Ext.onReady(function() { App.Gantt.init(); });

App.Gantt = {
    
    // Initialize application
    init : function(serverCfg) {  
        Ext.QuickTips.init();      
    
        var start = new Date(2009, 11, 29),
            end = Sch.util.Date.add(start, Sch.util.Date.WEEK, 40);
       
        var store = new Ext.ux.maximgb.tg.AdjacencyListStore({
            defaultExpanded : true,
    	    autoLoad : true,
            proxy : new Ext.data.HttpProxy({
                url : 'tasks.js',
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
                    {name:'Responsible'}
                ]
            )
        });
        
        var dependencyStore = new Ext.data.JsonStore({   
            autoLoad : true,
            proxy : new Ext.data.HttpProxy({
                url : 'dependencies.js',
                method:'GET'
            }),
            fields : [
                // 3 mandatory fields
                {name:'From', type:'string'},
                {name:'To', type:'string'},
                {name:'Type'}
            ]
        });
        
        var g = new Sch.gantt.GanttPanel({
            height : 350,
            width: 1000,
            renderTo : Ext.getBody(),
            leftLabelField : 'Name',
            rightLabelField : 'Name',
            highlightWeekends : false,
            loadMask : true,
            
            view : new Sch.gantt.BufferedGanttView({
	            scrollDelay : false
            }),
            
            startDate : start, 
            endDate : end, 
            viewPreset : 'weekDateAndMonth',
            
            // Setup your static columns
            columns : [
                {
                    header : 'Tasks', 
                    dataIndex : 'Name', 
                    locked : true,
                    width:250
                }
            ],
            taskStore : store,
            dependencyStore : dependencyStore,
            trackMouseOver : false,
            stripeRows : true
        });
        
        return g;
    }
};

