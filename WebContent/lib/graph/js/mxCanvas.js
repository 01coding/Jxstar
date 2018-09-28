var mxBasePath = 'lib/graph';

var onMxInit = function(editor) {
	mxConnectionHandler.prototype.connectImage = new mxImage('lib/graph/images/connector.gif', 16, 16);
	//取消提示信息
	editor.graph.setTooltips(false);
	//设置节点可以自动连接
	editor.graph.setConnectable(true);
	//设置自动连接时可以创建目标节点
	editor.graph.connectionHandler.setCreateTarget(true);
};

var mxCanvas = function(config) {
	var hideSplash = function() {
		var splash = document.getElementById('mx_splash');
		
		if (splash != null) {
			try {
				mxEvent.release(splash);
				mxEffects.fadeOut(splash, 100, true);
			} catch (e) {
				splash.parentNode.removeChild(splash);
			}
		}
	};
	
	try {
		if (!mxClient.isBrowserSupported()) {
			mxUtils.error('当前浏览器不支持绘图程序！', 200, false);
		} else {
			var node = mxUtils.load(config).getDocumentElement();
			var editor = new mxEditor(node);
			
			hideSplash();
		}
	} catch (e) {
		hideSplash();

		mxUtils.alert('不能打开绘图程序：'+e.message);
		throw e;
	}
	
	return editor;
};