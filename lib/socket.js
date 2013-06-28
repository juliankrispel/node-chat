var EventEmitter = require('events').EventEmitter,
    _ = require('underscore');

var sockets = {};

var Socket = function(server){
    this.init(server);
}

_(Socket.prototype).extend(
    EventEmitter.prototype, {

    init: function(server){
        _(this).bindAll('setupEvents', 'sendToClients', 'closeSocket');

        this.io = require('socket.io').listen(server);
        var that = this;
        this.io.sockets.on('connection', function (socket) {
            //Store socket in object
            sockets[socket.id] = socket;

            //Setup events for socket
            that.setupEvents(socket);
        });
    },

    closeSocket: function(id){
        var socket = sockets[id];
        socket.emit('Insufficient Credentials');
        socket.disconnect();
        delete socket[id];
    },

    setupEvents: function(socket){
        var that = this;
        socket.on('user_connected', function(data){
            that.emit('user_connected', socket.id, data);
        });

        socket.on('message_from_user', function(data){
            that.emit('message_from_user', socket.id, data);
        });

        socket.on('disconnect', function () {
            that.emit('socket_disconnect', socket.id);
        });
    },

    sendToClients: function(data){
        this.io.sockets.emit('message_from_server', data);
    }
});

module.exports = Socket;
