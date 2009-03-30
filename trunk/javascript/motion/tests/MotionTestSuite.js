// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * MotionTestSuite
 *
 * @author mingcheng@taobao.com
 * @date   2009-03-30
 * @link   http://www.gracecode.com/
 * 
 * assertTrue
 * assertFalse
 * assertEqual
 * assertNotEqual
 * assertNull
 * assertNotNull
 * assertUndefined
 * assertNotUndefined
 * assertNaN
 * assertNotNaN
 */
jsUnity.attachAssertions();

var MotionTestSuite = {
    suiteName: 'MotionTweens',
    setUp: function () {

    },

    tearDown: function () {

    }
}; // MotionTestSuite

for (var i in Motion.getTweens()) {
    (function () {
        MotionTestSuite['test' + i.replace(/^[a-z]{1}/, function(c){return c.toUpperCase()})] = function() {
            var duration = 2000, frames = Math.ceil((duration/1000)*35);
            var from = 0, to = 1000, current = 1, result = 0;
            var tween = Motion.getTweens()[i];
            while (current++ < frames) {
                result = tween((current/frames)*duration, from, to - from, duration);
            }
            assertEqual(1000, result);
        }
    })();
}
