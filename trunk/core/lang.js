// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript Framework
 *
 * @author feeinglucky<i.feelinglucky@gmail.com>
 * @link   http://www.gracecode.com/
 */

Spirity.register.add({
     module: 'Spirity.lang', 
    version: ''
});

Spirity.lang = Spirity.lang || {
    isArray: function(o) {
        if (o) {
           var l = Spirity.lang;
           return l.isNumber(o.length) && l.isFunction(o.splice);
        }
        return false;
    },

    isBoolean: function(o) {
        return typeof o === 'boolean';
    },

    isFunction: function(o) {
        return typeof o === 'function';
    },

    isNull: function(o) {
        return o === null;
    },

    isNumber: function(o) {
        return typeof o === 'number' && isFinite(o);
    },

    isObject: function(o) {
        return (o && (typeof o === 'object' || Spirity.lang.isFunction(o))) || false;
    },

    isString: function(o) {
        return typeof o === 'string';
    },

    isUndefined: function(o) {
        return typeof o === 'undefined';
    }
};
