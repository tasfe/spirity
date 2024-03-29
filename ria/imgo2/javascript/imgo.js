// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8 nobomb:
/**
 * 看图购 AIR 版
 *
 * @author mingcheng@taobao.com
 * @date   2009-04-16
 * @link   http://www.gracecode.com/
 * @change
 *     [+]new feature  [*]improvement  [!]change  [x]bug fix
 *
 * [+] 2009-04-17
 *      完成大图逻辑 @TODO 优化代码，加入大小图切换、缓存机制
 *
 * [+] 2009-04-16
 *      完成小图逻辑 @TODO 代码需要分离
 */

(function() {
    // 自定义事件
    var _callback = function(func, scope) {
        var args = Array.prototype.slice.call(arguments);
            args = args.slice(2);
        if (typeof func == 'function') {
            try {
                return func.apply(scope || this, args);
            } catch (e) {
                return false;
            }
        }
    };

    // 远程获取数据
    var _fetchData = function(page) {
        var _self = this;

        if ('undefined' != typeof this.loaded[page] || this._scrolling || this.loading) {
            return;
        }
        this.loading = true;

        // 分段获取逻辑
        var begin = parseInt((page-1) * this.config.perPage, 10);
        var end = parseInt((page-1) * this.config.perPage + this.cache * this.config.perPage, 10);

        var reqUri = this.config.api + this.key + '&s=' + begin + '&n=' + end + '&var=Imgo2';

        runtime.trace(reqUri);

        _callback(this.config.onBeforeLoad, _self);

        YAHOO.util.Connect.asyncRequest('get', reqUri, {
            success: function(o) {
                var data = YAHOO.lang.JSON.parse(o.responseText.replace('Imgo2={', '{'));

                // 如没有初始化，则初始化
                if (!this.inited) {
                    this.totalItem = data.total;

                    if (this.totalItem <= 0) {
                        _callback(this.config.onNotMatch, this);
                        return;
                    }

                    if (this.config.limit && this.config.limit < this.totalItem) {
                        this.totalItem = this.config.limit;
                    }

                    this.totalPage = Math.ceil(this.totalItem / this.config.perPage);
                    _callback(this.config.onInit, this);
                }

                this.loading = false;
                this.inited = true;
                this.loaded[page] = true;

                // 数据载入成功后的回调
                _callback(this.config.onLoadComplete, _self, data, page);

                // 准备就绪，重新跳回指定的页
                this.switchGroup(page);
            }, 
            failure: function(o) {
                alert('数据获取失败 :^(');
            },
            scope: _self
        });
    };

    var defConfig = {
             api: '',    // 接口地址
           limit: 5000,  // 限制条数
         perPage: 30     // 每页显示
    };

    YAHOO.ImgoSmall = function(container, config) {
        this.config = YAHOO.lang.merge(defConfig||{}, config);
        this.container = Dom.get(container);
        this.bigItems = Dom.get('J_bigAlbum');
        this.cache = this.config.cache || 2;
        this.flush('', false); // 重新初始化
    };

    YAHOO.ImgoSmall.prototype = {
        flush: function(key, start) {
            _callback(this.config.onFlush, this);
            this.container.innerHTML = '';
            this.bigItems.innerHTML = '';
            this.inited = false;
            this.loading = false;
            this.loaded = [];
            this.totalPage = 1;
            this.key = encodeURIComponent(key || ''); // encode uri
            this.mode = 'small';
            if (this.anim)
            this.anim.stop();

            start = ('undefined' == typeof start) ? true : start;
            if (start) {
                this.switchGroup(1);
            }
        },

        switchGroup: function(page) {
            if (page < 1 || page > this.totalPage || this._scrolling) {
                return;
            }

            // 如果未载入该页面数据
            if ('undefined' == typeof this.loaded[page]) {
                _fetchData.call(this, page || 1);
                return;
            }

            // 标记当前页
            this.currentPage = page;

            /*
            var offset = (this.container.getElementsByTagName('ul')[this.currentPage-1]).offsetLeft + 5;
            */
            var offset = 483 * (this.currentPage - 1);
            
            if (this.mode != 'small') {
                Dom.get('J_warp').scrollTop = 560;
            }

            if (this.anim) this.anim.stop();
            this.anim = new YAHOO.util.Scroll('J_warp', {
                scroll: {
                    to: [offset, 560]
                }
            }, 0.5, YAHOO.util.Easing[this.mode == 'small' ? 'easeBoth' : 'bounceOut']);
            this.anim.onComplete.subscribe(function() {
                this._scrolling = false;
                _callback(this.config.onGroupChange, this);
                if (this.currentPage == 1) {
                    _callback(this.config.onFirstPage, this);
                }
                if (this.currentPage == this.totalPage) {
                    _callback(this.config.onLastPage, this);
                }
            }, this, true);
            this._scrolling = true;
            this.mode = 'small';
            this.anim.animate();
        },

        switchItem: function(item) {
            item = Dom.get(item);
            if (!item) return;
            //var offset = 483 * (this.currentPage - 1);
            if (this.anim) this.anim.stop();
            var offset =  item.offsetLeft || (this.currentItem || {}).offsetLeft
            if (this.mode != 'big') {
                Dom.get('J_warp').scrollLeft = offset;
            }
            this.currentItem = item;
            this.anim = new YAHOO.util.Scroll('J_warp', {
                scroll: {
                    to: [offset, 0]
                }
            }, 0.5, YAHOO.util.Easing[this.mode == 'big' ? 'easeBoth' : 'bounceOut']);
            this.anim.onComplete.subscribe(function() {
                this._scrolling = false;
                _callback(this.config.onItemChange, this, item);

                if (!Dom.getNextSibling(item)) {
                    _callback(this.config.onLastItem, this);
                }
                if (!Dom.getPreviousSibling(item)) {
                    _callback(this.config.onFirstItem, this);
                }
            }, this, true);
            this._scrolling = true;
            this.mode = 'big';
            this.anim.animate();
        },

        nextItem: function(item) {
            item = item || this.currentItem;
            if (!item) item = 'big:' + this.currentPage + ':0';
            var next = Dom.getNextSibling(item);
            if (next) {
                this.switchItem(next);
            }
        },

        prevItem: function(item) {
            item = item || this.currentItem;
            if (!item) item = 'big:' + this.currentPage + ':0';
            var prev = Dom.getPreviousSibling(item);
            if (prev) {
                this.switchItem(prev);
            }
        },

        nextGroup: function() {
            var page = this.currentPage + 1;
            if (page > this.totalPage) {
                page = this.totalPage;
            }
            this.switchGroup(page);
        },

        prevGroup: function() {
            var page = this.currentPage - 1;
            if (page < 1) {
                page = 1;
            }
            this.switchGroup(page);
        }
    };
})();
