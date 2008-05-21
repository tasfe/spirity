// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript Framework
 *
 * @author feeinglucky<i.feelinglucky@gmail.com>
 * @link   http://code.google.com/p/spirity/
 * @link   http://www.gracecode.com/
 */

if (!Spirity.widget) {
    Spirity.widget = {};
};

Spirity.widget.Effect = Spirity.widget.Effect || (function () {
    var dom    = Spirity.dom;
    var lang   = Spirity.lang;
    var timer  = null;

    return {
        fadeIn: function (element, speed, callback) {
            if (lang.isString(element)) {
                element = dom.get(element);
            }

            if (!lang.isElement(element)) {
                return;
            }
            
            if (timer) {
                timer.cancel();
            }

            timer = lang.later(function () {
                var opacity = dom.getStyle(element, 'opacity');
                if (opacity < 1) {
                    opacity = opacity * 1;
                    dom.setStyle(element, 'opacity', opacity += 0.1);
                } else {
                    timer.cancel();
                }
            }, speed || 100, true);
        },

        fadeOut: function (element, speed, callback) {
            if (lang.isString(element)) {
                element = dom.get(element);
            }

            if (!lang.isElement(element)) {
                return;
            }

            if (timer) {
                timer.cancel();
            }

            timer = lang.later(function () {
                var opacity = dom.getStyle(element, 'opacity');
                if (opacity > 0) {
                    dom.setStyle(element, 'opacity', opacity -= 0.1);
                } else {
                    timer.cancel();
                }
            }, speed || 100, true);
        }
    };
})();
