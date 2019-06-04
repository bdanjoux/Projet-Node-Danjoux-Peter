
var Manager = require("./Manager.js");
//require("./server.js");

var manager = new Manager();

manager.addSalon("mon premier salon",8081,function(){
	manager.addBotToSalon("george",8081,function(){
		manager.botInSalonLoadDirectory("george",8081,"brain");
	});	
	manager.addBotToSalon("clara",8081,function(){
		manager.botInSalonLoadDirectory("clara",8081,"brain");
	});	
});

manager.addSalon("mon deuxieme salon",8083,function(){
	manager.moveBotFromSalonToSalon("george",8081,8083);
});

manager.getSalon(8083).connectDiscord();
console.log(manager.getAllBotNames());