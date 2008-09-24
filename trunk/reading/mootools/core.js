/*
Script: Core.js
	MooTools - My Object Oriented JavaScript Tools.

License:
	MIT-style license.

Copyright:
	Copyright (c) 2006-2007 [Valerio Proietti](http://mad4milk.net/).

Code & Documentation:
	[The MooTools production team](http://mootools.net/developers/).

Inspiration:
	- Class implementation inspired by [Base.js](http://dean.edwards.name/weblog/2006/03/base/) Copyright (c) 2006 Dean Edwards, [GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)
	- Some functionality inspired by [Prototype.js](http://prototypejs.org) Copyright (c) 2005-2007 Sam Stephenson, [MIT License](http://opensource.org/licenses/mit-license.php)
*/

var MooTools = {
	'version': '1.2.0',
	'build': ''
};

// mooTools 的对象机制
var Native = function(options){
	options = options || {};

	// 方法生效后的回调函数
	var afterImplement = options.afterImplement || function(){};
	// “一般化”
	var generics = options.generics;
	generics = (generics !== false);
	// 继承对象
	var legacy = options.legacy;
	// 初始化, Prototype 风格
	var initialize = options.initialize;
	// 是否保护原对象的原型方法，以免被继承的同名方法覆盖
	var protect = options.protect;
	// 类名称
	var name = options.name;

	// 初始化返回的对象是继承还是新声明的
	var object = initialize || legacy;

	object.constructor = Native;
	object.$family = {name: 'native'};
	// 原型继承
	if (legacy && initialize) object.prototype = legacy.prototype;
	object.prototype.constructor = object;

	// 类的名称
	if (name){
		var family = name.toLowerCase();
		object.prototype.$family = {name: family};
		  /*
  类型化,为Native类型对象添加静态type方法，现在可以使用object.type(object1)判断object1与object类型的实例
  比如Number.type(1)返回true,String.type(1)返回false
  后面的IFrame等代码中有很多地方利用这个特性配合Array.link实现函数的参数位置无关性
  */
		Native.typize(object, family);  // typzie 在下面注解
	}

	// 为对象增加方法
	var add = function(obj, name, method, force){
		//仅当不指定对象受保护,或指定强制覆盖或原对象原型中不存在该方法时添加

		if (!protect || force || !obj.prototype[name]) {
			obj.prototype[name] = method;
		}
		if (generics){
			Native.genericize(obj, name, protect);
		}

		// 执行增加方法后的回调函数
		afterImplement.call(obj, name, method);
		return obj;
	};
	
	// a1 = name
	// a2 = method (function)
	// a3 = force
	// [?] a2 的参数是可变的，如 a1 为字符串时，a2 为方法、如 a1 为关联数组时，a2 则为 force
	object.implement = function(a1, a2, a3){
		if (typeof a1 == 'string'){
			return add(this, a1, a2, a3);
		}

		// 批量增加 ["a": function() {}, "b": func ...]
		for (var p in a1){
			add(this, p, a1[p], a2);
		}
		return this;
	};
	
	// 设置别名函数（方法的拷贝）
	object.alias = function(a1, a2, a3){
		if (typeof a1 == 'string'){
			a1 = this.prototype[a1];
			if (a1) {
				add(this, a2, a1, a3);
			}
		} else {
			for (var a in a1) {
				this.alias(a, a1[a], a2);
			}
		}
		return this;
	};

	return object;
};

//用于同时对多个对象进行扩展实现,子对象须被Native化,或者实现了名为implement的静态方法
Native.implement = function(objects, properties){
	for (var i = 0, l = objects.length; i < l; i++){
		objects[i].implement(properties);
	}
};

//方法静态化
Native.genericize = function(object, property, check){
	if ((!check || !object[property]) && typeof object.prototype[property] == 'function') object[property] = function(){
		//将arguments数组化
		var args = Array.prototype.slice.call(arguments);
		 //将第一个参数作为原来实例方法的this指向

		return object.prototype[property].apply(args.shift(), args);
	};
};

Native.typize = function(object, family){
	//如果未定义type方法才定义，避免重复定义和覆盖
	if (!object.type) {
		// 利用闭包保存family变量值，在使用object.type的时候参与比较
		object.type = function(item){
			return ($type(item) === family);
		};
	}
};

Native.alias = function(objects, a1, a2, a3){
	for (var i = 0, j = objects.length; i < j; i++) objects[i].alias(a1, a2, a3);
};

/*
因为js中的变量作用域只存在于function和with中,此处使用模块化写法避免全局变量污染,就地执行匿名方法
使Boolean/Native/Object支持类型判断操作，如Boolean.type(false),Native.type(Boolean),Object.type({})
*/
(function(objects){
	for (var name in objects){
		Native.typize(objects[name], name);
	}
})({'boolean': Boolean, 'native': Native, 'object': Object});

/*
对下列内置类型进行Native化包装,使之支持类型化,别名,继承等
*/
(function(objects){
	for (var name in objects) new Native({name: name, initialize: objects[name], protect: true});
})({'String': String, 'Function': Function, 'Number': Number, 'Array': Array, 'RegExp': RegExp, 'Date': Date});

(function(object, methods){
	for (var i = methods.length; i--; i) Native.genericize(object, methods[i], true);
	return arguments.callee;
})
(Array, ['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice', 'toString', 'valueOf', 'indexOf', 'lastIndexOf'])
(String, ['charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'replace', 'search', 'slice', 'split', 'substr', 'substring', 'toLowerCase', 'toUpperCase', 'valueOf']);

///////////////////////////////////////////

function $chk(obj){
	return !!(obj || obj === 0);
};

function $clear(timer){
	clearTimeout(timer);
	clearInterval(timer);
	return null;
};

function $defined(obj){
	return (obj != undefined);
};

function $empty(){};

function $arguments(i){
	return function(){
		return arguments[i];
	};
};

function $lambda(value){
	return (typeof value == 'function') ? value : function(){
		return value;
	};
};

function $extend(original, extended){
	for (var key in (extended || {})) original[key] = extended[key];
	return original;
};

function $unlink(object){
	var unlinked;
	
	switch ($type(object)){
		case 'object':
			unlinked = {};
			for (var p in object) unlinked[p] = $unlink(object[p]);
		break;
		case 'hash':
			unlinked = $unlink(object.getClean());
		break;
		case 'array':
			unlinked = [];
			for (var i = 0, l = object.length; i < l; i++) unlinked[i] = $unlink(object[i]);
		break;
		default: return object;
	}
	
	return unlinked;
};

function $merge(){
	var mix = {};
	for (var i = 0, l = arguments.length; i < l; i++){
		var object = arguments[i];
		if ($type(object) != 'object') continue;
		for (var key in object){
			var op = object[key], mp = mix[key];
			mix[key] = (mp && $type(op) == 'object' && $type(mp) == 'object') ? $merge(mp, op) : $unlink(op);
		}
	}
	return mix;
};

function $pick(){
	for (var i = 0, l = arguments.length; i < l; i++){
		if (arguments[i] != undefined) return arguments[i];
	}
	return null;
};

function $random(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
};

function $splat(obj){
	var type = $type(obj);
	return (type) ? ((type != 'array' && type != 'arguments') ? [obj] : obj) : [];
};

var $time = Date.now || function(){
	return new Date().getTime();
};

function $try(){
	for (var i = 0, l = arguments.length; i < l; i++){
		try {
			return arguments[i]();
		} catch(e){}
	}
	return null;
};

function $type(obj){
	if (obj == undefined) return false;
	if (obj.$family) return (obj.$family.name == 'number' && !isFinite(obj)) ? false : obj.$family.name;
	if (obj.nodeName){
		switch (obj.nodeType){
			case 1: return 'element';
			case 3: return (/\S/).test(obj.nodeValue) ? 'textnode' : 'whitespace';
		}
	} else if (typeof obj.length == 'number'){
		if (obj.callee) return 'arguments';
		else if (obj.item) return 'collection';
	}
	return typeof obj;
};

var Hash = new Native({

	name: 'Hash',

	initialize: function(object){
		if ($type(object) == 'hash') object = $unlink(object.getClean());
		for (var key in object) this[key] = object[key];
		return this;
	}

});

Hash.implement({
	
	getLength: function(){
		var length = 0;
		for (var key in this){
			if (this.hasOwnProperty(key)) length++;
		}
		return length;
	},

	forEach: function(fn, bind){
		for (var key in this){
			if (this.hasOwnProperty(key)) fn.call(bind, this[key], key, this);
		}
	},
	
	getClean: function(){
		var clean = {};
		for (var key in this){
			if (this.hasOwnProperty(key)) clean[key] = this[key];
		}
		return clean;
	}

});

Hash.alias('forEach', 'each');

function $H(object){
	return new Hash(object);
};

Array.implement({

	forEach: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++) fn.call(bind, this[i], i, this);
	}

});

Array.alias('forEach', 'each');

function $A(iterable){
	if (iterable.item){
		var array = [];
		for (var i = 0, l = iterable.length; i < l; i++) array[i] = iterable[i];
		return array;
	}
	return Array.prototype.slice.call(iterable);
};

function $each(iterable, fn, bind){
	var type = $type(iterable);
	((type == 'arguments' || type == 'collection' || type == 'array') ? Array : Hash).each(iterable, fn, bind);
};
