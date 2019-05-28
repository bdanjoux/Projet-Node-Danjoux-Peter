var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var DanjouxPeterBot = require("./bot.js");


module.exports = class DanjouxPeterSalon{

    constructor(name,port){
        console.log("listening on port "+port);
        this.name = name;
        this.port = port;
        this.bots = new Set();
        
        server.listen(port);

        // Chargement de la page index.html
        app.get('/', function (req, res) {
          res.sendfile(__dirname + '/index.html',{port:port});
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
                // On envoie le message à tous les bots qui ne sont pas celui qui a envoyé le message
                for(var bot in bots){
                    if(bot.getName()!==sovket.pseudo){
                        bot.reply(socket.pseudo, message);
                    }
                }
            });
        });
    }


    // to move to the salonManager
    getPort(){
        return this.port;
    }

    getName(){
        return this.name;
    }
    
    addBot(bot){
        if(bot!==null){
            this.bots.add(bot);
            bot.connect("http://localhost:"+this.port+"/");
            socket.broadcast.emit('nouveau_client', bot.getName());
        }else{
            console.log("you tried to add a null bot to the salon "+this.name+" at port "+this.port);
        }
    }

    getBot(name){
        for(var bot in bots){
            if(name===bot.getName()){
                return bot;
            }
        }
        return null;
    }

    removeBot(botName){
        for(var bot in this.bots){
            if(bot.getName()===botName){
                bots.delete(bot);
            }
        }
    }


}
