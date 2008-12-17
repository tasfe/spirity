// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * simpleResize.js
 *
 * @author mingcheng@taobao.com
 * @date   2008-12-17
 */
/**
 * 拖动改变指定元素的高宽
 *
 */
TB.widget.simpleResize = new function() {
    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event;
    var container, trigger, handle = {}, config = {
        max: [300, 300], // 最大高宽
        min: [100, 100]  // 最小高宽
    };

    var reSetTrigger = function (container, trigger) {
        var container = Dom.get(container);
        var cr = Dom.getRegion(container);
        Dom.setXY(trigger, [cr.right - trigger.offsetWidth, cr.bottom - trigger.offsetHeight]);
    };

    var startdrag = function(e) {
        Event.on(document, 'mousemove', dragging);
        Event.on(document, 'mouseup', enddrag);
        Event.stopEvent(e);
    };

    var dragging = function(e) {
        e = Event.getEvent();
        var xy = Dom.getXY(container);
        var offset = Event.getXY(e);
        var newWidth  = offset[0] - xy[0] + trigger.offsetWidth/2,
            newHeight = offset[1] - xy[1] + trigger.offsetHeight/2;
            resizeTo(container, [newWidth, newHeight]);
        Event.stopEvent(e);
    };

    var enddrag = function(e) {
        Event.removeListener(document, 'mousemove', dragging);
        Event.removeListener(document, 'mouseup', enddrag);
        Event.stopEvent(e);
    };

    var resizeTo = function(el, dimension) {
        var width  = dimension[0] > config.max[0] ? config.max[0] : dimension[0];
            width  = width < config.min[0] ? config.min[0] : width;
        var height = dimension[1] > config.max[1] ? config.max[1] : dimension[1];
            height = height < config.min[1] ? config.min[1] : height;
        Dom.setStyle(el, 'width',  width+'px');
        Dom.setStyle(el, 'height', height+'px');
        reSetTrigger(container, trigger);
    };

    handle.resizeTo = function(dimension) {
        resizeTo(container, dimension);
    };

    this.attach = function(c, t, defConfig) {
        container = Dom.get(c), trigger = Dom.get(t);
        config = TB.applyIf(defConfig||{}, config);
        reSetTrigger(container, trigger);
        Event.on(trigger, 'mousedown', startdrag);

        return handle;
    };
};
