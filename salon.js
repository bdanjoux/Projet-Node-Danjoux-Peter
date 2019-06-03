var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var DanjouxPeterBot = require("./bot.js");
var ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)


module.exports = class DanjouxPeterSalon{

    constructor(name,port){
        console.log("listening on port "+port);
        this.name = name;
        this.port = port;
        this.bots = new Set();
        
        server.listen(port);

        // Chargement de la page index.html
        app.get('/', function (req, res) {
            console.log('port '+port);
            res.render(__dirname + '/chat_page.ejs',{ port: port });
        });

        var rply = this.replyToBots.bind(this); 

        io.sockets.on('connection', function (socket, pseudo) {
            // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
            socket.on('nouveau_client', function(pseudo) {
                pseudo = ent.encode(pseudo);
                socket.pseudo = pseudo;
                socket.broadcast.emit('nouveau_client', pseudo);
            });

            // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
            socket.on('message', function(message){
                message = ent.encode(message);
                socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
                console.log("pseudo: " + socket.pseudo);
                // On envoie le message à tous les bots qui ne sont pas celui qui a envoyé le message
                rply(socket.pseudo,message);
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

    toString(){
        return this.name;   
    }
    
    addBot(bot){
        console.log('salon add bot');
        if(bot!=null){
            console.log('adding bot '+bot.getName()+' to bots in salon '+ this.getName());
            console.log('bots : '+this.bots.size);
            this.bots.add(bot);
            console.log('bots : '+this.bots.size);
            bot.connect("http://localhost:"+this.port+"/");
        }else{
            console.log("you tried to add a null bot to the salon "+this.name+" at port "+this.port);
        }
    }

    getBot(name){
        for(var bot in this.bots){
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

    replyToBots(author,message){
        console.log('going through bots');
        this.bots.forEach(function(key,bot,set){
            if("bot "+bot.getName()!=author){
                bot.reply(author, message);
            }
        })
    }

}
