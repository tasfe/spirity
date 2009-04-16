// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8 nobomb:
/**
 * 看图购 AIR 版
 *
 * @author mingcheng@taobao.com
 * @date   2009-04-16
 * @link   http://www.gracecode.com/
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
        var end = parseInt((page-1) * this.config.perPage + this.config.perPage, 10);

        var reqUri = this.config.api + '&ps_b=' + begin + '&pe_e=' + end + '&var=Imgo2';

        window.runtime ? runtime.trace(reqUri) : console.info(reqUri);

        YAHOO.util.Connect.asyncRequest('get', reqUri, {
            success: function(o) {
                var data = YAHOO.lang.JSON.parse(o.responseText.replace('Imgo2={', '{'));

                // 如没有初始化，则初始化
                if (!this.inited) {
                    this.totalItem = data.total;
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
                _callback(this.config.onLoadComplete, _self, data);

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
        this.flush(); // 重新初始化
    };

    YAHOO.ImgoSmall.prototype = (function() {


        return {
            flush: function(key) {
                _callback(this.config.onFlush, this);
                this.container.innerHTML = '';
                this.inited = false;
                this.loaded = [];
                this.totalPage = 1;
                this.key = key; // encode urix
                this.switchGroup(1);
            },

            switchGroup: function(page) {
                if (page < 1 || page > this.totalPage || this._scrolling) {
                    return;
                }

                // 如果未载入该页面数据
                if ('undefined' == typeof this.loaded[page]) {
                    _fetchData.call(this, page);
                    return;
                }

                // 标记当前页
                this.currentPage = page;


            },

            nextGroup: function() {


            },

            prevGroup: function() {

            }
        };
    })();
})();