

// dbmanager = require("../DBManager.js"),
// callSendApi = require("./sendMessage.js"),
// messageGenerator = require("./../JSONParser.js"),
const	workOutTasksFromPaths = require("./workOutTasksFromPaths.js"),
	routingLogic = require("./message_paths/routingLogic.js");


var db;
// var pathDb;

// dbmanager.register((client) => {
// 	db = client.db("facebookData");
// 	pathDb = db.collection("pathData");
// });

// This function will basically be removed completely
async function handleTaskPostback(senderPSID, postback) {
	if (userMessageTable.pendingResponse) {
		routingLogic.handleMetadata(senderPSID, path);
	} else {
		workOutTasksFromPaths(senderPSID, postback.payload);
	}
}

module.exports = handleTaskPostback;