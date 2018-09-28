/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 同步请求对象。
 *
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */
function XmlRequest(method, url, async, params, username, password) {
    this.url = url;
    this.params = params;
    this.method = method || 'POST';
    this.async = (async != null) ? async: true;
    this.username = username;
    this.password = password;
};
XmlRequest.prototype.url = null;
XmlRequest.prototype.params = null;
XmlRequest.prototype.method = null;
XmlRequest.prototype.async = null;
XmlRequest.prototype.binary = false;
XmlRequest.prototype.username = null;
XmlRequest.prototype.password = null;
XmlRequest.prototype.request = null;
XmlRequest.prototype.isBinary = function() {
    return this.binary;
};
XmlRequest.prototype.setBinary = function(value) {
    this.binary = value;
};
XmlRequest.prototype.getText = function() {
    return this.request.responseText;
};
XmlRequest.prototype.isReady = function() {
    return this.request.readyState == 4;
};
XmlRequest.prototype.getDocumentElement = function() {
    var doc = this.getXml();
    if (doc != null) {
        return doc.documentElement;
    }
    return null;
};
XmlRequest.prototype.getXml = function() {
    var xml = this.request.responseXML;
    if (xml == null || xml.documentElement == null) {
        xml = mxUtils.parseXml(this.request.responseText);
    }
    return xml;
};
XmlRequest.prototype.getText = function() {
    return this.request.responseText;
};
XmlRequest.prototype.getStatus = function() {
    return this.request.status;
};
XmlRequest.prototype.create = function() {
    if (window.XMLHttpRequest) {
        return function() {
            var req = new XMLHttpRequest();
            if (this.isBinary() && req.overrideMimeType) {
                req.overrideMimeType('text/plain; charset=x-user-defined');
            }
            return req;
        };
    } else if (typeof(ActiveXObject) != "undefined") {
        return function() {
            return new ActiveXObject("Microsoft.XMLHTTP");
        };
    }
} ();
XmlRequest.prototype.send = function(onload, onerror) {
    this.request = this.create();
    if (this.request != null) {
        if (onload != null) {
            this.request.onreadystatechange = mxUtils.bind(this,
            function() {
                if (this.isReady()) {
                    onload(this);
                    this.onreadystatechaange = null;
                }
            });
        }
        this.request.open(this.method, this.url, this.async, this.username, this.password);
        this.setRequestHeaders(this.request, this.params);
        this.request.send(this.params);
    }
};
XmlRequest.prototype.setRequestHeaders = function(request, params) {
    if (params != null) {
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
};