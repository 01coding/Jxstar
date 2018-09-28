	config.eventcfg = {
        pushrole: function(){
            var records = this.grid.getSelectionModel().getSelections();
            if (!JxUtil.selectone(records)) return;

            var roleId = records[0].get('app_role__role_id');
            var params = 'eventcode=pushrole&funid=app_role&roleId='+roleId;
            Request.postRequest(params, null);
        }
    }