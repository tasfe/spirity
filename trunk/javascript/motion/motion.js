// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Motion - 动画组件
 *
 * @author  mingcheng<i.feelinglucky@gmail.com>
 * @since   2009-01-26
 * @link    http://www.gracecode.com/
 * @version $Id$
 *
 * @change
 *     [+]new feature  [*]improvement  [!]change  [x]bug fix
 *
 * [*] 2009-04-05
 *      优化对象接口
 *
 * [*] 2009-04-05
 *      优化 customEvent；增强动画函数判断，使其支持自定义函数
 *
 * [*] 2009-03-30
 *      增加 customEvent 函数，优化逻辑
 *
 * [!] 2009-02-01
 *      将 setTimeout 改成了 setInterval ，详见 http://ejohn.org/blog/how-javascript-timers-work/
 *
 * [*] 2009-01-27
 *      调整接口，优化代码
 *
 * [+] 2009-01-26
 *      最初版，完成基本功能
 */
(function(scope) {
    /**
     * Easing Equations
     *
     * @see http://developer.yahoo.com/yui/animation/
     * @see http://www.robertpenner.com/profmx
     * @see http://hikejun.com/demo/yui-base/yui_2x_animation.html
     */
    var Tween = {
        linear: function (t, b, c, d) {
            return c*t/d + b;
        },

        easeIn: function (t, b, c, d) {
            return c*(t/=d)*t + b;
        },

        easeOut: function (t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },

        easeBoth: function (t, b, c, d) {
            if ((t/=d/2) < 1) {
                return c/2*t*t + b;
            }
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },
        
        easeInStrong: function (t, b, c, d) {
            return c*(t/=d)*t*t*t + b;
        },
        
        easeOutStrong: function (t, b, c, d) {
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        
        easeBothStrong: function (t, b, c, d) {
            if ((t/=d/2) < 1) {
                return c/2*t*t*t*t + b;
            }
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        },

        elasticIn: function (t, b, c, d, a, p) {
            if (t === 0) { 
                return b; 
            }
            if ( (t /= d) == 1 ) {
                return b+c; 
            }
            if (!p) {
                p=d*0.3; 
            }
            if (!a || a < Math.abs(c)) {
                a = c; 
                var s = p/4;
            } else {
                var s = p/(2*Math.PI) * Math.asin (c/a);
            }
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },

        elasticOut: function (t, b, c, d, a, p) {
            if (t === 0) {
                return b;
            }
            if ( (t /= d) == 1 ) {
                return b+c;
            }
            if (!p) {
                p=d*0.3;
            }
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else {
                var s = p/(2*Math.PI) * Math.asin (c/a);
            }
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        },
        
        elasticBoth: function (t, b, c, d, a, p) {
            if (t === 0) {
                return b;
            }
            if ( (t /= d/2) == 2 ) {
                return b+c;
            }
            if (!p) {
                p = d*(0.3*1.5);
            }
            if ( !a || a < Math.abs(c) ) {
                a = c; 
                var s = p/4;
            }
            else {
                var s = p/(2*Math.PI) * Math.asin (c/a);
            }
            if (t < 1) {
                return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
                        Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            }
            return a*Math.pow(2,-10*(t-=1)) * 
                    Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
        },

        backIn: function (t, b, c, d, s) {
            if (typeof s == 'undefined') {
               s = 1.70158;
            }
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },

        backOut: function (t, b, c, d, s) {
            if (typeof s == 'undefined') {
                s = 1.70158;
            }
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        
        backBoth: function (t, b, c, d, s) {
            if (typeof s == 'undefined') {
                s = 1.70158; 
            }
            if ((t /= d/2 ) < 1) {
                return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            }
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },

        bounceIn: function (t, b, c, d) {
            return c - Tween['bounceOut'](d-t, 0, c, d) + b;
        },
        
        bounceOut: function (t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
            }
            return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
        },
        
        bounceBoth: function (t, b, c, d) {
            if (t < d/2) {
                return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
            }
            return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
        } /* ,

        // extra, form http://hikejun.com/demo/yui-base/yui_2x_animation.html
        easeInQuad: function (t, b, c, d) {
            return c*(t/=d)*t + b;
        },

        easeOutQuad: function ( t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },

        easeInOutQuad: function ( t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },

        easeInCubic: function ( t, b, c, d) {
            return c*(t/=d)*t*t + b;
        },

        easeOutCubic: function ( t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        },

        easeInOutCubic: function ( t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        },

        easeInQuart: function ( t, b, c, d) {
            return c*(t/=d)*t*t*t + b;
        },

        easeOutQuart: function ( t, b, c, d) {
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },

        easeInOutQuart: function ( t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        },

        easeInQuint: function ( t, b, c, d) {
            return c*(t/=d)*t*t*t*t + b;
        },

        easeOutQuint: function ( t, b, c, d) {
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },

        easeInOutQuint: function ( t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        },

        easeInSine: function ( t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },

        easeOutSine: function ( t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },

        easeInOutSine: function ( t, b, c, d) {
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        },

        easeInExpo: function ( t, b, c, d) {
            return (t===0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },

        easeOutExpo: function ( t, b, c, d) {
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },

        easeInOutExpo: function ( t, b, c, d) {
            if (t===0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },

        easeInCirc: function ( t, b, c, d) {
            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },

        easeOutCirc: function ( t, b, c, d) {
            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },

        easeInOutCirc: function ( t, b, c, d) {
            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        },

        easeInElastic: function ( t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t===0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*0.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },

        easeOutElastic: function ( t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t===0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*0.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        },

        easeInOutElastic: function ( t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t===0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(0.3*1.5);
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            if (t < 1) return -0.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
        },

        easeInBack: function ( t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },

        easeOutBack: function ( t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },

        easeInOutBack: function ( t, b, c, d, s) {
            if (s == undefined) s = 1.70158; 
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },

        easeInBounce: function ( t, b, c, d) {
            return c - Tween['easeOutBounce']( d-t, 0, c, d) + b;
        },

        easeOutBounce: function ( t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
            }
        },

        easeInOutBounce: function ( t, b, c, d) {
            if (t < d/2) return Tween['easeInBounce']( t*2, 0, c, d) * 0.5 + b;
            return Tween['easeOutBounce']( t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
        }
        */
    };

    // 动画行进中
    var _Tweening = function() {
        // 动画进行时的回调
        customEvent(this.onTweening, this);

        if (this.current >= this.frames) {
            this.stop();
            customEvent(this.onComplete, this);
            this.tweening = false;
            return;
        }

        this.current++;
    };

    /**
     * 自定义事件
     * 
     * @params {Function} 事件回调
     * @params {Object} 作用域
     */
    var customEvent = function(func, scope) {
        var args = Array.prototype.slice.call(arguments);
            args = args.slice(2);
        if (typeof func == 'function') {
            try {
                return func.apply(scope || this, args);
            } catch (e) {
                scope.errors = scope.errors || [];
                scope.errors.push(e);
            }
        }
    };

    /**
     * 动画组件
     *
     * @params {String} 动画类型（方程式）
     * @params {Number} 过程动画时间
     */
    scope.Motion = function(tween, duration) {
        this.duration = duration || 1000;
        this.tween = tween || 'linear';
    };

    // 返回动画公式
    scope.Motion.getTweens = function(){return Tween};

    // 原型继承
    scope.Motion.prototype = {
        // 初始化
        init: function() {
            customEvent(this.onInit, this);

            // 默认 35 FPS
            this.fps = this.fps || 35;

            // 计算帧数
            this.frames = Math.ceil((this.duration/1000)*this.fps);
            if (this.frames < 1) this.frames = 1;

            // 确定动画函数，便于计算当前位置
            var f = ('function' == typeof this.tween) ? this.tween : Tween[this.tween] || Tween['linear'];
            this.equation = function(from, to) {
                return f((this.current/this.frames)*this.duration, from, to - from, this.duration);
            };
            this.current = this.tweening = 1;
        },

        //  开始动画
        start: function() {
            this.init();
            customEvent(this.onStart, this);
            var _self = this, d = this.duration / this.frames;
            this.timer = setInterval(function() {_Tweening.call(_self);}, d);
        },

        // 停止动画
        stop: function() {
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.tweening = false;
        }
    };
})(window);