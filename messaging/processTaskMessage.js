// const dbmanager = require("../DBManager.js");

const	handleMessageWithAttachment = require("./handleAttachment.js"),
	workOutTasksFromPaths = require("./workOutTasksFromPaths.js");

// var pathDb;
// var db;

// dbmanager.register((client) => {
// 	db = client.db("facebookData");

// 	pathDb = db.collection("pathData");
// });

async function handleTaskMessage(senderPSID, receivedMessage) {
	if (userMessageTable.pendingResponse) {
		routingLogic.handleMetadata(senderPSID, receivedMessage);
	} else {
		if (receivedMessage.attachments) {
			handleMessageWithAttachment(receivedMessage);
		} else {
			workOutTasksFromPaths(senderPSID, receivedMessage.text);
		}
	}
}

module.exports = handleTaskMessage;