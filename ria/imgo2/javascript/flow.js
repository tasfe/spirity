// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8 nobomb:
/**
 * 看图购 AIR 版 - 流程调用
 *
 * @author mingcheng@taobao.com
 * @date   2009-04-16
 * @link   http://www.gracecode.com/
 */
var small = new YAHOO.ImgoSmall('J_smallAlbum', {
    api: Dom.get('J_searchForm').action,
    onFlush: function() {
        Dom.setStyle('J_warp', 'overflow', 'hidden');
        Dom.setStyle('J_notMatch', 'visibility', 'hidden');
        Dom.setStyle(['loading', 'J_result', 'J_prev', 'J_next'], 'visibility', 'hidden');
    },

    onBeforeLoad: function() {
        Dom.setStyle('loading', 'visibility', 'visible');
    },

    onInit: function() {
        Dom.setStyle('J_result', 'visibility', 'visible');
        Dom.get('J_result').getElementsByTagName('em')[0].innerHTML = this.totalItem;
        Dom.get('J_result').getElementsByTagName('em')[2].innerHTML = this.totalPage;
    },

    onFirstPage: function() {
        Dom.addClass('J_prev', 'disabled');
    },

    onLastPage: function() {
        Dom.addClass('J_next', 'disabled');
    },

    onFirstItem: function() {
        Dom.addClass('J_prev', 'disabled');
    },

    onLastItem: function() {
        Dom.addClass('J_next', 'disabled');
    },

    onItemChange: function(item) {
        Dom.setStyle(['J_prev', 'J_next'], 'visibility', 'visible');
        Dom.removeClass(['J_prev', 'J_next'], 'disabled');
        item = Dom.get(item);
        var img = item.getElementsByTagName('img')[0];
        if (!img.src) img.src = img.getAttribute('org');
        this.currentPage = parseInt(this.currentItem.id.match(/big:(\d+):/)[1], 10);
        Dom.get('J_result').getElementsByTagName('em')[1].innerHTML = this.currentPage;
        Dom.removeClass('J_switchMode', 'mode-big');
    },

    onNotMatch: function() {
        Dom.get('k_title').value = '';
        Dom.get('k_title').focus();
        this.flush('', false);
        Dom.setStyle('J_notMatch', 'visibility', 'visible');
    },

    onGroupChange: function() {
        Dom.get('J_result').getElementsByTagName('em')[1].innerHTML = this.currentPage;
        Dom.setStyle(['J_prev', 'J_next'], 'visibility', 'visible');
        Dom.removeClass(['J_prev', 'J_next'], 'disabled');
        Dom.get('k_title').blur();
        Dom.addClass('J_switchMode', 'mode-big');
    },

    onLoadComplete: function(data, page) {
        for(var k = 0; k < this.cache; k++) {
            var page = page + k;
            if (!Dom.get('page:' + page)) {
                var group = document.createElement('ul');
                group.id = 'page:' + page;
                this.loaded[page] = true;

                for (var c, j = 0, i = 0 + (k * this.config.perPage), len = this.config.perPage + (k * this.config.perPage); i < len; i++, j++) {
                    if ('undefined' != typeof data.data[i]) {
                        c = data.data[i];
                        var li = document.createElement('li');
                        li.id = 'small:' + page + ':' + j;
                        li.innerHTML = ['<a title="' + c.title  + '" href="',
                        'http://item.taobao.com/auction/item_detail-' + c.xid + '-'+ c.id + '.jhtml',
                        '"><img src="' + c.smallThumbnailsTfs + '" /></a>'].join('');
                        group.appendChild(li);

                        var bigLi = document.createElement('li');
                        bigLi.id = 'big:' + page + ':' + j;
                        bigLi.innerHTML = [
                            '<span class="pic">',
                            '    <a href="http://item.taobao.com/auction/item_detail-' + c.xid + '-' + c.id + '.jhtml">',
                            '<img org="' + c.bigThumbnailTfs + '" /></a>',
                            '</span>',
                            '<span class="info">',
                            '   <span class="seller">共<strong>' + c.similarNum + '</strong>位卖家</span>',
                            '   <span class="price"><strong>' + c.reservePrice + '</strong>元</span>',
                            '   <span class="buy"><a target="_blank" href="http://item.taobao.com/auction/item_detail-' + 
                                c.xid + '-' + c.id + '.jhtml">我要购买</a></span></span>'
                        ].join('');
                        this.bigItems.appendChild(bigLi);
                    }
                }
                this.container.appendChild(group);
            }
        }

        Dom.setStyle('loading', 'visibility', 'hidden');
    }
});

Event.on('J_next', 'click', function(e) {
    this[this.mode == 'small' ? 'nextGroup' : 'nextItem']();
    Event.stopEvent(e);
}, small, true);

Event.on('J_prev', 'click', function(e) {
    this[this.mode == 'small' ? 'prevGroup' : 'prevItem']();
    Event.stopEvent(e);
}, small, true);

Event.on('J_switchMode', 'click', function(e) {
    Event.stopEvent(e);
    var target = Event.getTarget(e);
    if ('small' == this.mode) {
        var big = Dom.get('big:' + this.currentPage + ':0');
        if (big) {
            this.switchItem(big);
        }
    } else {
        Dom.get('J_warp').scrollTop  = 0;
        Dom.get('J_warp').scrollLeft = 483 * (this.currentPage - 1);
        this.switchGroup(this.currentPage);
    }
}, small, true);

Event.on(document, 'DOMMouseScroll', function(e){
    if (this._scrolling) {
        return;
    }

    var e = Event.getEvent(e);
    Event.stopEvent(e);

    var direct = 0;
    if (e.wheelDelta) {
       direct = e.wheelDelta > 0 ? 1 : -1;
    } else if (e.detail) {
       direct = e.detail < 0 ? 1 : -1;
    }

    if (this._timer) {
        this._timer.cancel();
    }

    this._timer = YAHOO.lang.later(50, this, function() {
        direct == -1 ? this[this.mode == 'small' ? 'nextGroup' : 'nextItem']() : 
            this[this.mode == 'small' ? 'prevGroup' : 'prevItem']();
    }, direct, false);
}, small, true);

Event.on(document, 'keydown', function(e){
     // http://www.quirksmode.org/js/keys.html
     var charcode = Event.getCharCode(e);
     var target = Event.getTarget(e);
     var type = target.tagName.toLowerCase();
     if (type == 'input' || type == 'textarea') {
         return;
     }
     if (this._timer) {
        this._timer.cancel();
     }
     this._timer = YAHOO.lang.later(100, this, function() {
        //console.info(charcode);
        switch(charcode) {
            case 39: case 74: case 32:
                this[this.mode == 'small' ? 'nextGroup' : 'nextItem']();
                break;
            case 37: case 75:
                this[this.mode == 'small' ? 'prevGroup' : 'prevItem']();
                break;
            case 71: case 117: // g
                Dom.get('k_title').value = '';
                Dom.get('k_title').focus();
                this.flush('', false);
                break;
            case 81:
                if (window.nativeWindow)
                    window.nativeWindow.close();
                break;

            case 38: case 72:
                if ('small' == this.mode) {
                    var big = Dom.get('big:' + this.currentPage + ':0');
                    if (big) {
                        this.switchItem(big);
                    }
                }
                break;

            case 40: case 76:
                if ('big' == this.mode) {
                    Dom.get('J_warp').scrollTop  = 0;
                    Dom.get('J_warp').scrollLeft = 483 * (this.currentPage - 1);
                    this.switchGroup(this.currentPage);
                }
                break;
        }
     }, charcode, false);
     if (charcode == 32) {
        Event.stopEvent(e);
     }
}, small, true);

Event.on('J_searchForm', 'submit', function(e) {
    Event.stopEvent(e);
                    
    var title = Dom.get('k_title');
    if (title && !title.value.replace(/(^\s*)|(\s*$)/g, "").length) {
         title.value = '';
         title.focus();
         return false;
    }

    this.flush(title.value, true);
}, small, true);

Event.on('J_smallAlbum', 'click', function(e) {
    Event.stopEvent(e);
    var target = Event.getTarget(e);
    if ('img' == target.nodeName.toLowerCase()) {
        target = Dom.getAncestorByTagName(target, 'li');
        this.switchItem(target.id.replace('small:', 'big:'));
    }
}, small, true);

(function() {
    // 打开系统浏览器窗口
    var openUriInSystemWebBrowser = function(url) {
        var urlReq = new air.URLRequest(url); 
        air.navigateToURL(urlReq);
    }

    Event.on('J_bigAlbum', 'click', function(e) {
        Event.stopEvent(e);
        var target = Event.getTarget(e);
        var nodeName = target.nodeName.toLowerCase();
        if (nodeName == 'a' || nodeName == 'img') {
            if (nodeName == 'img') {
                target = Dom.getAncestorByTagName(target, 'a');
            }

            if (air) {
                openUriInSystemWebBrowser(target.href);
            }
        }
    }, small, true);

    Dom.get('k_title').focus();
})();
