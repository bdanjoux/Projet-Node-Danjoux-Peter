
var Manager = require("./Manager.js");
//require("./server.js");

var manager = new Manager();

manager.addSalon("mon premier salon",8081,function(){
	manager.addBotToSalon("george",8081,function(){
		manager.botInSalonLoadDirectory("george",8081,"brain");
	});	
});

manager.addSalon("mon deuxieme salon",8083,function(){
	manager.addBotToSalon("claraa",8083,function(){
		manager.botInSalonLoadDirectory("claraa",8083,"brain");
	});	
});

