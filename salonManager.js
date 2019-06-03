var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var DanjouxPeterSalon = require("./salon.js");

module.exports = class DanjouxPeterSalon{

    constructor(){
        this.name = name;

        this.bots = new Set();
        
        server.listen(port);

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



    
    // to move to the salonManager
    addSalon(){
        this.bot.loadFile(filepath).then(()=>this.loading_done()).catch(()=>this.loading_error_file());
    }
    
}