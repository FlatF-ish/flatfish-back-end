const
  

const dbmanager = require('../DBManager.js'),
      callSendApi = require('./sendMessage.js'),
      messageGenerator = require('./../JSONParser.js'),
      workOutTasksFromPaths = require('./workOutTasksFromPaths.js'),
      routingLogic = require('./message_paths/routingLogic.js');


var db;
var pathDb;

dbmanager.register((client) => {
  db = client.db("facebookData")

  pathDb = db.collection("pathData");
});

async function handleTaskPostback(sender_psid, postback)
{
  if (userMessageTable.pendingResponse) {
    routingLogic.handleMetadata(sender_psid, path)
  } else {
    workOutTasksFromPaths(sender_psid, postback.payload);
  }
}

module.exports = handleTaskPostback;