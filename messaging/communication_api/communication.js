// This will need to do all of the stuff to align facebook to the app
// This will make requests to the app api so that the server can do stuff
// After each endpoint is hit and a post request is made a response will be sent to the user
// Doing this will mean that things should all just work
// This part of the system will also be responsible dealing with the routes in the routing table
// Only do things on end of action - either meta is false - action ends or meta is true and data is provided (couold be more complex and require multipl emeta in future) - this is a simplification

const dbManager = require('../DBManager.js.js'),
      callSendApi = require('../facebook/sendMessage.js.js');

var userDb;
var db;

dbManager.register((client) => {
  db = client.db("houseData");
  userDb = db.collection("users");
});

// Call all functions for sending messages
function sendAll(userId, message) {
  sendFacebookMessage(userId, message);
}

// Send a facebook message
function sendFacebookMessage(userId, message) {

    userDb.findOne({userid: userId}).then((user) => {
        response = {text: message};
        callSendApi(user.facebookid, response);
    });
}

module.exports = {sendFacebookMessage: sendFacebookMessage, sendAll: sendAll}