// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript Framework
 *
 * @author feeinglucky<i.feelinglucky@gmail.com>
 * @link   http://www.gracecode.com/
 */

Spirity.register.add({
     module: 'Spirity.dom', 
    version: ''
});

Spirity.dom = Spirity.dom || {
    get: function (){
        if (el && (el.nodeType || el.item)) {
            return el;
        }
        
        if (Spirity.lang.isString(el) || !el) {
            return document.getElementById(el);
        }
        
        if (el.length !== undefined) {
            var c = [];
            for (var i = 0, len = el.length; i < len; ++i) {
                c[c.length] = Spirity.dom.get(el[i]);
            }
            
            return c;
        }

        return el;
    }, // get

    getElementsByClassName: function(className, tag, root, apply){
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
                if (apply) {
                    apply.call(elements[i], elements[i]);
                }
            }
        }
        
        return nodes;
    }, // getElementsByClassName

    getStyle: function () {
    
    },

    setStyle: function () {
    
    },

    selector: function() {
    
    } // selector
} // end of declaration dom

//document.getElementsByClassName = Spirity.dom.getElementsByClassName;
