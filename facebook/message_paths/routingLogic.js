// Get previous route  from lookup table
// Get new route from database based on current action
// Check status
// If status is generic do ...
    // Set existing path to empty
// If status is action do ...
    // Check path
    // Set existing path to new path
    // Check requiresMeta (bool)
// If status is meta do ...
    // Find out the expected type for the metadata
    // Ask user to fill in the meta data
    // Strip the metadata of anything that is not quite right to leave the expected value
    // Append the prrocessed metadata to the existing path

    
const dbmanager = require('../DBManager.js');

var db;
var pathDb;

var userMessageTable; // need to decide how to implement this - maybe a class?

dbmanager.register((client) => {
  db = client.db("facebookData")

  pathDb = db.collection("pathData");
});


function setPathOnMessage() {
    const route = await pathDb.findOne({ pathId: path.toLowerCase() });
    
    if (userMessageTable.requiresMeta){
        if (userMessageTable.metaDataType === "int") {
            console.log("parse message as int");
            console.log("Ensure that only an int is remaining");
            console.log("If there is any confusion then send another message asking for clarification");
        }
    }

    switch(path.status)
    {
        case "action":
            userMessageTable.path = route.path;
            if(route.requiresMeta) {
                // Send a message asking for metadata of type
                console.log("You require" + route.mataType)
                userMessageTable.metaTypeExpected = route.metaType;
            } else {
                console.log("End of action");
                console.log("Hit endpoint from here");
            }
            break;
        case "generic":
            userMessageTable.path = null;
            break;
        default: 
            userMessageTable.path = null;
            break;
    }
}


module.exports = {setPathOnMessage: setPathOnMessage}