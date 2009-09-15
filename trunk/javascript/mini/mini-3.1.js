/**
 * "mini" Selector Engine
 * Copyright (c) 2009 James Padolsey
 * -------------------------------------------------------
 * Dual licensed under the MIT and GPL licenses.
 *    - http://www.opensource.org/licenses/mit-license.php
 *    - http://www.gnu.org/copyleft/gpl.html
 * -------------------------------------------------------
 * Version: 0.01 (BETA)
 */

var mini = (function(){
    
    var snack = /(?:[\w\-\\.#]+)+(?:\[\w+?=([\'"])?(?:\\\1|.)+?\1\])?|\*|>/ig,
        exprClassName = /^(?:[\w\-_]+)?\.([\w\-_]+)/, // 样式选择符 .className
        exprId = /^(?:[\w\-_]+)?#([\w\-_]+)/, // ID 选择符 .nodeId
        exprNodeName = /^([\w\*\-_]+)/, // tag 名称 <em>
        na = [null,null];
    
    function _find(selector, context) {
        
        /**
         * This is what you call via x()
         * Starts everything off...
         */
        
        // 如无使用，则使用 document 容器
        context = context || document;
        
        var simple = /^[\w\-_#]+$/.test(selector);
        
        // 如果有原生的方法，则直接使用原生的 - Firefox、Weikit 支持
        if (!simple && context.querySelectorAll) {
            // 强制转换为数组
            return realArray(context.querySelectorAll(selector));
        }
        
        // 依次获取每个逗号分隔的选择器内容
        if (selector.indexOf(',') > -1) {
            var split = selector.split(/,/g), ret = [], sIndex = 0, len = split.length;
            for(; sIndex < len; ++sIndex) { 
                // 使用递归
                ret = ret.concat( _find(split[sIndex], context) );
            }
            return unique(ret);
        }
        
        var parts = selector.match(snack),
            part = parts.pop(),
            id = (part.match(exprId) || na)[1],
            className = !id && (part.match(exprClassName) || na)[1],
            nodeName = !id && (part.match(exprNodeName) || na)[1],
            collection;

            /*
            console.info('parts: ' + parts);
            console.info('part: ' + part);
            console.info('id: ' + id);
            console.info('className: ' + className);
            console.info('nodeName: ' + nodeName);
            */
            
        if (className && !nodeName && context.getElementsByClassName) {
            // 如果只有样式选择符，则直接使用原生的
            collection = realArray(context.getElementsByClassName(className));

        } else {
            // 获取指定 tagName 的节点
            collection = !id && realArray(context.getElementsByTagName(nodeName || '*'));
            
            // 获取指定 className 的节点
            if (className) {
                collection = filterByAttr(collection, 'className', RegExp('(^|\\s)' + className + '(\\s|$)'));
            }
            
            if (id) {
                var byId = context.getElementById(id);
                return byId?[byId]:[];
            }
        }
        
        return parts[0] && collection[0] ? filterParents(parts, collection) : collection;
        
    }
    
    function realArray(c) {
        
        /**
         * Transforms a node collection into
         * a real array
         */
        
        try {
            return Array.prototype.slice.call(c);
        } catch(e) {
            var ret = [], i = 0, len = c.length;
            for (; i < len; ++i) {
                ret[i] = c[i];
            }
            return ret;
        }
        
    }
    
    function filterParents(selectorParts, collection, direct) {
        
        /**
         * This is where the magic happens.
         * Parents are stepped through (upwards) to
         * see if they comply with the selector.
         */
        
        var parentSelector = selectorParts.pop();
        
        if (parentSelector === '>') {
            return filterParents(selectorParts, collection, true);
        }
        
        var ret = [],
            r = -1,
            id = (parentSelector.match(exprId) || na)[1],
            className = !id && (parentSelector.match(exprClassName) || na)[1],
            nodeName = !id && (parentSelector.match(exprNodeName) || na)[1],
            cIndex = -1,
            node, parent,
            matches;
            
        nodeName = nodeName && nodeName.toLowerCase();
            
        while ( (node = collection[++cIndex]) ) {
            
            parent = node.parentNode;
            
            do {
                
                matches = !nodeName || nodeName === '*' || nodeName === parent.nodeName.toLowerCase();
                matches = matches && (!id || parent.id === id);
                matches = matches && (!className || RegExp('(^|\\s)' + className + '(\\s|$)').test(parent.className));
                
                if (direct || matches) { break; }
                
            } while ( (parent = parent.parentNode) );
            
            if (matches) {
                ret[++r] = node;
            }
        }
        
        return selectorParts[0] && ret[0] ? filterParents(selectorParts, ret) : ret;
        
    }
    
    
    var unique = (function(){
        
        var uid = +new Date();
                
        // 简单的 memorize 实现
        var data = (function(){
            var n = 1;
            return function(elem) {
                var cacheIndex = elem[uid], nextCacheIndex = n++;
                if(!cacheIndex) {
                    elem[uid] = nextCacheIndex;
                    return true;
                }
                return false;
            };
        })();
        
        return function(arr) {
            /**
             * Returns a unique array
             */
            var ret = [], r = -1, item;
            for (var i = 0, length = arr.length; i < length; ++i) {
                item = arr[i];
                if (data(item)) {
                    ret[++r] = item;
                }
            }
            uid += 1;
            
            return ret;
        };
    })();
    
    function filterByAttr(collection, attr, regex) {
        /**
         * Filters a collection by an attribute.
         */
        var i = -1, node, r = -1, ret = [];
        
        while ( (node = collection[++i]) ) {
            //if (regex.test(node[attr])) {
            if (regex.test(node.getAttribute(attr))) {
                ret[++r] = node;
            }
        }
        
        return ret;
    }
    
    return _find;
})();
// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8 nobomb:
