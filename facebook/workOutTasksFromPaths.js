const jsonParser = require('./../JSONParser.js'),
      dbmanager = require('../DBManager.js'),
      callSendApi = require('./sendMessage.js'),
      routingLogic = require('./message_paths/routingLogic.js');

var db;
var pathDb;
var houseDb;

dbmanager.register((client) => {
  db = client.db("facebookData")

  pathDb = db.collection("pathData");
  houseDb = db.collection("houseData");
});


async function workOutTasksFromPaths (sender_psid, path)
{
  let response;
  
  if (path)
  { 
    const val = await db.collection('pathData').findOne({ pathId: path.toLowerCase() });
    if(val)
    {
      routingLogic.setEndpointOnMessage(sender_psid, path);
      if(val.type === "integer")
      {
        //const house = await houseDb.findOne({ : });
        //house.rota.toiletPaper.next().person();
        //next = house.rota.next()
        // Needs some sort of hash map thing - yay
        //response = jsonParser.integerMessageGenerator(val);
        response = jsonParser.buttonMessageGenerator(val);
        console.log(response);
      }
      else
      {
        response = jsonParser.buttonMessageGenerator(val);
        // This should call the relevant endpoint instead, making all events one big if, ifelse, etc. is bad and gross :)
        if (val.pathId = 'tp')
        {
          
            // Get person who's turn it is to get the toilet paper
            // Get their message id
            // Send them a message saying that it is their turn to get it
            // Give them options to remind me later or done it
        }
        
        if (val.pathId = 'kr')
        {
            // Get person who's turn it is to get the kitchen roll
            // Get their message id
            // Send them a message saying that it is their turn to get it
            // Give them options to remind me later or done it
        }
      }
    }
    else
    {
      if (path.toLowerCase() === "exit")
      {
        response = 
        {
          text: 'Bye for now!'
        }
      }
      else
      {
        response = 
        {
          text: `Sorry, "${path}" is not a recognised command, please enter a different one`
        }
      }
    }
  }
    
  callSendApi(sender_psid, response);
}

module.exports = workOutTasksFromPaths;