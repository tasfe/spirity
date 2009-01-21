/**
 * 考验眼力和反应能力的小游戏
 *
 * @author i.feelinglucky@gmail.com
 * @date   2009-01-21
 * @link   http://www.gracecode.com/
 */
(function(_scope) {
    var defConfig = {group: 10, level: 0};
    var arrow = ['up', 'down', 'left', 'right'];
    var keyCode = {'38': 'up', '40':'down', '37': 'left', '39': 'right'};

    _scope.Dazing = function(container, config) {
        this.container = document.getElementById(container);
        this.config = config || defConfig;
        this.score = this.current = 0, this.level = this.config.level || 0;
        this.init();
    };

    var proto = _scope.Dazing.prototype;

    proto.init = function() {
        this.container.innerHTML = '';
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
            var node  = document.createElement('li');
            var className = arrow[Math.round((Math.random()*100))%4];
            node.className = className;
            node.innerHTML = '<span>' + className.toUpperCase() + '</span>';
            this.container.appendChild(node);
        };
    };

    proto.judge = function(className) {
        var node = this.container.childNodes[this.current], answerName = node.className;
        if (answerName == className) {
            node.className += ' done';
            this.current++;
        } else {
            this.stop();
            document.onkeydown = null;
            alert(this.current);
        }
    };

    proto.start = function() {
        var _self = this, f = arguments.callee;
        this.container.scrollLeft += (this.level + 1) * 1.5;

        var node = this.container.childNodes[this.current];
        if (node && (this.container.scrollLeft > node.offsetLeft)) { 
            this.stop();
            document.onkeydown = null;       
            alert(this.current);
            return;
        } else {
            this.level = Math.floor((this.current) / this.config.group);
            var needNodes = (this.level + 2) * this.config.group;
            if (needNodes >= this.container.childNodes.length) {
                this.build();
            };
            this.timer = setTimeout(function() {f.call(_self);}, 20);
        }
    };

    proto.stop = function() { clearTimeout(this.timer); };
})(window);
// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
