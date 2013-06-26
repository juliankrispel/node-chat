var User = function(){
    this.init();
}

_(User.prototype).extend({
    init: function(name, time){
        this.id = (function(){ return userCount++; });
        this.name = name;
        this.time = time;
    }
});
