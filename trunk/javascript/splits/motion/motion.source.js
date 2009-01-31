// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * 视觉动画组件
 *
 * @author mingcheng<i.feelinglucky@gmail.com>
 * @date   2009-01-26
 * @link   http://www.gracecode.com/
 * @change
 *
 *  2009-01-27
 *      调整接口，优化代码
 *
 *  2009-01-26
 *      最初版，完成基本功能
 *      @ TODO 代码需要优化，重新考虑接口实现
 */
(function(scope) {
    /**
     * Easing Equations
     *
     * @see http://www.robertpenner.com/profmx
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
            if (t == 0) { 
                return b; 
            }
            if ( (t /= d) == 1 ) {
                return b+c; 
            }
            if (!p) {
                p=d*.3; 
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
            if (t == 0) {
                return b;
            }
            if ( (t /= d) == 1 ) {
                return b+c;
            }
            if (!p) {
                p=d*.3;
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
            if (t == 0) {
                return b;
            }
            if ( (t /= d/2) == 2 ) {
                return b+c;
            }
            if (!p) {
                p = d*(.3*1.5);
            }
            if ( !a || a < Math.abs(c) ) {
                a = c; 
                var s = p/4;
            }
            else {
                var s = p/(2*Math.PI) * Math.asin (c/a);
            }
            if (t < 1) {
                return -.5*(a*Math.pow(2,10*(t-=1)) * 
                        Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            }
            return a*Math.pow(2,-10*(t-=1)) * 
                    Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
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
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            }
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        },
        
        bounceBoth: function (t, b, c, d) {
            if (t < d/2) {
                return Tween['bounceIn'](t*2, 0, c, d) * .5 + b;
            }
            return Tween['bounceOut'](t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    };


    var _Tweening = function() {
        if (this.tweening) { return; }
        var _self = this, f = arguments.callee;

        if ('function' == typeof this.onTweening) {
            this.onTweening.call(this);
        }

        if (this.current < this.frames) {
            this.timer = setTimeout(function() {f.call(_self);}, this.duration/this.frames);
        } else {
            this.tweening = false;
            if ('function' == typeof this.onComplete) {
                this.onComplete.call(this);
            }
        }
        this.current++;
    }

    /**
     * @param Int duration 过程动画时间
     * @param String tween 动画类型
     */
    scope.Motion = function(duration, tween) {
        this.duration = duration || 1000;
        this.tween = tween || 'linear';
    };

    var proto = scope.Motion.prototype;
    proto.init = function() {
        if ('function' == typeof this.onInit) {
            this.onInit.call(this);
        }
        this.fps = this.fps || 35;
        this.frames = Math.ceil((this.duration/1000)*this.fps);
        if (this.frames < 1) {
            this.frames = 1
        };
        if ('function' != typeof Tween[this.tween]) {
            this.tween = 'linear';
        }
        var f = Tween[this.tween];
        this.equation = function(from, to) {
            return f((this.current/this.frames)*this.duration, from, to - from, this.duration);
        }
        this.current = 1;
    };

    proto.start = function() {
        this.init();
        if ('function' == typeof this.onStart) {
            this.onStart.call(this);
        }
        _Tweening.call(this);
    };

    proto.stop = function() {
        clearTimeout(this.timer);
        this.tweening = false;
    };
})(window);