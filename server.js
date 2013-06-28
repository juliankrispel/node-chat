var express = require('express'),
    app = express(),
    clientApp = express(),
    server = require('http').createServer(app),
    clientServer = require('http').createServer(clientApp),
    fs = require('fs'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Mongo = require('./lib/mongo.js'),
    Users = require('./lib/users.js'),
    users = new Users;
    Socket = require('./lib/socket.js');

server.listen(3000);
clientServer.listen(4000);
console.log('server listening on port 3000, http://localhost:3000');
console.log('client server listening on port 3000, http://localhost:3000');

// Initialize DB
var db = new Mongo(
    'mongodb://localhost:27017/node-chat',
    ['users', 'messages'],
    function(){
        console.log('mongo connected');
    }
);

db.on('connected', function(){
    db.get('users', 'messages', function(err, results){
        if(err) throw(err);
        console.log(results);
    });
});

// Initialize Socket
var socket = new Socket(server);

// Middleware between socket.io and Mongo
socket.on('message_from_user', function(socketId, data){
    db.insert(data);
});

db.on('insert', function(){ 
    console.log('insert'); 
});

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendfile(__dirname + 'admin/index.html');
});

clientApp.use(express.static(__dirname + '/public'));
clientApp.get('/', function (req, res) {
  res.sendfile(__dirname + 'client/index.html');
});


// When a new socket connects
socket.on('user_connected', function(socketId, user){
    // Catch invalid user info
    //
    if(!user || !user.clientid || !user.email){
        socket.closeSocket(socketId);
        return ;
    }

    //See if user is in the databsase
    db.get('users', {
        $or: [
            {'username': user.username },
            {'email': user.email }
        ]
    }, function(err, results){
        if(err) throw (err);
        // If the user isn't in the database yet, create him
        if(_(results).isEmpty()){
            db.insert('users', user, function(){
                users.add(user);
                console.log('user created: ' +  user.username);
            });
        }else{
            console.log('User found in DB');
            console.log(results);
            users.add(user);
            console.log(users);
        }
    });
});

// Conversations is a collection of Conversation Documents
// A Conversation Document can have multiple users
//

// Schema
//
//Messages = {'}
//    id: 1232,
//    message: '...',
//    users: [1, 23, 239, 231],
//    unread: [1, 23],
//    adminread: false
//}
//
//User = {
//    unread: [2, 3, 10, 23, 291],
//    id: 123,
//    client_id: 83217,
//    password: 'hash',
//    username: 'username',
//    name: 'Julian',
//    email: 'juliankrispel@yahoo.de',
//    company: 'Whatever Co',
//    etc: 'any other data'
//}
