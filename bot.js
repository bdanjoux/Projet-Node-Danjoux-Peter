var client = require("socket.io-client");
var RiveScript = require('rivescript');
module.exports = class DanjouxPeterBot{

    constructor(name){
        this.bot = new RiveScript();
        this.name = name;
        this.connected = false;
        this.botsocket = null;
    }

    loadFile(filepath){
        var thenThing = this.loading_done().bind(this);
        this.bot.loadFile(filepath).then(thenThing());
    }

    loadDirectory(directorypath){
        console.log('loading directory');
        this.bot.loadDirectory(directorypath).then(thenThing());        
    }

    loading_done(){
        console.log("Bot "+this.name+" has finished loading!");
        this.bot.sortReplies();
    }

    loading_error_file(error, filename, lineno){
        console.log("Bot "+this.name+" Had an error when loading files: " + error);   
    }

    loading_error_dir(error, filename, lineno){
        console.log("Bot "+this.name+" Had an error when loading dir: " + error);   
    }

    connect(address){
        /*if(this.botsocket!==null){
            this.botsocket.disconnect();
        }*/
        console.log('bot '+this.getName()+' trying to connect');
        this.botsocket = client.connect(address);
        if(this.botsocket!==null){
            this.connected = true;
        }
        this.botsocket.emit('nouveau_client', "bot "+this.name);
    }

    disconnect(){
        this.botsocket = null;
        this.connected = false;
    }

    reply(pseudo,message){
        if(this.botsocket!=null && this.connected){
            this.bot.reply(pseudo,message).then((reply)=>this.emit(reply));
        }else{
            console.log("you can't receive messages if you aren't connected yet");
        }
    }

    emit(reply){
        if(this.botsocket!=null && this.connected){
            console.log("The bot says: " + reply);
            this.botsocket.emit('message', reply);
        }else{
            console.log("The bot can't say anything if it's not connected");   
        }   
    }

    getName(){
        return this.name;
    }
    
}
