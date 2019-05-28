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
        this.bot.loadFile(filepath).then(()=>this.loading_done()).catch(()=>this.loading_error_file());
    }

    loadDirectory(directorypath){
        this.bot.loadDirectory(directorypath).then(()=>this.loading_done()).catch(()=>this.loading_error_dir());
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
        this.botsocket = client.connect(address);
        if(this.botsocket!==null){
            connected = true;
        }
        this.botsocket.emit('nouveau_client', "bot "+this.name);
    }

    disconnect(){
        this.botsocket = null;
        this.connected = false;
    }

    reply(pseudo,message){
        if(this.botsocket!==null && this.connected){
            this.bot.reply(pseudo,message).then((reply)=>this.emit(reply));
        }else{
            console.log("you can't receive messages if you aren't connected yet");
        }
    }

    emit(reply){
        if(this.botsocket!==null && this.connected){
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
