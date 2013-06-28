var EventEmitter = require('events').EventEmitter,
    _ = require('underscore');

var Socket = function(server){
    this.init(server);
}

_(Socket.prototype).extend(
    EventEmitter.prototype, {

    init: function(server){
        _(this).bindAll('setupEvents', 'sendToClients');

        this.io = require('socket.io').listen(server);
        var that = this;
        this.io.sockets.on('connection', function (socket) {
            that.setupEvents(socket);
        });
    },

    closeSocket: function(id){
    console.log(this.sockets.sockets);
        this.io.sockets.sockets[id].emit('Authentication failed');
        this.io.sockets.sockets[id].close();
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
        console.log(this.io.sockets);
        this.io.sockets.emit('message_from_server', data);
    }
});

module.exports = Socket;
