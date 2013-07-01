var _ = require('underscore');
var Backbone = require('backbone');
var User = Backbone.Model.extend({
    idAttribute: 'email',
    db: null,
    defaults: {
        isConnected: false,
        unread: [],
        id: undefined,
        clientId: undefined,
        password: undefined,
        username: undefined,
        name: undefined,
        email: undefined,
        company: undefined,
        socketId: undefined
    },

    initialize: function(){
        _(this).bindAll('setupEvents');
        this.setupEvents();
    },

    toJSON: function(options) {
        var attr = _(this.attributes).omit('socketId');
        return _.clone(this.attributes);
    }, 

    setupEvents: function(){
        this.on('change:isConnected', function(){
            
        });
    },

    whenConnected: function(){
        
    },

    save: function(attrs){
        if(!attrs) attrs = this.toJSON();
        if(this.db)
            this.db.update('users', this.toJSON(), attrs);
        else if(this.collection && this.collection.db)
            this.collection.save(this.toJSON(), attrs);
    }
});
module.exports = User;
