var Backbone = require('backbone');
var User = Backbone.Model.extend({
    defaults: {
        isConnected: false,
        unread: [],
        id: undefined,
        clientId: undefined,
        password: undefined,
        username: undefined,
        name: undefined,
        email: undefined,
        company: undefined
    },
    initialize: function(){
        _(this).bindAll('setupEvents', 'sendUnread')
        this.setupEvents();
    },
    setupEvents: function(){
        this.on('change:isConnected', function(){
            
        });
    },
    whenConnected: function(){
        
    }
});
module.exports = User;
