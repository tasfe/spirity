/**
 * 考验眼力和反应能力的小游戏
 *
 * @author i.feelinglucky@gmail.com
 * @date   2009-01-21
 * @link   http://www.gracecode.com/
 *
 * @change  2009-01-22
 *      增加 3 次出错机会，增加 this.score 属性
 * @change  2009-01-21
 *      完成基本逻辑 @TODO 代码需要优化
 */
(function(_scope) {
    var defConfig = {group: 10, step: 1.25, life: 3};
    var arrow = ['up', 'down', 'left', 'right'];
    var keyCode = {'38': 'up', '40':'down', '37': 'left', '39': 'right'};

    _scope.Dazing = function(container, config) {
        this.container = container;
        this.config = config || defConfig;
        this.init();
    };

    var proto = _scope.Dazing.prototype;

    proto.init = function() {
        this.container.innerHTML = '';
        this.score = this.current = this.life = 0;
        this.step = this.config.step || 1.25;
        this.container.style.overflow = 'hidden';
        this.container.style.paddingLeft = this.container.clientWidth + 'px';
        var _self = this;
        document.onkeydown = function(e) {
            e = e || window.event;
            var className = keyCode[e.keyCode];
            if (className) { _self.judge(className); }
        };
    };

    proto.build = function() {
        for (var i = 0; i < this.config.group*2; i++) {
            var node = document.createElement('li');
            node.className = arrow[Math.round((Math.random()*100))%4];
            node.innerHTML = '<span>' + node.className.toUpperCase() + '</span>';
            this.container.appendChild(node);
        };
    };

    proto.judge = function(className) {
        var node = this.container.childNodes[this.current], answerName = node.className;
        if (answerName == className) {
            node.className += ' done';
        } else {
            if (this.life < this.config.life) {
                node.style.visibility = 'hidden';
                this.life++;
            } else {
                this.stop();
                if ('function' == typeof this.config.onFinished) {
                    this.config.onFinished.call(this);
                }
                return;
            }
        }
        this.current++;
    };
    
    proto.scrolling = function() {
        var _self = this, f = arguments.callee;
        this.container.scrollLeft += (this.level + 1) * this.step;

        var node = this.container.childNodes[this.current];
        if (node && (this.container.scrollLeft > node.offsetLeft)) { 
            this.stop();
            if ('function' == typeof this.config.onFinished) {
                this.config.onFinished.call(this);
            }
            return;
        } else {
            this.level = Math.floor((this.current) / this.config.group);
            var needNodes = (this.level + 2) * this.config.group;
            if (needNodes >= this.container.childNodes.length) {
                this.build();
            };
            this.timer = setTimeout(function() {f.call(_self);}, 20);
        }
        this.score = this.current - this.life;

        if ('function' == typeof this.config.onScrolling) {
            this.config.onScrolling.call(this);
        }
    };

    proto.stop = function() {
        clearTimeout(this.timer); document.onkeydown = null; 
    };

    proto.start = function() {
        this.scrolling(); 
    };
})(window);
// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
