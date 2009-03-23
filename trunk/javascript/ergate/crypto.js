// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity 编码模块
 *
 * @author mingcheng<i.feelinglucky@gmail.com>
 * @date   2009-03-23
 * @link   http://www.gracecode.com/
 */

var crypto = (function() {
    var html = {
        encode: function(str) {
            var div  = document.createElement('div');
            var text = document.createTextNode(str);
            div.appendChild(text);
            return div.innerHTML;
        },

        decode: function(str) {
            var div = document.createElement('div');
            div.innerHTML = str;
            return div.innerText;
        }
    };

    //JavaScript　base64_decode
    // Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
    // Version: 1.0
    // LastModified: Dec 25 1999
    // This library is free.　You can redistribute it and/or modify it.
    var base64 = (function () {
        var encodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var decodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                           -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                           -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
                           58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1,  0,  1,  2,  3,  4,  5,  6,
                            7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                           25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
                           37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
                           -1, -1];

        return {
            encode: function(str) {
                var out = "", len = str.length, i = 0; 
                var c1, c2, c3;
                while (i < len) {
                    c1 = str.charCodeAt(i++) & 0xff;
                    if (i == len) {
                        out += encodeChars.charAt(c1 >> 2);
                        out += encodeChars.charAt((c1 & 0x3) << 4);
                        out += "==";
                        break;
                    }
                    c2 = str.charCodeAt(i++);
                    if (i == len) {
                        out += encodeChars.charAt(c1 >> 2);
                        out += encodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        out += encodeChars.charAt((c2 & 0xF) << 2);
                        out += '=';
                        break;
                    }
                    c3 = str.charCodeAt(i++);

                    out += encodeChars.charAt(c1 >> 2);
                    out += encodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    out += encodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                    out += encodeChars.charAt(c3 & 0x3F);
                }

                return out;
            },

            decode: function(str) {
               var out = "", len = str.length, i = 0; 
               var c1, c2, c3, c4;
               while (i < len) {
                   do {
                       c1 = decodeChars[str.charCodeAt(i++) & 0xff]
                   } while (i < len && c1 == -1);

                   if (c1 == -1) {
                       break;
                   }

                   do {
                       c2 = decodeChars[str.charCodeAt(i++) & 0xff]
                   } while (i < len && c2 == -1);

                   if (c2 == -1) {
                       break;
                   }

                   out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

                   do {
                       c3 = str.charCodeAt(i++) & 0xff;
                       if (c3 == 61) return out;
                       c3 = decodeChars[c3];
                   } while (i < len && c3 == -1);

                   if (c3 == -1) {
                       break;
                   }

                   out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

                   do {
                       c4 = str.charCodeAt(i++) & 0xff;
                       if (c4 == 61) return out;
                       c4 = decodeChars[c4]
                   } while (i < len && c4 == -1);

                   if (c4 == -1) {
                       break;
                   }

                   out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
               }

               return out;
            }
        };
    })();

    return {
        html: html, base64: base64
    };
})();
