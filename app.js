
var Manager = require("./Manager.js");
//require("./server.js");

var manager = new Manager();

manager.addSalon("mon premier salon",8081,function(){
	manager.addBotToSalon("george",8081,function(){
		manager.botInSalonLoadDirectory("george",8081,"brain");
	});	
});

manager.addSalon("mon deuxieme salon",8083,function(){
	manager.moveBotFromSalonToSalon("george",8081,8083);
});

console.log(manager.getSalon(8083).getBotNames());