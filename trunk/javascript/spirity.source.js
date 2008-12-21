// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity.source.js 
 *
 * 名叫 Spirity 的小型 Javascript 库
 *
 * @author feelinglucky<i.feelinglucky@gmail.com>
 * @link   http://www.gracecode.com/
 * @link   http://spirity.googlecode.com/
 * @since  2008-11-09
 *
 * @change
 *     [+]new feature  [*]improvement  [!]change  [x]bug fix
 *
 * [+] 2008-12-21
 *     增加 bom 和 lang 模块
 */
(function (scope, namespace) {
    /**
     * BOM
     */
    var bom = {
        agent: {
            ie: !!(window.attachEvent && !window.opera),
            opera: !!window.opera,
            webkit: !navigator.taintEnabled,
            gecko: !!document.getBoxObjectFor
        },

        cookie: {
            set: function(name, value, expire, domain, path) {
                var value  = escape(value);
                    value += (domain) ? '; domain=' + domain : '';
                    value += (path) ? "; path=" + path : '';

                if (expire){
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
            }
        },

        load: {
            script: function() {
            
            
            },

            css: function() {
            
            
            }
        }

        /*
		getdomain: function() {
			var host = arguments[1] || location.hostname; 
			var da = host.split('.'), len = da.length;
			var deep = arguments[0]|| (len<3?0:1);
			if (deep>=len || len-deep<2)
				deep = len-2;
			return da.slice(deep).join('.');
		},
		
		addBookmark: function(title, url) {
		    if (window.sidebar) {
		        window.sidebar.addPanel(title, url, "");
		    } else if(document.external) {
		        window.external.AddFavorite( url, title);
		    } else {
                // ...
			}
		}
        */
    }; // bom

    /**
     * Lang
     */
    var lang = (function() {
        var lang = {
            is: {
                obj: function(object) {
                    return (object && (typeof object === 'object' || lang.is.func(object))) || false;
                },

                str: function(object) {
                    return typeof object === 'string';
                },

                bool: function(object) {
                    return typeof object === 'boolean';
                },

                element: function(object) {
                    return object && object.nodeType == 1;
                },

                null: function(object) {
                    return object === null;
                },

                undef: function(object) {
                    return typeof object === 'undefined';
                },

                array: function(object){
                    if (object) {
                        return lang.is.num(object.length) && lang.is.func(object.splice);
                    }
                    return false;
                },

                num: function() {
                    return typeof object === 'number' && isFinite(object);
                },

                func: function(object) {
                    return typeof object === 'function';
                },

                json: function(object) {
                    if (!lang.is.str(object)) {
                        return false;
                    }

                    return /^[\],:{}\s]*$/.test(object.replace(/\\./g,'@').
                        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').
                        replace(/(?:^|:|,)(?:\s*\[)+/g,''));
                }
            }
        };

        lang.json = {
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
                    results.push('"'+property+'": '+object[property]);
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

        lang.curry = function(func, scope) {
            var _func = func, _scope = scope || window;
            var _args = Array.prototype.slice.call(arguments, 2);
            return function() {
                return _func.apply(_scope, _args.concat(Array.prototype.slice.call(arguments, 0)));
            }
        };

        lang.genericize = function(object, property, check) {
            if ((!check || !object[property]) && lang.is.func(object.prototype[property])) {
                object[property] = function () {
                    var _args = Array.prototype.slice.call(arguments);
                    return object.prototype[property].apply(_args.shift(), _args);
                };
            };
        };

        return lang;
    })(); // lang

    /**
     * DOM
     */
    var dom = (function(){
        var dom;

        return dom;
    })(); // dom

    /**
     * Event
     */
    var event = (function(){
        var event;

        return event;
    })(); // event

    /**
     * XHR
     */
    var xhr = (function(){
        var xhr;

        return xhr;
    })(); // xhr

    /**
     * Mix
     */
    /*
     ['indexOf', 'lastIndexOf', 'forEach', 'filter', 'map', 'some', 'every', 'copy'].forEach(
         function(c) {
             lang.genericize(Array, c);
         }
     );
     */

    scope[namespace] = {"bom":bom, "lang":lang, "dom":dom, "event":event, "xhr":xhr,
        "version": '$Id$'};
})(window, 'spirity');
