// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript Framework
 *
 * @author feeinglucky<i.feelinglucky@gmail.com>
 * @link   http://code.google.com/p/spirity/
 * @link   http://www.gracecode.com/
 */

Spirity.register.add({
     module: 'Spirity.dom', 
    version: '$Id: event.source.js 40 2008-09-19 03:21:33Z i.feelinglucky $'
});

Spirity.event = Spirity.event || {
    addListener: function(element, type, callback, object, override) {
        if (Spirity.lang.isString(element)) {
            element = Spirity.dom.get(element);
        }

        if (!callback || !callback.call) {
            throw new TypeError(type + " addListener call failed, callback undefined");
            return false;
        }

        if (element.addEventListener) {
            element.addEventListener(type, callback, false);
        } else if (element.attachEvent){
            element.attachEvent('on'+type, callback);
        } else {
            // ...
        }
    },

    removeListener: function (element, type, callback, object, override) {
        if (!callback || !callback.call) {
            throw new TypeError(type + " removeListener call failed, callback undefined");
            return false;
        }

        if (element.removeEventListener) {	
            element.removeEventListener(type, callback, false);
        } else if (element.detachEvent) {
            element.detachEvent('on'+type, callback);
        } else {
        
        }
    },

    getEvent: function (event) {
        var event = event || window.event;

        if (!event) {
            var c = this.getEvent.caller;
            while (c) {
                event = c.arguments[0];
                if (event && Event == event.constructor) {
                    break;
                }
                c = c.caller;
            }
        }

        return event;
    }, // getEvent

    stopEvent: function (event) {
		event = event || Spirity.event.getEvent();
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }

        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }, // stopEvent

    /**
     * Returns the charcode for an event
     */
    getCharCode: function(event) {
        var code = event.keyCode || event.charCode || 0;
        // webkit key normalization
        if (Spirity.broswer.ua.webkit && (code in webkitKeymap)) {
            code = webkitKeymap[code];
        }
        return code;
    },

    getPageX: function(event) {
        var x = event.pageX || event.clientX || 0;
        if ( Spirity.broswer.ua.explorer) {
            x += this._getScroll()[1];
        }

        return x;
    },

    getPageY: function(event) {
        var y = event.pageY || event.clientY || 0;
        if ( Spirity.broswer.ua.explorer) {
            y += this._getScroll()[0];
        }

        return y;
    },

    onDOMReady: function (callback) {
        if (!callback || !Spirity.lang.isFunction(callback)) {
            throw new TypeError(callback.toString() + " onDOMReady call failed, callback undefined");
            return false;
        }

        var isReady = Spirity.event.onDOMReady.isReady;
        if (document.addEventListener && !Spirity.broswer.ua.opera) {	
            if (!isReady) {
                isReady = true;
            }
            document.addEventListener('DOMContentLoaded', callback, false);
        }

        if (Spirity.broswer.ua.explorer && window == top ) (function() {
            if (isReady) {
                return;
            }
            try {
                var done = false;
                var init = function () {
                    if (!done) {
                        done = true;
                        callback();
                    }
                };

                document.documentElement.doScroll("left");
            } catch( error ) {
                setTimeout(arguments.callee, 0);
                return;
            }

            init();
        })();

	    if (Spirity.broswer.ua.opera) {
            document.addEventListener( "DOMContentLoaded", function () {
                if (isReady) return;
                for (var i = 0; i < document.styleSheets.length; i++)
                    if (document.styleSheets[i].disabled) {
                        setTimeout( arguments.callee, 0 );
                        return;
                    }
                
                callback();
            }, false);
        }

    	if (Spirity.broswer.ua.webkit) {
            (function() {
			    if (isReady) return;
                if ( document.readyState != "loaded" && document.readyState != "complete" ) {
                    setTimeout( arguments.callee, 0 );
                    return;
                }

                callback();
            })();
        };
    }
};	

Spirity.event.on = Spirity.event.addEventListener;
