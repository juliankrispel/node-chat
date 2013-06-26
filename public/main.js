var socket = io.connect('http://localhost:8001');

var elButton = document.getElementById('submit_chat_message');
var elInput = document.getElementById('chat_message');

var ChatHistory = function(){
    this.init();
}

_(ChatHistory.prototype).extend({
    init: function(){

    },
    callbacks: {
        'addMessage': []
    },
    chats: [],
    addMessage: function(message){
        console.log(message);
        this.chats.push(message);
        this.lastMessage = message;
        this.trigger('addMessage');
    },

    on: function(key, func){
        if(!this.callbacks[key]) return;
        this.callbacks[key].push(func);
    },

    trigger: function(key){
        // Cancel method if there are no event callbacks for this attribute
        if(!this.callbacks[key] || this.callbacks[key].length < 1) return ;
        for (var i = 0; i < this.callbacks[key].length; i++)
            this.callbacks[key][i](key);
    }
})

var chat = new ChatHistory();
var elChat = document.getElementById('chat');

chat.on('addMessage', function(){
console.log(chat.lastMessage.message);
    elChat.innerHTML+= '<li>' + chat.lastMessage.message + '</li>';
});


elButton.onclick = function(){
    var message = {
        user: 'Julian',
        message: elInput.value,
        time: new Date().getTime()
    }
    socket.emit('message_from_user', message);
    chat.addMessage(message);
}

socket.on('message_from_server', function(data){
    //Hack TODO differentiate between initial chatload and updates from the server
    elChat.innerHTML = '';
    for(var i = 0; i < data.length; i++){
        chat.addMessage(data[i]);
    }
});

socket.on('connect', function (data) {
    var user = 'Julian';
    var time = new Date().getTime();

    socket.emit('user_connected', {
        user: user,
        time: time
    });
});
