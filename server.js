var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    fs = require('fs'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Mongo = require('./lib/mongo.js'),
    Users = require('./lib/users.js'),
    users = new Users;
    Socket = require('./lib/socket.js');

server.listen(3000);
console.log('server listening on port 3000, http://localhost:3000');

// Initialize DB
var db = new Mongo(
    'mongodb://localhost:27017/node-chat',
    ['users', 'messages'],
    function(){
        console.log('mongo connected');
    }
);

db.on('connected', function(){
    db.get('users', '', function(err, results){
        if(err) throw(err);
        console.log(results);
        users.add(results);
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
  res.sendfile(__dirname + '/index.html');
});

// When a new socket connects
socket.on('user_connected', function(socketId, user){
    // Catch invalid user info
    if(!user || !user.clientid || !user.email){
        console.log(user, user.clientid, user.email);
        console.log('Both clientid and email must be defined, closing socket');
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
        if(!results){
            db.insert('users', data, function(){
                users.add(data);
                console.log('user created: ' +  data.username);
            });
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
