
var Manager = require("./Manager.js");

var manager = new Manager();

manager.addSalon("mon premier salon",8080);
manager.addBotToSalon("george",8080);
manager.botInSalonLoadDirectory("george",8080,"brain");