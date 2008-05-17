// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript Framework
 * 
 * DOM 扩展
 *
 * @author feeinglucky<i.feelinglucky@gmail.com>
 * @link   http://www.gracecode.com/
 */

Spirity.register.add({
     module: 'Spirity.dom', 
    version: '$Id: dom.js 17 2008-05-14 12:49:26Z i.feelinglucky $'
});

Spirity.dom = Spirity.dom || {
    get: function (element){
        if (element && (element.nodeType || element.item)) {
            return element;
        }
        
        if (Spirity.lang.isString(element) || !element) {
            return document.getElementById(element);
        }
        
        if (element.length !== undefined) {
            var c = [];
            for (var i = 0, len = element.length; i < len; ++i) {
                c[c.length] = Spirity.dom.get(element[i]);
            }
            
            return c;
        }

        return element;
    }, // end of Spirity.dom.get

    getElementsByClassName: function(className, tag, root, callback){
        tag = tag || '*';
        root = (root) ? Spirity.dom.get(root) : null || document; 
        if (!root) {
            return [];
        }
        
        var nodes = [],
            elements = root.getElementsByTagName(tag),
            re = getClassRegEx(className);

        for (var i = 0, len = elements.length; i < len; ++i) {
            if (re.test(elements[i].className) ) {
                nodes[nodes.length] = elements[i];
                if (callback) {
                    callback.call(elements[i], elements[i]);
                }
            }
        }
        
        return nodes;
    }, // getElementsByClassName

    getStyle: function (element, property) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
            var value = null;
            if (property == 'float') {
                property = 'cssFloat';
            }

            var computed = document.defaultView.getComputedStyle(element, '');
            if (computed) {
                value = computed[Spirity.lang.toCamel(property)];
            }
            return element.style[property] || value;
        } else if (document.documentElement.currentStyle && Spirity.broswer.ua.explorer) {
            switch(Spirity.lang.toCamelement(property)) {
                case 'opacity':
                    var val = 100;
                    try {
                        val = element.filters['DXImageTransform.Microsoft.Alpha'].opacity;
                    } catch(e) {
                        try {
                            val = element.filters('alpha').opacity;
                        } catch(e) {
                            // ...
                        }
                    }
                    return val / 100;
                case 'float':
                    property = 'styleFloat';
                default: 
                    var value = element.currentStyle ? element.currentStyle[property] : null;
                    return ( element.style[property] || value );
            }
        } else {
            return element.style[property];
        }
    }, // getStyle

    setStyle: function(element, property, val) {
        if (Spirity.broswer.ua.explorer) {
            switch (property) {
                case 'opacity':
                    if ( Spirity.lang.isString(element.style.filter) ) {
                        element.style.filter = 'alpha(opacity=' + val * 100 + ')';
                        
                        if (!element.currentStyle || !element.currentStyle.hasLayout) {
                            element.style.zoom = 1;
                        }
                    }
                    break;
                case 'float':
                    property = 'styleFloat';
           }
        } else {
            if (property == 'float') {
                property = 'cssFloat';
            }
        }

        element.style[Spirity.lang.toCamelement(property)] = val;
    }, // setStyle

    hasClassName: function(element, className) {
        if (Spirity.lang.isString(element)) {
            element = Spirity.dom.get(element);
        }

        if (!Spirity.lang.isElement(element)){
            return;
        }

        var elementClassName = element.className;
        return (elementClassName.length > 0 && (elementClassName == className ||
            new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
    }, // hasClassName

    addClassName: function(element, className) {
        if (Spirity.lang.isString(element)) {
            element = Spirity.dom.get(element);
        }

        if (!Spirity.dom.hasClassName(element, className)) {
            element.className += (element.className ? ' ' : '') + className;
        }

        return element;
    }, // addClassName

    removeClassName: function(element, className) {
        if (Spirity.lang.isString(element)) {
            element = Spirity.dom.get(element);
        }

        element.className = element.className.replace(
            new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ');

        return element;
    }, // removeClassName

    toggleClassName: function(element, className) {
        var dom = Spirity.dom;
        if (dom.hasClassName(element, className)) {
            dom.removeClassName(element, className);
        } else {
            dom.addClassName(element, className);
        }
    }, // toggleClassName

    replaceClassName: function(element, className, replaceClassName) {
        if (Spirity.lang.isString(element)) {
            element = Spirity.dom.get(element);
        }

        if (Spirity.dom.hasClassName(element, className)) {
            element.className = element.className.replace(
                new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ' + replaceClassName + ' ');
        }

        return element;
    }, // replaceClassName

    getDimensions: function(element) {
        if (Spirity.lang.isString(element)) {
            element = Spirity.dom.get(element);
        }

        var display = Spirity.dom.getStyle(element, 'display');
        if (display != 'none' && display != null) {
          return {width: element.offsetWidth, height: element.offsetHeight};
        }

        // All *Width and *Height properties give 0 on elements with display none,
        // so enable the element temporarily
        var els = element.style;
        var originalVisibility = els.visibility;
        var originalPosition   = els.position;
        var originalDisplay    = els.display;

        els.visibility = 'hidden';
        els.position   = 'absolute';
        els.display    = '';

        var originalWidth  = element.clientWidth;
        var originalHeight = element.clientHeight;

        els.display    = originalDisplay;
        els.position   = originalPosition;
        els.visibility = originalVisibility;
        return {width: originalWidth, height: originalHeight};
    }, // getDimensions

    getWidth: function(element) {
        return Spirity.dom.getDimensions(element).width;
    }, // getWidth

    getHeight: function(element) {
        return Spirity.dom.getDimensions(element).height;
    }, // getHeight

    getXY: function() {
    
    },

    getX: function() {

    },

    getY: function() {

    }
} // end of declaration dom

//document.getElementsByClassName = Spirity.dom.getElementsByClassName;
