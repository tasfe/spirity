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
        //console.info(this);
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
        Dom.get('J_prev', 'visibility', 'hidden');
    },

    onLastPage: function() {
        Dom.get('J_next', 'visibility', 'hidden');
    },

    onGroupChange: function() {
        Dom.get('J_result').getElementsByTagName('em')[1].innerHTML = this.currentPage;
        Dom.get(['J_prev', 'J_next'], 'visibility', 'visible');
    },

    onLoadComplete: function(data) {
        //console.dir(data);
        var group = document.createElement('ul');
        for (var c, i = 0; i < this.config.perPage; i++) {
            if ('undefined' != typeof data.data[i]) {
                var li = document.createElement('li'); c = data.data[i];
                li.innerHTML = '<a title="' + c.title  + '" href="#"><img src="' + c.smallThumbnailsTfs + '" /></a>';
                group.appendChild(li);
            }
        }
        this.container.appendChild(group);
        Dom.setStyle('loading', 'visibility', 'hidden');
    }
});

Event.on('J_next', 'click', function(e) { this.nextGroup(); Event.stopEvent(e); }, small, true);
Event.on('J_prev', 'click', function(e) { this.prevGroup(); Event.stopEvent(e); }, small, true);

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
        direct == -1 ? this.nextGroup() : this.prevGroup();
    }, direct, false);
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
