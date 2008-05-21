// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Spirity Javascript Framework - Broswer
 * 
 * �������չ���������Ҫ���� Spirity �� BOM �����������ģ�ͣ�����չ
 *
 * @author feeinglucky<i.feelinglucky@gmail.com>
 * @link   http://code.google.com/p/spirity/
 * @link   http://www.gracecode.com/
 */

Spirity.register.add({
     module: 'Spirity.broswer', 
    version: '$Id: broswer.js 17 2008-05-14 12:49:26Z i.feelinglucky $'
});

Spirity.broswer = Spirity.broswer || {
	// ��ȡ��������ͣ�ȡ�� Prototype
    ua: {
        explorer: !!(window.attachEvent && !window.opera),
        opera: !!window.opera,
        webkit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
        gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1
    },

    get: (function () {
		var lang = Spirity.lang;
		var dom  = Spirity.dom;	

        return {
			/**
			 * ��̬���� CSS ��ʽ
			 */
            css: function () {
            
            },

			/**
			 * ��ִ̬�� Javascript �ű�
			 */
            script: function () {
            
            }
        }
    })() // get
};
