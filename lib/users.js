var _ = require('underscore'),
    Backbone = require('backbone'),
    User = require('./user.js');

var Users = Backbone.Collection.extend({
    model: User,
    db: null,
    initialize: function(config){
        _(this).extend(config);
        this.on('all', function(a,b,c){
            console.log('something\'s happened', a, b, c);
        });
        var user = new User();
        this.add(user);
        user.save();
    },
    save: function(model, attrs){
        if(!this.db) return console.log('No db specified for this collection, aborting save');
        if(model && attrs && this.db)
            this.db.update('users', model, attrs);
        else if(this.db){
            var query = { $or: [] };
            var payload = [];
            _(this.toJSON()).each(function(model){ 
                query.$or.push(model.id); 
                payload.push(model);
            });
            this.db.update(query, payload);
        }
    },
});

module.exports = Users
