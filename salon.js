var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

module.exports = class DanjouxPeterSalon{

    constructor(name,port){
        this.name = name;

        this.bots = new Set();
        
        server.listen(8080);

        // Chargement de la page index.html
        app.get('/', function (req, res) {
          res.sendfile(__dirname + '/index.html');
        });

        io.sockets.on('connection', function (socket, pseudo) {
        
        // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
        socket.on('nouveau_client', function(pseudo) {
            pseudo = ent.encode(pseudo);
            socket.pseudo = pseudo;
            socket.broadcast.emit('nouveau_client', pseudo);
        });

        // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
        socket.on('message', function (message) {
            message = ent.encode(message);
            socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
            console.log("pseudo: " + socket.pseudo);
            if(!socket.pseudo.includes('benjamin')){
                myBot.reply(socket.pseudo, message);
            }else if(!socket.pseudo.includes('marie')){
                myBot2.reply(socket.pseudo, message);
            }
        });

    }



    addSalon(){
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
