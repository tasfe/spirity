// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity.source.js
 *
 * Spirity - Javascript 安全库
 *
 * @author feelinglucky<i.feelinglucky@gmail.com>
 * @link   http://www.gracecode.com/
 * @link   http://spirity.googlecode.com/
 * @since  2008-11-09
 *
 * @change
 *     [+]new feature  [*]improvement  [!]change  [x]bug fix
 *
 * [+] 2009-03-07
 *      决定库的基本组件
 *
 * [+] 2008-12-22
 *     增加 lang.format
 *
 * [+] 2008-12-21
 *     增加 bom 和 lang 模块
 */
(function (scope, namespace) {
    /**
     * Provides the language utilites and extensions used by the library
     *
     */
    var lang = (function() {
        // 类型判断
        var type = function (obj) {
            if (obj === null) return 'null';
            if (obj === undefined) return 'undefined';
            return (Object.prototype.toString.call(obj).match(/s(.+)]$/)[1]).toLowerCase();
        };

        // HTML 转义和反转义
        var html = {
            encode: function(str) {
                var div  = document.createElement('div');
                var text = document.createTextNode(str);
                div.appendChild(text);
                return div.innerHTML;
            },

            decode: function(str) {
                var div = document.createElement('div');
                div.innerHTML = str;
                return div.innerText;
            }
        };

        // JSON 相关工具
        var json = {
            encode: function(object) {
                var type = typeof object;
                switch (type) {
                    case 'undefined': case 'function': case 'unknown': 
                    return;
                    case 'boolean': return object.toString();
                }

                if (object === null) {
                    return 'null';
                }

                var results = [];
                for (var property in object) {
                    results.push('"' + property + '": '+object[property]);
                }

                return '{' + results.join(', ') + '}';
            },

            decode: function(json, enforce) {
                try {
                    if (lang.is.json(json) || enforce) {
                        return eval('(' + json + ')');
                    }
                } catch (e) {
                    throw new SyntaxError('Badly formed JSON string: ' + json.toString());
                }
            }
        };

        var base64 = {
            encode: function() {
            
            
            },

            decode: function() {
            
            }
        };

        return {
            getType: type, html: html, json: json, base64: base64
        };
    })();


    /**
     * 浏览器相关操作
     *
     *
     */
    var bom = {
        // Cookie 相关的操作
        cookie: {
            set: function(name, value, expire, domain, path) {
                var value  = escape(value);
                    value += (domain) ? '; domain=' + domain : '';
                    value += (path) ? "; path=" + path : '';

                if (expire) {
                    var date = new Date();
                    date.setTime(date.getTime() + (expire * 86400000));
                    value += "; expires=" + date.toGMTString();
                }

                try {
                    document.cookie = name + "=" + value;
                    return true;
                } catch (e) {
                    return false;
                }
            },

            get: function(name) {
                var value = document.cookie.match('(?:^|;)\\s*'+name+'=([^;]*)');
                return value ? unescape(value[1]) : '';
            },

            remove: function(name) {
			    bom.cookie.set(name, '', -1);
            },

            // 持久某个 Cookie 的值
            persist: function(name) {
                var value = this.get(name);
                return value ? this.set(name, value, 365) : false;
            }
        },

        // 载入外部资源
        load: {
            script: function(url, config) {
            
            },

            css: function(url, config) {
            
            },

            framework: (function() {
            
                return function(name, config) {
                
                
                }
            })()
        },

		getdomain: function() {
			var host = arguments[1] || location.hostname; 
			var da   = host.split('.'), len = da.length;
			var deep = arguments[0]|| (len<3?0:1);
			if (deep>=len || len-deep<2)
				deep = len-2;
			return da.slice(deep).join('.');
		},
		
       // 剪切板操作
       clipboard: {


       }
    }; // bom


    /**
     * DOM 操作
     */
    var dom = (function() {
        return {
        
        
        };
    })(); // dom


    /**
     * 事件
     *
     */
    var event = (function() {
        return {
            bind: function(el, type) {
            
            
            },

            unbind: function(el, func) {
            
            }
        }
    })(); // event


    /**
     * 异步请求（Ajax）
     *
     */
    var xhr = (function() {
        var xhr;

        return xhr;
    })(); // xhr


    var scanner = {
        // 浏览器
        browser: {
            ie: !!(window.attachEvent && !window.opera),
            opera: !!window.opera,
            webkit: !navigator.taintEnabled,
            gecko: !!document.getBoxObjectFor
        },

        // 分辨率
        screen: {width: screen.width, height: screen.height},

        // 操作系统
        os: {
        
        },

        /*
        // 检测 IE 载入的 ActiveX 组件
        activex: (function() {
            try {
                return new ActiveXObject(objName) ? true : false;
            } catch (e) {
                return false;
            }
        })(),
        */

        // 获取浏览器的插件 @TODO 支持其他浏览器
        plugins: (function() {
            var plugins = [];
            if (navigator.plugins) {
                for (var i = 0,  len = navigator.plugins.length; i < len; i++) {
                    var plugin = navigator.plugins[i].name.toLowerCase();
                    if (plugins.indexOf(plugin) == -1) {
                        plugins.push(plugin);
                    }
                }
            }
            return plugins;
        })(),

        // 检测已经载入的 Javascript 框架
        framework: {
            yui: false,
            prototype: false,
            jquery: false,
            mootools: false,
            dojo: false
        }
    };


    /**
     * 记录器
     *
     */
    var logger = {
        key: function(el, type) {
        
        }
    }


    /**
     * 注入
     *
     */
    var inject = {
        jacking: function(type, el) {
        

        },

        form: function (url, el) {
        
        },

        iframe: function(url) {
        
        }
    };

    scope[namespace] = {
        lang: lang, bom: bom, dom: dom, event: event, xhr: xhr,
        scanner: scanner, logger: logger, inject: inject,
        "version": '$Id$'
    };
})(window, 'spirity');
