// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript Framework
 *
 * @author feeinglucky<i.feelinglucky@gmail.com>
 * @link   http://www.gracecode.com/
 */

(function () {
    if (typeof Spirity == "undefined" || !Spirity) {
        return;
    }

    Spirity.register.add({
         module: 'Spirity.broswer', 
        version: ''
    });

    var broswer = Spirity.extend('Spirity.broswer');

    /**
     * 检测浏览器 - 参考 jQuery
     */
    broswer.ua = (function() {
        var ua = navigator.userAgent.toLowerCase();
        var version = (ua.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1];
        return {
            webkit: /webkit/.test(ua) ? version : 0,
            opera: /opera/.test(ua) ? version : 0,
            ie: /msie/.test(ua) && !/opera/.test(ua) ? version : 0,
            gecko: /mozilla/.test(ua)&&!/(compatible|webkit)/.test(ua) ? version : 0
        };
    })(); // broswer.ua

})();
