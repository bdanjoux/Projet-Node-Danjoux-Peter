

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
var client = require("socket.io-client");

//RiveScript = require("./node_modules/rivescript/lib/rivescript.js");
RiveScript = require('rivescript');
var bot = new RiveScript();
 
// Load a directory full of RiveScript documents (.rive files). This is for
// Node.JS only: it doesn't work on the web!
bot.loadDirectory("brain").then(loading_done).catch(loading_error);
 
// Load an individual file.
bot.loadFile("brain/eliza.rive").then(loading_done).catch(loading_error);
 
// Load a list of files all at once (the best alternative to loadDirectory
// for the web!)
bot.loadFile([
  "brain/begin.rive",
  "brain/admin.rive",
  "brain/clients.rive"
]).then(loading_done).catch(loading_error);
 
// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

function loading_done() {
  console.log("Bot has finished loading!");
 
  // Now the replies must be sorted!
  bot.sortReplies();
    
  // And now we're free to get a reply from the brain
    
}

server.listen(8080);

var botsocket = client.connect("http://localhost:8080/");
botsocket.emit('nouveau_client', 'bot');

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
        if(socket.pseudo!=='bot'){
            // NOTE: the API has changed in v2.0.0 and returns a Promise now.
            bot.reply(socket.pseudo, message).then(function(reply) {
                console.log("The bot says: " + reply);
                botsocket.emit('message', reply);
            });
        }
    });
});



// It's good to catch errors too!
function loading_error(error, filename, lineno) {
  console.log("Error when loading files: " + error);
}