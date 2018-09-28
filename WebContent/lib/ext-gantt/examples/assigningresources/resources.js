Ext.ns('App');

Ext.onReady(function() {App.Gantt.init(); });

App.Gantt = {
    
    // Initialize application
    init : function(serverCfg) {  
        Ext.QuickTips.init();      
        this.grid = this.createGrid();
    },
    
    createGrid : function() {
       
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
                    {name:'ParentId'},
                    {name:'IsLeaf', type: 'bool'},

                    // Your task meta data goes here
                    {name:'AssignedResources'}
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
                {name:'From'},
                {name:'To'},
                {name:'Type'}
            ]
        });

        var staffCombo = new Ext.ux.form.LovCombo({
		    width:100,
		    hideOnSelect:false,
		    maxHeight:200,
		    store:new Ext.data.ArrayStore({
			    idIndex:0,
			    fields:[{ name:'id', type:'int'}, 'name'],
			    data:[
				    [1, 'Mike'],
				    [2, 'John'],
				    [3, 'Kent'],
				    [4, 'Doug'],
				    [5, 'Anna']
			    ]
		    }),
		    triggerAction:'all',
		    valueField:'id',
		    displayField:'name',
		    mode:'local'
	    });

        var staffCombo2 = staffCombo.cloneConfig();

        var g = new Sch.gantt.GanttPanel({
            height : 600,
            width: 1000,
            renderTo : Ext.getBody(),
            
            // Just a field name, no editing...
            leftLabelField : 'Name',

            // ... or a custom object, with editor, dataIndex and renderer defined
            rightLabelField : {
                dataIndex : 'AssignedResources',
                editor : staffCombo,
                renderer : Ext.util.Format.multiComboRenderer(staffCombo)
            },

            eventRenderer : function(task) {
                if (task.get('AssignedResources')) {
                    // This task has resources assigned, show a little icon
                    return {
                        ctcls : 'resources-assigned'
                    };
                }
            },

            highlightWeekends : true,
            showTodayLine : true,
            loadMask : true,
            enableDependencyDragDrop : false,
            snapToIncrement : true,

            startDate : new Date(2010,0,11), 
            endDate : Sch.util.Date.add(new Date(2010,0,4), Sch.util.Date.WEEK, 20), 
            viewPreset : 'weekAndDayLetter',
            
            // Setup your static columns
            columns : [
                {
                    header : 'Tasks', 
                    dataIndex : 'Name', 
                    locked : true,
                    width:250
                },
                {
                    header : 'Assigned Resources', 
                    width:150, 
                    dataIndex : 'AssignedResources',
                    locked : true,
                    editor : staffCombo2,
                    renderer : Ext.util.Format.multiComboRenderer(staffCombo2)
                }
            ],
            taskStore : store,
            dependencyStore : dependencyStore,
            plugins : [new Sch.plugins.Pan()],
            stripeRows : true
        });
        
        return g;
    }
};

Ext.util.Format.multiComboRenderer = function(combo){  
    return function(value){ 
    	var valueList = [],
    	    findArr = value.split(','),
    	    i, l=findArr.length;

    	for (i=0; i<l; i++) {
    		if (record = combo.findRecord(combo.valueField, findArr[i])) {
    			valueList.push(record.get(combo.displayField));
    		}
    	}
    	return valueList.join(', ');
    };
};
