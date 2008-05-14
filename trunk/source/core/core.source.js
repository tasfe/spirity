// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript Framework
 *
 *
 *
 *
 *
 *
 *
 * @author feeinglucky<i.feelinglucky@gmail.com>
 * @link   http://www.gracecode.com/
 * @link   http://code.google.com/p/spirity/
 */

if (typeof Spirity == "undefined" || !Spirity) {
    var Spirity = {};
}


/**
 * 命名空间
 *
 * 开辟命名空间，以便扩展
 *
 * @param {string} 命名空间的名称
 * @return {object}
 */
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


/**
 * 模块信息
 *
 */
Spirity.register = {
    /**
     * 注册模块信息
     *
     * 注册模块信息，在本文件的最下方有调用示例
     *
     * @param  {object} 模块信息
     * @return {boolean}
     */
    add: function (mods) {
        if (typeof this.modules[mods.module] == 'object') {
            return false;
        } else {
            this.modules[mods.module] = mods;
        }
    },

    /**
     * 查询模块信息
     *
     * @param {string} 模块名称
     * @return {object} 模块信息
     */
    query: function (mods) {
        if (this.modules[mods]) {
            return this.modules[mods];
        }

        return false;
    },

    modules: []
};

Spirity.register.add({
     module: 'Spirity.core', 
    version: '$Id: core.js 12 2008-05-14 06:33:39Z i.feelinglucky $'
});
