// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Accordian.source.js
 *
 * @author feelinglucky@gmail.com
 * @date   2008-10-18
 * @link   http://www.gracecode.com/
 */
function Accordian(el, config) {
    var _config = {};
    var _current_page = -1;

    var pagers = $(el).getElements('div').setStyle('display', 'none');
    var _total_page = pagers.length;


    var handle = {};
    handle.next = function(page) {
        if (_current_page >= _total_page - 1) {
            return;
        }

        if (pagers[_current_page]) {
            pagers[_current_page].setStyle('display', 'none');
        }
        pagers[++_current_page].setStyle('display', '');
    };

    handle.prev = function () {
        if (_current_page <= 0) {
            return;
        }

        if (pagers[_current_page]) {
            pagers[_current_page].setStyle('display', 'none');
        }
        pagers[--_current_page].setStyle('display', '');
    };

    document.addEvent('keypress', function(e) {
        switch(e.key) {
            case 'space': case 'right': case 'j':
                handle.next();
                break;

            case 'backspace': case 'left': case 'k':
                handle.prev();
                break;
        }

        e.stop();
    });

    handle.next();
    return handle;
}
