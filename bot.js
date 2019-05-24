var client = require("socket.io-client");

module.exports = class DanjouxPeterBot{

    constructor(name){
        this.bot = new RiveScript();
        this.name = name;
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
        this.botsocket.emit('nouveau_client', "bot "+this.name);
    }

    reply(pseudo,message){
        if(this.botsocket!==null){
            this.bot.reply(pseudo,message).then((reply)=>this.emit(reply));
        }else{
            console.log("you can't receive messages if you aren't connected yet");
        }
    }

    emit(reply){
        console.log("The bot says: " + reply);
        this.botsocket.emit('message', reply);
    }
    
}
