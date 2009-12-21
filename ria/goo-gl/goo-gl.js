// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8 nobomb:
/**
 * Create short url from goo.gl
 *
 * @author mingcheng<i.feelinglucky#gmail.com>
 * @date   2009-12-18
 * @link   http://www.gracecode.com/
 * @see    http://www.kix.in/blog/2009/12/goo-gl/
 *
 * @change
 *    [+]new feature  [*]improvement  [!]change  [x]bug fix
 *
 * [+] 2009-12-20
 *    initial version
 */

(function(scope) {
    /**
     * Request API
     */
    var API = "http://goo.gl/api/url";

    /**
     * Below code from Google Toolbar
     */
    var getToken = (function() {
        var c = function () {
            for (var l = 0, m = 0; m < arguments.length; m++) {
                l = l + arguments[m] & 4294967295;
            }
            return l;
        }

				
        var d = function (l) {
            l = l = String(l > 0 ? l : l + 4294967296);
			var m; m = l;

            for (var o = 0, n = false, p = m.length - 1; p >= 0; --p) {
                var q = Number(m.charAt(p));
                if (n) {
                    q *= 2;
                    o += Math.floor(q / 10) + q % 10
                } else {
                    o += q;
                }
                n = !n
            }

            m = m = o % 10;
            o = 0;
            if (m != 0) {
                o = 10 - m;
                if (l.length % 2 == 1) {
                    if (o % 2 == 1) o += 9;
                    o /= 2
                }
            }
            m = String(o);
            m += l;
            return l = m
        }
        
        var e = function(l) {
            for (var m = 5381, o = 0; o < l.length; o++) {
                m = c(m << 5, m, l.charCodeAt(o));
            }
            return m
        }

        var f = function (l) {
            for (var m = 0, o = 0; o < l.length; o++) {
                m = c(l.charCodeAt(o), m << 6, m << 16, -m);
            }
            return m
        }
    
        return function(url) {
            var h = {
                byteArray_: url,
                charCodeAt: function (l) {
                    return this.byteArray_[l]
                }
            };

            h.length = h.byteArray_.length;
            var i = e(h.byteArray_);
            i = i >> 2 & 1073741823;
            i = i >> 4 & 67108800 | i & 63;
            i = i >> 4 & 4193280 | i & 1023;
            i = i >> 4 & 245760 | i & 16383;
            var j = "7";
            h = f(h.byteArray_);
            var k = (i >> 2 & 15) << 4 | h & 15;
            k |= (i >> 6 & 15) << 12 | (h >> 8 & 15) << 8;
            k |= (i >> 10 & 15) << 20 | (h >> 16 & 15) << 16;
            k |= (i >> 14 & 15) << 28 | (h >> 24 & 15) << 24;
            j += d(k);
            return j;
        }
    })();


    /**
     * Short url from goo.gl
     *
     * @param {String} url 
     * @param {Object} callback
     */
    var handle = function(url, callback) {
        var auth_token = getToken(url), urlEscaped = encodeURIComponent(url);
        var params = "user=toolbar@google.com&url=" + urlEscaped + "&auth_token=" + auth_token;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", API, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.responseText) {
                var result = JSON.parse(xhr.responseText);
                switch(xhr.status) {
                    case 200: case 201: 
                        callback.onSuccess && callback.onSuccess(result);
                        break;
                    default: 
                    console.info('faild');
                        callback.onError && callback.onError(result);
                }
            }
        }
        xhr.send(params);
        return xhr;
    };

    scope.zipUrlByGoogle = handle;
})(this);
