//Initiates MongoDB and fires callback
var MongoClient = require('mongodb').MongoClient,
    _ = require('underscore'),
    EventEmitter = require('events').EventEmitter;

var Mongo = function(url, callback, collectionName){
    this.init(url, callback, collectionName);
}

_(Mongo.prototype).extend(
    EventEmitter.prototype, {
    init: function(url, callback, collectionName){
        _(this).bindAll('insert', 'get');
        var that = this;
        setTimeout(function(){
            that.emit('bli');
        }, 500);
        MongoClient.connect(url, function(err, db) {
            // Return error if we couldn't connect
            if(err) { return console.dir(err); }

            // Create a mongo collection
            that.collection = db.collection(collectionName || 'noname');

            callback(err, that.collection);
        })
    },

    insert: function(data, callback){
        that = this;
        this.collection.insert(data, function(err){
            that.emit('insert');
            if(err) throw err;
            if(callback) callback();
        });
    },

    get: function(query, callback){
        this.collection.find(query).toArray(function(err, results){
            callback(err, results);
        });
    }
});

module.exports = Mongo;
