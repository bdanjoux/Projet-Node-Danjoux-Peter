// server.js
// load the things we need
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var Manager = require("./Manager.js");
var app = express();

app.use(session({
    key: 'user_sid',
    secret: 'Tolkien', //salt for the hash
    resave: false,
    saveUnitialized:false
})); //TODO: trouver comment enregistrer le username dans le cookie de session

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());
app.use(express.urlencoded());

//BDD
var mongoose = require('mongoose');
//var mongoDB = 'mongodb://localhost:27017/ChatBot';
var mongoDB = 'mongodb+srv://ChatBotUser:Rvm5xqne6SpNJbDQ@cluster0-dsjyq.gcp.mongodb.net/ChatBot?retryWrites=true&w=majority';

mongoose.connect(mongoDB, {useNewUrlParser:true});

//Declaration of the database
let User = new mongoose.model("user", {
    username: String,
    password: String
});//End of declaration

// set the view engine to ejs
app.set('view engine', 'ejs');

var isLogged = false;
var isSigned = false;

var db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error : "));


var manager = new Manager();

manager.addSalon("mon premier salon",8081,function(){
    manager.addBotToSalon("george",8081,function(){
        manager.botInSalonLoadDirectory("george",8081,"brain");
    });
});

//Template
app.set('view engine', 'ejs');
app.set('ejs', require('ejs').renderFile);
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');

//Routes

//get

// index page
app.get('/', function(req, res) {
    session.name = req.query.username;

    if(!isLogged){
        res.render('pages/index');
    }
    else {
        res.render('pages/activity', {username: req.query.username});
    }
    console.log(session.name);
});

// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

// lobby page
app.get('/botLobby', function(req, res){
    res.render('pages/botLobby.ejs');
});

// admin page
app.get('/botAdmin', function(req, res) {
    res.render('pages/botAdmin.ejs');
});

//bot create page
app.get('/botCreate', function(req, res){
   res.render('pages/botCreate.ejs');
});

//salon create page
app.get('/salonCreate', function(req, res){
    res.render('pages/salonCreate.ejs');
});

// admin page
app.get('/allBotNames', function(req, res) {
    res.send(JSON.stringify(manager.getAllBotNames()));
});

app.post('/allBotNamesInSalon', function(req, res,next) {
    console.log(req.body.salon);
    console.log("about to send "+manager.getAllBotNamesInSalon(req.body.salon));
    res.send(JSON.stringify(manager.getAllBotNamesInSalon(req.body.salon)));
    
});

// admin page
app.get('/allConfigFiles', function(req, res) {
    res.send(JSON.stringify(manager.getAllAvailableConfigFiles()));
});


app.get('/allSalonNames', function(req, res){
    res.send(JSON.stringify(manager.getAllSalonNames()));
});

app.get('/logout', function(req, res){
    req.session.destroy();
    isLogged = false;
    res.render('pages/index.ejs');
});

//post
app.post('/submit_login', function(req, res)
{
    User.findOne({username: req.body.username, password: req.body.password}, function(err, data){
        console.log(data);
        if(data != null){
            isLogged = true;
            res.redirect('/?username='+req.body.username);
            req.session.user = {username:req.body.username}; //on enregistre l'utilisateur dans le cookie
            console.log(req.session.user);
        } else {
            console.log("The username and password don't match");
            res.redirect('/');
        }
    });
});

//post
app.post('/submit_signIn', function(req, res, next){
    User.findOne({username: req.body.username}, function(err, data){
        console.log(data);
        if(data == null){
            var user = new User({username: req.body.username, password: req.body.password}, function(err){
                if(err){throw err;}
            });
            user.save(function(err, data){
                if(err){throw(err);}
                console.log(data.username);
                console.log(data.password);
            });

            res.render('pages/index.ejs');
            isSigned = true;
        } else {
            console.log("Pseudo déjà utilisé !");
            res.render('pages/index.ejs');
        }
    })
});

app.post('/createBot', function(req, res, next){
    if(req.body.salonName = "No lobby")
    {
        manager.addBot(req.body.botName);
    }
    else
    {
        manager.addBotToSalon(req.body.botName, req.body.salonName);
    }
    console.log(manager.getAllBotNames());
    res.render('pages/createSuccess.ejs');
});

app.post('/createSalon', function(req, res, next){
    manager.addSalon(req.body.salonName, parseInt(req.body.salonPort));
    console.log(manager.getAllSalonNames());
    res.render('pages/createSuccess.ejs');
});

app.post('/botInSalonLoadFile', function(req, res, next){
    console.log("");
    manager.botInSalonLoadFile(req.body.name,parseInt(req.body.port),req.body.configFile);//TODO: récupérer les trucs du fichier botCreate
    res.render('pages/botAdmin.ejs');
});

app.post('/chat', function(req, res, next){
    var port = req.body.port;
    var url = "http://localhost:"+port;
    res.redirect(url);
});



app.listen(8080);
console.log('8080 is the magic port');