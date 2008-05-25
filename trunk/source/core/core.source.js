// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript Framework
 * 
 * 这是名为 Spirity 的 Javascript 运行库。
 *
 * @author feeinglucky<i.feelinglucky@gmail.com>
 * @link   http://www.gracecode.com/
 * @link   http://code.google.com/p/spirity/
 */

if (typeof Spirity == "undefined" || !Spirity) {
    var Spirity = {};
}

/**
 * 增加命名空间，参考 YUI 框架
 */
Spirity.namespaces = function() {
    var object = Spirity;
    for (var i = 0, length = arguments.length; i < length; i++) {
        var tmp = arguments[i].split(".");
        for (var j = (tmp[0] == "Spirity" ? 1 : 0), len = tmp.length; j < len; j++) {
            object[tmp[j]] = object[tmp[j]] || {};
            object = object[tmp[j]];
        }
    }

    return object;
};

/**
 * 注册组件
 */
Spirity.register = {
    add: function (mods) {
		// 如果已经存在
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

/**
 * 注册核心组件
 */
Spirity.register.add({
     module: 'Spirity.core', 
    version: '$Id: core.js 12 2008-05-14 06:33:39Z i.feelinglucky $'
});
