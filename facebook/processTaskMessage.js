const dbmanager = require('../DBManager.js');

const
  handleMessageWithAttachment = require('./handleAttachment.js'),
  workOutTasksFromPaths = require('./workOutTasksFromPaths.js');

var pathDb;
var db;

dbmanager.register((client) => {
  db = client.db("facebookData")

  pathDb = db.collection("pathData");
});

async function handleTaskMessage (sender_psid, received_message)
{
    if (userMessageTable.pendingResponse) {
      routingLogic.handleMetadata(sender_psid, received_message)
    } else {
      if (received_message.attachments)
      {
        handleMessageWithAttachment(received_message);
      }
      else
      {
          workOutTasksFromPaths(sender_psid , received_message.text);
      }
    }
}

module.exports = handleTaskMessage;