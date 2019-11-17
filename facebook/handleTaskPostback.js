const
  callSendApi = require('./sendMessage.js');

const dbmanager = require('../DBManager.js'),
      messageGenerator = require('./../JSONParser.js'),
      workOutTasksFromPaths = require('./workOutTasksFromPaths.js');

var db;
var pathDb;

dbmanager.register((client) => {
  db = client.db("facebookData")

  pathDb = db.collection("pathData");
});

async function handleTaskPostback(sender_psid, postback)
{
  workOutTasksFromPaths(sender_psid, postback.payload);
}

module.exports = handleTaskPostback;