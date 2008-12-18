// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity.source.js
 *
 * @author feelinglucky<i.feelinglucky@gmail.com>
 * @date   2008-11-09
 * @link   http://www.gracecode.com/
 */

(function (_scope) {
    var spirity = _scope.spirity = {};
    spirity.version = '$Id';

    // 检测浏览器类型
    spirity.browser.ua = {
        trident: !!(window.attachEvent && !window.opera),
          opera: !!window.opera,
         webkit: !navigator.taintEnabled,
          gecko: !!document.getBoxObjectFor
    };

    // dom
    spirity.dom = {};

    // event

    // ajax


})(window);
