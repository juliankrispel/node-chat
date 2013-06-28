var Backbone = require('backbone'),
    User = require('./user.js');

var Users = Backbone.Collection.extend({
    model: User
});

module.exports = Users
