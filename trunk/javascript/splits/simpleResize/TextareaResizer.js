/**
 * TextareaResizer.js
 *
 * @author mingcheng@taobao.com
 * @date   2008-12-17
 *
 * @update
 *      2009-1-2  更新程序逻辑
 */
(function(){
    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event;

    var defConfig = {
        max: [300, 300], // 最大高宽
        min: [100, 100]  // 最小高宽
    };

    var startDrag = function(e) {
        Event.on(document, 'mousemove', Dragging, this, true);
        Event.on(document, 'mouseup', endDrag, this, true);
        Event.stopEvent(e);
    };

    var Dragging = function(e) {
        var xy = Dom.getXY(this.container);
        var offset = Event.getXY(Event.getEvent());
        var width  = offset[0] - xy[0] + this.trigger.offsetWidth/2,
            height = offset[1] - xy[1] + this.trigger.offsetHeight/2;
        this.resizeTo(width, height);
        Event.stopEvent(e);
    };

    var endDrag = function(e) {
        Event.removeListener(document, 'mousemove', Dragging);
        Event.removeListener(document, 'mouseup', endDrag);
    };

    TB.widget.TextareaResizer = function(container, trigger, config) {
        this.container = Dom.get(container);
        this.trigger   = Dom.get(trigger);
        this.config    = YAHOO.lang.merge(defConfig||{}, config);
        this.resetTrigger();
        Event.on(this.trigger, 'mousedown', startDrag, this, true);
    };

    var prototype = TB.widget.TextareaResizer.prototype;

    /**
     *
     */
    prototype.resetTrigger = function () {
        var region = Dom.getRegion(this.container);
        Dom.setXY(this.trigger, [region.right - this.trigger.offsetWidth, 
                                        region.bottom - this.trigger.offsetHeight]);
    };

    /**
     *
     */
    prototype.resizeTo = function(width, height) {
        var width  = Math.min(width,  this.config.max[0]);
            width  = Math.max(width,  this.config.min[0]);
        var height = Math.min(height, this.config.max[1]);
            height = Math.max(height, this.config.min[1]);

        Dom.setStyle(this.container, 'width',  width+'px');
        Dom.setStyle(this.container, 'height', height+'px');
        this.resetTrigger(this.container, this.trigger);
        if (typeof this.config.onScroll == 'function') {
            this.config.onScroll.call(this);
        }
    };
})();

// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=gbk
