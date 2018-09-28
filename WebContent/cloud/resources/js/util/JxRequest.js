//访问jxstar服务器的对象
JxRequest = {
    post: function(params, hdcall, options) {
        var me = this, mask;
        if (params.indexOf('&user_code=') < 0) {
            params += '&user_code=' + me.curuser;
        }
        
        options = options || {};
		var contextpath = options.contextpath || JxUtil.getContextPath();
        var hasmask = (options.hasmask == null ? true : options.hasmask); //是否需要遮挡层
        var hashint = (options.hashint == null ? true : options.hashint); //是否需要提示信息
        var dataType = options.type || 'json'; //xml json
        var async = (options.async == null ? true : options.async); //true 为异步请求
        var timeout = options.timeout || 60000;
        
        var nousercheck = options.nousercheck || false; //不检查登录会话
        var url = contextpath+"/commonAction.do";
        if (nousercheck) {//如果不检查登录会话，则需要加标记
            url = contextpath+"/fileAction.do";
            params += '&nousercheck=1';
        }

        if (hasmask) {
            mask = new JxMask();
            mask.show();
        }
        $.ajax({
            method: 'post',
            url: url,
            data: params,
            async: async,
            //dataType: dataType,
            timeout: timeout,
            success: function(data) {
                var result = {};
                if (dataType == 'xml') {
                    var xdoc = $.parseXML(data);
                    //把xml响应对象解析为JSON对象
                    result.data = $(xdoc).find('data');
                    result.success = $(xdoc).find('success').val();
                    result.message = $(xdoc).find('message').val();
                } else {
                    //把响应字符串解析为JSON对象
                    result = JxUtil.decode(data);
                }

                //调整执行顺序，先销除myMask对象，再调用回调函数
                if (hasmask && mask) {
                    mask.hide();
                    mask = null;
                }

                if (result.success == true || result.success == 'true') {
                    var msg = result.message;
                    if (hashint) {
                        if (msg.length == 0) msg = '执行成功！';
                        JxHint.hint(msg);
                    }

                    //成功执行外部的回调函数
                    if (hdcall != null) hdcall(result.data, result.extData);
                } else {
                    //如果注册了执行失败的回调函数，则不提示失败消息
                    if (options && options.errorcall) {
                        options.errorcall(result);
                    } else {
                        var msg = result.message;
                        if (msg.length == 0) msg = '执行失败！';
                        JxHint.alert(msg);
                    }
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (options && options.errorcall) {
                    options.errorcall({message:'Ajax execute '+textStatus});
                } else {
                    JxHint.alert('请求后台执行异常：' + textStatus);
                }
            }
        });
    }
};
