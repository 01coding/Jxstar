JxUtil = {
	//对象转string
	encode : function(o){
		var r=[];
		if(typeof o=="string"){
			return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";
		}
		if(typeof o=="object"){
			if(!o.sort){
				for(var i in o){
					r.push("\""+i+"\":"+JxUtil.encode(o[i]));
				}
				if(!!document.all&&!/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)){
					r.push("toString:"+o.toString.toString());
				}
				r="{"+r.join()+"}";
			}else{
				for(var i=0;i<o.length;i++){
					r.push(JxUtil.encode(o[i]))
				}
				r="["+r.join()+"]";
			}
			return r;
		}
		return o.toString();
	},
	
    decode: function(js) {
        if (window.eval) {
        	return window.eval("(" + js + ")");
		} else {
			return window.execScript("(" + js + ")");
		}
    },
	
	//去掉中间与两端的空格
	trim: function(str, noall) {
		var result;
		result = str.replace(/(^\s+)|(\s+$)/g, "");
		if (!noall) result = result.replace(/\s/g, "");
		return result;
	},

    //把时间戳 YYYYMMddHHmmss 解析为日期或时间
	shortTime : function(ts, isbr) {
		if (!ts || ts.length < 14) return ts;
		if (ts.indexOf('-') > -1) {
			var re = /[-: ]/g;
			ts = ts.replace(re, '');
		}
		
		var cur = $.getTimeStamp();
		//如果是当天的时间，则只显示HH:mm，否则显示日期
		if (cur.substr(0, 8) == ts.substr(0, 8)) {
			return '今天'+(isbr ? '<br>':' ')+ts.substr(8, 2)+':'+ts.substr(10, 2);
		} else {
			return ts.substr(4, 2)+'-'+ts.substr(6, 2)+(isbr ? '<br>':' ')+ts.substr(8, 2)+':'+ts.substr(10, 2);//不要年份：ts.substr(0, 4)+'-'+
		}
	},
	
	//取项目名称
	getContextPath : function() {
		var contextPath = document.location.pathname; 
		var index =contextPath.substr(1).indexOf("/"); //这个地方可能有问题，要根据具体项目适当修改
		contextPath = contextPath.substr(0,index+1); 
		delete index; 
		return contextPath;
	}
};

//只验证，不提交
$.validator.setDefaults({
    debug: true,
    wrapper: "div",
    errorPlacement: function(error, element) {
    	var ep = $(element.parent());
    	if (ep.hasClass("field-group") || ep.hasClass("col-xs-8")) {
    		error.appendTo(element.parent());
    	} else {
    		error.appendTo(element.parent().parent());
    	}
    }
});
//添加手机号与邮箱地址验证
$.validator.addMethod("mobilecode",
    function(value, element, param) {
        value = JxUtil.trim(value);
        if (value.length == 0) return false;

        //var result = $.validator.methods['email'].call(this, value, element, param);
        //if (!result) {
            result = $.validator.methods['digits'].call(this, value, element, param);
            if (result) {
                if (value.length != 11) result = false;
            }
        //}

        return result;
    },
    '请输入手机号，用于登录账号与短信验证！'
);