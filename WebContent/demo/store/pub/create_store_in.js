Jxstar.currentPage = function(define, pageParam) {
	var param = {};
	param.whereSql = 'store_in.auditing = ?';
	param.whereValue = '0';
	param.whereType = 'string';
	param.isfast = true;
	param.funTitle = define.nodetitle;
	Jxstar.createNode('store_in', param);
};