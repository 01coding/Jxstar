	config.eventcfg = {
		dataImportParam: function(){
			var pfunid = this.grid.gridNode.parentNodeId;
            return {extendParam:'extparam_pfunid='+pfunid};
		}
        
    };