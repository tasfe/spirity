// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8 nobomb:
/**
 * Twitter Client Library
 *
 * @author mingcheng<i.feelinglucky@gmail.com>
 * @date   2009-11-14
 * @link   http://www.gracecode.com/
 */


Twitter = (function() {
    var config = {
        api: "http://twitter.com",
        username: "",
        password: "",
        count: 5,
        timeout: 5000
    };

    var sendRequest = function (request, callback) {
        var params = []; request.params = request.params || {};
        for(name in request.params) {
            params.push(name + '=' + encodeURIComponent(request.params[name]));
        }

        console.warn('params: ' + params.join('&'));
        console.warn(request.url);
        console.warn(request.type || "GET");

        //
        var request = YAHOO.util.Connect.asyncRequest(request.type || "GET", request.url, {
            success: callback.onSuccess || function () {},
            failure: callback.onError || function() {},
            timeout: config.timeout,
            cache: false
        }, params.join('&'), config.username, config.password);
    };

    var getFriendsTimeline = function(callback) {
        sendRequest({
            url: config.api + '/statuses/friends_timeline.json?count=' + config.count
        }, callback);
    };

    var sendDirectMessage = function(user, tweets, callback) {
        sendRequest({
            type: "POST", url: config.api + '/direct_messages/new.json',
            params: {
                'user': user,
                'text': tweets
            }
        }, callback);
    };

    var getDirectMessages = function(callback) {
        sendRequest({
            url: config.api + '/direct_messages.json?count=' + config.count
        }, callback);
    };

    var getUserTimeline = function(user, callback) {
        user = user || '';
        sendRequest({
            url: config.api + '/statuses/user_timeline' + (user ? '' : ('/' + user)) + '.json?count=' + config.count
        }, callback);
    };

    var getReplies = function (callback) {
        sendRequest({
            url: config.api + '/statuses/replies.json?count=' + config.count
        }, callback);
    };

    var login = function (callback) {
        sendRequest({
            url: config.api + '/account/verify_credentials.json?t=' + (+new Date())
        }, callback);
    };

    var update = function (tweets, callback) {
        sendRequest({
            type: "POST", url: config.api + '/statuses/update.json',
            params: {
                'status': tweets,
                't': +new Date
            }
        }, callback);
    };

    return {
        login: login,
        update: update,
        getReplies: getReplies,
        getDirectMessages: getDirectMessages,
        getFriendsTimeline: getFriendsTimeline,
        getUserTimeline: getUserTimeline,
        sendDirectMessage: sendDirectMessage,
        setConfig: function(user_config) {
            YAHOO.lang.augmentObject(config, user_config, true);
        }
    };
})();
