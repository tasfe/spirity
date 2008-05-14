// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript Framework
 *
 * @author feeinglucky<i.feelinglucky@gmail.com>
 * @link   http://www.gracecode.com/
 */

Spirity.register.add({
     module: 'Spirity.lang', 
    version: '$Id$'
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
        return (object && (typeof object === 'object' || Spirity.lang.isFunction(object))) || false;
    },

    isString: function(object) {
        return typeof object=== 'string';
    },

    isUndefined: function(object) {
        return typeof object === 'undefined';
    },

    isElement: function(object) {
        return object && object.nodeType == 1;
    },

    /**
     * 返回类的 JSON 格式
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
    } // toCamel
};
