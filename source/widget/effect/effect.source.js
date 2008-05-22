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
        },

        shock: function (element, extent, duration, speed, direction, callback) {
            if (lang.isString(element)) {
                element = dom.get(element);
            }

            if (!lang.isElement(element)) {
                return;
            }

            if (timer) {
                timer.cancel();
            }

            var org_position = dom.getStyle(element, 'position');
            var org_top      = dom.getStyle(element, 'top');
            var org_left     = dom.getStyle(element, 'left');

            if (org_position != 'relative' || org_position != 'absolute') {
                dom.setStyle(element, 'position', 'relative');
            }

            var start = 0;
            duration  = duration  || 1000;
            extent    = extent    || 10;
            speed     = speed     || 150;
            direction = direction || {x: true, y: true};

            timer = lang.later(function () {
                if (start < duration) {
                    if (direction.y) {
                        dom.setStyle(element, 'top',  extent * ((start/speed % 2) * -1) + 'px');
                    }
                    if (direction.x) {
                        dom.setStyle(element, 'left', extent * ((start/speed % 2) * -1) + 'px');
                    }
                    start += speed;
                } else {
                    timer.cancel();
                    dom.setStyle(element, 'position', org_position);
                    dom.setStyle(element, 'top',  org_top);
                    dom.setStyle(element, 'left', org_left);
                }
            }, speed, true);
        },

        scrollOut: function (element, speed, direction, dimension, callback) {
            if (lang.isString(element)) {
                element = dom.get(element);
            }

            if (!lang.isElement(element)) {
                return;
            }

            if (timer) {
                timer.cancel();
            }

            var org_dimension = {width: parseInt(dom.getStyle(element, 'width')), 
                height: parseInt(dom.getStyle(element, 'height'))};
            var backup = {width: parseInt(dom.getStyle(element, 'width')), 
                height: parseInt(dom.getStyle(element, 'height'))};

            dimension = dimension || {width: 0, height: 0};
            direction = direction || {x: true, y: true};

            timer = lang.later(function () {
                if (org_dimension.width >= dimension.width || org_dimension.height >= dimension.height ) {
                    if (direction.y) {
                        dom.setStyle(element, 'height', org_dimension.height + 'px');
                    }
                    if (direction.x) {
                        dom.setStyle(element, 'width',  org_dimension.width  + 'px');
                    }
                    org_dimension.width  -= 5;
                    org_dimension.height -= 5;
                } else {
                    timer.cancel();
                    dom.setStyle(element, 'display', 'none');
                    dom.setStyle(element, 'width',  backup.width  + 'px');
                    dom.setStyle(element, 'height', backup.height + 'px');
                }
            }, speed || 20, true);
        },

        scrollIn: function (element, speed, direction, dimension, callback) {
            if (lang.isString(element)) {
                element = dom.get(element);
            }

            if (!lang.isElement(element)) {
                return;
            }

            if (timer) {
                timer.cancel();
            }

            var org_dimension = {width: parseInt(dom.getStyle(element, 'width')), 
                height: parseInt(dom.getStyle(element, 'height'))};
            dimension = dimension || {width: 0, height: 0};
            direction = direction || {x: true, y: true};

            dom.setStyle(element, 'width',  dimension.width  + 'px');
            dom.setStyle(element, 'height', dimension.height + 'px');
            dom.setStyle(element, 'display', '');

            timer = lang.later(function () {
                if (dimension.width < org_dimension.width|| dimension.height < org_dimension.height) {
                    if (direction.y) {
                        dom.setStyle(element, 'height', dimension.height + 'px');
                    }
                    if (direction.x) {
                        dom.setStyle(element, 'width',  dimension.width  + 'px');
                    }
                    dimension.width  += 5;
                    dimension.height += 5;
                } else {
                    timer.cancel();
                    dom.setStyle(element, 'width',  org_dimension.width  + 'px');
                    dom.setStyle(element, 'height', org_dimension.height + 'px');
                }
            }, speed || 20, true);
        }
    };
})();
