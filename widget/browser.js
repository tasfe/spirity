

/**
 * 浏览器属性
 */
Spirity.browser = {
    ua: {},

    /**
     * 添加到收藏夹
     *
     */
    addBookmark: function(title, url) {
        if (window.sidebar) {
            window.sidebar.addPanel(title, url, "");
        } else if(document.external) {
            window.external.AddFavorite(url, title);
        } else {
            /* TODO */
        }
    }
}
