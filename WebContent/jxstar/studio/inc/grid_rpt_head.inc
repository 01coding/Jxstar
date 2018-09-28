
	config.initpage = function(gridNode){
		var grid = gridNode.page;
		grid.on('rowclick', function(g, rowindex, e) {
			var frm = Ext.get('frm_designer_report').dom;
			if (frm == null) return;
			var seldiv = frm.contentWindow.getSelectDiv();
			if (seldiv != null) {
				var record = g.getStore().getAt(rowindex);
				
				seldiv.oldRecord = seldiv.curRecord;
				seldiv.curRecord = record;
				seldiv.titleField = 'rpt_head__display';
				seldiv.positionField = 'rpt_head__col_pos';
			}
		});
	};