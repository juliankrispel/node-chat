var express = require('express'),
    app = express(),
    clientApp = express(),
    hbs = require('hbs'),
    server = require('http').createServer(app),
    clientServer = require('http').createServer(clientApp),
    fs = require('fs'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Mongo = require('./lib/mongo.js'),
    Users = require('./lib/users.js'),
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

var users = new Users([], {db: db, dbCollectionName: 'users'});

db.on('connected', function(){
    db.get('users', '', function(err, results){
        if(err) throw(err);
        else users.add(results);
    });
});

// Initialize Socket
var socket = new Socket(server);

// Middleware between socket.io and Mongo
socket.on('message_from_user', function(socketId, data){
    var user = users.findWhere({socketId: socketId});
    console.log('Message inserted into db ', data);
    if(!data.message) return console.warn('Message not sent or empty');
    if(!user) return console.warn('User doesn\'t exist');
    data.user = user.get('email');
    db.insert('messages', data);
});

app.set('view engine', 'hbs');
app.engine('html', require('hbs').__express);

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.render('admin/index.html', { users: users.toJSON() });
});

app.get('/user/:email', function(req, res){
    var user = users.findWhere({email: req.params.email});

    db.get('messages',
        {user: req.params.email},
        function(err, results){
            console.log('results', results);
            res.render('admin/user.html', {messages: results});
    });

});

clientApp.use(express.static(__dirname + '/public'));
clientApp.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/client/index.html');
});

socket.on('socket_disconnect', function(socketId){
    var user = users.findWhere({socketId: socketId});
    if(user) user.set({socketId: null});
});

// When a new socket connects
socket.on('user_connected', function(socketId, user){
    // Catch invalid user info
    if(!user || !user.clientid || !user.email){
        socket.closeSocket(socketId);
        return ;
    }

    // Attach socketId to user
    user.socketId = socketId;

    if(!users.get(user.email)){
        console.log('users.create');
        users.create(user);
    }
    else{
        console.log('users.add');
        users.add(user, {merge: true});
    }
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
