// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript Framework
 *
 * Javascript 的 Array 扩展包
 * 获取自 Trba 库（http://tbra.googlecode.com）
 *
 * @author feeinglucky<i.feelinglucky@gmail.com>
 * @link   http://www.gracecode.com/
 * @link   http://spirity.googlecode.com/
 */

/**
 * 获取元素在数组中的位置
 *
 * @param  Object    元素
 * @param  Intger    fromIndex - 起始位置
 * @return Intger
 */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, fromIndex) {
        if (fromIndex == null) {
            fromIndex = 0;
        } else if (fromIndex < 0) {
            fromIndex = Math.max(0, this.length + fromIndex);
        }
        for (var i = fromIndex; i < this.length; i++) {
            if (this[i] === obj)
                return i;
        }
        return -1;
    };
}


/**
 * 反向查找元素在数组中的位置
 *
 * @param  object    元素
 * @param  fromIndex 起始位置
 * @return int
 */
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function (obj, fromIndex) {
        if (fromIndex == null) {
            fromIndex = this.length - 1;
        } else if (fromIndex < 0) {
            fromIndex = Math.max(0, this.length + fromIndex);
        }
        for (var i = fromIndex; i >= 0; i--) {
            if (this[i] === obj)
                return i;
        }
        return -1;
    };
}


/**
 * Executes a provided function once per array element.
 *
 * @param  fucntion Function to test each element of the array.
 * @link   http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach
 */
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function") {
            throw new TypeError();
        }
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                fun.call(thisp, this[i], i, this);
            }
        }
    };
}


/**
 * Creates a new array with all elements that pass the test 
 * implemented by the provided function.
 *
 * @param  fucntion Function to test each element of the array.
 * @link   http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:filter
 * @return array
 */
if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun) {
        var len = this.length;
        if (typeof fun != "function") {
          throw new TypeError();
        }
        var res   = [];
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                var val = this[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, this)) {
                    res.push(val);
                }
            }
        }
        return res;
    };
}


/**
 * Creates a new array with the results of calling 
 * a provided function on every element in this array. 
 *
 * @param  fucntion Function to test each element of the array.
 * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:map
 * @return array
 */
if (!Array.prototype.map) {
    Array.prototype.map = function(fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function") {
            throw new TypeError();
        }
        var res   = new Array(len);
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                res[i] = fun.call(thisp, this[i], i, this);
            }
        }
        return res;
    };
}


/**
 * Tests whether some element in the array passes the 
 * test implemented by the provided function.
 *
 * @param  fucntion Function to test each element of the array.
 * @link   http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:some
 * @return bool
 */
if (!Array.prototype.some) {
    Array.prototype.some = function(fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function") {
            throw new TypeError();
        }

        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this && fun.call(thisp, this[i], i, this)) {
                return true;
            }
        }

        return false;
    };
}


/**
 * Tests whether all elements in the array 
 * pass the test implemented by the provided function.
 *
 * @param function Function to test for each element. 
 * @link  http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:every
 */
if (!Array.prototype.every) {
    Array.prototype.every = function(fun) {
        var len = this.length;
        if (typeof fun != "function") {
            throw new TypeError();
        }
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this && !fun.call(thisp, this[i], i, this)) {
                return false;
            }
        }
        return true;
    };
}


/**
 * Apply a function simultaneously against two values 
 * of the array (from left-to-right) as to reduce it to a single value.
 *
 * @param function Function to test for each element. 
 * @link  http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:reduce
 */
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function(fun /*, initial*/) {
        var len = this.length;
        if (typeof fun != "function") {
            throw new TypeError();
        }
        // no value to return if no initial value and an empty array
        if (len == 0 && arguments.length == 1) {
          throw new TypeError();
        }

        var i = 0;
        if (arguments.length >= 2) {
            var rv = arguments[1];
        } else {
          do {
                if (i in this) {
                    rv = this[i++];
                    break;
                }
                // if array contains no values, no initial value to return
                if (++i >= len) {
                  throw new TypeError();
                }
          } while (true);
        }

        for (; i < len; i++) {
            if (i in this) {
                rv = fun.call(null, rv, this[i], i, this);
            }
        }

        return rv;
    };
}


/**
 * Apply a function simultaneously against two values
 * of the array (from right-to-left) as to reduce it to a single value.
 *
 * @param function Function to test for each element. 
 * @link  http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:reduceRight
 */
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function(fun /*, initial*/) {
        var len = this.length;
        if (typeof fun != "function") {
            throw new TypeError();
        }

        // no value to return if no initial value, empty array
        if (len == 0 && arguments.length == 1) {
            throw new TypeError();
        }

        var i = len - 1;
        if (arguments.length >= 2) {
            var rv = arguments[1];
        } else {
            do {
                if (i in this) {
                    rv = this[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0) {
                  throw new TypeError();
                }
            } while (true);
        }

        for (; i >= 0; i--) {
            if (i in this) {
                rv = fun.call(null, rv, this[i], i, this);
            }
        }

        return rv;
    };
}


/**
 * 删除数组中重复的元素
 *
 * @return Array
 */
if (!Array.prototype.unique) {
    Array.prototype.unique = function() {
        var resultArr = [],
            returnArr = [],
            origLen = this.length,
            resultLen;

        function include(arr, value) {
            for (var i = 0, n = arr.length; i < n; ++i){
                if (arr[i] === value) {
                    return true;
                }
            }

            return false;
        }

        resultArr.push(this[0]);
        for (var i = 1; i < origLen; ++i) {
            if (include(resultArr, this[i])) {
                returnArr.push(this[i]);
            } else {
                resultArr.push(this[i]);
            }
        }

        resultLen = resultArr.length;
        this.length = resultLen;
        for (var i = 0; i < resultLen; ++i){
            this[i] = resultArr[i];
        }

        return returnArr;
    }
}


/**
 * 检查数组是否包含某元素
 *
 * @param  object 元素
 * @return bool
 */
Array.prototype.contains = function (obj) {
    return this.indexOf(obj) != -1;
};


/**
 * 复制数组中的全部元素
 *
 * @return Array
 */
Array.prototype.copy = function (obj) {
    return this.concat();
};


/**
 * 在 i 之后插入元素
 *
 * @param Object 元素
 * @param Intger 位置
 */
Array.prototype.insertAt = function (obj, i) {
    this.splice(i, 0, obj);
};


/**
 * 在指定元素之前插入元素
 *
 * @param Object obj  插入元素
 * @param Object obj2 目标元素
 */
Array.prototype.insertBefore = function (obj, obj2) {
    var i = this.indexOf(obj2);
    if (i == -1)
        this.push(obj);
    else
        this.splice(i, 0, obj);
};


/**
 * 删除指定位置的元素
 *
 * @param Intger 位置
 */
Array.prototype.removeAt = function (i) {
    this.splice(i, 1);
};


/**
 * 删除一个数组中指定的元素
 *
 * @param Object obj 目标元素
 */
Array.prototype.remove = function (obj) {
    var i = this.indexOf(obj);
    if (i != -1) {
        this.splice(i, 1);
    }
};


/**
 * 删除全部数组中指定的元素
 *
 * @param Object obj 目标元素
 */
Array.prototype.removeAll = function (obj) {
    for (var i = 0, length = this.length; i < length; i++) {
        var j = this.indexOf(obj);
        if (j != -1) {
            this.splice(j, 1);
        } else {
            break;
        }
    }
};
