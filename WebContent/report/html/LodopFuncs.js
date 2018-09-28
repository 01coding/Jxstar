var CreatedOKLodop7766 = null;

//====判断是否需要安装CLodop云打印服务器:====
function needCLodop() {
    try {
        var ua = navigator.userAgent;
        if (ua.match(/Windows\sPhone/i) != null) return true;
        if (ua.match(/iPhone|iPod/i) != null) return true;
        if (ua.match(/Android/i) != null) return true;
        if (ua.match(/Edge\D?\d+/i) != null) return true;

        var verTrident = ua.match(/Trident\D?\d+/i);
        var verIE = ua.match(/MSIE\D?\d+/i);
        var verOPR = ua.match(/OPR\D?\d+/i);
        var verFF = ua.match(/Firefox\D?\d+/i);
        var x64 = ua.match(/x64/i);
        if ((verTrident == null) && (verIE == null) && (x64 !== null)) return true;
        else if (verFF !== null) {
            verFF = verFF[0].match(/\d+/);
            if ((verFF[0] >= 42) || (x64 !== null)) return true;
        } else if (verOPR !== null) {
            verOPR = verOPR[0].match(/\d+/);
            if (verOPR[0] >= 32) return true;
        } else if ((verTrident == null) && (verIE == null)) {
            var verChrome = ua.match(/Chrome\D?\d+/i);
            if (verChrome !== null) {
                verChrome = verChrome[0].match(/\d+/);
                if (verChrome[0] >= 42) return true;
            };
        };
        return false;
    } catch(err) {
        return true;
    };
};

function showLodopInstall() {
    var ifrHtml = '<iframe frameborder="no" style="display:none;border-width:0;width:100%;height:100%;" ></iframe>';
    var win = new Ext.Window({
        width: 500,
        height: 200,
        html: ifrHtml
    });
    win.show();
    var href = window.contextpath + '/report/html/install.html?_dc=' + (new Date()).getTime();
    var frm = win.getEl().child('iframe');
    frm.dom.src = href;
    frm.show();
};
//====页面引用CLodop云打印必须的JS文件：====
if (needCLodop()) {
    /*var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
	var oscript = document.createElement("script");
	oscript.src ="http://localhost:8000/CLodopfuncs.js?priority=1";
	head.insertBefore( oscript,head.firstChild );

	//引用双端口(8000和18000）避免其中某个被占用：
	oscript = document.createElement("script");
	oscript.src ="http://localhost:18000/CLodopfuncs.js?priority=0";
	head.insertBefore( oscript,head.firstChild );*/

    //判断服务是否启动；为了实现动态加载CLodopfuncs.js，采用下面的加载方案
    JxUtil.delay(1000,
    function() {
        var state = getLodop().webskt.readyState;
        if (state == 0) {
            delete getLodop;
            delete getCLodop;
            alert('C-Lodop打印服务没有启动或Lodop打印插件没有安装！');
            showLodopInstall();
        }
    });

    JxUtil.loadJS('/report/html/CLodopfuncs.js', true);
};

//====获取LODOP对象的主过程：====
function getLodop(oOBJECT, oEMBED) {
    var LODOP;
    try {
        var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);
        if (needCLodop()) {
            try {
                LODOP = getCLodop();
            } catch(err) {};
            if (!LODOP && document.readyState !== "complete") {
                alert("C-Lodop没准备好，请稍后再试！");
                return;
            };
            if (!LODOP) {
                showLodopInstall();
                return;
            } else {

                if (CLODOP.CVERSION < "3.0.0.2") {
                    showLodopInstall();
                };
                if (oEMBED && oEMBED.parentNode) oEMBED.parentNode.removeChild(oEMBED);
                if (oOBJECT && oOBJECT.parentNode) oOBJECT.parentNode.removeChild(oOBJECT);
            };
        } else {
            var is64IE = isIE && (navigator.userAgent.indexOf('x64') >= 0);
            //=====如果页面有Lodop就直接使用，没有则新建:==========
            if (oOBJECT != undefined || oEMBED != undefined) {
                if (isIE) LODOP = oOBJECT;
                else LODOP = oEMBED;
            } else if (CreatedOKLodop7766 == null) {
                LODOP = document.createElement("object");
                LODOP.setAttribute("width", 0);
                LODOP.setAttribute("height", 0);
                LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
                if (isIE) LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
                else LODOP.setAttribute("type", "application/x-print-lodop");
                document.documentElement.appendChild(LODOP);
                CreatedOKLodop7766 = LODOP;
            } else LODOP = CreatedOKLodop7766;
            //=====Lodop插件未安装时提示下载地址:==========
            if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) {
                showLodopInstall();
                return LODOP;
            };
        };
        if (LODOP.VERSION < "6.2.1.8") {
            if (!needCLodop()) {
                showLodopInstall();
            };
            return LODOP;
        };
        //===如下空白位置适合调用统一功能(如注册语句、语言选择等):===
        LODOP.SET_LICENSES("广州市东宏软件科技有限公司", "F3903FE7C5EF8B1DD466A22E2B7E04F2", "", "");
        //===========================================================
        return LODOP;
    } catch(err) {
        alert("getLodop出错:" + err);
    };
};