// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript Framework
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
    ua: {
        explorer: !!(window.attachEvent && !window.opera),
        opera: !!window.opera,
        webkit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
        gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1
    }

    /**
     * 检测浏览器 - 参考 jQuery
     */
    /*
    ua: (function() {
        var ua = navigator.userAgent.toLowerCase();
        var version = (ua.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1];
        return {
            webkit: /webkit/.test(ua) ? version : 0,
            opera: /opera/.test(ua) ? version : 0,
            explorer: /msie/.test(ua) && !/opera/.test(ua) ? version : 0,
            gecko: /mozilla/.test(ua)&&!/(compatible|webkit)/.test(ua) ? version : 0
        };
    })()
    */
};
