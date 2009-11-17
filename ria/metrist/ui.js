// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8 nobomb:
/**
 * Popup UI
 *
 * @author mingcheng<i.feelinglucky@gmail.com>
 * @date   2009-11-17
 * @link   http://www.gracecode.com/
 */

~function() {
    var Util = YAHOO.util, Dom = Util.Dom, Event = Util.Event, Lang = YAHOO.lang;

    /**
     * 滚动栏目
     */
    var Channel = (function(containers, triggers, content) {
        var timer, anim, addons,
            currentClass = 'selected', lastSelectedIdx = false;

        var switchTo = function(idx, useAnim, onShow) {
            if (!containers[idx] || !triggers[idx]) {
                return;
            }

            var onShowEvent = new Util.CustomEvent("onShow", this);
            if (Lang.isFunction(onShow)) {
                onShowEvent.subscribe(onShow, this);
            }

            if (Lang.isFunction(addons)) {
                onShowEvent.subscribe(addons, this);
            }

            Dom.addClass(triggers[idx], currentClass);
            if (Lang.isNumber(lastSelectedIdx)) {
                Dom.removeClass(triggers[lastSelectedIdx], currentClass);
            }
            lastSelectedIdx = idx;
            onShowEvent.fire(); // fire event!

            var offset = 348 * idx; // ...
            if (typeof useAnim == 'undefined') useAnim = true;
            var attributes = {
               scroll: {to: [offset] }
            }; 
            if (anim) { anim.stop(); }
            anim = new Util.Scroll(content, attributes, 
                useAnim ? .3 : 0, Util.Easing.easeOutStrong); 
            anim.animate();
        };

        Dom.removeClass(triggers, currentClass);
        for(var i = 0, len = containers.length; i < len; i++) {
            ~function (idx) {
                Event.on(triggers[idx], 'click', function(e) {
                    Event.stopEvent(e);
                    switchTo(idx);
                });
            }(i);
        };

         return {
            getCurrentIdx: function() {return lastSelectedIdx;},
            triggers: triggers,
            containers: containers,
            switchTo: switchTo,
            setSwitchToCall: function(callback) {
                if (Lang.isFunction(callback)) {
                    addons = callback;
                }
            },
            getAll: function() {
                return {
                    containers: containers,
                    triggers: triggers
                };
            }
         }
     })(Dom.get('content').getElementsByTagName('ul'),
        Dom.get('channel').getElementsByTagName('li'),
        Dom.get('content'));

    /**
     * 提示信息
     */
    var Notice = (function(noticeEl) {
        var anim;
        Dom.addClass(noticeEl, 'hidden');
        return {
            show: function(message, delay, onShow) {
                var _self = this, delay = delay || 2;
                noticeEl.innerHTML = '<span>' + message + '</span>';
                Dom.removeClass(noticeEl, 'hidden');

                var onShowEvent = new Util.CustomEvent("onShow", this);
                if (Lang.isFunction(onShow)) {
                    onShowEvent.subscribe(onShow, this);
                }

                var attributes = {
                    opacity: {from: 1, to: 0}
                }; 
                if (anim) { anim.stop(); }
                anim = new Util.Anim(noticeEl, attributes, delay); 
                anim.onComplete.subscribe(function() {
                    Dom.setStyle(noticeEl, 'opacity', '1');
                    onShowEvent.fire();
                    _self.hide();
                });
                anim.animate();
            },

            hide: function(onHide) {
                Dom.addClass(noticeEl, 'hidden');
                if (Lang.isFunction(onHide)) {
                    var onHideEvent = new Util.CustomEvent("onHide", this);
                    onHideEvent.subscribe(onHide, this);
                    onHideEvent.fire();
                }
            }
        }
    })(Dom.get('notice'));

    /**
     * “载入中”层
     */
    var Loading = (function(loadingEl) {
        var anim;
        Dom.addClass(loadingEl, 'hidden');

        var $show = function(onShow) {
            Dom.removeClass(loadingEl, 'hidden');
            if (Lang.isFunction(onShow)) {
                var onShowEvent = new Util.CustomEvent("onShow", this);
                onShowEvent.subscribe(onShow, this);
                onShowEvent.fire();
            }
        };


        var $hide = function(onHide, useAnim) {
            var _self = this, attributes = {
                opacity: {to: 0}
            };

            var onHideEvent = new Util.CustomEvent("onHide", _self);
            if (Lang.isFunction(onHide)) {
                onHideEvent.subscribe(onHide, _self);
            }

            if (Lang.isUndefined(useAnim)) {
                useAnim = true;
            }

            if (useAnim) {
                if (anim) { anim.stop(); }
                anim = new Util.Anim(loadingEl, attributes, .5); 
                anim.onComplete.subscribe(function() {
                    Dom.setStyle(loadingEl, 'opacity', '1');
                    Dom.addClass(loadingEl, 'hidden');
                    onHideEvent.fire();
                });
                anim.animate();
            } else {
                Dom.setStyle(loadingEl, 'opacity', '1');
                Dom.addClass(loadingEl, 'hidden');
                onHideEvent.fire();
            }
        };

        return {
            showMini: function(onShow) {
                Dom.addClass(loadingEl, 'loading-mini');
                $show(onShow);
            },

            hideMini: function(onHide, useAnim) {
                Dom.addClass(loadingEl, 'loading-mini');
                $hide(onHide, useAnim);
            },

            show: function(onShow) {
                Dom.removeClass(loadingEl, 'loading-min');
                $show(onShow);
            },

            hide: function(onHide, useAnim) {
                Dom.removeClass(loadingEl, 'loading-min');
                $hide(onHide, useAnim);
            }
        }
    })(Dom.get('loading'));


    /**
     * HTML 控制台
     */
    var HTMLConsole = (function() {
        return {
            error: function(message) {
                console.info(message);
            },

            info: function (message) {
                console.info(message);
            },

            warn: function(message) {
                console.info(message);
            }
        }
    })();


    /**
     * 重新渲染对应的数据
     */
    var Rebuild = (function(channel_list) {
        var TWITTER_HOME_URL_BASE = 'https://twitter.com/';


        // 格式化字符串
        $process = function (str) {
            str = str.replace(/(http:\/\/[\w|\.|\/|\-]+)/g, '<a href="$1" title="$1">$1</a>');
            return str.replace(/[^\w]@([\w|\_]+)/g, ' <a href="'+ TWITTER_HOME_URL_BASE +'$1" title="$1\'s Homepage">@$1</a>');
        }

        // 绘制某条界面
        $drawChannel = function(name, data) {
            var plane = channel_list[name], length = getConf('conf_max_record_show', 50);
            //length = data.length > length ? length : data.length;

            plane.innerHTML = '';
            /*
            console.info(name);
            console.warn(length);
            console.warn(length);
            console.info(data);
            console.warn('data.length:' + data.length);
            */
            for(var k = 0; k < length; k++) {
                var item = data[k];
                if (!Lang.isObject(item)) {
                    console.warn('UI.Rebuild.channel: $drawChannel is finished');
                    break;
                }

                var li = document.createElement('li'), sender = item.user || item.sender;
                
                Dom.setAttribute(li, 'id', item.id);
                var html = [
                    '<h4 class="nick"><a title="'+ sender.screen_name +'\'s Homepage" href="https://twitter.com/'+
                        sender.screen_name +'">'+ sender.name +'</a></h4>',
                    '<p class="time">'+ relativeTime(item.created_at) +'</p>',
                    '<p class="avatar">' + 
                        '<img width="48" height="48" src="'+ 
                        sender.profile_image_url +'" alt="'+ sender.screen_name +'"/></p>',
                    '<p class="message">'+ $process(item.text) +'</p>',
                    '<p class="act" param:id="'+ item.id +'">',
                    item.sender ? '' : '<a href="#" act="Retweet">Retweet</a>',
                    '<a href="#" act="Reply">Reply</a></p>'
                ];

                Dom.setAttribute(li, 'screen_name', sender.screen_name);
                Dom.setAttribute(li, 'tweets_text', item.text);

                if (item.in_reply_to_screen_name == localStorage['status_last_login_username']) {
                    Dom.addClass(li, 'reply');
                }

                if (item.text.indexOf('@' + localStorage['status_last_login_username']) != -1) {
                    Dom.addClass(li, 'reply');
                }

                if (sender.screen_name == localStorage['status_last_login_username']) {
                    Dom.addClass(li, 'me');
                }

                if (item.sender) {
                    Dom.addClass(li, 'direct');
                }

                li.innerHTML = html.join('');
                plane.appendChild(li);
            }
        }

        return {
            channel: function(name, data) {
                if (Lang.isUndefined(channel_list[name])) {
                    console.error('UI.Rebuild.channel: container ['+ name +'] not exists');
                    return false;
                }

                $drawChannel(name, data);
            },
            all: function(queues) {
                for (i in queues) {
                    this.channel(i.name, i.data);
                }
            }
        };
    })({
        friends: Dom.get('metrist:friends'),
        replies: Dom.get('metrist:replies'),
        directs: Dom.get('metrist:directs')
    });


    /**
     * 输入框界面逻辑
     */
    var InputArea = (function(textarea, status) {
        var TWEETS_MAX_LENGTH = 140;
        var $check = function() {
            if (Lang.trim(textarea.value).length > TWEETS_MAX_LENGTH) {
                Dom.addClass(textarea, 'full');
                Dom.setStyle(status, 'color', 'red');
                return false;
            } else {
                Dom.removeClass(textarea, 'full');
                Dom.setStyle(status, 'color', '');
                return true;
            }
        };

        Event.on(textarea, 'keydown', function(e) {
            status.innerHTML = TWEETS_MAX_LENGTH - Lang.trim(textarea.value).length;
            $check();
        });
        
        return {
            getValue: function() {
                return Lang.trim(textarea.value);
            },
            setValue: function(value, cursorAtEnd) {
                cursorAtEnd = Lang.isUndefined(cursorAtEnd) ? true : !!cursorAtEnd;
                textarea.value = Lang.trim(value);
                //...
            },
            check: $check
        };
    })(Dom.get('form:input'), Dom.get('form:status'));

    // 合并到全局空间
    window.UI = {
        Channel: Channel, Notice: Notice, Loading: Loading, 
        HTMLConsole: HTMLConsole, Rebuild: Rebuild, InputArea: InputArea
    };
}();
