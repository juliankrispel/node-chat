var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    fs = require('fs'),
    Mongo = require('./lib/mongo.js'),
    Socket = require('./lib/socket.js');

server.listen(3000);
console.log('server listening on port 3000, http://localhost:3000');

// Initialize DB
var db = new Mongo(
    'mongodb://localhost:27017/project', 
    function(err, collection){
        console.log('mongo connected');
    }
);


// Initialize Socket
var socket = new Socket(server);

// Middleware between socket.io and Mongo
socket.on('message_from_user', function(data){
    db.insert(data);
});

socket.on('user_connected', function(data){
    db.get('', function(err, data){
        socket.sendToClients(data);
    });
});

db.on('insert', function(){ 
    console.log('inserted'); 
});

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

//Load whole collection of chat history into socket.io object

//Subscribe to updates of socket.io object and update mongodb


// Initiate Mongo DB

