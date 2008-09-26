// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript / Core / Core
 * 
 * @author  feeinglucky<i.feelinglucky@gmail.com>
 * @link    http://www.gracecode.com/
 * @link    http://code.google.com/p/spirity/
 * @version $Id$
 */

/*
if (typeof Spirity == "undefined" || !Spirity) {
    var Spirity = {};
}
 */

var genericize = function(object, property, check) {
	if ((!check || !object[property]) && typeof object.prototype[property] == 'function') {
        object[property] = function() {
		    var args = Array.prototype.slice.call(arguments);
		    return object.prototype[property].apply(args.shift(), args);
        }
	};
};

(function(object, methods) {
	for (var i = methods.length; i--; i) {
        genericize(object, methods[i], true);
    }
	return arguments.callee;
})(Array, ['forEach', 'filter', 'map', 'some', 'every','copy', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice', 'toString', 'valueOf', 'indexOf', 'lastIndexOf'])
(String, ['charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'replace', 'search', 'slice', 'split', 'substr', 'substring', 'toLowerCase', 'toUpperCase', 'valueOf']);

/*
f.call(o, 1, 2);

o.m = f;
o.m(1,2);
delete o.m;
*/

/*
(function(){
	['indexOf','lastIndexOf','forEach','filter','map','some','every','copy'].forEach(
		function(m) {
			if (!Array[m]) {
				Array[m] = function(scope){
					return Array.prototype[m].apply(scope, Array.prototype.slice.call(arguments, 1));
				};
			}
		}
	);
})();
*/


