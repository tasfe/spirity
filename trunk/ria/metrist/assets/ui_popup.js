// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8 nobomb:
/**
 * Popup UI
 *
 * @author mingcheng<i.feelinglucky#gmail.com>
 * @date   2009-11-15
 * @link   http://www.gracecode.com/
 */
~function() {
    var Util = YAHOO.util, Dom = Util.Dom, Event = Util.Event, Lang = YAHOO.lang;

    // 节点列表
    var content = Dom.get('content');
    var containers = content.getElementsByTagName('ul');
    var triggers = Dom.get('channel').getElementsByTagName('li');

    var friendsContainer = Dom.get('metrist:friends');
    var repliesContainer = Dom.get('metrist:replies');
    var directsContainer = Dom.get('metrist:directs');

    var formElement = Dom.get('metrist:form');
    var formTextarea = formElement.getElementsByTagName('textarea')[0];
    var formSubmit = Dom.get('metrist:submit');
    var formStatus = formElement.getElementsByTagName('span')[0];
    var formRefresh = Dom.get('refresh');

    // 频道列表事件
    var Channel = (function() {
        var timer, anim;
        var switchTo = function(idx) {
            if (!containers[idx] || !triggers[idx]) {
                return;
            }
            Dom.removeClass(triggers, 'selected');
            Dom.addClass(triggers[idx], 'selected');

            var offset = 348 * idx;
            var attributes = { 
               scroll: {to: [offset] }
            }; 
            if (anim) { anim.stop(); }
            anim = new YAHOO.util.Scroll(content, attributes, .3, YAHOO.util.Easing.easeOutStrong); 
            anim.animate();
        };

        for(var i = 0, len = containers.length; i < len; i++) {
            ~function (idx) {
                Event.on(triggers[idx], 'click', function(e) {
                    Event.stopEvent(e);
                    switchTo(idx);
                });
            }(i);
        };

        // 清除节点内所有内容
        Array.forEach(containers, function(c){
            c.innerHTML = '';
        });

        return {
            switchTo: switchTo
        };
    })();
    Channel.switchTo(0); // 默认跳转到第一页

    // 重置控制台
    ///*
    var logger = (function () {
        var consoleContainer = Dom.get('metrist:console');

        // @TODO
        if (localStorage) {
            if (localStorage['console_data']) {
                var consoleData = JSON.parse(localStorage['console_data']);
            } else {
                localStorage['console'] = JSON.stringify([]);
                var consoleData = [];
            }
        } else {
            var consoleData = [];
        }

        var refresh = function () {
            consoleContainer.innerHTML = '';
            if (!Lang.isArray(consoleData)) {
                consoleData = [];
            }
        
            for(var i = 0, len = consoleData.length; i < len; i++) {
                var data = consoleData[i];
                var li = document.createElement('li');
                li.innerHTML = (new Date().toString()) + ":\n  " + data.message + '';
                Dom.addClass(li, data.type);
                if (consoleContainer.firstChild) {
                    Dom.insertBefore(li, consoleContainer.firstChild);
                } else {
                    consoleContainer.appendChild(li);
                }
            }
        }

        var insert = function (message, type) {
            consoleData.push({
                message: message, type: type
            });
            refresh();
            if (localStorage) {
                localStorage['console_data'] = JSON.stringify(consoleData);
            }
        }
        refresh();

        return {
            log: function(message) {insert(message, 'log');},
            warn: function(message) {insert(message, 'warn');},
            info: function(message) {insert(message, 'info');},
            error: function(message) {insert(message, 'error');}
        };
    })();
    // */

    // 输入框表单事件
    var formElement = Dom.get('metrist:form');
    Event.on(formElement, 'submit', function(e) {
        Event.stopEvent(e);
        if (formTextarea.value > 140) {
            formTextarea.focus();
            Dom.addClass(formTextarea, 'full');
            return false;
        } else {
            console.info(formTextarea.value);
        }
    });


    Event.on(formTextarea, 'keyup', function(e) {
        if (localStorage) {
            localStorage['tmp_keydown'] = formTextarea.value;
        }
        var left = 140 - formTextarea.value.length;
        formStatus.innerHTML = left;
        if (left < 0) {
            Dom.addClass(formTextarea, 'full');
        } else {
            Dom.removeClass(formTextarea, 'full');
        }

        var e = Event.getEvent(e);
        if (e.ctrlKey && e.keyCode == 13 && formTextarea.value.length) {
            console.info(formTextarea.value);
        }
    });
    if (localStorage && typeof localStorage['tmp_keydown'] != 'undefined') { 
        formTextarea.value = localStorage['tmp_keydown'];
    }

    Event.on(formRefresh, 'click', function(e) {
        Event.stopEvent(e);
        console.warn('Refresh!');
    });


    /**
     * ReBuildUI
     *
     */
    var ReBuildUI = function() {
        var storageFlag = ['friends', 'replies', 'direct'];
        var planes = [friendsContainer, repliesContainer, directsContainer];
        for (var i = 0, len = storageFlag.length; i < len; i++) {
            var data = JSON.parse(localStorage[storageFlag[i]]), plane = planes[i];

            ///*
            if (plane && Lang.isArray(data) && data.length) {
                var confMaxRecord = localStorage['conf_maxrecord'] || 50;
                var maxRecord = data.length > confMaxRecord ? confMaxRecord : data.length;
                for(var k = 0; k < maxRecord; k++) {
                    var item = data[k], li = document.createElement('li');
                    var sender = item.user || item.sender;
                    // process
                    
                    var html = [
                        '<h4 class="nick"><a href="http://twitter.com/'+
                            sender.screen_name +'">'+ sender.name +'</a></h4>',
                        '<p class="time">'+ relative_time(item.created_at) +'</p>',
                        '<p class="avatar">' + 
                            '<img width="48" height="48" src="'+ 
                            sender.profile_image_url +'" alt="'+ sender.screen_name+'"/></p>',
                        '<p class="message">'+ item.text +'</p>',
                        '<p class="act" param:id="'+ item.id +'"><a href="#">Retweet</a><a href="#">Reply</a></p>'
                    ];
                    if (item.sender) {
                        Dom.addClass(li, 'direct');
                    }
                    li.innerHTML = html.join('');
                }
                plane.appendChild(li);
            }
            // */
        }
        console.info('ReBuildUI finished.');
    };

    // 暴露到全局的接口
    window.Channel = Channel;
    window.console = logger;
    window.ReBuildUI = ReBuildUI;

    setTimeout(function() {formTextarea.focus();}, 50);
}();