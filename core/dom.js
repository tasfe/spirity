// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript Framework
 *
 * @author feeinglucky<i.feelinglucky@gmail.com>
 * @link   http://www.gracecode.com/
 */

Spirity.register.add({
     module: 'Spirity.dom', 
    version: '$Id$'
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
    }, // get

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
                value = computed[Spirity.lang.toCamelement(property)];
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
                    if ( Spirity.lang.isString(element.style.filter) ) { // in case not appended
                        element.style.filter = 'alpha(opacity=' + val * 100 + ')';
                        
                        if (!element.currentStyle || !element.currentStyle.hasLayout) {
                            element.style.zoom = 1; // when no layout or cant telementl
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

        element.style[property] = val;
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
    },

    removeClassName: function(element, className) {
        if (Spirity.lang.isString(element)) {
            element = Spirity.dom.get(element);
        }

        element.className = element.className.replace(
            new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ');

        return element;
    },

    toggleClassName: function(element, className) {
        var dom = Spirity.dom;
        if (dom.hasClassName(element, className)) {
            dom.removeClassName(element, className);
        } else {
            dom.addClassName(element, className);
        }
    },

    replaceClassName: function(element, className, replaceClassName) {
        if (Spirity.lang.isString(element)) {
            element = Spirity.dom.get(element);
        }

        if (Spirity.dom.hasClassName(element, className)) {
            element.className = element.className.replace(
                new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ' + replaceClassName + ' ');
        }

        return element;
    }
} // end of declaration dom

//document.getElementsByClassName = Spirity.dom.getElementsByClassName;
