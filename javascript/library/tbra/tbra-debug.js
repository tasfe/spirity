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
 * 复制一个数组，Generic 化后也可用于将 arguments/NodeList 转化为数组。
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
  * 移除数组中的指定元素
  * 为保持代码兼容性，保留此方法 
 */
Array.prototype.remove = function(elt) {
	var i = this.indexOf(elt);
	if (i != -1)
		this.splice(i, 1);
};

/**
 * Generic化 indexOf/lastIndexOf/forEach/filter/map/some/every/copy 8个数组原型方法
 * 可使用 Array.xxxx 的形式调用，如：
 * 		arr.forEach(fun) 
 * 也可以改写为 
 * 		Array.forEach(arr, fun);
 * 同时，Array.xxxxx 的形式支持传递 arguments/NodeList 对象最为第一个参数 
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
 * 取随机整数
 * @param {Object} n 最大整数
 */
Math.randomInt = function(n) {
	return Math.floor(Math.random() * (n + 1));	
}
/**
 * 常用变量
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
	 * 移除文字前后的空白字符
	 * 
	 * @method trim
	 * @param {String} str 
	 * @deprecated 使用String.prototpye.trim()来替代
	 */
	trim: function(str) {
		return str.replace(/(^\s*)|(\s*$)/g,''); 
	},

	/**
	 * 编码HTML (from prototype framework 1.4)
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
	 * 解码HTML (from prototype framework 1.4)
	 * @method unescapeHTML
	 * @param {Object} str
	 */
	unescapeHTML: function(str) {
		var div = document.createElement('div');
		div.innerHTML = str.replace(/<\/?[^>]+>/gi, '');
		return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
	},
	
	/**
	 * 删除字符串中的(x)html中的标签信息
	 * @method stripTags
	 * @param {Object} str
	 */
	stripTags: function(str) {
    	return str.replace(/<\/?[^>]+>/gi, '');
  	},

	/**
	 * 转换 NodeList 或者 arguments 为数组
	 * @method toArray
	 * @param {Object} list
	 * @param {Object} start
	 * @return {Array} 转换后的数组，如果start大于list的容量，返回空数组
	 */
	toArray : function(list, start) {
		var array = [];
		for (var i = start || 0; i < list.length; i++) {
			array[array.length] = list[i];
		}
		return array;
	},

	/**
	 * 复制配置属性给某对象，如果对象已存在该配置，不进行覆盖
	 * @param {Object} obj 目标对象 
	 * @param {Object} config 包含属性/参数 对象
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
	 * 复制配置属性给某对象，如果对象已存在该配置，将被覆盖为新属性
	 * @param {Object} obj 目标对象 
	 * @param {Object} config 包含属性/参数 对象
	 */		
	apply: function(obj, config) {
    	if(obj && config && typeof config == 'object'){
        	for(var p in config)
				obj[p] = config[p];
		}
		return obj;
	},
	
	/**
	 * 格式化字符串
	 * eg:
	 * 	TB.common.formatMessage('{0}天有{1}个小时', [1, 24]) 
	 *  or
	 *  TB.common.formatMessage('{day}天有{hour}个小时', {day:1, hour:24}}
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
	 * 解析URI
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
	     * 获取cookie
	     * @method getCookie
	     * @param {String} name cookie名称
	     * @return {String} cookie 的值或者空字符串
	     */	
		getCookie: function(name) {
			var value = document.cookie.match('(?:^|;)\\s*'+name+'=([^;]*)');
			return value ? unescape(value[1]) : '';
		},
	
	    /**
	     * 设置cookie
	     * @method setCookie
	     * @param {String} name cookie名称
		 * @param {String} value cookie的值
	     * @return {String} cookie 的值或者空字符串
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
		 * 删除cookie
		 * @method removeCookie
		 * @param {Object} name
		 */
		removeCookie: function(name) {
			this.setCookie(name, '', -1);
		},
	
		/**
		 * 提取当前hostname的domain.domain;
		 * 默认返回当前hostname的第一层父级域，如 www.xyx.taobao.com -> xyz.taoboa.com，store.taobao.com - > taobao.com
		 * 可传递一个参数n，指定取n级的父级域，如n=2, 则www.xyx.taobao.com -> taoboa.com
		 * 如果hostname本身只有二级域，或参数n过大，则总是返回二级域
		 * 
		 * 注意：类似sina.com.cn这样带国家区域的域名可能有误。
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
		 * 添加到收藏夹
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
	 * 根据tagName获取最近一个祖先节点
	 * @param {Object} el
	 * @param {Object} tag
	 * @deprecated use YAHOO.util.Dom.getAncestorByTagName
	 */
	getAncestorByTagName: function(el, tag) {
		return $D.getAncestorByTagName(el, tag);
	},
	
	/**
	 * 根据class获取最近的一个祖先节点
	 * @param {Object} el
	 * @param {Object} cls
	 * @deprecated use YAHOO.util.Dom.getAncestorByClassName
	 */
	getAncestorByClassName: function(el, cls) {
		return $D.getAncestorByClassName(el, cls);
	}, 
	
	/** 
	 * 获取之后的兄弟节点
	 * @param {Object} node
	 * @deprecated use YAHOO.util.Dom.getNextSibling
	 */	
	getNextSibling: function(node) {
		return $D.getNextSibling(node);
	},
	
	/** 
	 * 获取之前的兄弟节点
	 * @param {Object} node
	 * @deprecated use YAHOO.util.Dom.getPreviousSibling
	 */
	getPreviousSibling: function(node) {
		return $D.getPreviousSibling(node);	
	},
	
	/**
	 * 获取表单域的label
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
	 * 获取iframe的document
	 * @param {Object} el
	 */
	getIframeDocument: function(el) {
		var iframe = $(el);
		return iframe.contentWindow? iframe.contentWindow.document : iframe.contentDocument;
	},

	/**
	 * 设置表单的action属性，处理表单中包含同名的field时的情况
	 * @param {Object} form  form 对象
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
	 * 添加样式文本
	 * @param {Object} cssText
	 * @param {Object} doc
	 */
	addCSS: function(cssText, doc) {
		doc = doc || document;
		var styleEl = doc.createElement('style');
		styleEl.type = "text/css";
		doc.getElementsByTagName('head')[0].appendChild(styleEl); //先appendChild，否则hack失效
		if (styleEl.styleSheet) {
			styleEl.styleSheet.cssText = cssText;
		} else {
			styleEl.appendChild(doc.createTextNode(cssText));
		}
	},
	
	/**
	 * 根据脚本名字，取得脚本参数
	 * @param {Object}||{RegExp}||{String} script
	 */
	getScriptParams: function(script) {
		var p = /\?(.*?)($|\.js)/;
		var m;
		//如果是 <script> tag
		if (YAHOO.lang.isObject(script) && script.tagName && script.tagName.toLowerCase()=='script') {
			if (script.src && (m = script.src.match(p))) {
				return m[1].toQueryParams();  
			}
		} else {
			//如果是 string， 转成 regexp
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
 * @fileOverview TB.anim 基于YAHOO.util.Anim封装的动画效果
 * @name TB.anim
 * @example
	new TB.anim.Highlight(el, {
		startColor: '#ffff99'
	}).animate();
 */
 
/**
 * @constructor
 * @param {Object} el 应用动画的元素
 * @param {Object} [config]  配置参数
 */	
TB.anim.Highlight = function(el, config) {
	if (!el) return;
	this.init(el, config)
}

/**
 * 默认配置
 */
TB.anim.Highlight.defConfig = {
	/** 加亮开始时设置的背景色*/
	startColor: '#ffff99',
	/** 动画时长 */
	duration: .5,
	/** 是否保持原先的背景 */
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
	 * onComplete 回调，直接引用被封装的 Anim 对象的 onComplete 事件
	 */	
	this.onComplete = anim.onComplete;
	
	/**
	 * 执行动画
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
	config 属性说明

	position: {String} [left|right|top|bottom]
	autoFit: {Boolean} 是否自适应窗口
	width: {Number} popup width 
	height: {Number} popup height
	offset: {Array} offset
	eventType: {String} [mouse|click] 鼠标移动触发还是点击触发
	disableClick: {Boolean}
	delay: {Number} 鼠标移动触发时间延迟
	onShow: {function} 显示回调函数
	onHide: {Function} 隐藏回调函数
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
	 * 事件处理器
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
			/* batch操作时处于简单考虑，不返回handle object */
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
		/* 返回给调用者的控制器，只包含对调用者可见的方法/属性 */		
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
			/* batch 操作时，Popup 的鼠标事件只注册一次 */
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
						t = dh-ph+st-2; /* 2px 偏差 */
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
/** 简单滚动 */
TB.widget.SimpleScroll = new function() {
	
	var Y = YAHOO.util;	
 	var defConfig = {
		delay: 2,
		speed: 20,
		startDelay: 2,
		direction: 'vertical',	/* 'horizontal(h)' or 'vertical(v)'. defaults to vertical. */		
		disableAutoPlay: false, 
		distance: 'auto',
		scrollItemCount: 1  /** 随同一行滚动的li数量，默认1 */		
	}
	/**
	 * container 必须是一个 ul
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
		/* 是否横向滚动 */
		var isHorizontal = (config.direction.toLowerCase() == 'horizontal') || (config.direction.toLowerCase() == 'h'); 
		
		/* 返回给调用者的控制器，只包含对调用者可见的方法/属性 */	
		var handle = {};
		handle._distance = 0;
		/* 空间上能否还可以滚动 */
		handle.scrollable = true;
		/* 本次预计滚动的距离 */
		handle.distance = config.distance;
		/* 每次滚动的距离 */
		handle._distance = 0;
		/* 鼠标移动上去时暂停 */
		handle.suspend = false;
		/* 暂停 */
		handle.paused = false;
	
		
		/* 内部使用事件 */
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
		
		/* 公开事件 */
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
		
		/** 初始化移动距离并判断是否可滚动 */
		_onScrollEvent.fire();
		/** 自动开始滚动 */		
		if (!config.disableAutoPlay) {
			startDelayTimeId = setTimeout(function(){handle.play();}, config.startDelay*1000);
		}		
		return handle;
	}
};/**
 * TBra Slide 
 * 
 * 限制：幻灯片必须包括在<ul>中，每张幻灯片是一个<li>。
 * @author xiaoma<xiaoma@taobao.com>
 * 
 */
/* 幻灯片播放 */
(function() {
	var Y = YAHOO.util;
	
	TB.widget.Slide = function(container, config) {
		this.init(container, config);
	}
	/* 默认参数配置 */ 
	TB.widget.Slide.defConfig = {
		slidesClass: 'Slides',			/* 幻灯影片ul的className */
		triggersClass: 'SlideTriggers',		/* 触点的className */
		currentClass: 'Current',			/* 当前触点的className */
		eventType: 'click',					/* 触点接受的事件类型，默认是鼠标点击 */
		autoPlayTimeout: 5,					/* 自动播放时间间隔 */
		disableAutoPlay: false				/* 禁止自动播放 */
	};
	TB.widget.Slide.prototype = {
		/**
		 * 初始化对象属性和行为
		 * @method init 
		 * @param {Object} container 容器对象或ID
		 * @param {Object} config 配置参数
		 */
		init: function(container, config) {
			this.container = $(container);
			this.config = TB.applyIf(config||{}, TB.widget.Slide.defConfig);
			try {
				this.slidesUL = $D.getElementsByClassName(this.config.slidesClass, 'ul', this.container)[0];
				
				if(!this.slidesUL) {
					//取第一个 ul 子节点
					this.slidesUL = $D.getFirstChild(this.container, function(node) {
						return node.tagName.toLowerCase === 'ul';
					});
				}
				
				this.slides = $D.getChildren(this.slidesUL); //只取直接的子<li>元素
				if (this.slides.length == 0) {
					throw new Error();
				}
			} catch (e) {
				throw new Error("can't find slides!");
			}
			this.delayTimeId = null;		/* eventType = 'mouse' 时，延迟的TimeId */
			this.autoPlayTimeId = null;		/* 自动播放TimeId */
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
			
			/* 指定tbra.css中设定的 class */
			$D.addClass(this.container, 'tb-slide');
			$D.addClass(this.slidesUL, 'tb-slide-list');
			$D.setStyle(this.slidesUL, 'height', (this.config.slideHeight || this.container.offsetHeight) + 'px');
			
			this.initSlides(); /* 初始化幻灯片设置 */
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
		 * 根据幻灯片长度自动生成触点，包含在一个<ul>中，页面中CSS中必须有对应属性设置
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
		 * 初始化幻灯片
		 * @method initSlides 
		 */
		initSlides: function() {
			$E.on(this.slides, 'mouseover', function(){this.pause = true;}, this, true);
			$E.on(this.slides, 'mouseout', function(){this.pause = false;}, this, true);
			$D.setStyle(this.slides, 'display', 'none');
		},
		
		/**
		 * 点击事件处理
		 * @param {Object} e Event对象
		 */
		clickHandler: function(e) {
			var t = $E.getTarget(e);
			var idx = parseInt(TB.common.stripTags(t.innerHTML));
			while(t != this.container) {
				if(t.nodeName.toUpperCase() == "LI") {
					 /* 如果还在滑动中,停止响应 */
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
		 * 鼠标事件处理
		 * @param {Object} e Event 对象
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
		 * 播放指定页的幻灯片
		 * @param {Object} n 页数，也就是触点数字值
		 * @param {Object} flag 如果flag=true，则是用户触发的，反之则为自动播放
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
		 * 切换幻灯片，最简单的切换就是隐藏/显示。
		 * 不同的效果可以覆盖此方法
		 * @see TB.widget.ScrollSlide
		 * @see TB.widget.FadeSlide
		 * @param {Object} n 页数
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
		 * 设置自动播放
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
	 * 滚动效果的幻灯片播放器
	 * @param {Object} container
	 * @param {Object} config
	 */
	TB.widget.ScrollSlide = function(container, config){
		this.init(container, config);
	}
	YAHOO.extend(TB.widget.ScrollSlide, TB.widget.Slide, {
		/**
		 * 覆盖父类的行为，不隐藏幻灯片
		 * CSS中注意设置 slidesUL overflow:hidden，保证只显示一幅幻灯
		 */
		initSlides: function() {
			TB.widget.ScrollSlide.superclass.initSlides.call(this);
			$D.setStyle(this.slides, 'display', '');
		},
		/**
		 * 覆盖父类的行为，使用滚动动画
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
	 * 淡入淡出效果的幻灯片播放器
	 * @param {Object} container
	 * @param {Object} config
	 */
	TB.widget.FadeSlide = function(container, config){
		this.init(container, config);
	}
	YAHOO.extend(TB.widget.FadeSlide, TB.widget.Slide, {
		/**
		 * 覆盖父类的行为，设置幻灯片的position=absolute
		 */
		initSlides: function() {
			TB.widget.FadeSlide.superclass.initSlides.call(this);
			$D.setStyle(this.slides, 'position', 'absolute');
			$D.setStyle(this.slides, 'top', this.config.slideOffsetY||0);
			$D.setStyle(this.slides, 'left', this.config.slideOffsetX||0);
			$D.setStyle(this.slides, 'z-index', 1);
		},
		
		/**
		 * 覆盖父类的行为，使用淡入淡出动画
		 * @param {Object} n
		 */
		slide: function(n) {
			/* 第一次运行 */
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
 * Slide 的封装，通过 effect 参数，创建不同的Slide对象
 */
TB.widget.SimpleSlide = new function() {
	
	this.decorate = function(container, config) {
		if (!container) return;
		config = config || {};
		if (config.effect == 'scroll') {
			/** <li>下包含<iframe>时，firefox显示异常 */ 
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
}/* 简单Tab切换 */
TB.widget.SimpleTab = new function() {
	var Y = YAHOO.util;
	var defConfig = {
		eventType: 'click',
		currentClass: 'Current',  /* li 当前选中状态时的className */
		tabClass: '',  /* 作为 tab 的element的 className */
		autoSwitchToFirst: true,  /* 是否默认选中第一个tab */
		stopEvent: true,  /* 停止事件传播 */
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
		/* 返回给调用者的控制器，只包含对调用者可见的方法/属性 */		
		var handle = {};
	
		var tabPanels = getImmediateDescendants(container);
		var tab = tabPanels.shift(0);
		var tabTriggerBoxs  = tab.getElementsByTagName('li');
		var tabTriggers, delayTimeId;
		if (config.tabClass) {
			tabTriggers = $D.getElementsByClassName(config.tabClass, '*', container);
		} else {
			tabTriggers = TB.common.toArray(tab.getElementsByTagName('a')); /* 默认取tab下的<a> */
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

		/* 定义公开的方法 */
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
		
		/*初始化操作*/
		$D.setStyle(tabPanels, 'display', 'none');
		if (config.autoSwitchToFirst)
			handle.switchTab(0);
		
		/* 返回操作对象 */
		return handle;
	}
};/**
 * 评分组件
 * 需要star-rating.css
 */

TB.widget.SimpleRating = new function() {
	
	var defConfig = {
		rateUrl: '',  /* 评分数据发送给的URL */
		rateParams: '',  /* 其他参数，格式k1=v1&k2=v2 */
		scoreParamName: 'score', /* 评论参数名 */
		topScore: 5,  /* 最高分 */
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
		ratingContainer = $(ratingContainer);  /* 一个<ul> */
		config = TB.applyIf(config || {}, defConfig);
		var currentRatingLi = $D.getElementsByClassName(config.currentRatingClass, 'li', ratingContainer)[0];
		
		var onRateEvent = new YAHOO.util.CustomEvent('onRate', null, false, YAHOO.util.CustomEvent.FLAT);
		if (config.onRate)
			onRateEvent.subscribe(config.onRate);
		var handle = {};
		
		handle.init = function(avg) {
			/* 检查看是否需要显示当前的分数 */
			updateCurrentRating(currentRatingLi, avg, config);
		}
		
		handle.update = function(ret) {
			if (ret && ret.Average && currentRatingLi) {
				updateCurrentRating(currentRatingLi, ret.Average, config);
			}
			/* 只能评分一次 */
			$E.purgeElement(ratingContainer, true, 'click');
			/* 移除其他的li */
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
		
		/* 初始化 */
		if (!inputField.title)
			inputField.setAttribute("title", hintMessage);
		$E.on(inputField, 'focus', focusHandler, handle);
		$E.on(inputField, 'drop', focusHandler, handle); /* for ie/safari */
		
		if (!config.appearOnce)
			$E.on(inputField, 'blur', blurHandler, handle);
		
		/* 默认先显示 */
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
		formatStyle: 'short', /* 'long' ： x天x小时x分x秒  or 'short' ：[x天x小时 | x小时x分 | x分x秒]  or custom */
		formatPattern: '',  /* for formatStyle == custom */
		hideZero: true, /* for formatStyle == 'long' : if day==0 then show x小时x分x秒，etc. */
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
}/** 状态指示器 */
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
}/* 简单分页 */
TB.util.Pagination = new function() {
	
	var PAGE_SEPARATOR = '...'; /*页省略符号*/	

	/* 默认配置参数 */	
	var defConfig = {
		pageUrl: '',
		prevPageClass: 'PrevPage',  /*上一页<li>的className*/
		noPrevClass: 'NoPrev',       /*上一页不可用时<li>的className*/
		prevPageText: 'prevPageText',
		nextPageClass: 'NextPage',  /*下一页<li>的className*/
		nextPageText: 'nextPageText',
		noNextClass: 'NoNext',       /*下一页不可用时<li>的className*/		
		currPageClass: 'CurrPage',  /*当前页<li>的className*/
		pageParamName: 'page',		/*标识页数的参数名*/
		appendParams: '',   /*附带其他的参数*/
		pageBarMode: 'bound',  /*分页条的样式  bound | eye | line*/
		showIndicator: true,   /*显示加载提示图标*/
		cachePageData: false  /*缓存分页数据*/
	}
	
	/**
	 * 停止click事件传播，用于上/下一页不可用时，或者分页数据加载中时所有分页点都被禁用时
	 * @param {Object} ev  事件对象
	 */
	var cancelHandler = function(ev) {
		$E.stopEvent(ev);
	}
	
	/**
	 * 分页点击事件处理程序
	 * @param {Object} ev  	 事件对象
	 * @param {Object} args  参数格式为 [pageIndex, handle]
	 */
	var pageHandler = function(ev, args) {
		$E.stopEvent(ev);
		var target = $E.getTarget(ev);
		args[1].gotoPage(args[0]);
	}
	
	/**
	 * 构造"bound"形式的分页列表
	 * @param {Object} pageIndex  当前页
	 * @param {Object} pageCount  总页数
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
	 * 创建包括页符的<li> element
	 * @param {Object} idx   页符
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
			/*如果是分页省略分隔符，直接显示省略号*/
			liEl.innerHTML = PAGE_SEPARATOR;
		}
		return liEl;
	}
	
	/**
	 * 构造页标Url
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
	 * 接口函数
	 * @param {Object} pageBarContainer 分页条容器
	 * @param {Object} pageDataContainer  页面数据容器
	 * @param {Object} config 配置参数
	 */
	this.attach = function(pageBarContainer, pageDataContainer, config) {	
		pageBarContainer = $(pageBarContainer);
		pageDataContainer = $(pageDataContainer);
		config = TB.applyIf(config||{}, defConfig);
		
		/*数据缓存对象*/
		if (config.cachePageData) {
			var pageDataCache = {};
		}
		
		var ulEl = document.createElement('ul');
		pageBarContainer.appendChild(ulEl);
		
		var pageLoadEvent = new YAHOO.util.CustomEvent('pageLoad', null, false, YAHOO.util.CustomEvent.FLAT);
		
		var handle = {};
		
		/**
		 * 重新整理分页符
		 * @param {Object} pageObj  JSON格式的分页数据
		 * 
		 * 数据格式
		 * {
		 * 		"Pagination": {
		 * 			"PageIndex": 1, //当前页
		 * 			"PageCount" : 3 , //总页数
		 * 			"PageSize" : 100, //页面条目数
		 * 			"TotalCount" : 300, //条目总数（可选）
		 * 			"PageData" : "<html>" //编码后的html代码
		 * 		} 
		 * 	}
		 */
		handle.rebuildPageBar = function(pageObj) {
			if (!pageObj) return;

			this.pageIndex = parseInt(pageObj.PageIndex);
			this.totalCount = parseInt(pageObj.TotalCount);
			this.pageCount = parseInt(pageObj.PageCount);
			this.pageSize = parseInt(pageObj.PageSize);
			
			/* 清除page UL 内容并重新构造 */
			ulEl.innerHTML = '';
			
			/* 获取分页页码列表 */
			var list = this.repaginate();

			/* 上一页导航单元 */
			var prevLiEl = buildPageEntry('prev', config);
			if (!this.isPrevPageAvailable()) {
				$D.addClass(prevLiEl, config.noPrevClass);
				$E.on(prevLiEl, 'click', cancelHandler);
			} else {
				$E.on(prevLiEl, 'click', pageHandler, [this.pageIndex-1, this]);
			}
			ulEl.appendChild(prevLiEl);			
			
			/* 循环构造分页符 */
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
			
			/* 下一页导航单元 */
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
		 * 构造分页页码表
		 */
		handle.repaginate = function() {
			var mode = config.pageBarMode;
			if (mode == 'bound') {
				/* 返回 bound 形式的分页条，间断性的显示页码 */
				return buildBoundPageList(parseInt(this.pageIndex), parseInt(this.pageCount));
			} else if (mode == 'line') {
				/* 返回 line 形式的分页条，显示所有页码 */
				var l = [];
				for (var i = 1; i <= this.pageCount; i++) {
					l.push(i);
				}
				return l;
			} else if (mode == 'eye') {
				/* 返回 eye 形式的分页条,只有向前向后的分页形式 */
				return [];
			}
		}
		
		/**
		 * 显示指定页码的数据
		 * @param {Object} idx  页码
		 */
		handle.gotoPage = function(idx) {
			this.disablePageBar();
			if (config.showIndicator) {
				$D.setStyle(pageDataContainer, 'display', 'none');
				var indicator = TB.util.Indicator.attach(pageDataContainer, {message:$M('loading')});
				indicator.show();
			}
			var url = buildPageUrl(idx, config);
			
			/* 如果设置了数据缓存，而发现缓存数据已存在，直接显示缓存中的数据 */
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
		 * 存在下一页？
		 */
		handle.isNextPageAvailable = function() {
			return this.pageIndex < this.pageCount;
		}

		/**
		 * 存在上一页?
		 */
		handle.isPrevPageAvailable = function() {
			return this.pageIndex > 1;
		}
		
		/**
		 * 禁用分页条，当用户点击某个分页符时，禁用整个分页条中所有<a>的点击操作，并设置其disabled=1
		 * @param {Object} bar
		 */
		handle.disablePageBar = function() {
			$D.addClass(pageBarContainer, 'Disabled');
			/* 先重置所有onclick event handler */
			$E.purgeElement(pageBarContainer, true, 'click');
			var els = TB.common.toArray(pageBarContainer.getElementsByTagName('a'));
			els.forEach(function(el, i){
				$E.on(el, 'click', cancelHandler);
				el.disabled = 1;
			});
		}		
		
		/**
		 * 注册页面数据加载完成后执行的回调函数
		 * @param {Object} callback
		 */
		handle.onPageLoad = function(callback) {
			if (YAHOO.lang.isFunction(callback))
				pageLoadEvent.subscribe(callback);
		} 
		
		/**
		 * 设置query其他参数
		 * @param {Object} params
		 */
		handle.setAppendParams = function(params) {
			config.appendParams = params;
		}
		
		return handle;		
	}			
}/**
 * 构造queryString
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
		checkOnInit: true /* 初始化时是否预处理 */
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
		/*返回给调用者的控制器，只包含对调用者可见的方法/属性*/	
		var handle = {};
		var onCheckEvent = new Y.CustomEvent('onCheck', handle, false, Y.CustomEvent.FLAT);			
	
		var checkboxes = [];
		if (checkboxGroup) {
			if(checkboxGroup.length)
				checkboxes = TB.common.toArray(checkboxGroup);
			else
				checkboxes[0] = checkboxGroup; /*如果只有一个checkbox*/		
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
	 * 默认配置参数
	 */
	var defConfig = {
		separator: ' ', /*默认分隔符是空格*/
		selectedClass: 'Selected'
	}
	
	/**
	 * 判断选中的tag是否在array中存在，如果存在返回true，反之false。
	 * @param {Object} tagArr
	 * @param {Object} tagEl
	 */
	var tagExists = function(tagArr, tagEl) {
		return tagArr.indexOf(TB.common.trim(tagEl.innerHTML)) != -1;
	}
	
	var value2TagArray = function(textField, separator) {
		/*将连续的空格替换为单个空格，并去除首尾的空格*/
		var val = textField.value.replace(/\s+/g, ' ').trim();
		if (val.length > 0)
			return val.split(separator);
		else
			return [];
	}
	
	/**
	 * 指派给输入元素和备选tag的容器
	 * @param {Object} textField 必须是一个<input>或者<textarea>
	 * @param {Object} tagsContainer 放置备选tag的element，可能是一个ul或dl
	 * @param {Object} config 配置参数
	 */
	this.attach = function(textField, tagsContainer, config) {
		textField = $(textField);
		tagsContainer = $(tagsContainer);
		config = TB.applyIf(config || {}, defConfig);
		
		
		var triggers = TB.common.toArray(tagsContainer.getElementsByTagName('a'));		
		
		/**
		 * 点击备选tag的事件处理程序
		 * @param {Object} ev
		 */
		var clickHandler = function(ev) {
			var tagArray = value2TagArray(textField, config.separator);
			var target = $E.getTarget(ev);
			/* tag已选中 */
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
		 * 初始化的一些工作
		 */
		handle.init = function() {
			var tagArray = value2TagArray(textField, config.separator);

			/* 给每个	备选tag的<a> 注册事件处理程序 */
			triggers.forEach(function(o, i){
				if (tagExists(tagArray, o)) {
					$D.addClass(o, config.selectedClass);
				}
				$E.on(o, 'click', clickHandler);
			});
			
			/* 监测每次的键盘动作，如果发现匹配或者不匹配的tag文字，增加或取消着重效果 */
			$E.on(textField, 'keyup', function(ev){
				var tagArray = value2TagArray(textField, config.separator);
				updateClass(tagArray);				
			});
		}
		handle.init();
	}
}
