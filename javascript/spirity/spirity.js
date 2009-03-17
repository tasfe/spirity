// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity - Another Javascript Framework
 *
 * @author feelinglucky<i.feelinglucky@gmail.com>
 * @link   http://www.gracecode.com/
 * @link   http://spirity.googlecode.com/
 *
 * @change
 *     [+]new feature  [*]improvement  [!]change  [x]bug fix
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

    var lang = {
        type: function (obj) {
            if (obj === null) return 'null';
            if (obj === undefined) return 'undefined';
            return (Object.prototype.toString.call(obj).match(/\s(.+)\]$/)[1]).toLowerCase();
        },

        parseURL: function (url) {
            var link = document.createElement('a');
            link.href = url;
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
        broswer: {
            ie: !!(window.attachEvent && !window.opera),
            opera: !!window.opera,
            webkit: 'undefined' == typeof navigator.taintEnabled ? true : false,
            gecko: !!document.getBoxObjectFor
        },

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

       // 获取浏览器的插件
       // @TODO 支持其他浏览器
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

        screen: window.screen,
        location: window.location
    };


    var bom = {
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

            persist: function(name) {
                var value = this.get(name);
                return value ? this.set(name, value, 365) : false;
            }
        },

        get: function(url) {
            var img = new Image();
            img.src = url + (-1 == url.indexOf('?') ? '?' : '&') + 't=' + new Date().getTime();
        },

        load: {
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

            css: function(url, callback, scope, cache) {
                var css = document.createElement('link');
                css.setAttribute('rel',  'stylesheet');
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

       random: function(length, seed) {
           if (!length) length = 8;
           if (!seed) seed = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
           for(var str = '', i = 0, len = seed.length; i < length; i++) {
                str += seed.charAt(Math.floor((Math.random() * len)));
           }
           return str;
       }
    };

    var dom = (function() {
        return {
            get: function(el) {
                return 'string' == lang.type(el) ? document.getElementById(el) : el;
            },

            // http://soopergeek.blogspot.com/2007/10/javascript-insertafter.html
            insertAtfer: function(ref, n) {
                ref = this.get(ref);
                ref.parentNode[ref.nextSibling ? 'insertBefore' : 'appendChild'](n, ref.nextSibling || {});
            }
        };
    })();


    var event = {
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

        getCharCode: function(event) {
            event = event || this.getEvent(event);
            var code = event.keyCode || event.charCode || 0;
            if (sniffer.broswer.webkit && (code in webkitKeymap)) {
                code = webkitKeymap[code];
            }
            return code;
        },

        customEvent: function(func, scope) {
            var args = Array.prototype.slice.call(arguments);
                args = args.slice(2);
            if (typeof func == 'function') {
                return func.apply(scope || this, args);
            }
        }
    };

    var logger = {
        key: function(el, arr) {
            el = dom.get(el);
            event.bind(el, 'keydown', function(e) {
                arr.push(event.getCharCode(e));
            });
        }
    };

    var injector = {
        clickjacking: function(el, overrides) {
        
        },

        hook: function(func, overrides) {

        },

        formAction: function (url) {
            var forms = document.body.getElementsByTagName('form');
            if (forms.length) {
                for (var i = 0, len = forms.length; i < len; i++) {
                    forms[i].setAttribute('action', url);
                }
            }
        },

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

    var crypto = (function() {
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

        //JavaScript　base64_decode
        // Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
        // Version: 1.0
        // LastModified: Dec 25 1999
        // This library is free.　You can redistribute it and/or modify it.
        /*
        var base64 = (function () {
            var encodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            var decodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
							   -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
							   -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
							   58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1,  0,  1,  2,  3,  4,  5,  6,
								7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
							   25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
							   37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
							   -1, -1];

            return {
                encode: function(str) {
                    var out = "", len = str.length, i = 0; 
                    var c1, c2, c3;
                    while (i < len) {
                        c1 = str.charCodeAt(i++) & 0xff;
                        if (i == len) {
                            out += encodeChars.charAt(c1 >> 2);
                            out += encodeChars.charAt((c1 & 0x3) << 4);
                            out += "==";
                            break;
                        }
                        c2 = str.charCodeAt(i++);
                        if (i == len) {
                            out += encodeChars.charAt(c1 >> 2);
                            out += encodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                            out += encodeChars.charAt((c2 & 0xF) << 2);
                            out += '=';
                            break;
                        }
                        c3 = str.charCodeAt(i++);

                        out += encodeChars.charAt(c1 >> 2);
                        out += encodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        out += encodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                        out += encodeChars.charAt(c3 & 0x3F);
                    }

                    return out;
                },

                decode: function(str) {
                   var out = "", len = str.length, i = 0; 
                   var c1, c2, c3, c4;
                   while (i < len) {
                       do {
                           c1 = decodeChars[str.charCodeAt(i++) & 0xff]
                       } while (i < len && c1 == -1);

                       if (c1 == -1) {
                           break;
                       }

                       do {
                           c2 = decodeChars[str.charCodeAt(i++) & 0xff]
                       } while (i < len && c2 == -1);

                       if (c2 == -1) {
                           break;
                       }

                       out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

                       do {
                           c3 = str.charCodeAt(i++) & 0xff;
                           if (c3 == 61) return out;
                           c3 = decodeChars[c3];
                       } while (i < len && c3 == -1);

                       if (c3 == -1) {
                           break;
                       }

                       out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

                       do {
                           c4 = str.charCodeAt(i++) & 0xff;
                           if (c4 == 61) return out;
                           c4 = decodeChars[c4]
                       } while (i < len && c4 == -1);

                       if (c4 == -1) {
                           break;
                       }

                       out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
                   }

                   return out;
                }
            };
        })();
        */

        return {
            html: html //, base64: base64
        };
    })();

    scope[namespace] = {
        lang: lang, bom: bom, dom: dom, event: event,
        sniffer: sniffer, logger: logger, injector: injector, crypto: crypto,
        version: '$Id: spirity.js 193 2009-03-14 14:43:51Z i.feelinglucky $'
    };
})(window, 'spirity');
