var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var DanjouxPeterSalon = require("./salon.js");
var DanjouxPeterBot = require("./bot.js");

module.exports = class DanjouxPeterSalon{

    constructor(){
        this.salons = new Set();
        this.unassignedBots = new Set();
        
        server.listen(1111);
        //the Manager is situated on port 1111

        // Chargement de la page de management
        app.get('/', function (req, res) {
          res.sendfile(__dirname + '/management.html');
        });
    
        io.sockets.on('connection', function (socket, pseudo) {
            // Si un administrateur demande la création d'un salon
            // il précise un nom et un port pour celui-ci, le salon est créé, et ajouté au pool.
            socket.on('nouveau_salon', function(name,port) {
                if(port===1111){
                    console.log("the port 1111 is reserved for management");
                }else{
                    this.addSalon(name,port);   
                }
            });

            // Si un administrateur demande la création d'un bot
            // il précise un nom, le bot est créé, et ajouté au pool des bots non assignés.
            socket.on('nouveau_bot', function (name) {
                this.addBot(name);
            });

            // Si un administrateur demande la création d'un bot et son ajout à un pool
            // il précise un nom et un port, le bot est créé, et ajouté au salon correspondant.
            socket.on('nouveau_bot_to_salon', function (name,port) {
                this.addBotToSalon(name,port);
            });
        });
    }


    addSalon(name,port){
        var newSalon = new DanjouxPeterSalon(name,port);
        this.salons.add(newSalon);
        console.log("added salon "+name);
    }


    getSalon(port){
        for(var salon of this.salons){
            if(salon!=null){
                if(()=>salon.getPort()==port){
                    return salon;
                }
            }
        }
        return null;
    }
    
    addBot(name){
        newBot = new DanjouxPeterBot(name);
        this.unassignedBots.add(newBot);
    }

    addBotToSalon(name,port){
        var newBot = new DanjouxPeterBot(name);
        var theSalon = ()=>this.getSalon(port);
        if(theSalon===null){
            console.log("adding the newly created bot to the pool of unassigned bots")    
            unassignedBots.add(newBot);
        }else{
            ()=>theSalon.addBot(newBot);
            console.log("adding the newly created bot to the wanted salon")    
        }
    }

    botInSalonLoadDirectory(botName,port,directory){
        ()=>done = false;
        ()=>salon = this.getSalon(port);
        if(()=>salon != null){
            ()=>bot = salon.getBot(botName);
            if(()=>bot!= null){
                ()=>bot.loadDirectory(directory);
                ()=>done = true;
            }
        }
        return ()=>done;
    }

}
