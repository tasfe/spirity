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
        Dom.setStyle('J_prev', 'visibility', 'hidden');
    },

    onLastPage: function() {
        Dom.setStyle('J_next', 'visibility', 'hidden');
    },

    onFirstItem: function() {
        Dom.setStyle('J_prev', 'visibility', 'hidden');
    },

    onLastItem: function() {
        Dom.setStyle('J_next', 'visibility', 'hidden');
    },

    onItemChange: function(item) {
        Dom.setStyle(['J_prev', 'J_next'], 'visibility', 'visible');
        item = Dom.get(item);
        var img = item.getElementsByTagName('img')[0];
        if (!img.src) img.src = img.getAttribute('org');
    },

    onNotMatch: function() {
        alert('抱歉，没有搜索结果 :-/');
        Dom.get('k_title').value = '';
        Dom.get('k_title').focus();
        this.flush('', false);
    },

    onGroupChange: function() {
        Dom.get('J_result').getElementsByTagName('em')[1].innerHTML = this.currentPage;
        Dom.setStyle(['J_prev', 'J_next'], 'visibility', 'visible');
        Dom.get('k_title').blur();
    },

    onLoadComplete: function(data, page) {
        var group = document.createElement('ul');
        for (var c, i = 0; i < this.config.perPage; i++) {
            if ('undefined' != typeof data.data[i]) {
                c = data.data[i];
                var li = document.createElement('li');
                li.id = 'small:' + page + ':' + i;
                li.innerHTML = ['<a title="' + c.title  + '" href="',
                'http://item.taobao.com/auction/item_detail-' + c.xid + '-'+ c.id + '.jhtml',
                '"><img src="' + c.smallThumbnailsTfs + '" /></a>'].join('');
                group.appendChild(li);

                var bigLi = document.createElement('li');
                bigLi.id = 'big:' + page + ':' + i;
                bigLi.innerHTML = [
                    '<span class="pic">',
                    '    <a href="http://item.taobao.com/auction/item_detail' + c.xid + '-' + c.id + '.jhtml">',
                    '<img org="' + c.bigThumbnailTfs + '" /></a>',
                    '</span>',
                    '<span class="info">',
                    '   <span class="seller"><a href="#">共<strong>' + c.similarNum + '</strong>位卖家</a></span>',
                    '   <span class="price"><strong>' + c.reservePrice + '</strong>元</span>',
                    '   <span class="buy"><a target="_blank" href="#">我要购买</a></span></span>'
                ].join('');
                this.bigItems.appendChild(bigLi);
            }
        }
        this.container.appendChild(group);
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
         console.info(charcode);
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

(function() {
    // 打开系统浏览器窗口
    var openUriInSystemWebBrowser = function(url) {
        var urlReq = new air.URLRequest(url); 
        air.navigateToURL(urlReq);
    }

    Event.on('J_smallAlbum', 'click', function(e) {
        Event.stopEvent(e);
        var target = Event.getTarget(e);
        if ('img' == target.nodeName.toLowerCase()) {
            target = Dom.getAncestorByTagName(target, 'li');
            this.switchItem(target.id.replace('small:', 'big:'));
        }
    }, small, true);

    Dom.get('k_title').focus();
})();
