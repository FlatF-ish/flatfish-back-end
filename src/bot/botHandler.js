// This will need to do all of the stuff to align facebook to the app
// This will make requests to the app api so that the server can do stuff
// After each endpoint is hit and a post request is made a response will be sent to the user
// Doing this will mean that things should all just work
// This part of the system will also be responsible dealing with the routes in the routing table
// Only do things on end of action - either meta is false - action ends or meta is true and data is provided (couold be more complex and require multipl emeta in future) - this is a simplification

const dbManager = global.include("./util/DBManager.js");

var userDb;
var db;

var botCallbacks = {};
var botStates = {};

dbManager.register((client) => {
	db = client.db("houseData");
	userDb = db.collection("users");
});

function registerBot(name, sendMessage) {
	if (typeof name !== "string" || name.length === 0) { throw new Error("Bot name must be a string."); }
	if (typeof sendMessage !== "function") { throw new Error("Bot sendMessage must be a function."); }
	if (botCallbacks[name]) { throw new Error("Bot \"" + name + "\" already exists."); }
	botCallbacks[name] = sendMessage;
	botStates[name] = {};
}

// Call all functions for sending messages
function sendAll(userId, message) {
	userDb.findOne({ userid: userId }).then((user) => {
		for (const func of botCallbacks) {
			func(user, message);
		}
	});
}
// BSID = Bot specific ID, like facebookId or discordId
function processMessage(botName, user, BSID, message) {
	const state = botStates[botName];
	if (state === undefined) throw new Error("Invalid bot name \"" + botName + "\"");

	// Do all the database stuff here :o
}

module.exports = { register: registerBot, sendAll: sendAll, processMessage: processMessage };
