


module.exports = class DanjouxPeterSalon{
    
    constructor(name,port){
        var express = require('express')
        var app = express();
        var server = require('http').createServer(app);
        var DanjouxPeterBot = require("./bot.js");
        var ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
        console.log("listening on port "+port);
        this.name = name;
        this.port = port;
        this.bots = new Set();
        
        server.listen(port);
        var io = require('socket.io').listen(server);

        // Chargement de la page index.html
        app.get('/', function (req, res) {
            console.log('port '+port);
            res.render(__dirname + '/chat_page.ejs',{ port: port });
        });

        var rply = this.replyToBots.bind(this); 

        io.sockets.on('connection', function (socket, pseudo) {
            // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
            socket.join(port);
            socket.on('nouveau_client', function(pseudo) {
                pseudo = ent.encode(pseudo);
                socket.pseudo = pseudo;
                socket.broadcast.to(port).emit('nouveau_client', pseudo);
            });

            // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
            socket.on('message', function(message){
                message = ent.encode(message);
                socket.broadcast.to(port).emit('message', {pseudo: socket.pseudo, message: message});
                console.log("pseudo: " + socket.pseudo);
                // On envoie le message à tous les bots qui ne sont pas celui qui a envoyé le message
                rply(socket.pseudo,message);
            });
        });
    }


    // to move to the salonManager
    getPort(callback){
        if(callback!=null){
            callback(this.port);
        }
        return this.port;
    }

    getName(callback){
        if(callback!=null){
            callback(this.name);
        }
        return this.name;
    }

    toString(callback){
        if(callback!=null){
            callback(this.name);
        }
        return this.name;   
    }
    
    addBot(bot,callback){
        console.log('salon add bot');
        if(bot!=null){
            console.log('adding bot '+bot.getName()+' to bots in salon '+ this.getName());
            console.log('bots : '+this.bots.size);
            this.bots.add(bot);
            console.log('bots : '+this.bots.size);
            bot.connect("http://localhost:"+this.port+"/",this.port);
        }else{
            console.log("you tried to add a null bot to the salon "+this.name+" at port "+this.port);
        }if(callback!=null){
            callback();
        }
    }

    getBot(name,callback){
        console.log("getBot");
        var ret=null;
        this.bots.forEach(function(key,bot,set){
            if(name==bot.getName()){
                ret = bot;
            }    
        });
        if(callback!=null){
            callback(ret);
        }
        return ret;
    }

    getBotNames(callback){
        var ret = new Array();
        this.bots.forEach(function(key,bot,set){
            ret.push(bot.getName());
        });
        if(callback!=null){
            callback(ret);
        }
        return ret;
    }

    removeBot(botName,callback){
        this.bots.forEach(function(key,bot,set){
            if(bot.getName()===botName){
                bot.disconnect();
                set.delete(key);
            }    
        });
        if(callback!=null){
            callback();
        }
    }

    replyToBots(author,message,callback){
        console.log('going through bots');
        this.bots.forEach(function(key,bot,set){
            if("bot "+bot.getName()!=author){
                console.log('found bot to reply to, author '+author+' message '+message);
                bot.reply(author, message);
            }
        });
        if(callback!=null){
            callback();
        }
    }

}
