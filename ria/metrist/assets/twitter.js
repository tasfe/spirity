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
        count: 5
    };

    var sendRequest = function (request, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(o) {
            if (xhr.readyState == 4) {
                    if (typeof callback.onSuccess == 'function') {
                        callback.onSuccess(xhr);
                    }
                    /*
                if (xhr.status == 200) {
                    if (typeof callback.onSuccess == 'function') {
                        callback.onSuccess(xhr);
                    }
                } else {
                    if (typeof callback.onError == 'function') {
                        callback.onError(xhr);
                    }
                }
                */
            } 
        };
        xhr.open(request.type || "GET",
            request.url, true, config.username, config.password);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        console.info(request.url);

        var params = []; request.params = request.params || {};
        for(name in request.params) {
            params.push(name + '=' + encodeURIComponent(request.params[name]));
        }
        xhr.send(params.join('&'));
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
                'status': tweets
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
            for(item in user_config) {
                config[item] = user_config[item];
            }
        }
    };
})();
