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
    }
});
