// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript Framework
 *
 * @author feeinglucky<i.feelinglucky@gmail.com>
 * @link   http://www.gracecode.com/
 */

Spirity.register.add({
     module: 'Spirity.lang', 
    version: '$Id: lang.js 17 2008-05-14 12:49:26Z i.feelinglucky $'
});

Spirity.lang = Spirity.lang || {
    isArray: function(object) {
        if (object) {
           var lang = Spirity.lang;
           return lang.isNumber(object.length) && lang.isFunction(object.splice);
        }
        return false;
    },

    isBoolean: function(object) {
        return typeof object === 'boolean';
    },

    isFunction: function(object) {
        return typeof object === 'function';
    },

    isNull: function(object) {
        return object === null;
    },

    isNumber: function(object) {
        return typeof object === 'number' && isFinite(object);
    },

    isObject: function(object) {
        return (object && (typeof object === 'object' || 
                        Spirity.lang.isFunction(object))) || false;
    },

    isString: function(object) {
        return typeof object === 'string';
    },

    isUndefined: function(object) {
        return typeof object === 'undefined';
    },

    isElement: function(object) {
        return object && object.nodeType == 1;
    },

    isJSON: function(object) {
        if (!Spirity.lang.isString(object)) {
            return false;
        }

        /* // prototype
        str = object.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
        return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
        */

        // YUI
        return /^[\],:{}\s]*$/.test(object.
                replace(/\\./g,'@').
                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').
                replace(/(?:^|:|,)(?:\s*\[)+/g,''));
    },

    /**
     * 返回 JSON 序列化格式
     *
     * @TODO 改进递归
     */
    toJSON: function(object) {
        var type = typeof object;
        switch (type){
          case 'undefined':
          case 'function':
          case 'unknown': return;
          case 'boolean': return object.toString();
        }

        if (object === null) {
            return 'null';
        }

        var results = [];
        for (var property in object) {
            results.push(property + ': ' + object[property]);
        }

        return '{' + results.join(', ') + '}';
    }, // toJSON

    /**
     * 执行 JSON 字符串
     */
    evalJSON: function(json, enforce) {
        try {
          if (Spirity.lang.isJSON(json) || enforce) {
            return eval('(' + json + ')');
          }
        } catch (e) {
            throw new SyntaxError('Badly formed JSON string: ' + json.toString());
        }
    }, // evalJSON

    toCamel: function(property) {
        var parts = property.split('-'), len = parts.length;
        if (len == 1) {
            return parts[0];
        }

        var camelized = property.charAt(0) == '-'
          ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1)
          : parts[0];

        for (var i = 1; i < len; i++) {
          camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
        }

        return camelized;
    }, // toCamel

    later: function(func, when, periodic, object, data) {
        when   = when || 0;
        object = object || {}

        var lang = Spirity.lang;
        if (lang.isString(func)) {
            func = object[func];
        }

        if (!lang.isFunction(func)) {
            throw new TypeError("method undefined");
        }

        if (!Spirity.lang.isArray(data)) {
            data = [data];
        }

        f = function() {
            func.apply(object, data);
        };

        var r = (periodic) ? setInterval(f, when) : setTimeout(f, when);
        return {
            interval: periodic,
            cancel: function() {
                if (this.interval) {
                    clearInterval(r);
                } else {
                    clearTimeout(r);
                }
            }
        }
    } // later
};
