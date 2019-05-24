
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)

//RiveScript = require("./node_modules/rivescript/lib/rivescript.js");
RiveScript = require('rivescript');
//var bot = new RiveScript();

var DanjouxPeterBot = require("./bot.js");
var myBot = new DanjouxPeterBot("bot_benjamin");
var myBot2 = new DanjouxPeterBot("bot_marie");

myBot.loadDirectory("brain");
myBot2.loadDirectory("brain");
 
// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

server.listen(8080);

myBot.connect("http://localhost:8080/");
myBot2.connect("http://localhost:8080/");

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
});

// It's good to catch errors too!
function loading_error(error, filename, lineno) {
  console.log("Error when loading files: " + error);
}