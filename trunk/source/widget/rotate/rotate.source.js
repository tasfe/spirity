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

Spirity.widget.Rotate = Spirity.widget.Rotate || function (config) {
    var config = config || {
          handle: 'ark:rotate',
        interval: 1000,
           begin: 0,
        autoplay: true,
        callback: null
    };

    config.begin = config.begin || 0;

    var dom   = Spirity.dom;
    var lang  = Spirity.lang;
    var event = Spirity.event;

    var rotateBox = dom.get(config.handle);
    if (!rotateBox) {
        throw new TypeError(config.handle + "not found");
        return false;
    }

    var rotateItem = rotateBox.getElementsByTagName('li');
    if (!rotateItem || !rotateItem.length) {
        throw new TypeError(config.handle + "seems empty");
        return false;
    }

    var hideAllItems = function () {
        for (var i = 0, len = rotateItem.length; i < len; i++) {
            dom.setStyle(rotateItem[i], 'display', 'none');
        }
    };

    var binding = function () {
        for (var i = 0, len = rotateItem.length; i < len; i++) {
            event.addListener(rotateItem[i], 'mouseover', 
            function (e) {
                handle.pause();
            });

            event.addListener(rotateItem[i], 'mouseout', 
            function (e) {
                handle.play();
            });
        }
    }

    var handle = {
        interval: null,
        play: function () {
                this.interval = lang.later(config.interval, null, function () {
                if (rotateItem.length <= config.begin) {
                    config.begin = 0;
                }

                hideAllItems();
                if (lang.isFunction(config.callback)) {
                    config.callback(rotateItem[config.begin++]);
                } else {
                    dom.setStyle(rotateItem[config.begin++], 'display', '');
                }
            }, null, true);
        },

        pause: function() {
           if (this.interval) {
               this.interval.cancel();
           }
        },

        init: function () {
            hideAllItems();
            binding();
        }
    };

    handle.init();
    if (config.autoplay) {
        handle.play();
    }

    return handle;
};
