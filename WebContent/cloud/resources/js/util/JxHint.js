JxHint = {
    hint: function(msg, title, isinfo){
        var div = $('<div class="error-hint">'+msg+'</div>').appendTo(document.body);
        div.delay(2000).fadeTo(400, 0); 
        
        /*$.gritter.add({
            title: title|| (isinfo ? '提示' : '错误'),
            text: msg,
            class_name: isinfo ? 'gritter-success gritter-light' : 'gritter-error gritter-light'
        });*/
    },
    
    alert: function(msg){
        alert(msg);
    }
};