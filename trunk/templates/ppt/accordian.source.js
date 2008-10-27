// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Accordian.source.js
 *
 * @author feelinglucky@gmail.com
 * @date   2008-10-18
 * @link   http://www.gracecode.com/
 */
function Accordian(el, config) {
    /**
     * 默认配置
     */
    var _config = {
        "effect" : "random",
        "repeat" : false, // 重新回滚到首页？
        "status" : true,
        "jumpTo" : 1
    };

    '<div class="pager"></div>';

    config = config || _config;

    var _pagers       = $(el).getElements('div.section');
    var _current_page = 0;               // 默认跳到第一条连接
    var _total_page   = _pagers.length;  // 获取总页面数
    _pagers.setStyle('display', 'none'); // 隐藏所有页面

    if (config.status) {
        var _status = document.createElement('div');
        _status.className = _status.id = "pager";
        _status.innerHTML  = '<a class="back" title="上一页" id="back" href="#">上一页</a>';
        _status.innerHTML += '<span class="status" id="status"></span>';
        _status.innerHTML += '<a class="next" title="下一页" id="next" href="#">下一页</a>';
        document.body.appendChild(_status);
        _status = $('status');

        var _setStatus = function() {
            var str = (_current_page + 1) + "/" + _total_page;
            _status.innerHTML =  str;
        }
    }

    // 显示某元素
    var _show = function(el) {
        if (config.status) {
            _setStatus();
        }

        el.setStyle('display', '');
        /*
        var myFx = new Fx.Morph(el, {duration: 'long', transition: Fx.Transitions.Cubic.easeOut});
        //console.info(el.getSize());
        */
        /*
        var myFx = new Fx.Morph(el, {duration: '5000', transition: Fx.Transitions.Cubic.easeOut});
        myFx.start({'opacity': [100, 0]});
        */
    }

    // 隐藏特定元素
    var _hide = function(el) {
        /*
        var myFx = new Fx.Morph(el, {duration: 'long', transition: Fx.Transitions.Cubic.easeOut});
        //console.info(el.getSize());
        myFx.start({'left': [0, el.getSize()['x']]});
        */
        el.setStyle('display', 'none');
    }


    var handle = {
        /**
         * 跳转到下一页
         */
        next: function(e) {
            
            if (_current_page >= _total_page - 1) {
                if (config.repeat) {
                    this.jump(0);
                }
                return;
            }

            _hide(_pagers[_current_page]);
            if (_pagers[++_current_page]) {
                _show(_pagers[_current_page]);
            }
        },

        /**
         * 跳转到上一页
         */
        back: function(e) {
            if (_current_page <= 0) {
                _current_page = 0;
                return;
            }

            _hide(_pagers[_current_page]);
            if (_pagers[--_current_page]) {
                _show(_pagers[_current_page]);
            }
        },

        /**
         * 跳转到指定页
         */
        jump: function(page) {
            _hide(_pagers[_current_page]); // 隐藏当前页

            _current_page = page;
            if (_pagers[_current_page]) {
                _show(_pagers[_current_page]);
            }
        }
    };


    /**
     * 注册事件
     */

    if (config.status) {
        $('next').addEvent('click', handle.next);
        $('back').addEvent('click', handle.back);
    }

    document.addEvent('keypress', function(e) {
        switch(e.key) {
            case 'space': case 'right': case 'j':
                handle.next();
                break;

            case 'backspace': case 'left': case 'k':
                handle.back();
                break;
        }
        e.stop();
    });

    // 默认跳转到 N 页
    handle.jump((config.jumpTo || 0) - 1);
    return handle;
}
