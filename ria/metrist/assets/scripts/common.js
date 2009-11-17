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

/**
 * 返回相对时间
 */
function relative_time(time_value) {
    var values = time_value.split(" ");
    time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
    var parsed_date = Date.parse(time_value);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
    var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
    delta = delta + (relative_to.getTimezoneOffset() * 60);

    var r = '';
    if (delta < 60) {
        r = 'a minute ago';
    } else if(delta < 120) {
        r = 'couple of minutes ago';
    } else if(delta < (45*60)) {
        r = (parseInt(delta / 60)).toString() + ' minutes ago';
    } else if(delta < (90*60)) {
        r = 'an hour ago';
    } else if(delta < (24*60*60)) {
        r = '' + (parseInt(delta / 3600)).toString() + ' hours ago';
    } else if(delta < (48*60*60)) {
        r = '1 day ago';
    } else {
        r = (parseInt(delta / 86400)).toString() + ' days ago';
    }

    return r;
}
