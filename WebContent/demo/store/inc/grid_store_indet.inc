//config.param.average_fields = ['store_indet__in_num','store_mat__mat_price','store_indet__in_money'];
//config.param.hasQuery = false;

config.initpage = function(gridNode) {
    var grid = gridNode.page;
    
    var calu = function(record, field1, field2, field3) {
        var value = record.get(field1) * record.get(field2);
        record.set(field3, value);
    };

    //金额 = 数量 * 单价;
    grid.on('afteredit', function(e){
        if (e.field == 'store_indet__in_num') {
            calu(e.record, 'store_indet__in_num', 'store_mat__mat_price', 'store_indet__in_money');
        }
    });
};
