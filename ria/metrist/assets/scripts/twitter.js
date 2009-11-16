// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8 nobomb:
/**
 * Twitter Client Library
 *
 * @author mingcheng<i.feelinglucky@gmail.com>
 * @date   2009-11-14
 * @link   http://www.gracecode.com/
 */

/**
 * Twitter Request API
 */
Twitter = (function() {
    // default configure
    var config = {
        api: "http://twitter.com",
        username: "",
        password: "",
        count: 20,
        timeout: 5000
    };

    /**
     * sendRequest with YUI Connect Module
     */
    var sendRequest = function (request, callback) {
        var params = []; request.params = request.params || {};
        for(name in request.params) {
            params.push(name + '=' + encodeURIComponent(request.params[name]));
        }

        var request = YAHOO.util.Connect.asyncRequest(request.type || "GET", request.url, {
            success: callback.onSuccess || function () {},
            failure: callback.onError || function() {},
            timeout: config.timeout,
            cache: false
        }, params.join('&'), config.username, config.password);
    };

    // Twitter request methods

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
        sendRequest({
            url: config.api + '/statuses/user_timeline' + (user ? '/' + user : '') + '.json?count=' + config.count
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

    // public method
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



/**
 * Tweets Save Handle for Chrome
 *      Gears doesn't work in chrome addons, sigh~
 */
Tweets = (function() {
    var $merge = function(target, source) {
        var result = [], data = YAHOO.lang.merge(target, source);
        var match = [];
        for (items in data) {
            var i = data[items], id = i.id;
            // unique
            if (match.indexOf(id) == -1) {
                result.push(data[items]); match.push(id);
            }
            // sort
        }
        return result;
    };

    var diffResult = 0, $diff = function(target, source) {
        var match = [];
        for (items in source) {
            var i = source[items], id = i.id; match.push(id);
        }

        for (items in target) {
            var i = target[items], id = i.id;
            // unique
            if (match.indexOf(id) == -1) {
                diffResult++;
            }
        }
    };

    return {
        addToList: function(listName, data) {
            try {
                var source = JSON.parse(localStorage[listName]);
                console.info('source: ' + source);
            } catch (e) {
                console.error('parse localStorage data error');
                this.clearList(listName);
            }
            $diff(data, source); // diff new message
            localStorage[listName] = JSON.stringify($merge(data, source));
        },

        getDiffNumber: function() {
            return diffResult;
        },

        clearDiffNumber: function() {
            diffResult = 0;
        },

        getList: function(listName) {
            var data = JSON.parse(localStorage[listName]);
            return data;
        },

        clearList: function(listName) {
            localStorage[listName] = JSON.stringify([]);
        }
    };
})();
