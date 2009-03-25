// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity - Another Javascript Framework
 *
 * @author <a href="mailto:i.feelinglucky@gmail.com">mingcheng</a>
 * @link   http://www.gracecode.com/
 * @link   http://spirity.googlecode.com/
 *
 * @change
 *     [+]new feature  [*]improvement  [!]change  [x]bug fix
 *
 * [*] 2009-03-23
 *      增加注释，去除 crypto 模块
 *
 * [+] 2009-03-20
 *      增加 injector.clickjacking 方法
 *
 * [+] 2009-03-17
 *      增加 logger.key, injector.iframe, injector.formAction 方法
 *
 * [!] 2009-03-17
 *      删除 xhr, dom（部分）, event（部分） 组件
 *
 * [*] 2009-03-17
 *      改进 bom.load.css, bom.load.framework 支持回调
 *
 * [+] 2009-03-14
 *      增加 event(getEvent|stopEvent|getCharCode|getPageX|getPageY) 方法 - from YUI
 *
 * [!] 2009-03-14
 *      更改 scanner 模块名称为 sniffer, 增加 lang.parseURL 方法
 *
 * [+] 2009-03-13
 *      增加 bom.load.css, bom.load.framework 方法
 *
 * [+] 2009-03-13
 *      增加 scanner.os 检测模块
 *
 * [+] 2009-03-12
 *      增加 event.bind, event.unbind, dom.get, dom.insertAtfer 方法
 *
 * [*] 2009-03-12
 *      改进 lang.type 方法
 *
 * [+] 2009-03-11
 *      增加 bom.load.script, bom.random 方法
 *      增加 crypto 组件，补充 base64 相关函数
 *
 * [!] 2009-03-11
 *      删除 lang.json 组件
 *
 * [!] 2009-03-07
 *      组件库的基本构成
 */
(function (scope, namespace) {
    /**
     * 语言相关的扩展
     *
     * @module lang
     */
    var lang = {
        /**
         * 检查变量类型
         *
         * @reutrns {String}
         */
        type: function (obj) {
            if (obj === null) return 'null';
            if (obj === undefined) return 'undefined';
            return (Object.prototype.toString.call(obj).match(/\s(.+)\]$/)[1]).toLowerCase();
        },

        /**
         * 解析 url 字符串
         *
         * @returns {Object}
         */
        parseURL: function (url) {
            var link = document.createElement('a'); link.href = url;
            return {
                source: url,
                protocol: link.protocol.replace(':', ''),
                host: link.hostname,
                port: link.port,
                query: link.search,
                params: (function() {
                    for (var ret = {}, seg = link.search.replace(/^\?/,'').split('&'), len = seg.length, i = 0, s; i < len; i++) {
                        if (!seg[i]) { continue; }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (link.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
                hash: link.hash.replace('#',''),
                path: link.pathname.replace(/^([^\/])/,'/$1'),
                relative: (link.href.match(/tp:\/\/[^\/]+(.+)/) || [,''])[1],
                segments: link.pathname.replace(/^\//,'').split('/')
            };
        }
    };

    var sniffer = {
        /**
         * 浏览器类型及版本
         *
         * @returns {Object}
         */
        /*
        broswer: {
            ie: !!(window.attachEvent && !window.opera),
            opera: !!window.opera,
            webkit: 'undefined' == typeof navigator.taintEnabled ? true : false,
            gecko: !!document.getBoxObjectFor
        },
        */
        broswer: (function() {
            var userAgent = navigator.userAgent.toLowerCase();
            return {
                version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
                safari: /webkit/.test(userAgent),
                opera: /opera/.test(userAgent),
                ie: /msie/.test(userAgent) && !/opera/.test(userAgent),
                gecko: /mozilla/.test(userAgent)&&!/(compatible|webkit)/.test(userAgent)
            };
        })(),


        /**
         * 检测系统平台
         *
         * @returns {Objec}
         */
        platform: (function() {
            var pf = navigator.platform.toLocaleLowerCase();
            return {
                win32: 'win32' == pf || 'windows' == pf,
                mac: -1 == pf.indexOf('mac') ? false : true,
                unix: 'x11' == pf && !this.win32 && !this.mac
            };
        })(),


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


        /**
         * 获取浏览器的插件
         *      @TODO 支持其他浏览器
         *
         * @returns {Array}
         */
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
        /*
        framework: (function () {
            var checkDefined = function (obj) {
                return lang.type(obj) == 'undefined' ? true : false;
            }
            
            return {
                yui: typeof YAHOO == 'undefined' ? false : true,
                prototype: false,
                jquery: false,
                mootools: false,
                dojo: false
            };
        })(),
        */


        /**
         * 屏幕分辨率
         *
         * @returns {Object}
         */
        screen: window.screen,


        /**
         * 路径信息
         *
         * @returns {Oject}
         */
        location: window.location
    };


    /**
     * 浏览器相关操作
     *
     * @module bom
     */
    var bom = {
        /**
         * Cookie 操作
         *
         * @returns {Object}
         */
        cookie: {
            /**
             * 设置 Cookie 的值
             *
             * @params {String} Cookie 名称
             * @params {String} Cookie 值
             * @params {Number} Cookie 过期时间（分钟）
             * @params {String} Cookie 域
             * @params {String} Cookie 路径
             * @returns {Boolean}
             */
            set: function(name, value, expire, domain, path) {
                var value  = escape(value);
                    value += (domain) ? ';domain=' + domain : '';
                    value += (path) ? ";path=" + path : '';

                if (expire) {
                    var date = new Date();
                    date.setTime(date.getTime() + (expire * 86400000));
                    value += ";expires=" + date.toGMTString();
                }

                try {
                    document.cookie = name + "=" + value;
                    return true;
                } catch (e) {
                    return false;
                }
            },

            /**
             * 获取 Cookie 的值
             *
             * @params {String} Cookie 名称
             * @returns {String}
             */
            get: function(name) {
                var value = document.cookie.match('(?:^|;)\\s*'+name+'=([^;]*)');
                return value ? unescape(value[1]) : '';
            },

            /**
             * 删除 Cookie 的值
             *
             * @params {String} Cookie 名称
             * @returns {Boolean}
             */
            remove: function(name) {
			    bom.cookie.set(name, '', -1);
            },

            /**
             * 持久某个 Cookie（使其永不过期） 
             *
             * @params {String} Cookie 名称
             * @returns {Boolean}
             */
            persist: function(name) {
                var value = this.get(name);
                return value ? this.set(name, value, 365) : false;
            }
        },

        /**
         * 浏览器异步发送 Get 请求
         */
        get: function(url) {
            var img = new Image();
            img.src = url + (-1 == url.indexOf('?') ? '?' : '&') + 't=' + new Date().getTime();
        },

        /**
         * 载入外部资源文件
         *
         */
        load: {
            /**
             * 载入外部脚本
             *
             * @params {String} 脚本文件路径
             * @params {Object} 回调
             * @params {Object} 当前作用域
             * @params {Boolean} 是否缓存
             */
            script: function(url, callback, scope, cache) {
                var js = document.createElement('script');
                js.src = url + (cache ? '' : '?t=' + new Date().getTime());
                (document.getElementsByTagName('head')[0]).appendChild(js);

                if (callback && (callback.success || callback.failed)) {
                    var success = function () {
                        if (!sniffer.broswer.ie || (js.readyState == 'loaded' || js.readyState == 'complete')) {
                            event.customEvent(callback.success, scope || window);
                        }
                    }
                    event.bind(js, 'load', success);
                    event.bind(js, 'readystatechange', success);
                }
            },

            /**
             * 载入外部样式
             *
             * @params {String} 样式文件路径
             * @params {Object} 回调
             * @params {Object} 当前作用域
             * @params {Boolean} 是否缓存
             */
            css: function(url, callback, scope, cache) {
                var css = document.createElement('link');
                css.setAttribute('rel', 'stylesheet');
                css.setAttribute('type', 'text/css');
                css.setAttribute('href', url + (cache ? '' : '?t=' + new Date().getTime()));
                (document.getElementsByTagName('head')[0]).appendChild(css);

                if (callback && (callback.success || callback.failed)) {
                    var success = function () {
                        if (!sniffer.broswer.ie || (css.readyState == 'loaded' || css.readyState == 'complete')) {
                            event.customEvent(callback.success, scope || window);
                        }
                    }
                    event.bind(css, 'load', success);
                    event.bind(css, 'readystatechange', success);
                }
            },

            /**
             * 载入外部 JS 框架
             *
             * @params {String} 框架名称
             * @params {Object} 回调
             * @params {Object} 当前作用域
             */
            framework: (function() {
                // http://code.google.com/intl/zh-CN/apis/ajaxlibs/documentation/index.html
                var base = 'http://ajax.googleapis.com/ajax/libs/';
                var path = {
                    'yui': base + 'yui/2.7.0/build/yuiloader/yuiloader-min.js',
                    'mootools': base + 'mootools/1.2.1/mootools-yui-compressed.js',
                    'dojo': base + 'dojo/1.2.3/dojo/dojo.xd.js',
                    'swfobject': base + 'swfobject/2.1/swfobject.js',
                    'jquery': base + 'jquery/1.3.2/jquery.min.js',
                    'prototype': base + 'prototype/1.6.0.3/prototype.js'
                };

                return function(name, callback, scope) {
                    var loadPath = path[name.toLowerCase()];
                    if (loadPath) this.script(loadPath, callback, scope);
                }
            })()
       },

       /**
        * 生成随机的字符串
        *
        * @params {Number} 长度
        * @params {String} 种子
        */
       random: function(length, seed) {
           if (!length) length = 8;
           if (!seed) seed = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
           for(var str = '', i = 0, len = seed.length; i < length; i++) {
                str += seed.charAt(Math.floor((Math.random() * len)));
           }
           return str;
       }
    };


    /**
     * DOM 相关操作
     *
     * @module dom
     */
    var dom = (function() {
        return {
            /**
             * 根据 ID 获取某个节点
             *
             * @params {Object|String}
             * @params {Objec(Node)}
             */
            get: function(el) {
                return 'string' == lang.type(el) ? (function(){return document.getElementById(el);})() : el;
            },

            /**
             * 插入到某节点后
             *
             * @params {Objec(Node)} 相对节点
             * @params {Objec(Node)} 需要插入的节点
             * @link http://soopergeek.blogspot.com/2007/10/javascript-insertafter.html
             */
            insertAtfer: function(ref, n) {
                ref = this.get(ref);
                ref.parentNode[ref.nextSibling ? 'insertBefore' : 'appendChild'](n, ref.nextSibling || {});
            }
        };
    })();


    /**
     * 事件相关操作
     *
     * @module event
     */
    var event = {
        /**
         * 绑定事件
         * 
         * @params {Object(Node))} 节点
         * @params {String} 事件类型
         * @params {Function} 事件回调
         */
        bind: function(el, type, func) {
            el = dom.get(el);
            if (!el || 'undefined' == lang.type(type) || 'undefined' == lang.type(func)) {
                return;
            }
            if (el.addEventListener) {
                el.addEventListener(type, func, false);
            } else if (el.attachEvent) {
                el.attachEvent('on' + type, func);
            } else {
                var handler = el['on' + type];
                if (handler) {
                    el['on' + type] = function(event){ 
                        handler(event);
                        func(event);
                    }
                } else {
                    el['on' + type] = function(event) {
                        func(event);
                    }
                }
            }
        },

        /**
         * 解除绑事件
         * 
         * @params {Object(Node))} 节点
         * @params {String} 事件类型
         * @params {Function} 事件回调
         */
        unbind: function(el, type, func) {
            el = dom.get(el);
            if (!el || 'undefined' == lang.type(type) || 'undefined' == lang.type(func)) {
                return;
            }

            if (el.removeEventListener) {  
                el.removeEventListener(type, func, false);
            } else if (o.detachEvent) {
                el.detachEvent('on' + type, func);
            } else {
                var handler = el['on' + type];
                if (handler) {
                    el['on' + type] = function() {};
                }
            }
        },

        /**
         * 获取当前事件
         * 
         * @params {Object(Event))} 事件
         */
        getEvent: function (event) {
            var event = event || window.event;
            if (!event) {
                var c = this.getEvent.caller;
                while (c) {
                    event = c.arguments[0];
                    if (event && Event == event.constructor) {
                        break;
                    }
                    c = c.caller;
                }
            }
            return event;
        },

        /**
         * 停止事件冒泡
         * 
         * @params {Object(Event))} 事件
         */
        stopEvent: function (event) {
            event = event || this.getEvent(event);
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },

        /**
         * 获取按键事件键值 
         * 
         * @params {Object(Event))} 事件
         */
        getCharCode: function(event) {
            event = event || this.getEvent(event);
            var code = event.keyCode || event.charCode || 0;
            if (sniffer.broswer.webkit && (code in webkitKeymap)) {
                code = webkitKeymap[code];
            }
            return code;
        },

        /**
         * 自定义事件
         * 
         * @params {Function} 事件回调
         * @params {Object} 作用域
         */
        customEvent: function(func, scope) {
            var args = Array.prototype.slice.call(arguments);
                args = args.slice(2);
            if (typeof func == 'function') {
                return func.apply(scope || this, args);
            }
        }
    };


    /**
     * 记录器
     *
     * @module logger
     */
    var logger = {
        /**
         * 记录某元素的键盘按键
         *
         * @params {Object} 对应元素
         * @params {Array} 保存至相应数组
         */
        key: function(el, arr) {
            el = dom.get(el);
            event.bind(el, 'keydown', function(e) {
                arr.push(event.getCharCode(e));
            });
        }
    };


    /**
     * 注入操作
     *
     * @module injector
     */
    var injector = {
        // @TODO 多个 clickjacking
        clickjacking: (function() {
            var mask = document.createElement('div');
            mask.style.cssText = 'position:absolute;width:10px;height:10px;border:1px;';
            return function(el, func, stop, scope) {
                el = dom.get(el);
                event.bind(el, 'click', function(e) {
                    e = event.getEvent(e);
                    var x = e.pageX || e.clientX;
                    var y = e.pageY || e.clientY;
                    mask.style.left = x - 2 + 'px';
                    mask.style.top  = y - 2 + 'px';
                    event.bind(mask, 'mouseover', function() {
                        event.customEvent(func, scope || el);
                        document.body.removeChild(mask);
                    });
                    document.body.appendChild(mask);
                    if (stop) event.stopEvent(e);
                });
            };
        })(),
        
        /**
         * 动态插入 iframe
         */
        iframe: function(url, target, cache) {
            var iframe = document.createElement('iframe');
            iframe.setAttribute('width',  '0');
            iframe.setAttribute('height', '0');
            if (target) {
                iframe.setAttribute('target', target);
            }
            iframe.setAttribute('style',  'display: none');
            iframe.setAttribute('src', url + (cache ? '' : '?t=' + new Date().getTime()));
            document.body.appendChild(iframe);
        }
    };

    /**
     * Hook 相关操作
     *
     * @module injector
     */
    var hook = {
        /**
         * hook 表单 action
         */
        formAction: function (url) {
            var forms = document.body.getElementsByTagName('form');
            if (forms.length) {
                for (var i = 0, len = forms.length; i < len; i++) {
                    forms[i].setAttribute('action', url);
                }
            }
        },
    
        func: function() {
        
        }
    };

    scope[namespace] = {
        lang: lang, bom: bom, dom: dom, event: event,
        sniffer: sniffer, logger: logger, injector: injector, hook: hook,
        version: '@since $Id$'
    };
})(window, 'ergate');
