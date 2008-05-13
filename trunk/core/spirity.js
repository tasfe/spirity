// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript Framework
 *
 * @author feeinglucky<i.feelinglucky@gmail.com>
 * @link   http://www.gracecode.com/
 */

if (typeof Spirity == "undefined" || !Spirity) {
    var Spirity = {};
}

Spirity.extend = function() {
    var a = arguments, o = Spirity;
    for (var i = 0; i < a.length; i++) {
        var tmp = a[i].split(".");
        for (var j = (tmp[0] == "Spirity" ? 1 : 0); j < tmp.length; j++) {
            o[tmp[j]] = o[tmp[j]] || {};
            o = o[tmp[j]];
        }
    }

    return o;
};


Spirity.register = {
    add: function (mods) {
        if (typeof this.modules[mods.module] == 'object') {
            return false;
        } else {
            this.modules[mods.module] = mods;
        }
    },

    query: function (mods) {
        if (this.modules[mods]) {
            return this.modules[mods];
        }

        return false;
    },

    modules: []
};
