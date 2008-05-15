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
    version: '$Id: event.js 17 2008-05-14 12:49:26Z i.feelinglucky $'
});

Spirity.event = Spirity.event || {
    addEvent: function(element, type, callback, object, override) {
        if (!callback || !callback.call) {
            throw new TypeError(type + " addEvent call failed, callback undefined");
            return false;
        }

        if (object.addEventListener) {	
            object.addEventListener(type, func, false);
        } else if (object.attachEvent){
            object.attachEvent('on'+type, func);
        } else {
        
        }
    },

    removeEvent: function (element, type, callback, object, override) {
        if (!callback || !callback.call) {
            throw new TypeError(type + " removeEvent call failed, callback undefined");
            return false;
        }

        if (object.removeEventListener) {	
            object.removeEventListener(type, func, false);
        } else if (object.detachEvent) {
            object.attachEvent('on'+type, func);
        } else {
        
        }
    },

    onDOMReady: function (callback) {
        if (!callback || !callback.call) {
            throw new TypeError(type + " onDOMReady call failed, callback undefined");
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
            if (isReady) return;
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

function IEContentLoaded (w, fn) {
	var d = w.document, done = false,
	// only fire once
	init = function () {
		if (!done) {
			done = true;
			fn();
		}
	};
	// polling for no errors
	(function () {
		try {
			// throws errors until after ondocumentready
			d.documentElement.doScroll('left');
		} catch (e) {
			setTimeout(arguments.callee, 50);
			return;
		}
		// no errors, fire
		init();
	})();
	// trying to always fire before onload
	d.onreadystatechange = function() {
		if (d.readyState == 'complete') {
			d.onreadystatechange = null;
			init();
		}
	};
}
