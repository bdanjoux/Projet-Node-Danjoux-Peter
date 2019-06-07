var client = require("socket.io-client");
var RiveScript = require('rivescript');
module.exports = class DanjouxPeterBot{

    constructor(name){
        this.bot = new RiveScript();
        this.name = name;
        this.connected = false;
        this.botsocket = null;
        this.port=null;
    }

    loadFile(filepath){
        console.log('loading file');
        var thenThing = this.loading_done.bind(this);
        this.bot.loadFile(filepath).then(thenThing());
    }

    loadDirectory(directorypath){
        console.log('loading directory');
        var thenThing = this.loading_done.bind(this);
        this.bot.loadDirectory(directorypath).then(thenThing());
        this.bot.sortReplies();
    }

    loading_done(){
        this.bot.sortReplies();
        console.log("Bot "+this.name+" has finished loading!");
    }

    loading_error_file(error, filename, lineno){
        console.log("Bot "+this.name+" Had an error when loading files: " + error);   
    }

    razRivscript(){
        this.bot = new RiveScript();
    }

    loading_error_dir(error, filename, lineno){
        console.log("Bot "+this.name+" Had an error when loading dir: " + error);   
    }       

    connect(address,port,callback){
        /*if(this.botsocket!==null){
            this.botsocket.disconnect();
        }*/
        console.log('bot '+this.getName()+' trying to connect');
        this.botsocket = client.connect(address);
        this.port = port;
        if(this.botsocket!==null){
            this.connected = true;
        }
        this.botsocket.emit('nouveau_client', "bot "+this.name);
        if(callback!=null){
            callback();
        }
    }

    disconnect(callback){
        this.botsocket = null;
        this.connected = false;
        if(callback!=null){
            callback();
        }
    }

    reply(pseudo,message,callback){
        this.bot.sortReplies();
        console.log("bot reply, pseudo "+pseudo+" message "+message);
        var thisEmit = this.emit.bind(this);
        if(this.botsocket!=null && this.connected){
            this.bot.reply(pseudo,message).then(function(reply){
                console.log("reply "+reply);
                thisEmit(reply);}
            ).catch(function(e){
                console.log(e);
            });
        }else{
            console.log("you can't receive messages if you aren't connected yet");
        }if(callback!=null){
            callback();
        }
    }

    emit(reply,callback){
        console.log('bot emit : '+reply);
        if(this.botsocket!=null && this.connected){
            console.log("The bot says: " + reply);
            this.botsocket.emit('message', reply);
        }else{
            console.log("The bot can't say anything if it's not connected");   
        }   if(callback!=null){
            callback();
        }
    }

    getName(callback){
        return this.name;
        if(callback!=null){
            callback();
        }
    }
    
}
