	config.eventcfg = {
        pushapp: function(){
            var params = 'eventcode=pushapp&funid=app_update';
            Request.postRequest(params, null);
        }
    };