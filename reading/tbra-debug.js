// Mozilla 1.8 has support for indexOf, lastIndexOf, forEach, filter, map, some, every
// http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:indexOf
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(elt /*, from*/) {
		var len = this.length;
		var from = Number(arguments[1]) || 0;
		from = (from < 0)? Math.ceil(from): Math.floor(from);
		if (from < 0)
			from += len;
		for (; from < len; from++){
			if (from in this && this[from] === elt)
				return from;
		}
		return -1;
	};
}

// http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:lastIndexOf
if (!Array.prototype.lastIndexOf){
	Array.prototype.lastIndexOf = function(elt /*, from*/){
		var len = this.length;
		var from = Number(arguments[1]);
		if (isNaN(from)) {
			from = len - 1;
		} else {
			from = (from < 0)? Math.ceil(from): Math.floor(from);
			if (from < 0)
				from += len;
			else if (from >= len)
				from = len - 1;
		}
		for (; from > -1; from--){
			if (from in this &&this[from] === elt)
				return from;
		}
		return -1;
	};
}


// http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:forEach
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(fun /*, thisp*/) {
		var len = this.length;
		if (typeof fun != "function")
			throw new TypeError();
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) {
			if (i in this) 
				fun.call(thisp, this[i], i, this);
		}	
	};
}

// http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:filter
if (!Array.prototype.filter){
	Array.prototype.filter = function(fun /*, thisp*/){
		var len = this.length;
		if (typeof fun != "function")
			throw new TypeError();
		var res = new Array();
		var thisp = arguments[1];
		for (var i = 0; i < len; i++){
			if (i in this){
				var val = this[i]; // in case fun mutates this
				if (fun.call(thisp, val, i, this))
					res.push(val);
			}
		}
		return res;
	};
}


// http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:map
if (!Array.prototype.map){
	Array.prototype.map = function(fun /*, thisp*/){
		var len = this.length;
		if (typeof fun != "function")
			throw new TypeError();
		var res = new Array(len);
		var thisp = arguments[1];
		for (var i = 0; i < len; i++){
			if (i in this)
				res[i] = fun.call(thisp, this[i], i, this);
		}
		return res;
	};
}

// http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:some
if (!Array.prototype.some) {
	Array.prototype.some = function(fun /*, thisp*/){
		var len = this.length;
		if (typeof fun != "function")
			throw new TypeError();
		var thisp = arguments[1];
		for (var i = 0; i < len; i++){
			if (i in this && fun.call(thisp, this[i], i, this))
				return true;
		}
		return false;
	};
}


// http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:every
if (!Array.prototype.every) {
	Array.prototype.every = function(fun /*, thisp*/){
		var len = this.length;
		if (typeof fun != "function")
			throw new TypeError();
		var thisp = arguments[1];
		for (var i = 0; i < len; i++){
			if (i in this && !fun.call(thisp, this[i], i, this))
				return false;
		}
		return true;	};
}

/**
 * ����һ�����飬Generic ����Ҳ�����ڽ� arguments/NodeList ת��Ϊ���顣
 */
Array.prototype.copy = function () {
	var len = this.length;
	var res = new Array(len);
	for (var i = 0; i < len; i++) {
		res[i] = this[i];
	}
	return res;
};

/**
  * �Ƴ������е�ָ��Ԫ��
  * Ϊ���ִ�������ԣ������˷��� 
 */
Array.prototype.remove = function(elt) {
	var i = this.indexOf(elt);
	if (i != -1)
		this.splice(i, 1);
};

/**
 * Generic�� indexOf/lastIndexOf/forEach/filter/map/some/every/copy 8������ԭ�ͷ���
 * ��ʹ�� Array.xxxx ����ʽ���ã��磺
 * 		arr.forEach(fun) 
 * Ҳ���Ը�дΪ 
 * 		Array.forEach(arr, fun);
 * ͬʱ��Array.xxxxx ����ʽ֧�ִ��� arguments/NodeList ������Ϊ��һ������ 
 */
(function(){
	['indexOf','lastIndexOf','forEach','filter','map','some','every','copy'].forEach(
		function(m) {
			if (!Array[m]) {
				Array[m] = function(scope){
					return Array.prototype[m].apply(scope, Array.prototype.slice.call(arguments, 1));
				};
			}
		}
	);
})();



/***************** String ******************/
if (!String.prototype.toQueryParams) {
	String.prototype.toQueryParams = function() {
		var hash = {};
		var params = this.split('&');
		var rd = /([^=]*)=(.*)/;
		for (var j = 0; j < params.length; j++) {
			var match = rd.exec(params[j]);
			if (!match) continue;
			var key = decodeURIComponent(match[1]);
			var value = match[2]?decodeURIComponent(match[2]) : undefined;
			if (hash[key] !== undefined) {
				if (hash[key].constructor != Array)
					hash[key] = [hash[key]];
				if (value) 
					hash[key].push(value);
			} else {
				hash[key] = value;
			}
		}
		return hash;
	}
}

if (!String.prototype.trim) {
	String.prototype.trim = function(){ 
	    var re = /^\s+|\s+$/g;
	    return function(){ return this.replace(re, ""); };
	}();
}

if (!String.prototype.replaceAll) {
	String.prototype.replaceAll = function(from, to){
		return this.replace(new RegExp(from, 'gm'), to);
	}
}

/**
 * ȡ�������
 * @param {Object} n �������
 */
Math.randomInt = function(n) {
	return Math.floor(Math.random() * (n + 1));	
}
/**
 * ���ñ���
 */

$D = YAHOO.util.Dom;
$E = YAHOO.util.Event;
$ = $D.get;

TB = YAHOO.namespace('TB');
TB.namespace = function() {
	var args = Array.prototype.slice.call(arguments, 0), i;
	for (i = 0; i < args.length; ++i) {
		if (args[i].indexOf('TB') != 0) {
			args[i] = 'TB.' + args[i];
		}
	}
	return YAHOO.namespace.apply(null, args);
}

/********* Env *********/
TB.namespace('env');
TB.env = {
	hostname: 'taobao.com',
	debug: false,
	lang: 'zh-cn' /*(navigator.userLanguage?navigator.userLanguage.toLowerCase():navigator.language.toLowerCase())*/
};

/******** Locale ********/
TB.namespace('locale');
TB.locale = {
	Messages: {},
	getMessage: function(key) {
		return TB.locale.Messages[key] || key;
	},
	setMessage: function(key, value) {
		TB.locale.Messages[key] = value;
	}
}
$M = TB.locale.getMessage;

/******** Trace *********/
TB.trace = function(msg) {
	if (!TB.env.debug) return;
	if (window.console) {
		window.console.debug(msg);
	} else {
		alert(msg);
	}
}

/********* TB.init *********/
TB.init = function() {
	this.namespace('widget', 'dom', 'bom', 'util', 'form', 'anim');

	if (location.hostname.indexOf('taobao.com') == -1) {
		TB.env.hostname = location.hostname;
		TB.env.debug = true;
	}

	var scripts = document.getElementsByTagName("script");
	var scriptName = /tbra(?:[\w\.\-]*?)\.js(?:$|\?(.*))/;
	var matchs;
	for (var i = 0; i < scripts.length; ++i) {
		if(matchs = scriptName.exec(scripts[i].src)) {
			TB.env['path'] = scripts[i].src.substring(0, matchs.index);
			if (matchs[1]) {
				var params = matchs[1].toQueryParams();
				for (n in params) {
					if (n == 't' || n == 'timestamp') {
						TB.env['timestamp'] = parseInt(params[n]);
						continue;
					}
					TB.env[n] = params[n];
				}				
			}
		}
	}
	YAHOO.util.Get.css(TB.env['path'] + 'assets/tbra.css' + (TB.env.timestamp?'?t='+TB.env.timestamp+'.css':''));	
}
TB.init();/**
 * TB Common function
 */
TB.common = {
	/**
	 * �Ƴ�����ǰ��Ŀհ��ַ�
	 * 
	 * @method trim
	 * @param {String} str 
	 * @deprecated ʹ��String.prototpye.trim()�����
	 */
	trim: function(str) {
		return str.replace(/(^\s*)|(\s*$)/g,''); 
	},

	/**
	 * ����HTML (from prototype framework 1.4)
	 * @method escapeHTML
	 * @param {Object} str
	 */
	escapeHTML: function(str) {
		var div = document.createElement('div');
		var text = document.createTextNode(str);
		div.appendChild(text);
		return div.innerHTML;
	},

	/**
	 * ����HTML (from prototype framework 1.4)
	 * @method unescapeHTML
	 * @param {Object} str
	 */
	unescapeHTML: function(str) {
		var div = document.createElement('div');
		div.innerHTML = str.replace(/<\/?[^>]+>/gi, '');
		return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
	},
	
	/**
	 * ɾ���ַ����е�(x)html�еı�ǩ��Ϣ
	 * @method stripTags
	 * @param {Object} str
	 */
	stripTags: function(str) {
    	return str.replace(/<\/?[^>]+>/gi, '');
  	},

	/**
	 * ת�� NodeList ���� arguments Ϊ����
	 * @method toArray
	 * @param {Object} list
	 * @param {Object} start
	 * @return {Array} ת��������飬���start����list�����������ؿ�����
	 */
	toArray : function(list, start) {
		var array = [];
		for (var i = start || 0; i < list.length; i++) {
			array[array.length] = list[i];
		}
		return array;
	},

	/**
	 * �����������Ը�ĳ������������Ѵ��ڸ����ã������и���
	 * @param {Object} obj Ŀ����� 
	 * @param {Object} config ��������/���� ����
	 */	
	applyIf: function(obj, config) {
    	if(obj && config && typeof config == 'object'){
        	for(var p in config) {
				if (!YAHOO.lang.hasOwnProperty(obj, p))
            		obj[p] = config[p];
			}
    	}
    	return obj;
	},

	/**
	 * �����������Ը�ĳ������������Ѵ��ڸ����ã���������Ϊ������
	 * @param {Object} obj Ŀ����� 
	 * @param {Object} config ��������/���� ����
	 */		
	apply: function(obj, config) {
    	if(obj && config && typeof config == 'object'){
        	for(var p in config)
				obj[p] = config[p];
		}
		return obj;
	},
	
	/**
	 * ��ʽ���ַ���
	 * eg:
	 * 	TB.common.formatMessage('{0}����{1}��Сʱ', [1, 24]) 
	 *  or
	 *  TB.common.formatMessage('{day}����{hour}��Сʱ', {day:1, hour:24}}
	 * @param {Object} msg
	 * @param {Object} values
	 */
	formatMessage: function(msg, values, filter) {
		var pattern = /\{([\w-]+)?\}/g;
		return function(msg, values, filter) {
			return msg.replace(pattern, function(match, key) {
				return filter?filter(values[key], key):values[key];
			});	
		}
	}(),
	
	/**
	 * ����URI
	 */
	parseUri: (function() {
		var keys = ['source', 'prePath', 'scheme', 'username', 'password', 'host', 'port', 'path', 'dir', 'file', 'query', 'fragment'];
		var re = /^((?:([^:\/?#.]+):)?(?:\/\/)?(?:([^:@]*):?([^:@]*)?@)?([^:\/?#]*)(?::(\d*))?)((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?/;	
		return function(sourceUri) {
			var uri = {};
			var uriParts = re.exec(sourceUri);
			for(var i = 0; i < uriParts.length; ++i){
				uri[keys[i]] = (uriParts[i] ? uriParts[i] : '');
			}
			return uri;
		}
	})()
};

TB.applyIf = TB.common.applyIf;
TB.apply = TB.common.apply;TB.locale.Messages={loading:"\u52a0\u8f7d\u4e2d...",pleaseWait:"\u6b63\u5728\u5904\u7406\uff0c\u8bf7\u7a0d\u5019...",ajaxError:"\u5bf9\u4e0d\u8d77\uff0c\u53ef\u80fd\u56e0\u4e3a\u7f51\u7edc\u6545\u969c\u5bfc\u81f4\u7cfb\u7edf\u53d1\u751f\u5f02\u5e38\u9519\u8bef\uff01",prevPageText:"\u4e0a\u4e00\u9875",nextPageText:"\u4e0b\u4e00\u9875",year:"\u5e74",month:"\u6708",day:"\u5929",hour:"\u5c0f\u65f6",minute:"\u5206\u949f",second:"\u79d2",timeoutText:"\u65f6\u95f4\u5230"};
/**
 * @author zexin.zhaozx
 */

(function() {
	var ua = navigator.userAgent.toLowerCase();
	var _isOpera = ua.indexOf('opera') != -1,
		_isSafari = ua.indexOf('safari') != -1,
		_isGecko = !_isOpera && !_isSafari && ua.indexOf('gecko') > -1,
		_isIE = !_isOpera && ua.indexOf('msie') != -1, 
		_isIE6 = !_isOpera && ua.indexOf('msie 6') != -1,
		_isIE7 = !_isOpera && ua.indexOf('msie 7') != -1;
		
	TB.bom = {
		isOpera: _isOpera,
		isSafari: _isSafari,
		isGecko: _isGecko,
		isIE: _isIE,
		isIE6: _isIE6,
		isIE7: _isIE7,
			
		/**
	     * ��ȡcookie
	     * @method getCookie
	     * @param {String} name cookie����
	     * @return {String} cookie ��ֵ���߿��ַ���
	     */	
		getCookie: function(name) {
			var value = document.cookie.match('(?:^|;)\\s*'+name+'=([^;]*)');
			return value ? unescape(value[1]) : '';
		},
	
	    /**
	     * ����cookie
	     * @method setCookie
	     * @param {String} name cookie����
		 * @param {String} value cookie��ֵ
	     * @return {String} cookie ��ֵ���߿��ַ���
	     */	
		setCookie: function(name, value, expire, domain, path) {
			value = escape(value);
			value += (domain) ? '; domain=' + domain : '';
			value += (path) ? "; path=" + path : '';
			if (expire){
				var date = new Date();
				date.setTime(date.getTime() + (expire * 86400000));
				value += "; expires=" + date.toGMTString();
			}
			document.cookie = name + "=" + value;
		},
	
		/**
		 * ɾ��cookie
		 * @method removeCookie
		 * @param {Object} name
		 */
		removeCookie: function(name) {
			this.setCookie(name, '', -1);
		},
	
		/**
		 * ��ȡ��ǰhostname��domain.domain;
		 * Ĭ�Ϸ��ص�ǰhostname�ĵ�һ�㸸������ www.xyx.taobao.com -> xyz.taoboa.com��store.taobao.com - > taobao.com
		 * �ɴ���һ������n��ָ��ȡn���ĸ�������n=2, ��www.xyx.taobao.com -> taoboa.com
		 * ���hostname����ֻ�ж����򣬻����n���������Ƿ��ض�����
		 * 
		 * ע�⣺����sina.com.cn���������������������������
		 * 
		 * @method pickDocumentDomain
		 * @return expected document.domain value
		 */
		pickDocumentDomain: function() {
			var host = arguments[1] || location.hostname; 
			var da = host.split('.'), len = da.length;
			var deep = arguments[0]|| (len<3?0:1);
			if (deep>=len || len-deep<2)
				deep = len-2;
			return da.slice(deep).join('.');
		},
		
		/**
		 * ��ӵ��ղؼ�
		 * @param {Object} title
		 * @param {Object} url
		 */
		addBookmark: function(title, url) {
		    if (window.sidebar) {
		        window.sidebar.addPanel(title, url,"");
		    } else if( document.external ) {
		        window.external.AddFavorite( url, title);
		    } else {
				/* TODO */
			}
		}
	}
})();/**
 * DOM utilities
 * @TODO
 */
TB.dom = {
	
	/**
	 * insertAfter
	 * @param {Object} node
	 * @param {Object} refNode
	 * @deprecated use YAHOO.util.Dom.insertAfter
	 */
	insertAfter: function(node, refNode) {
		return $D.insertAfter(node, refNode);
	},
	
	/**
	 * ����tagName��ȡ���һ�����Ƚڵ�
	 * @param {Object} el
	 * @param {Object} tag
	 * @deprecated use YAHOO.util.Dom.getAncestorByTagName
	 */
	getAncestorByTagName: function(el, tag) {
		return $D.getAncestorByTagName(el, tag);
	},
	
	/**
	 * ����class��ȡ�����һ�����Ƚڵ�
	 * @param {Object} el
	 * @param {Object} cls
	 * @deprecated use YAHOO.util.Dom.getAncestorByClassName
	 */
	getAncestorByClassName: function(el, cls) {
		return $D.getAncestorByClassName(el, cls);
	}, 
	
	/** 
	 * ��ȡ֮����ֵܽڵ�
	 * @param {Object} node
	 * @deprecated use YAHOO.util.Dom.getNextSibling
	 */	
	getNextSibling: function(node) {
		return $D.getNextSibling(node);
	},
	
	/** 
	 * ��ȡ֮ǰ���ֵܽڵ�
	 * @param {Object} node
	 * @deprecated use YAHOO.util.Dom.getPreviousSibling
	 */
	getPreviousSibling: function(node) {
		return $D.getPreviousSibling(node);	
	},
	
	/**
	 * ��ȡ�����label
	 * @param {Object} el
	 * @param {Object} parent
	 */
	getFieldLabelHtml: function(el, parent) {
		var input = $(el), labels = (parent || input.parentNode).getElementsByTagName('label');
		for (var i = 0; i < labels.length; i++) {
			var forAttr = labels[i].htmlFor || labels[i].getAttribute('for')
			if (forAttr == input.id)
				return labels[i].innerHTML;
		}
		return null;
	},
	
	/**
	 * ��ȡiframe��document
	 * @param {Object} el
	 */
	getIframeDocument: function(el) {
		var iframe = $(el);
		return iframe.contentWindow? iframe.contentWindow.document : iframe.contentDocument;
	},

	/**
	 * ���ñ���action���ԣ�������а���ͬ����fieldʱ�����
	 * @param {Object} form  form ����
	 * @param {Object} url  action url
	 */
	setFormAction: function(form, url) {
		form = $(form);
	    var actionInput = form.elements['action'];
	    var postSet;
	    if (actionInput) {
	        var ai = form.removeChild(actionInput);
	        postSet = function() {
	            form.appendChild(ai);
			}
	    }
	    form.action = url;
	    if (postSet)
	        postSet();
	    return true;
	},
	
	/**
	 * �����ʽ�ı�
	 * @param {Object} cssText
	 * @param {Object} doc
	 */
	addCSS: function(cssText, doc) {
		doc = doc || document;
		var styleEl = doc.createElement('style');
		styleEl.type = "text/css";
		doc.getElementsByTagName('head')[0].appendChild(styleEl); //��appendChild������hackʧЧ
		if (styleEl.styleSheet) {
			styleEl.styleSheet.cssText = cssText;
		} else {
			styleEl.appendChild(doc.createTextNode(cssText));
		}
	},
	
	/**
	 * ���ݽű����֣�ȡ�ýű�����
	 * @param {Object}||{RegExp}||{String} script
	 */
	getScriptParams: function(script) {
		var p = /\?(.*?)($|\.js)/;
		var m;
		//����� <script> tag
		if (YAHOO.lang.isObject(script) && script.tagName && script.tagName.toLowerCase()=='script') {
			if (script.src && (m = script.src.match(p))) {
				return m[1].toQueryParams();  
			}
		} else {
			//����� string�� ת�� regexp
			if (YAHOO.lang.isString(script)) {
				script = new RegExp(script, 'i');
			}
			var scripts = document.getElementsByTagName("script");
			var matchs, ssrc;
			for (var i = 0; i < scripts.length; ++i) {
				ssrc = scripts[i].src;
				if (ssrc && script.test(ssrc) && (m = ssrc.match(p))) {
					return m[1].toQueryParams(); 
				}
			}
		}
	}	
	
}/**
 * @fileOverview TB.anim ����YAHOO.util.Anim��װ�Ķ���Ч��
 * @name TB.anim
 * @example
	new TB.anim.Highlight(el, {
		startColor: '#ffff99'
	}).animate();
 */
 
/**
 * @constructor
 * @param {Object} el Ӧ�ö�����Ԫ��
 * @param {Object} [config]  ���ò���
 */	
TB.anim.Highlight = function(el, config) {
	if (!el) return;
	this.init(el, config)
}

/**
 * Ĭ������
 */
TB.anim.Highlight.defConfig = {
	/** ������ʼʱ���õı���ɫ*/
	startColor: '#ffff99',
	/** ����ʱ�� */
	duration: .5,
	/** �Ƿ񱣳�ԭ�ȵı��� */
	keepBackgroundImage: true
};

TB.anim.Highlight.prototype.init = function(el, config) {
	var Y = YAHOO.util;
	config = TB.applyIf(config||{}, TB.anim.Highlight.defConfig);

	var attr = {backgroundColor: {from: config.startColor}};
	var anim =	new Y.ColorAnim(el, attr, config.duration);
	var originBgColor = anim.getAttribute('backgroundColor');
	anim.attributes['backgroundColor']['to'] = originBgColor;

	if (config.keepBackgroundImage) {
		var originBg = $D.getStyle(el, 'background-image');
		anim.onComplete.subscribe(function() {
			$D.setStyle(el, 'background-image', originBg);
		});
	}
	
	/**
	 * onComplete �ص���ֱ�����ñ���װ�� Anim ����� onComplete �¼�
	 */	
	this.onComplete = anim.onComplete;
	
	/**
	 * ִ�ж���
	 */
	this.animate = function() {
		$D.setStyle(el, 'background-image', 'none');
		anim.animate();
	}
};

/**
 * @author xiaoma<xiaoma@taobao.com>
 */

/**
	config ����˵��

	position: {String} [left|right|top|bottom]
	autoFit: {Boolean} �Ƿ�����Ӧ����
	width: {Number} popup width 
	height: {Number} popup height
	offset: {Array} offset
	eventType: {String} [mouse|click] ����ƶ��������ǵ������
	disableClick: {Boolean}
	delay: {Number} ����ƶ�����ʱ���ӳ�
	onShow: {function} ��ʾ�ص�����
	onHide: {Function} ���ػص�����
 */
	
TB.widget.SimplePopup = new function() {
	var Y = YAHOO.util;

	var defConfig = {
		position: 'right',
		autoFit: true,
		eventType: 'mouse',
		delay: 0.1,
		disableClick: true,  /* stopEvent when eventType = mouse */
		width: 200,
		height: 200		
	};
	
	/**
	 * �¼�������
	 * scope is handle
	 * @param {Object} ev
	 */	
	var triggerClickHandler = function(ev) {
		var target = $E.getTarget(ev);
		if (triggerClickHandler._target == target) {
			this.popup.style.display == 'block'? this.hide() : this.show();
		} else {
			this.show();
		}
		$E.preventDefault(ev);
		triggerClickHandler._target = target;
	}
	var triggerMouseOverHandler = function(ev) {
		clearTimeout(this._popupHideTimeId);
		var self = this;
		this._popupShowTimeId = setTimeout(function(){
			self.show();
		}, this.config.delay * 1000);
		if (this.config.disableClick && !this.trigger.onclick) {
			this.trigger.onclick = function(e) {
				$E.preventDefault($E.getEvent(e));
			};
		}			
	}

	var triggerMouseOutHandler = function(ev) {
		clearTimeout(this._popupShowTimeId);
		if (!$D.isAncestor(this.popup, $E.getRelatedTarget(ev))){
			this.delayHide();
		}
		$E.preventDefault(ev);
	}
	
	var popupMouseOverHandler = function(ev) {
		var handle = this.currentHandle? this.currentHandle : this;
		clearTimeout(handle._popupHideTimeId);
	}

	var popupMouseOutHandler = function(ev) {
		var handle = this.currentHandle? this.currentHandle : this;
		if (!$D.isAncestor(handle.popup, $E.getRelatedTarget(ev))){
			handle.delayHide();
		}
	}
	
	this.decorate = function(trigger, popup, config) {
		if (YAHOO.lang.isArray(trigger) || (YAHOO.lang.isObject(trigger) && trigger.length)) {
			config.shareSinglePopup = true;
			var groupHandle = {};
			groupHandle._handles = [];
			/* batch����ʱ���ڼ򵥿��ǣ�������handle object */
			for (var i = 0; i < trigger.length; i++) {
				var h = this.decorate(trigger[i], popup, config);
				h._beforeShow = function(){
					groupHandle.currentHandle = this;
					return true;
				};
				groupHandle._handles[i] = h; 
			}
			if (config.eventType == 'mouse') {
				$E.on(popup, 'mouseover', popupMouseOverHandler, groupHandle, true);
				$E.on(popup, 'mouseout', popupMouseOutHandler, groupHandle, true);
			}			
			return groupHandle;
		}
		
		trigger = $(trigger);
		popup = $(popup);
		if (!trigger || !popup) return;
		config = TB.applyIf(config||{}, defConfig);
		/* ���ظ������ߵĿ�������ֻ�����Ե����߿ɼ��ķ���/���� */		
		var handle = {};		

		handle._popupShowTimeId = null;
		handle._popupHideTimeId = null;
		handle._beforeShow = function(){return true};

		var onShowEvent = new Y.CustomEvent("onShow", handle, false, Y.CustomEvent.FLAT);
		if (config.onShow) {
			onShowEvent.subscribe(config.onShow);	
		}
		var onHideEvent = new Y.CustomEvent("onHide", handle, false, Y.CustomEvent.FLAT);
		if (config.onHide) {
			onHideEvent.subscribe(config.onHide);	
		}			

		if (config.eventType == 'mouse') {
			$E.on(trigger, 'mouseover', triggerMouseOverHandler, handle, true);
			$E.on(trigger, 'mouseout', triggerMouseOutHandler, handle, true);
			/* batch ����ʱ��Popup ������¼�ֻע��һ�� */
			if (!config.shareSinglePopup) {
				$E.on(popup, 'mouseover', popupMouseOverHandler, handle, true);
				$E.on(popup, 'mouseout', popupMouseOutHandler, handle, true);
			}
		}
		else if (config.eventType == 'click') {
			$E.on(trigger, 'click', triggerClickHandler, handle, true);
		}

		TB.apply(handle, {
			popup: popup,
			trigger: trigger,
			config: config,
			show: function() {
				if (!this._beforeShow()) return;
				var pos = $D.getXY(this.trigger);
				if (YAHOO.lang.isArray(this.config.offset)) {
					pos[0] += parseInt(this.config.offset[0]);
					pos[1] += parseInt(this.config.offset[1]);
				}
				var tw = this.trigger.offsetWidth, th = this.trigger.offsetHeight;
				var pw = config.width, ph = config.height;
				var dw = $D.getViewportWidth(), dh = $D.getViewportHeight();
                var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
				var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
				
				var l = pos[0], t = pos[1];
				if (config.position == 'left') {
					l = pos[0]-pw;
				}
				else if (config.position == 'right') {
					l = pos[0]+tw;
				} else if (config.position == 'bottom') {
					t = t+th;
				} else if (config.position == 'top') {
					t = t-ph;
					if (t < 0) t = 0;
				}
				
				if(this.config.autoFit) {
					if (t-st+ph > dh) {
						t = dh-ph+st-2; /* 2px ƫ�� */
						if (t < 0) {
							t = 0;
						}
					}
				}
					
				this.popup.style.position = 'absolute';
				this.popup.style.top = t + 'px';
				this.popup.style.left = l + 'px';
				if (this.config.effect) {
					if (this.config.effect == 'fade') {
						$D.setStyle(this.popup, 'opacity', 0);
						this.popup.style.display = 'block';
						var anim = new Y.Anim(this.popup, { opacity: {to: 1} }, 0.4);
						anim.animate();
					}
				} else {
					this.popup.style.display = 'block';
				}
				onShowEvent.fire();					
			},
			hide: function() {
				$D.setStyle(this.popup, 'display', 'none');
				onHideEvent.fire();
			},
			delayHide: function() {
				var self = this;
		        this._popupHideTimeId = setTimeout(function(){
					self.hide();
				}, this.config.delay*1000);
			}			
		});
		
		$D.setStyle(popup, 'display', 'none');

		return handle;		
	}
}
	
/**
 * @author xiaoma
 */
/** �򵥹��� */
TB.widget.SimpleScroll = new function() {
	
	var Y = YAHOO.util;	
 	var defConfig = {
		delay: 2,
		speed: 20,
		startDelay: 2,
		direction: 'vertical',	/* 'horizontal(h)' or 'vertical(v)'. defaults to vertical. */		
		disableAutoPlay: false, 
		distance: 'auto',
		scrollItemCount: 1  /** ��ͬһ�й�����li������Ĭ��1 */		
	}
	/**
	 * container ������һ�� ul
	 * @param {Object} container
	 * @param {Object} config
	 */
	this.decorate = function(container, config) {
		container = $(container);
		config = TB.applyIf(config||{}, defConfig);
		var step = 2;
		if (config.speed < 20) {
			step = 5;
		}
		if (config.lineHeight) {
			config.distance = config.lineHeight;
		}
		
		var scrollTimeId = null, startTimeId = null, startDelayTimeId = null;
		/* �Ƿ������� */
		var isHorizontal = (config.direction.toLowerCase() == 'horizontal') || (config.direction.toLowerCase() == 'h'); 
		
		/* ���ظ������ߵĿ�������ֻ�����Ե����߿ɼ��ķ���/���� */	
		var handle = {};
		handle._distance = 0;
		/* �ռ����ܷ񻹿��Թ��� */
		handle.scrollable = true;
		/* ����Ԥ�ƹ����ľ��� */
		handle.distance = config.distance;
		/* ÿ�ι����ľ��� */
		handle._distance = 0;
		/* ����ƶ���ȥʱ��ͣ */
		handle.suspend = false;
		/* ��ͣ */
		handle.paused = false;
	
		
		/* �ڲ�ʹ���¼� */
		var _onScrollEvent = new Y.CustomEvent("_onScroll", handle, false, Y.CustomEvent.FLAT);
		_onScrollEvent.subscribe(function() {
			var curLi = container.getElementsByTagName('li')[0];
			if (!curLi) { 
				this.scrollable = false;
				return;
			}
			this.distance = (config.distance == 'auto')?curLi[isHorizontal?'offsetWidth':'offsetHeight']:config.distance;
			with(container) { 
				if (isHorizontal)
					this.scrollable = (scrollWidth - scrollLeft - offsetWidth) >= this.distance;
				else 
					this.scrollable = (scrollHeight - scrollTop - offsetHeight) >= this.distance;
			}
		});
		
		/* �����¼� */
		var onScrollEvent = new Y.CustomEvent("onScroll", handle, false, Y.CustomEvent.FLAT);
		if (config.onScroll) {
			onScrollEvent.subscribe(config.onScroll);
		} else {
			onScrollEvent.subscribe(function() {
				for (var i = 0; i < config.scrollItemCount; i++) {
					container.appendChild(container.getElementsByTagName('li')[0]);
				}
				container[isHorizontal?'scrollLeft':'scrollTop'] = 0;
			});
		}
		
		var scroll = function() {
			if (handle.suspend) return;
			handle._distance += step;
			var _d; 
			if ((_d = handle._distance % handle.distance) < step) {
				container[isHorizontal?'scrollLeft':'scrollTop'] += (step - _d);
				clearInterval(scrollTimeId);
				onScrollEvent.fire();
				_onScrollEvent.fire();
				startTimeId = null;
				if (handle.scrollable && !handle.paused) handle.play();
			}else{
				container[isHorizontal?'scrollLeft':'scrollTop'] += step;
			}
		}
		
		var start = function() {
			if (handle.paused) return;
			handle._distance = 0;
			scrollTimeId = setInterval(scroll, config.speed);
		}

		$E.on(container, 'mouseover', function(){handle.suspend=true;});
		$E.on(container, 'mouseout', function(){handle.suspend=false;});
		
		TB.apply(handle, {
			subscribeOnScroll: function(func, override) {
				if (override === true && onScrollEvent.subscribers.length > 0)
					onScrollEvent.unsubscribeAll();
				onScrollEvent.subscribe(func);
			},
			pause: function() {
				this.paused = true;
				clearTimeout(startTimeId);
				startTimeId = null;
			},
			play: function() {
				this.paused = false;
				if (startDelayTimeId) {clearTimeout(startDelayTimeId);}
				if (!startTimeId) {
					startTimeId = setTimeout(start, config.delay*1000);	
				}
			}
		});
		handle.onScroll = handle.subscribeOnScroll;
		
		/** ��ʼ���ƶ����벢�ж��Ƿ�ɹ��� */
		_onScrollEvent.fire();
		/** �Զ���ʼ���� */		
		if (!config.disableAutoPlay) {
			startDelayTimeId = setTimeout(function(){handle.play();}, config.startDelay*1000);
		}		
		return handle;
	}
};/**
 * TBra Slide 
 * 
 * ���ƣ��õ�Ƭ���������<ul>�У�ÿ�Żõ�Ƭ��һ��<li>��
 * @author xiaoma<xiaoma@taobao.com>
 * 
 */
/* �õ�Ƭ���� */
(function() {
	var Y = YAHOO.util;
	
	TB.widget.Slide = function(container, config) {
		this.init(container, config);
	}
	/* Ĭ�ϲ������� */ 
	TB.widget.Slide.defConfig = {
		slidesClass: 'Slides',			/* �õ�ӰƬul��className */
		triggersClass: 'SlideTriggers',		/* �����className */
		currentClass: 'Current',			/* ��ǰ�����className */
		eventType: 'click',					/* ������ܵ��¼����ͣ�Ĭ��������� */
		autoPlayTimeout: 5,					/* �Զ�����ʱ���� */
		disableAutoPlay: false				/* ��ֹ�Զ����� */
	};
	TB.widget.Slide.prototype = {
		/**
		 * ��ʼ���������Ժ���Ϊ
		 * @method init 
		 * @param {Object} container ���������ID
		 * @param {Object} config ���ò���
		 */
		init: function(container, config) {
			this.container = $(container);
			this.config = TB.applyIf(config||{}, TB.widget.Slide.defConfig);
			try {
				this.slidesUL = $D.getElementsByClassName(this.config.slidesClass, 'ul', this.container)[0];
				
				if(!this.slidesUL) {
					//ȡ��һ�� ul �ӽڵ�
					this.slidesUL = $D.getFirstChild(this.container, function(node) {
						return node.tagName.toLowerCase === 'ul';
					});
				}
				
				this.slides = $D.getChildren(this.slidesUL); //ֻȡֱ�ӵ���<li>Ԫ��
				if (this.slides.length == 0) {
					throw new Error();
				}
			} catch (e) {
				throw new Error("can't find slides!");
			}
			this.delayTimeId = null;		/* eventType = 'mouse' ʱ���ӳٵ�TimeId */
			this.autoPlayTimeId = null;		/* �Զ�����TimeId */
			this.curSlide = -1;
			this.sliding = false;
			this.pause = false;
			this.onSlide = new Y.CustomEvent("onSlide", this, false, Y.CustomEvent.FLAT);
			if (YAHOO.lang.isFunction(this.config.onSlide)){
				this.onSlide.subscribe(this.config.onSlide, this, true);
			}
			
			this.beforeSlide = new Y.CustomEvent("beforeSlide", this, false, Y.CustomEvent.FLAT);
			if (YAHOO.lang.isFunction(this.config.beforeSlide)){
				this.beforeSlide.subscribe(this.config.beforeSlide, this, true);
			}			
			
			/* ָ��tbra.css���趨�� class */
			$D.addClass(this.container, 'tb-slide');
			$D.addClass(this.slidesUL, 'tb-slide-list');
			$D.setStyle(this.slidesUL, 'height', (this.config.slideHeight || this.container.offsetHeight) + 'px');
			
			this.initSlides(); /* ��ʼ���õ�Ƭ���� */
			this.initTriggers();
			if (this.slides.length > 0)
				this.play(1);
			if (! this.config.disableAutoPlay){
				this.autoPlay();
			}
			if (YAHOO.lang.isFunction(this.config.onInit)) {
				this.config.onInit.call(this);
			}
		},
		
		/**
		 * ���ݻõ�Ƭ�����Զ����ɴ��㣬������һ��<ul>�У�ҳ����CSS�б����ж�Ӧ��������
		 * @method initTriggers 
		 */
		initTriggers: function() {
			var ul = document.createElement('ul');
			this.container.appendChild(ul);
			for (var i = 0; i < this.slides.length; i++) {
				var li = document.createElement('li');
				li.innerHTML = i+1;
				ul.appendChild(li);
			}
			$D.addClass(ul, this.config.triggersClass);
			this.triggersUL = ul;
			if (this.config.eventType == 'mouse') {
				$E.on(this.triggersUL, 'mouseover', this.mouseHandler, this, true);
				$E.on(this.triggersUL, 'mouseout', function(e){
					clearTimeout(this.delayTimeId);
					this.pause = false;
				}, this, true);
			} else {
				$E.on(this.triggersUL, 'click', this.clickHandler, this, true);
			}
		},
		
		/**
		 * ��ʼ���õ�Ƭ
		 * @method initSlides 
		 */
		initSlides: function() {
			$E.on(this.slides, 'mouseover', function(){this.pause = true;}, this, true);
			$E.on(this.slides, 'mouseout', function(){this.pause = false;}, this, true);
			$D.setStyle(this.slides, 'display', 'none');
		},
		
		/**
		 * ����¼�����
		 * @param {Object} e Event����
		 */
		clickHandler: function(e) {
			var t = $E.getTarget(e);
			var idx = parseInt(TB.common.stripTags(t.innerHTML));
			while(t != this.container) {
				if(t.nodeName.toUpperCase() == "LI") {
					 /* ������ڻ�����,ֹͣ��Ӧ */
					if (!this.sliding){
						this.play(idx, true);
					}
					break;
				} else {
					t = t.parentNode;
				}
			}		
		},
		
		/**
		 * ����¼�����
		 * @param {Object} e Event ����
		 */
		mouseHandler: function(e) {
			var t = $E.getTarget(e);
			var idx = parseInt(TB.common.stripTags(t.innerHTML));
			while(t != this.container) {
				if(t.nodeName.toUpperCase() == "LI") {
					var self = this;			
					this.delayTimeId = setTimeout(function() {
							self.play(idx, true);
							self.pause = true;
						}, (self.sliding?.5:.1)*1000);
					break;
				} else {
					t = t.parentNode;
				}
			}
		},
		
		/**
		 * ����ָ��ҳ�Ļõ�Ƭ
		 * @param {Object} n ҳ����Ҳ���Ǵ�������ֵ
		 * @param {Object} flag ���flag=true�������û������ģ���֮��Ϊ�Զ�����
		 */
		play: function(n, flag) {
			n = n - 1;
			if (n == this.curSlide) return;
			var curSlide = this.curSlide >= 0 ? this.curSlide : 0;
			if (flag && this.autoPlayTimeId)
				clearInterval(this.autoPlayTimeId);
			var triggersLis = this.triggersUL.getElementsByTagName('li');
			triggersLis[curSlide].className = ''; 
			triggersLis[n].className = this.config.currentClass;
			this.beforeSlide.fire(n);
			this.slide(n);
			this.curSlide = n;
			if (flag && !this.config.disableAutoPlay)
				this.autoPlay();
		},
		
		/**
		 * �л��õ�Ƭ����򵥵��л���������/��ʾ��
		 * ��ͬ��Ч�����Ը��Ǵ˷���
		 * @see TB.widget.ScrollSlide
		 * @see TB.widget.FadeSlide
		 * @param {Object} n ҳ��
		 */
		slide: function(n) {
			var curSlide = this.curSlide >= 0 ? this.curSlide : 0;
			this.sliding = true;
			$D.setStyle(this.slides[curSlide], 'display', 'none');
			$D.setStyle(this.slides[n], 'display', 'block');
			this.sliding = false;
			this.onSlide.fire(n);
		},
		
		/**
		 * �����Զ�����
		 * @method autoPlay
		 */
		autoPlay: function() {
			var self = this;
			var callback = function() {
				if ( !self.pause && !self.sliding ) {
					var n = (self.curSlide+1) % self.slides.length + 1;
					self.play(n, false);
				}
			}
			this.autoPlayTimeId = setInterval(callback, this.config.autoPlayTimeout * 1000);
		}
	}
	
	/**
	 * ����Ч���Ļõ�Ƭ������
	 * @param {Object} container
	 * @param {Object} config
	 */
	TB.widget.ScrollSlide = function(container, config){
		this.init(container, config);
	}
	YAHOO.extend(TB.widget.ScrollSlide, TB.widget.Slide, {
		/**
		 * ���Ǹ������Ϊ�������ػõ�Ƭ
		 * CSS��ע������ slidesUL overflow:hidden����ֻ֤��ʾһ���õ�
		 */
		initSlides: function() {
			TB.widget.ScrollSlide.superclass.initSlides.call(this);
			$D.setStyle(this.slides, 'display', '');
		},
		/**
		 * ���Ǹ������Ϊ��ʹ�ù�������
		 * @param {Object} n
		 */
		slide: function(n) {
			var curSlide = this.curSlide >= 0 ? this.curSlide : 0;
			var args = { scroll: {by:[0, this.slidesUL.offsetHeight*(n-curSlide)]} };
			var anim = new Y.Scroll(this.slidesUL, args, .5, Y.Easing.easeOutStrong);
			anim.onComplete.subscribe(function(){
				this.sliding = false;
				this.onSlide.fire(n);
			}, this, true);
			anim.animate();
			this.sliding = true;
		}
	});
	
	/**
	 * ���뵭��Ч���Ļõ�Ƭ������
	 * @param {Object} container
	 * @param {Object} config
	 */
	TB.widget.FadeSlide = function(container, config){
		this.init(container, config);
	}
	YAHOO.extend(TB.widget.FadeSlide, TB.widget.Slide, {
		/**
		 * ���Ǹ������Ϊ�����ûõ�Ƭ��position=absolute
		 */
		initSlides: function() {
			TB.widget.FadeSlide.superclass.initSlides.call(this);
			$D.setStyle(this.slides, 'position', 'absolute');
			$D.setStyle(this.slides, 'top', this.config.slideOffsetY||0);
			$D.setStyle(this.slides, 'left', this.config.slideOffsetX||0);
			$D.setStyle(this.slides, 'z-index', 1);
		},
		
		/**
		 * ���Ǹ������Ϊ��ʹ�õ��뵭������
		 * @param {Object} n
		 */
		slide: function(n) {
			/* ��һ������ */
			if (this.curSlide == -1) {
				$D.setStyle(this.slides[n], 'display', 'block');
				this.onSlide.fire(n);
			} else {
				var curSlideLi = this.slides[this.curSlide];
				$D.setStyle(curSlideLi, 'display', 'block');
				$D.setStyle(curSlideLi, 'z-index', 10);
				var fade = new Y.Anim(curSlideLi, { opacity: { to: 0 } }, .5, Y.Easing.easeNone);
				fade.onComplete.subscribe(function(){
					$D.setStyle(curSlideLi, 'z-index', 1);
					$D.setStyle(curSlideLi, 'display', 'none');
					$D.setStyle(curSlideLi, 'opacity', 1);
					this.sliding = false;
					this.onSlide.fire(n);
				}, this, true);
				
				$D.setStyle(this.slides[n], 'display', 'block');
				
				fade.animate();			
				this.sliding = true;
			}
		}
	});	
	
})();

/**
 * Slide �ķ�װ��ͨ�� effect ������������ͬ��Slide����
 */
TB.widget.SimpleSlide = new function() {
	
	this.decorate = function(container, config) {
		if (!container) return;
		config = config || {};
		if (config.effect == 'scroll') {
			/** <li>�°���<iframe>ʱ��firefox��ʾ�쳣 */ 
			if (YAHOO.env.ua.gecko) {
				if (YAHOO.util.Dom.get(container).getElementsByTagName('iframe').length > 0) {
					return new TB.widget.Slide(container, config);
				}
			}
			return new TB.widget.ScrollSlide(container, config);
		}
		else if (config.effect == 'fade') {
			return new TB.widget.FadeSlide(container, config);
		}
		else {
			return new TB.widget.Slide(container, config);
		}
	}	
}/* ��Tab�л� */
TB.widget.SimpleTab = new function() {
	var Y = YAHOO.util;
	var defConfig = {
		eventType: 'click',
		currentClass: 'Current',  /* li ��ǰѡ��״̬ʱ��className */
		tabClass: '',  /* ��Ϊ tab ��element�� className */
		autoSwitchToFirst: true,  /* �Ƿ�Ĭ��ѡ�е�һ��tab */
		stopEvent: true,  /* ֹͣ�¼����� */
		delay: 0.1  /* available when eventType=mouse */
	};
	var getImmediateDescendants = function(p) {
		var ret = [];
		if (!p) return ret;
		for (var i = 0, c = p.childNodes; i < c.length; i++) {
			if (c[i].nodeType == 1)
				ret[ret.length] = c[i];
		}
		return ret;	
	};
	this.decorate = function(container, config) {
		container = $(container);
		config = TB.applyIf(config||{}, defConfig);
		/* ���ظ������ߵĿ�������ֻ�����Ե����߿ɼ��ķ���/���� */		
		var handle = {};
	
		var tabPanels = getImmediateDescendants(container);
		var tab = tabPanels.shift(0);
		var tabTriggerBoxs  = tab.getElementsByTagName('li');
		var tabTriggers, delayTimeId;
		if (config.tabClass) {
			tabTriggers = $D.getElementsByClassName(config.tabClass, '*', container);
		} else {
			tabTriggers = TB.common.toArray(tab.getElementsByTagName('a')); /* Ĭ��ȡtab�µ�<a> */
		}
		var onSwitchEvent = new Y.CustomEvent("onSwitch", null, false, Y.CustomEvent.FLAT);
		if (config.onSwitch) {
			onSwitchEvent.subscribe(config.onSwitch);
		}

		var focusHandler = function(ev) {
			if (delayTimeId)
				cacelHandler();
			var idx = tabTriggers.indexOf(this);
			handle.switchTab(idx);
			if (config.stopEvent) {
				try {
					$E.stopEvent(ev);
				}catch (e) {
					/* ignore */
				}
			}
			return !config.stopEvent;
		}
		var delayHandler = function(ev) {
			var target = this;
			delayTimeId = setTimeout(function(){
				focusHandler.call(target, ev);
			}, config.delay*1000);
			if (config.stopEvent)
				$E.stopEvent(ev);
			return !config.stopEvent;
		}
		var cacelHandler = function() {
			clearTimeout(delayTimeId);
		}
		if (config.eventType == 'mouse') {
			$E.on(tabTriggers, 'focus', focusHandler);
			$E.on(tabTriggers, 'mouseover', config.delay?delayHandler:focusHandler);
			$E.on(tabTriggers, 'mouseout', cacelHandler);
		}
		else {
			$E.on(tabTriggers, 'click', focusHandler);
		}

		/* ���幫���ķ��� */
		TB.apply(handle, {
			switchTab: function(idx) {
				$D.setStyle(tabPanels, 'display', 'none');
				$D.removeClass(tabTriggerBoxs, config.currentClass);
				$D.addClass(tabTriggerBoxs[idx], config.currentClass);
				$D.setStyle(tabPanels[idx], 'display', 'block');
				onSwitchEvent.fire(idx);
			},
			subscribeOnSwitch: function(func) {
				onSwitchEvent.subscribe(func);
			}
		});
		handle.onSwitch = handle.subscribeOnSwitch;
		
		/*��ʼ������*/
		$D.setStyle(tabPanels, 'display', 'none');
		if (config.autoSwitchToFirst)
			handle.switchTab(0);
		
		/* ���ز������� */
		return handle;
	}
};/**
 * �������
 * ��Ҫstar-rating.css
 */

TB.widget.SimpleRating = new function() {
	
	var defConfig = {
		rateUrl: '',  /* �������ݷ��͸���URL */
		rateParams: '',  /* ������������ʽk1=v1&k2=v2 */
		scoreParamName: 'score', /* ���۲����� */
		topScore: 5,  /* ��߷� */
		currentRatingClass: 'current-rating'
	};

	var rateHandler = function(ev, handle) {
		$E.stopEvent(ev);
		var aEl = $E.getTarget(ev);
		var score = parseInt(aEl.innerHTML);
		try {
			aEl.blur();	
		} catch (e) {}
		handle.rate(score);
	}
	
	var updateCurrentRating = function(currentRatingLi, avg, config) {
		if (currentRatingLi) 
			currentRatingLi.innerHTML = avg;
			$D.setStyle(currentRatingLi, 'width', avg*100/config.topScore + '%');
	} 
		
	this.decorate = function(ratingContainer, config) {
		ratingContainer = $(ratingContainer);  /* һ��<ul> */
		config = TB.applyIf(config || {}, defConfig);
		var currentRatingLi = $D.getElementsByClassName(config.currentRatingClass, 'li', ratingContainer)[0];
		
		var onRateEvent = new YAHOO.util.CustomEvent('onRate', null, false, YAHOO.util.CustomEvent.FLAT);
		if (config.onRate)
			onRateEvent.subscribe(config.onRate);
		var handle = {};
		
		handle.init = function(avg) {
			/* ��鿴�Ƿ���Ҫ��ʾ��ǰ�ķ��� */
			updateCurrentRating(currentRatingLi, avg, config);
		}
		
		handle.update = function(ret) {
			if (ret && ret.Average && currentRatingLi) {
				updateCurrentRating(currentRatingLi, ret.Average, config);
			}
			/* ֻ������һ�� */
			$E.purgeElement(ratingContainer, true, 'click');
			/* �Ƴ�������li */
			for (var lis = ratingContainer.getElementsByTagName('li'), i = lis.length-1; i > 0; i--) {
				ratingContainer.removeChild(lis[i]);		
			}
			onRateEvent.fire(ret);
		}
		
		handle.rate = function(score) {
			var indicator = TB.util.Indicator.attach(ratingContainer, {message:$M('pleaseWait')});
			indicator.show();		
			ratingContainer.style.display = 'none';
			var postData = config.scoreParamName + '=' + score;
			if (config.rateParams) 
				postData += '&' + config.rateParams;
			YAHOO.util.Connect.asyncRequest('POST', config.rateUrl, {
				success: function(req) {
					indicator.hide();
					ratingContainer.style.display = '';					
					var ret = eval('(' + req.responseText + ')');
					if (ret.Error) {
						alert(ret.Error.Message);
						return;
					} else {
						handle.update(ret);	
					}
				},
				failure: function(req) {
					indicator.hide();
					ratingContainer.style.display = '';							
					TB.trace($M('ajaxError'));
				}
			}, postData);				
		}
		
		handle.onRate = function(callback) {
			if (YAHOO.lang.isFunction(callback))
				onRateEvent.subscribe(callback);		
		}				
		
		var triggers = ratingContainer.getElementsByTagName('a');
		for (var i = 0; i < triggers.length; i++) {
			$E.on(triggers[i], 'click', rateHandler, handle);
		}
				
		return handle;
	}
}/**
 * @author zexin.zhaozx
 */
TB.widget.InputHint = new function() {
	var defConfig = {
		hintMessage: '',
		hintClass: 'tb-input-hint',
		appearOnce: false
	};
	var EMPTY_PATTERN = /^\s*$/;
	
	var focusHandler = function(ev, handle) {
		if (!handle.disabled)
			handle.disappear();
	}
	var blurHandler = function(ev, handle) {
		if (!handle.disabled)
			handle.appear();
	}
	
	this.decorate = function(inputField, config) {
		inputField = $(inputField);
		config = TB.applyIf(config || {}, defConfig);
		var hintMessage = config.hintMessage || inputField.title;
		var handle = {};
		handle.disabled = false;
		
		handle.disappear = function() {
			if (hintMessage == inputField.value) {
				inputField.value = '';
				$D.removeClass(inputField, config.hintClass);
			}
		};
		
		handle.appear = function() {
			if (EMPTY_PATTERN.test(inputField.value) || hintMessage == inputField.value) {
				$D.addClass(inputField, config.hintClass);
				inputField.value = hintMessage;				
			}
		}
		
		handle.purge = function() {
			this.disappear();
			$E.removeListener(inputField, 'focus', focusHandler);
			$E.removeListener(inputField, 'drop', focusHandler);
			$E.removeListener(inputField, 'blur', blurHandler);
		}
		
		/* ��ʼ�� */
		if (!inputField.title)
			inputField.setAttribute("title", hintMessage);
		$E.on(inputField, 'focus', focusHandler, handle);
		$E.on(inputField, 'drop', focusHandler, handle); /* for ie/safari */
		
		if (!config.appearOnce)
			$E.on(inputField, 'blur', blurHandler, handle);
		
		/* Ĭ������ʾ */
		handle.appear();
		return handle;
	}
}/**
 * Countdown Timer
 * @author xiaoma<xiaoma@taobao.com>
 */
TB.util.CountdownTimer = new function() {
	
	var Y = YAHOO.util;
	
	var MINUTE = 60;
	var HOUR = MINUTE * 60;
	var DAY = HOUR*24;	
	
	var defConfig = {
		formatStyle: 'short', /* 'long' �� x��xСʱx��x��  or 'short' ��[x��xСʱ | xСʱx�� | x��x��]  or custom */
		formatPattern: '',  /* for formatStyle == custom */
		hideZero: true, /* for formatStyle == 'long' : if day==0 then show xСʱx��x�룬etc. */
		timeoutText: 'timeoutText',
		updatable: true
	};
	
	var leadingZero = function(n) {
		return ((n < 10) ? "0" : "") + n;
	}
	
	var genTimeFilter = function(lt) {
		return function(val, key) {
			switch(key) {
				case 'd': 
					return parseInt(lt / DAY);
				case 'dd':
					return leadingZero(parseInt(lt / DAY));
				case 'hh':
					return leadingZero(parseInt(lt % DAY / HOUR));
				case 'h':
					return parseInt(lt % DAY / HOUR);
				case 'mm':
					return leadingZero(parseInt(lt % DAY % HOUR / MINUTE));
				case 'm':
					return parseInt(lt % DAY % HOUR / MINUTE);
				case 'ss':
					return leadingZero(parseInt(lt % DAY % HOUR % MINUTE));
				case 's':
					return parseInt(lt % DAY % HOUR % MINUTE);				
			}
		}
	}
	
	this.attach = function(container, leftTime, config) {
		container = $(container);
		leftTime = parseInt(leftTime);
		config = TB.applyIf(config||{}, defConfig);
		var handle = {};
				
		var onStartEvent = new Y.CustomEvent("onStart", null, false, Y.CustomEvent.FLAT);
		if (config.onStart) {
			onStartEvent.subscribe(config.onStart);
		}
		var onEndEvent = new Y.CustomEvent("onEnd", null, false, Y.CustomEvent.FLAT);
		if (config.onEnd) {
			onEndEvent.subscribe(config.onEnd);
		}
		
		var currTime = parseInt(new Date().getTime()/1000);
		var endTime = currTime + leftTime;

		var updateTimer = function() {
			handle.update();			
		}
				
		handle.update = function() {
			var pattern = config.formatPattern, values = {}, nu = 1;
			if (config.formatStyle == 'long') {
				pattern = '{d}' + $M('day') + '{hh}' + $M('hour') + '{mm}' + $M('minute') + '{ss}' + $M('second');
			}			
			var lt = endTime - parseInt(new Date().getTime()/1000);
			if (lt <= 0) {
				container.innerHTML = $M(config.timeoutText);
				onEndEvent.fire();
				return;				
			}
			else if (lt > DAY) {
				if (config.formatStyle == 'short') {
					pattern = '{d}' + $M('day') + '{hh}' + $M('hour');
					nu = Math.floor(lt % DAY % HOUR) || HOUR;
				}
			}
			else if (lt > HOUR) {
				if (config.formatStyle == 'short') {
					pattern = '{hh}' + $M('hour') + '{mm}' + $M('minute');
					nu = Math.floor(lt % HOUR % MINUTE) || MINUTE;
				} else if (config.formatStyle == 'long' && config.hideZero) {
					pattern = '{hh}' + $M('hour') + '{mm}' + $M('minute') + '{ss}' + $M('second');
				}
			}
			else if (lt > 0) {
				if (config.formatStyle == 'short' || (config.formatStyle == 'long' && config.hideZero)) {
					pattern = '{mm}' + $M('minute') + '{ss}' + $M('second');
				}
			}
			
			container.innerHTML = TB.common.formatMessage(pattern, values, genTimeFilter(lt)); 
			if (config.updatable && nu > 0)
				setTimeout(updateTimer, nu*1000);
		}
		
		handle.init = function() {
			this.update();
			onStartEvent.fire();
		}
				
		handle.init();
		return handle;
	}
}/** ״ָ̬ʾ�� */
TB.util.Indicator = new function() {
	
	var defConfig = {
		message: 'loading',
		useShim: false,
		useIFrame: false,
		centerIndicator: true
	}
	
	var prepareShim = function(target, useIFrame) {
		var shim = document.createElement('div');
		shim.className = 'tb-indic-shim';
		$D.setStyle(shim, 'display', 'none');
		target.parentNode.insertBefore(shim, target);
		if (useIFrame) {
			var shimFrame = document.createElement('iframe');
			shimFrame.setAttribute("frameBorder", 0);
			shimFrame.className = 'tb-indic-shim-iframe';
			target.parentNode.insertBefore(shimFrame, target);
		}
		return shim;
	}	
	
	this.attach = function(target, config) {
		target = $(target);
		config = TB.applyIf(config||{}, defConfig);
		
		var indicator =  document.createElement('div');
		indicator.className = 'tb-indic';
		$D.setStyle(indicator, 'display', 'none');
		$D.setStyle(indicator, 'position', 'static');
		indicator.innerHTML = '<span>'+$M(config.message)+'</span>';
		
		if (config.useShim) {
			var shim = prepareShim(target, config.useIFrame);
			shim.appendChild(indicator);
		} else {
			target.parentNode.insertBefore(indicator, target);	
		}
		
		var handle = {};
		
		handle.show = function(xy) {
			if (config.useShim) {
				var region = $D.getRegion(target);	
				
				var shim = indicator.parentNode;
				$D.setStyle(shim, 'display', 'block');
				$D.setXY(shim, [region[0], region[1]]);
				$D.setStyle(shim, 'width', (region.right-region.left)+'px');
				$D.setStyle(shim, 'height', (region.bottom-region.top)+'px');
				
				if (config.useIFrame) {
					var shimFrame = shim.nextSibling;
					$D.setStyle(shimFrame, 'width', (region.right-region.left)+'px');
					$D.setStyle(shimFrame, 'height', (region.bottom-region.top)+'px');
					$D.setStyle(shimFrame, 'display', 'block');
				}
				
				$D.setStyle(indicator, 'display', 'block');
				$D.setStyle(indicator, 'position', 'absolute');
				if (config.centerIndicator) {
					$D.setStyle(indicator, 'top', '50%');
					$D.setStyle(indicator, 'left', '50%');
					indicator.style.marginTop = -(indicator.offsetHeight/2) + 'px';
					indicator.style.marginLeft = -(indicator.offsetWidth/2) + 'px';
				}
			} else {
				$D.setStyle(indicator, 'display', '');
				if (xy) {
					$D.setStyle(indicator, 'position', 'absolute');
					$D.setXY(indicator, xy);
				}
			}
		};

		handle.hide = function() {
			if (config.useShim) {
				var shim = indicator.parentNode;
				$D.setStyle(indicator, 'display', 'none');
				$D.setStyle(shim, 'display', 'none');
				if (config.useIFrame)
					$D.setStyle(indicator.parentNode.nextSibling, 'display', 'none');
				try {
					if (config.useIFrame)
						shim.parentNode.removeChild(shim.nextSibling);
					shim.parentNode.removeChild(shim);
				} catch (e) {}
			} else {
				$D.setStyle(indicator, 'display', 'none');
				try {
					indicator.parentNode.removeChild(indicator);
				} catch (e) {}
			}
		};
		
		return handle;
	}
}/* �򵥷�ҳ */
TB.util.Pagination = new function() {
	
	var PAGE_SEPARATOR = '...'; /*ҳʡ�Է���*/	

	/* Ĭ�����ò��� */	
	var defConfig = {
		pageUrl: '',
		prevPageClass: 'PrevPage',  /*��һҳ<li>��className*/
		noPrevClass: 'NoPrev',       /*��һҳ������ʱ<li>��className*/
		prevPageText: 'prevPageText',
		nextPageClass: 'NextPage',  /*��һҳ<li>��className*/
		nextPageText: 'nextPageText',
		noNextClass: 'NoNext',       /*��һҳ������ʱ<li>��className*/		
		currPageClass: 'CurrPage',  /*��ǰҳ<li>��className*/
		pageParamName: 'page',		/*��ʶҳ���Ĳ�����*/
		appendParams: '',   /*���������Ĳ���*/
		pageBarMode: 'bound',  /*��ҳ������ʽ  bound | eye | line*/
		showIndicator: true,   /*��ʾ������ʾͼ��*/
		cachePageData: false  /*�����ҳ����*/
	}
	
	/**
	 * ֹͣclick�¼�������������/��һҳ������ʱ�����߷�ҳ���ݼ�����ʱ���з�ҳ�㶼������ʱ
	 * @param {Object} ev  �¼�����
	 */
	var cancelHandler = function(ev) {
		$E.stopEvent(ev);
	}
	
	/**
	 * ��ҳ����¼��������
	 * @param {Object} ev  	 �¼�����
	 * @param {Object} args  ������ʽΪ [pageIndex, handle]
	 */
	var pageHandler = function(ev, args) {
		$E.stopEvent(ev);
		var target = $E.getTarget(ev);
		args[1].gotoPage(args[0]);
	}
	
	/**
	 * ����"bound"��ʽ�ķ�ҳ�б�
	 * @param {Object} pageIndex  ��ǰҳ
	 * @param {Object} pageCount  ��ҳ��
	 */
	var buildBoundPageList = function(pageIndex, pageCount) {
        var l = [];
        var leftStart = 1;
        var leftEnd = 2;
        var mStart = pageIndex - 2;
        var mEnd = pageIndex + 2;
        var rStart = pageCount - 1;
        var rEnd = pageCount;

        if (mStart <= leftEnd) {
            leftStart = 0;
            leftEnd = 0;
            mStart = 1;
        }

        if (mEnd >= rStart) {
            rStart = 0;
            rEnd = 0;
            mEnd = pageCount;
        }

        if (leftEnd > leftStart) {
            for (var i = leftStart; i <= leftEnd; ++i) {
            	l[l.length] = ""+i;
            }

            if ((leftEnd + 1) < mStart) {
            	l[l.length] = PAGE_SEPARATOR;
            }
        }

        for (var i = mStart; i <= mEnd; ++i) {
        	l[l.length] = ""+i;
        }

        if (rEnd > rStart) {
            if ((mEnd + 1) < rStart) {
            	l[l.length] = PAGE_SEPARATOR;
            }

            for (var i = rStart; i <= rEnd; ++i) {
            	l[l.length] = ""+i;
            }
        }
        return l;
	}
	
	/**
	 * ��������ҳ����<li> element
	 * @param {Object} idx   ҳ��
	 * @param {Object} config
	 */
	var buildPageEntry = function(idx, config) {
		var liEl = document.createElement('li');
		if (idx != PAGE_SEPARATOR) {
			$D.addClass(liEl, (idx=='prev')?config.prevPageClass:(idx=='next')?config.nextPageClass:'');
			var aEl = document.createElement('a');
			aEl.setAttribute('title',(idx == 'prev')?$M(config.prevPageText):(idx=='next')?$M(config.nextPageText):''+idx);
			aEl.href = buildPageUrl(idx, config) + '&t=' + new Date().getTime();
			aEl.innerHTML = (idx=='prev')?$M(config.prevPageText):(idx=='next')?$M(config.nextPageText):idx;
			liEl.appendChild(aEl);
		} else {
			/*����Ƿ�ҳʡ�Էָ�����ֱ����ʾʡ�Ժ�*/
			liEl.innerHTML = PAGE_SEPARATOR;
		}
		return liEl;
	}
	
	/**
	 * ����ҳ��Url
	 * @param {Object} idx
	 * @param {Object} config
	 */
	var buildPageUrl = function(idx, config) {
		var url = config.pageUrl + (config.pageUrl.lastIndexOf('?')!=-1?'&':'?') + config.pageParamName + '=' + idx;
		if (config.appendParams)
			url += '&' + config.appendParams;
		return url;
	}
	
	/**
	 * �ӿں���
	 * @param {Object} pageBarContainer ��ҳ������
	 * @param {Object} pageDataContainer  ҳ����������
	 * @param {Object} config ���ò���
	 */
	this.attach = function(pageBarContainer, pageDataContainer, config) {	
		pageBarContainer = $(pageBarContainer);
		pageDataContainer = $(pageDataContainer);
		config = TB.applyIf(config||{}, defConfig);
		
		/*���ݻ������*/
		if (config.cachePageData) {
			var pageDataCache = {};
		}
		
		var ulEl = document.createElement('ul');
		pageBarContainer.appendChild(ulEl);
		
		var pageLoadEvent = new YAHOO.util.CustomEvent('pageLoad', null, false, YAHOO.util.CustomEvent.FLAT);
		
		var handle = {};
		
		/**
		 * ���������ҳ��
		 * @param {Object} pageObj  JSON��ʽ�ķ�ҳ����
		 * 
		 * ���ݸ�ʽ
		 * {
		 * 		"Pagination": {
		 * 			"PageIndex": 1, //��ǰҳ
		 * 			"PageCount" : 3 , //��ҳ��
		 * 			"PageSize" : 100, //ҳ����Ŀ��
		 * 			"TotalCount" : 300, //��Ŀ��������ѡ��
		 * 			"PageData" : "<html>" //������html����
		 * 		} 
		 * 	}
		 */
		handle.rebuildPageBar = function(pageObj) {
			if (!pageObj) return;

			this.pageIndex = parseInt(pageObj.PageIndex);
			this.totalCount = parseInt(pageObj.TotalCount);
			this.pageCount = parseInt(pageObj.PageCount);
			this.pageSize = parseInt(pageObj.PageSize);
			
			/* ���page UL ���ݲ����¹��� */
			ulEl.innerHTML = '';
			
			/* ��ȡ��ҳҳ���б� */
			var list = this.repaginate();

			/* ��һҳ������Ԫ */
			var prevLiEl = buildPageEntry('prev', config);
			if (!this.isPrevPageAvailable()) {
				$D.addClass(prevLiEl, config.noPrevClass);
				$E.on(prevLiEl, 'click', cancelHandler);
			} else {
				$E.on(prevLiEl, 'click', pageHandler, [this.pageIndex-1, this]);
			}
			ulEl.appendChild(prevLiEl);			
			
			/* ѭ�������ҳ�� */
			for (var i = 0; i < list.length; i++) {
				var liEl = buildPageEntry(list[i], config);
				if (list[i] == this.pageIndex) {
					$D.addClass(liEl, config.currPageClass);
					$E.on(liEl, 'click', cancelHandler);
				} else {
					$E.on(liEl, 'click', pageHandler, [list[i], this]);				
				}
				ulEl.appendChild(liEl);
			}
			
			/* ��һҳ������Ԫ */
			var nextLiEl = buildPageEntry('next', config);
			if (!this.isNextPageAvailable()) {
				$D.addClass(nextLiEl, config.noNextClass);
				$E.on(nextLiEl, 'click', cancelHandler);
			} else {
				$E.on(nextLiEl, 'click', pageHandler, [this.pageIndex+1, this]);
			}			
			ulEl.appendChild(nextLiEl);
		}
		
		/**
		 * �����ҳҳ���
		 */
		handle.repaginate = function() {
			var mode = config.pageBarMode;
			if (mode == 'bound') {
				/* ���� bound ��ʽ�ķ�ҳ��������Ե���ʾҳ�� */
				return buildBoundPageList(parseInt(this.pageIndex), parseInt(this.pageCount));
			} else if (mode == 'line') {
				/* ���� line ��ʽ�ķ�ҳ������ʾ����ҳ�� */
				var l = [];
				for (var i = 1; i <= this.pageCount; i++) {
					l.push(i);
				}
				return l;
			} else if (mode == 'eye') {
				/* ���� eye ��ʽ�ķ�ҳ��,ֻ����ǰ���ķ�ҳ��ʽ */
				return [];
			}
		}
		
		/**
		 * ��ʾָ��ҳ�������
		 * @param {Object} idx  ҳ��
		 */
		handle.gotoPage = function(idx) {
			this.disablePageBar();
			if (config.showIndicator) {
				$D.setStyle(pageDataContainer, 'display', 'none');
				var indicator = TB.util.Indicator.attach(pageDataContainer, {message:$M('loading')});
				indicator.show();
			}
			var url = buildPageUrl(idx, config);
			
			/* ������������ݻ��棬�����ֻ��������Ѵ��ڣ�ֱ����ʾ�����е����� */
			if (config.cachePageData) {
				if (pageDataCache[url]) {
					handle.showPage(pageDataCache[url]);
					return;
				}
			} 
			
			YAHOO.util.Connect.asyncRequest('GET', url + '&t=' + new Date().getTime(), {
				success: function(req) {
					var resultSet = eval('(' + req.responseText + ')');
					handle.showPage(resultSet.Pagination);
					if (config.cachePageData) {
						pageDataCache[url] = resultSet.Pagination;	
					}
					if (config.showIndicator){
						indicator.hide();
						$D.setStyle(pageDataContainer, 'display', 'block');
					}			
				},
				failure: function(req) {
					if (config.showIndicator){
						$D.setStyle(pageDataContainer, 'display', 'block');						
						indicator.hide();
					}
					handle.rebuildPageBar();			
					alert($M('ajaxError'));
				}
			});	
		}
		
		handle.showPage = function(pageObj) {
			this._showPage(pageObj);
			this.rebuildPageBar(pageObj);
			pageLoadEvent.fire(pageObj);
		}
		
		handle._showPage = function(pageObj) {
			if (pageObj.PageData && YAHOO.lang.isString(pageObj.PageData))
				pageDataContainer.innerHTML = pageObj.PageData;
		}

		/**
		 * ������һҳ��
		 */
		handle.isNextPageAvailable = function() {
			return this.pageIndex < this.pageCount;
		}

		/**
		 * ������һҳ?
		 */
		handle.isPrevPageAvailable = function() {
			return this.pageIndex > 1;
		}
		
		/**
		 * ���÷�ҳ�������û����ĳ����ҳ��ʱ������������ҳ��������<a>�ĵ����������������disabled=1
		 * @param {Object} bar
		 */
		handle.disablePageBar = function() {
			$D.addClass(pageBarContainer, 'Disabled');
			/* ����������onclick event handler */
			$E.purgeElement(pageBarContainer, true, 'click');
			var els = TB.common.toArray(pageBarContainer.getElementsByTagName('a'));
			els.forEach(function(el, i){
				$E.on(el, 'click', cancelHandler);
				el.disabled = 1;
			});
		}		
		
		/**
		 * ע��ҳ�����ݼ�����ɺ�ִ�еĻص�����
		 * @param {Object} callback
		 */
		handle.onPageLoad = function(callback) {
			if (YAHOO.lang.isFunction(callback))
				pageLoadEvent.subscribe(callback);
		} 
		
		/**
		 * ����query��������
		 * @param {Object} params
		 */
		handle.setAppendParams = function(params) {
			config.appendParams = params;
		}
		
		return handle;		
	}			
}/**
 * ����queryString
 * @param {Object} maps
 */
TB.util.QueryData = function() {
	this.data = [];
	this.addField = function(input) {
		for(var i = 0; i < arguments.length; i++) {
			var field = arguments[i];
			if (field)
				this.add(field.name, encodeURIComponent(field.value));
		}
	}
	this.add = function(name, value) {
		this.data.push({"name":name, "value":value});
	}
	this.get = function(name) {
		for (var i = 0; i < this.data.length; i++) {
			if (this.data[i].name === name)
				return this.data[i].value;
		}
		return null;
	}
	this.toQueryString = function() {
		var qs = this.data.map(function(o, i) {
			return o.name + '=' + o.value;
		});
		return qs.join('&'); 			
	}
}/**
 * @author zexin.zhaozx
 */
TB.form.CheckboxGroup = new function() {
	var Y = YAHOO.util;
	var defConfig = {
		checkAllBox: 'CheckAll',
		checkAllBoxClass: 'tb:chack-all',
		checkOnInit: true /* ��ʼ��ʱ�Ƿ�Ԥ���� */
	}
	var getChecked = function(o, i) { return o.checked;	}
	var setChecked = function(o, i) {
		if (o.type && o.type.toLowerCase()=='checkbox')
			o.checked = true; 
	}
	var setUnchecked = function(o, i) {
		if (o.type && o.type.toLowerCase()=='checkbox')
			o.checked = false; 
	}
	
	this.attach = function(checkboxGroup, config) {
		config = TB.applyIf(config || {}, defConfig);
		/*���ظ������ߵĿ�������ֻ�����Ե����߿ɼ��ķ���/����*/	
		var handle = {};
		var onCheckEvent = new Y.CustomEvent('onCheck', handle, false, Y.CustomEvent.FLAT);			
	
		var checkboxes = [];
		if (checkboxGroup) {
			if(checkboxGroup.length)
				checkboxes = TB.common.toArray(checkboxGroup);
			else
				checkboxes[0] = checkboxGroup; /*���ֻ��һ��checkbox*/		
		}
		
		var checkAllBoxes = [];
		if (config.checkAllBoxClass) {
			checkAllBoxes = $D.getElementsByClassName(config.checkAllBoxClass, null, checkboxes[0].form);
		}
		if ($(config.checkAllBox)) {
			checkAllBoxes.push($(config.checkAllBox));
		}
 
		var doCheck = function() {
			var checkedBoxes = checkboxes.filter(getChecked);
			if (checkboxes.length == 0) {
				checkAllBoxes.forEach(setUnchecked);
			} else {
				checkAllBoxes.forEach((checkedBoxes.length == checkboxes.length)?setChecked:setUnchecked);
			}			
			handle._checkedBoxCount = checkedBoxes.length;
		}		
		var clickHandler = function(ev) {
			var checkbox = $E.getTarget(ev);
			doCheck();
			onCheckEvent.fire(checkbox);
			return true;
		}

		TB.apply(handle, {
			_checkedBoxCount : 0,
			
			onCheck: function(func) {
				onCheckEvent.subscribe(func);
			},
			
			isCheckAll: function() {
				return this._checkedBoxCount == checkboxes.length;				
			},
			isCheckNone: function() {
				return this._checkedBoxCount == 0;
			},
			isCheckSome: function() {
				return this._checkedBoxCount != 0;
			},
			isCheckSingle: function() {
				return this._checkedBoxCount == 1;
			},
			isCheckMulti: function() {
				return this._checkedBoxCount > 1;
			},			
			toggleCheckAll: function() {
				var allChecked = checkboxes.every(getChecked);
				checkboxes.forEach(allChecked?setUnchecked:setChecked);
				if (checkboxes.length == 0) {
					checkAllBoxes.forEach(setUnchecked);
				} else {
					checkAllBoxes.forEach(allChecked?setUnchecked:setChecked);
				}
				handle._checkedBoxCount = (allChecked)?0:checkboxes.length;
				checkboxes.forEach(function(o){
					onCheckEvent.fire(o);
				});
			},
			toggleChecked: function(checkbox) {
				checkbox.checked = !checkbox.checked;
				doCheck();
				onCheckEvent.fire(checkbox);
			},
			getCheckedBoxes: function() {
				return checkboxes.filter(getChecked);
			}
		});

		$E.on(checkboxes, 'click', clickHandler);
		if (config.onCheck && YAHOO.lang.isFunction(config.onCheck)) 
			onCheckEvent.subscribe(config.onCheck, handle, true);
		if (checkAllBoxes.length > 0) {
			$E.on(checkAllBoxes, 'click', handle.toggleCheckAll);
		}
		if (config.checkOnInit) {
			doCheck();
			var checkOnInit = function() {
				checkboxes.forEach(function(o){
					onCheckEvent.fire(o);
				});
			}
			setTimeout(checkOnInit, 10);
		}
		return handle;
	}	 
}/**
 * @author zexin.zhaozx
 */
TB.form.TagAssistor = new function() {
	
	/**
	 * Ĭ�����ò���
	 */
	var defConfig = {
		separator: ' ', /*Ĭ�Ϸָ����ǿո�*/
		selectedClass: 'Selected'
	}
	
	/**
	 * �ж�ѡ�е�tag�Ƿ���array�д��ڣ�������ڷ���true����֮false��
	 * @param {Object} tagArr
	 * @param {Object} tagEl
	 */
	var tagExists = function(tagArr, tagEl) {
		return tagArr.indexOf(TB.common.trim(tagEl.innerHTML)) != -1;
	}
	
	var value2TagArray = function(textField, separator) {
		/*�������Ŀո��滻Ϊ�����ո񣬲�ȥ����β�Ŀո�*/
		var val = textField.value.replace(/\s+/g, ' ').trim();
		if (val.length > 0)
			return val.split(separator);
		else
			return [];
	}
	
	/**
	 * ָ�ɸ�����Ԫ�غͱ�ѡtag������
	 * @param {Object} textField ������һ��<input>����<textarea>
	 * @param {Object} tagsContainer ���ñ�ѡtag��element��������һ��ul��dl
	 * @param {Object} config ���ò���
	 */
	this.attach = function(textField, tagsContainer, config) {
		textField = $(textField);
		tagsContainer = $(tagsContainer);
		config = TB.applyIf(config || {}, defConfig);
		
		
		var triggers = TB.common.toArray(tagsContainer.getElementsByTagName('a'));		
		
		/**
		 * �����ѡtag���¼��������
		 * @param {Object} ev
		 */
		var clickHandler = function(ev) {
			var tagArray = value2TagArray(textField, config.separator);
			var target = $E.getTarget(ev);
			/* tag��ѡ�� */
			if (tagExists(tagArray, target)) {
				tagArray.remove(TB.common.trim(target.innerHTML));
			} else {
				tagArray.push(TB.common.trim(target.innerHTML));
			}
			updateClass(tagArray);
			textField.value = tagArray.join(config.separator);
		}
		
		var updateClass = function(tagArray) {
			triggers.forEach(function(o, i) {
				if (tagExists(tagArray, o)) {
					$D.addClass(o, config.selectedClass);
				} else {
					$D.removeClass(o, config.selectedClass);
				}						
			})						
		}
		
		var handle = {};
		/**
		 * ��ʼ����һЩ����
		 */
		handle.init = function() {
			var tagArray = value2TagArray(textField, config.separator);

			/* ��ÿ��	��ѡtag��<a> ע���¼�������� */
			triggers.forEach(function(o, i){
				if (tagExists(tagArray, o)) {
					$D.addClass(o, config.selectedClass);
				}
				$E.on(o, 'click', clickHandler);
			});
			
			/* ���ÿ�εļ��̶������������ƥ����߲�ƥ���tag���֣����ӻ�ȡ������Ч�� */
			$E.on(textField, 'keyup', function(ev){
				var tagArray = value2TagArray(textField, config.separator);
				updateClass(tagArray);				
			});
		}
		handle.init();
	}
}
