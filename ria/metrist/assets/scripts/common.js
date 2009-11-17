// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8 nobomb:
/**
 * function
 *
 * @author mingcheng<i.feelinglucky#gmail.com>
 * @date   2009-11-15
 * @link   http://www.gracecode.com/
 */

/**
 * 使用内置存储作为记录器
 */
// /*
var logger = (function () {
    if (typeof localStorage == 'undefined') {
        return console;
    }

    var consoleData = JSON.parse(localStorage['console_data']) || [];
    var insert = function (message, type) {
        message = (new Date().toString()) + ":\n  " + message + '';
        consoleData.push({
            message: message, type: type
        });
        localStorage['console_data'] = JSON.stringify(consoleData);
    }

    return {
        log: function(message) {insert(message, 'log');},
        warn: function(message) {insert(message, 'warn');},
        info: function(message) {insert(message, 'info');},
        error: function(message) {insert(message, 'error');},
        clear: function() {
            localStorage['console_data'] = JSON.stringify([]);
        }
    };
})();

// 获取配置信息
var getConf = function(options, def) {
    return localStorage[options] ? localStorage[options] : def;
}

// 设置标签数字
var setBadgeText = function(text)  {
    if (chrome) {
        chrome.browserAction.setBadgeText({text: text + ''});
    }
}
