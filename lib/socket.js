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

    setupEvents: function(socket){
        var that = this;
        socket.on('user_connected', function(data){
            that.emit('user_connected', data);
        });
        socket.on('message_from_user', function(data){
            that.emit('message_from_user', data);
        });
    },

    sendToClients: function(data){
        console.log(this.io.sockets);
        this.io.sockets.emit('message_from_server', data);
    }
});

module.exports = Socket;
