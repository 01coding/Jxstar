/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 构建标签打印工具方法，动态加载。
 * 
 * @author TonyTan
 * @version 1.0, 2015-01-24
 */

JxLabPrint = {};
(function(){

Ext.apply(JxLabPrint, {
	
	PRELODOP: null,
	
	//约定1mm = 3.779527px ; 1in = 2.54cm = 25.4mm = 72pt = 96px 
	PN: 3.779527,
	
	//显示预览界面
	showPreView: function(codes) {
		//加载插件对象
		if (typeof getLodop == 'undefined') {
			JxUtil.loadJS('/report/html/LodopFuncs.js', true);
		}
		
		LODOP = getLodop();
		if (!LODOP) {
			alert('没有安装打印插件，安装完成后需要重新登录系统，插件才能生效！');
			return;
		}
		
		JxUtil.eval(codes);
		LODOP.SET_SHOW_MODE("HIDE_PAPER_BOARD",true);//隐藏走纸板
		LODOP.PREVIEW();
		LODOP = null;
	},
	
	/**
	* 直接打印条码标签（不显示预览）
	**/
	printBarCode:function(codes) {
		//加载插件对象
		if (typeof getLodop == 'undefined') {
			JxUtil.loadJS('/report/html/LodopFuncs.js', true);
		}
		
		LODOP = getLodop();
		if (!LODOP) {
			alert('没有安装打印插件，安装完成后需要重新登录系统，插件才能生效！');
			return;
		}
		
		JxUtil.eval(codes);
		var printerName = Jxstar.systemVar.labprint__printer__name||'';
		if (printerName.length > 0) {
		   LODOP.SET_PRINTER_INDEX (printerName);
		}
	    LODOP.PRINT();
	},
	
	/**
	* private 构建所有标签打印的代码
	* datas -- 选择的记录对象，格式如：[{field1:'', field2:'', field3:''},{...}]
	* config -- 模板设计信息，格式如：{model_index, model_name, width, height, colnum, design_set}
	* dataPage --当前批次
	* pagenum -- 每批次的标签数量
	**/
	buildCodes_page: function(datas, config, dataPage, dataNum) {
		var me = this;
		var width = parseFloat(config.lab_width);
		var height = parseFloat(config.lab_height);
		var colnum = parseInt(config.colnum||1);
		var coljx = parseFloat(config.coljx||0);
		var top = parseFloat(config.lab_top||0);
		var left = parseFloat(config.lab_left||0);
		
		var desjs = config.design_set;
		
		//取页面初始化代码
		var codes = 'LODOP.PRINT_INITA("'+top+'mm","'+left+'mm","'+(width*colnum)+'mm","'+height+'mm","'+config.model_name+'");\r\n';
		var colindx = 0, offset = 0;//如果有多列(也称为‘多排’)，则输出整行数据后再输出下一行数据
		for (var i = 0; i < dataNum; i++) {
		    var k = dataPage*dataNum+i;
			if (k >= datas.length) {
			  break;
			}
			codes += me.labPage(datas[k], desjs, offset);
			
			if (colindx == colnum-1) {//新起一页
				offset = 0;
				colindx = 0;
				codes += 'LODOP.NewPage();\r\n';
			} else {//设置下次填充第几列
				colindx++;
				offset = colindx*(width+coljx)*me.PN;//约定1mm = 3.779527px
			}
		}
		
		//设置打印纸张大小，保证预览效果
		codes += 'LODOP.SET_PRINT_PAGESIZE(1,"'+(width*colnum)+'mm","'+height+'mm","CreateCustomPage");\r\n';
		
		return codes;
	},
	
	/**
	* private 构建所有标签打印的代码
	* datas -- 选择的记录对象，格式如：[{field1:'', field2:'', field3:''},{...}]
	* config -- 模板设计信息，格式如：{model_index, model_name, width, height, colnum, design_set}
	**/
	buildCodes: function(datas, config) {
		var me = this;
		var width = parseFloat(config.lab_width);
		var height = parseFloat(config.lab_height);
		var colnum = parseInt(config.colnum||1);
		var coljx = parseFloat(config.coljx||0);
		var top = parseFloat(config.lab_top||0);
		var left = parseFloat(config.lab_left||0);
		
		var desjs = config.design_set;
		
		//取页面初始化代码
		var codes = 'LODOP.PRINT_INITA("'+top+'mm","'+left+'mm","'+(width*colnum)+'mm","'+height+'mm","'+config.model_name+'");\r\n';
		
		var colindx = 0, offset = 0;//如果有多列(也称为‘多排’)，则输出整行数据后再输出下一行数据
		//for (var i = 0; i < datas.length; i++) {
		//改成一次取多只预览6条数据(2017-2-22)
		var pageNum = 6;
		if (datas.length < 6) {
		    pageNum = datas.length;
		}
		for (var i = 0; i < pageNum; i++) {
			codes += me.labPage(datas[i], desjs, offset);
			
			if (colindx == colnum-1) {//新起一页
				offset = 0;
				colindx = 0;
				codes += 'LODOP.NewPage();\r\n';
			} else {//设置下次填充第几列
				colindx++;
				offset = colindx*(width+coljx)*me.PN;//约定1mm = 3.779527px
			}
		}
		
		//设置打印纸张大小，保证预览效果
		codes += 'LODOP.SET_PRINT_PAGESIZE(1,"'+(width*colnum)+'mm","'+height+'mm","CreateCustomPage");\r\n';
		return codes;
	},

	/**
	* private 构建一个打印页，需要解析打印js中的字段值，如果有偏移量，则需要调整X的值
	*         注意：如果字段值中有,，则解析时会出现问题
	* data -- 一条记录值，格式如：{field1:'', field2:'', field3:''}
	* desjs -- 模板设计信息，是LODOP脚本
	* offset -- 如果是N排，则是向右的偏移量
	**/
	labPage: function(data, desjs, offset) {
		var me = this;
		var ajs = desjs.split(/\r\n?|\n/);
		var codes = '';
		
		//第一行是：LODOP.PRINT_INITA(0,0,"80.8mm","40mm","标准标签打印");不要了，在外部处理好
		//一般代码格式如：LODOP.ADD_PRINT_TEXTA("[mat_code]",104,95,103,22,"[mat_code]");
		//需要解析的代码有：ADD_PRINT_TEXT、ADD_PRINT_BARCODE、ADD_PRINT_IMAGE
		//先判断是否有[]格式的参数，如果有则说明是字段名
		for (var i = 1; i < ajs.length; i++) {//第一行是页面初始化，不需要
			var code = ajs[i];
			var re = /"\[[^\]]+\]"/;
			if (code.search(re) >= 0) {//[^]]+
				var str = code.match(re)[0];
				//alert(str);
				//根据字段名取值
				var field = str.substr(2, str.length-4);
				var value = '';
				
				Ext.iterate(data, function(key, item){
					if (key.indexOf('__' + field) >= 0 || key == field) {
						item = Ext.isDate(item) ? item.dateFormat('Y-m-d') : item;
						value = item;
						return false;
					}
				});
				
				//替换字段值，找最后一个,，取最后一段用值替换
				var lix = code.lastIndexOf(',');
				code = code.substring(0, lix) + ',"' + value + '");';
			}
			//处理X偏移量，解析参数
			if (typeof offset == 'number' && offset > 0) {
				code = me.parseOffset(code, offset);
			}
			
			codes += code + "\r\n";
		}
		return codes;
	},
	
	//解析单行代码中的LEFT值
	parseOffset: function(code, offset) {
		if (code.indexOf('LODOP.ADD_PRINT_') < 0) return code;
		
		//处理X偏移量，解析参数；匹配URL中会报错
		//var params = code.match(/\([\S]+\)/)[0];
		var params = code.split('(')[1].split(')')[0];
		//重新构建代码
		code = code.split('(')[0] + '(';
		var nn = 0;//记录数字变量个数
		//var pp = params.substring(1, params.length-1).split(',');
		var pp = params.split(',');
		for (var j = 0; j < pp.length; j++) {
			var left = parseFloat(pp[j]);
			if (!isNaN(left)) {
				nn++;
				//第2个数字变量就是left参数，要增加偏移量
				if (nn == 2) pp[j] = left+offset;
			} 
			code += pp[j];
			if (j < pp.length-1) code += ',';
		}
		code += ');';
		return code;
	},
	
	/**
	* private 构建一个预览页，考虑多排效果
	* desjs -- 模板设计信息，是LODOP脚本
	* param = {
	* 	colnum -- 几排
	* 	width -- 每页宽度，mm
	* 	height -- 每页高度，mm
	* 	title -- 打印标题
	* 	coljx -- 水平间隙
	* 	top -- 上边距，mm
	* 	left -- 左边距，mm
	* }
	**/
	preCodes: function(desjs, param) {
		var width = parseFloat(param.lab_width);
		var height = parseFloat(param.lab_height);
		var colnum = parseInt(param.colnum||1);
		var coljx = parseFloat(param.coljx||0);
		var top = parseFloat(param.lab_top||0);
		var left = parseFloat(param.lab_left||0);
		
		var me = this;
		var onepage = function(desjs, offset) {
			var ajs = desjs.split('\r\n');
			var codes = '';
			for (var i = 1; i < ajs.length; i++) {
				//处理X偏移量，解析参数
				var code = ajs[i];
				if (offset > 0) {
					code = me.parseOffset(code, offset);
				}
				codes += code + "\r\n";
			}
			return codes;
		};

		//取页面初始化代码
		var codes = 'LODOP.PRINT_INITA("'+top+'mm","'+left+'mm","'+(width*colnum)+'mm","'+height+'mm","'+param.title+'");\r\n';
		for (var i = 0; i < colnum; i++) {
			var offset = i*(width+coljx)*me.PN;
			codes += onepage(desjs, offset);
		}
		//设置打印纸张大小，保证预览效果
		codes += 'LODOP.SET_PRINT_PAGESIZE(1,"'+(width*colnum)+'mm","'+height+'mm","CreateCustomPage");\r\n';
		return codes;
	}
});//Ext.apply

})();
