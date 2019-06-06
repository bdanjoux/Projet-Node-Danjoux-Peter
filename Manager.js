var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var DanjouxPeterSalon = require("./salon.js");
var DanjouxPeterBot = require("./bot.js");

module.exports = class Manager{

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


    addSalon(name,port,callback){
        var newSalon = new DanjouxPeterSalon(name,port);
        console.log("added salon "+newSalon.getName());
        this.salons.add(newSalon);
        if(callback!=null){
            callback();    
        }
    }


    getSalon(port,callback){
        console.log('going through salon');
        var ret=null;
        this.salons.forEach(function(key,salon,set){
            console.log('salon '+salon.getName());
            if(salon!=null){
                if(salon.getPort()==port){
                    ret = salon;
                }
            }
        });
        if(callback!=null){
            callback(ret);
        }
        return ret;
    }
    
    addBot(name,callback){
        var newBot = new DanjouxPeterBot(name);
        this.unassignedBots.add(newBot);
        if(callback != null){
            callback();
        }
    }

    addBotToSalon(name,port,callback){
        var newBot = new DanjouxPeterBot(name);
        var theSalon = this.getSalon(port);
        console.log('the salon '+theSalon);
        if(theSalon==null){
            console.log("adding the newly created bot to the pool of unassigned bots")    
            unassignedBots.add(newBot);
        }else{
            theSalon.addBot(newBot);
            console.log("adding the newly created bot to the wanted salon")    
        }
        if(callback != null){
            callback();
        }
    }

    addBotToManager(name,callback){
        var newBot = new DanjouxPeterBot(name);
        this.unassignedBots.add(bot);
        if(callback!=null){
            callback();
        }
    }

    moveBotFromSalonToSalon(name,port1,port2,callback){
        var salon1 = this.getSalon(port1);
        var salon2 = this.getSalon(port2);
        if(salon1!=null && salon2!=null){
            var bot = salon1.getBot(name);
            if(bot!=null){
                bot.disconnect();
                salon1.removeBot(name);
                salon2.addBot(bot);
            }
        }
        if(callback!=null){
            callback();
        }
    }

    moveBotFromSalonToManager(name,port,callback){
        var salon = this.getSalon(port);
        if(salon!=null){
            var bot = salon.getBot(name);
            if(bot!=null){
                bot.disconnect();
                salon.removeBot(name);
                this.unassignedBots.add(bot);
            }
        }
        if(callback!=null){
            callback();
        }
    }

    moveBotFromManagerToSalon(name,port,callback){
        var salon = this.getSalon(port);
        if(salon!=null){
            var bot = this.getBotFromManager(name);
            if(bot!=null){
                bot.disconnect();
                this.removeBotFromManager(name);
                salon.addBot(bot);
            }
        }
        if(callback!=null){
            callback();
        }
    }

    botInSalonLoadDirectory(botName,port,directory,callback){
        console.log("botInSalonLoadDirectory");
        var done = false;
        var salon = this.getSalon(port);
        if(salon != null){
            var bot = salon.getBot(botName);
            if(bot!= null){
                bot.loadDirectory(directory);
                done = true;
            }
        }
        if(callback!=null){
            callback(done);
        }
        return done;
    }

    getBotFromManager(name,callback){
        var ret = null;
        unassignedBots.forEach(function(key,bot,set){
            if(bot.getName()==name){
                ret=bot;
            }
        });
        if(callback!=null){
            callback(ret);
        }
        return ret;
    }

    removeBotFromManager(name,callback){
        var ret = false;
        unassignedBots.forEach(function(key,bot,set){
            if(bot.getName()==name){
                set.delete(key);
                ret=true;
            }
        });
        if(callback!=null){
            callback(ret);
        }
        return ret;
    }

    getAllBotNames(){ //retourne uniquement les noms des bots qui sont dans un salon
        var ret = new Array();
        this.salons.forEach(function(key,salon,set){
            var salonName = salon.getName();
            var salonPort = salon.getPort();
            salon.getBotNames().forEach(function(botName){
                ret.push({salonName,botName,salonPort});
            });
        });
        this.unassignedBots.forEach(function(key,bot,set){
            var salonName = "non assigné";
            var salonPort = 0;
            var botName = bot.getName();
            ret.push({salonName,botName,salonPort});
        });
        return ret;
    }

    getAllSalonNames(){
        var ret = new Array();
        this.salons.forEach(function(key, salon, set){
            var salonName = salon.getName();
            var salonPort = salon.getPort();
            ret.push({salonName, salonPort});
        });
        return ret;
    }
};
