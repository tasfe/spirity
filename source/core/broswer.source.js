// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript Framework - Broswer
 * 
 * 浏览器扩展，这个包主要包括 Spirity 的 BOM （浏览器对象模型）的扩展
 *
 * @author feeinglucky<i.feelinglucky@gmail.com>
 * @link   http://code.google.com/p/spirity/
 * @link   http://www.gracecode.com/
 */

Spirity.register.add({
     module: 'Spirity.broswer', 
    version: '$Id: broswer.js 17 2008-05-14 12:49:26Z i.feelinglucky $'
});

Spirity.broswer = Spirity.broswer || {
	// 获取浏览器类型，取自 Prototype
    ua: {
        explorer: !!(window.attachEvent && !window.opera),
        opera: !!window.opera,
        webkit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
        gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1
    },

    get: (function () {
		var lang = Spirity.lang;
		var dom  = Spirity.dom;	

        return {
			/**
			 * 动态载入 CSS 样式
			 */
            css: function () {
            
            },

			/**
			 * 动态执行 Javascript 脚本
			 */
            script: function () {
            
            }
        }
    })() // get
};
