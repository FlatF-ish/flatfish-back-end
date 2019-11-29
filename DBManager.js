const mongodb = require("mongodb");

const uri = `mongodb+srv://${process.env.MONGO_ADMIN_NAME}:${process.env.MONGO_ADMIN_PASS}@${process.env.MONGO_DB}?retryWrites=true&w=majority`;
var client = mongodb.MongoClient;

var callbacks = [];
var connected = false;

client.connect(uri, { useNewUrlParser: true }, (err, _client) => {
	if (err) throw err;
	client = _client;
	connected = true;
	callbacks.forEach((a) => {
		a(client);
	});
	callbacks = [];
});


function getClient() {
	if (!connected) { return null; }
	return client;
}

function isConnected() {
	return connected;
}

function registerDatabaseCallback(cb) {
	if (connected) { cb(client); return; }
	callbacks.push(cb);
}

module.exports = { register: registerDatabaseCallback, getClient: getClient, isConnected: isConnected };