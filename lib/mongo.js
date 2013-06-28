//Initiates MongoDB and fires callback
var MongoClient = require('mongodb').MongoClient,
    _ = require('underscore'),
    EventEmitter = require('events').EventEmitter;

var Mongo = function(url, collectionNames, callback){
    this.init(url, collectionNames, callback);
}

var collections = {}

_(Mongo.prototype).extend(
    EventEmitter.prototype, {
    init: function(url, collectionNames, callback){
        _(this).bindAll('insert', 'get');
        var that = this;
        MongoClient.connect(url, function(err, db) {
            // Return error if we couldn't connect
            if(err) { return console.dir(err); }

            // Create the mongo collections
            if(!collectionNames) throw('No collectionNames defined');
            for(var i = 0; i < collectionNames.length; i++)
                collections[collectionNames[i]] = db.collection(collectionNames[i]);

            that.emit('connected');
            callback();
        })
    },

    insert: function(collection, data, callback){
        this.validateCollectionName(collection);

        that = this;
        collections[collection].insert(data, function(err){
            that.emit('insert');
            if(err) throw err;
            if(callback) callback();
        });
    },

    get: function(collection, query, callback){
        this.validateCollectionName(collection);

        collections[collection].find(query).toArray(function(err, results){
            callback(err, results);
        });
    },

    validateCollectionName: function(collection){
        if(!collection) throw('No Collection defined');
        if(!collections[collection]) throw('There is no collection with the name of' + collection)
    }
});

module.exports = Mongo;
