// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript / Bom / Broswer
 * 
 * @author feeinglucky<i.feelinglucky@gmail.com>
 * @link   http://code.google.com/p/spirity/
 * @link   http://www.gracecode.com/
 */

Spirity.register.add({
     module: 'Spirity.broswer', 
    version: '$Id$'
});

Spirity.broswer = Spirity.broswer || {
	/**
     * 获取浏览器类型
     */
    ua: {
        explorer: !!(window.attachEvent && !window.opera),
           opera: !!window.opera,
          webkit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
           gecko: navigator.userAgent.indexOf('Gecko') > -1 && 
                  navigator.userAgent.indexOf('KHTML') == -1
    },

    /**
     * 动态载入 Javascript 和 CSS ，类似 YUI.util.Get 
     *
     * @todo 完善代码 - 2008年 5月25日
     */
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
