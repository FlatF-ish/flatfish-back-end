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

    
const dbmanager = require('./../../DBManager.js'),
      callSendApi = require('./../sendMessage.js');
var db;
var pathDb;

var userMessageTable; // need to decide how to implement this - maybe a class?

dbmanager.register((client) => {
  db = client.db("facebookData")

  pathDb = db.collection("pathData");
});


async function setEndpointOnMessage(sender_psid, path) {
    const route = await pathDb.findOne({ pathId: path.toLowerCase() });
    
    if (userMessageTable.requiresMeta) {
        if (userMessageTable.metaDataType === "int") {
            console.log("parse message as int");
            console.log("Ensure that only an int is remaining");
            console.log("If there is any confusion then send another message asking for clarification");
        }
    }

    switch(route.status)
    {
        case "action":
            userMessageTable.path = route.path;
            if(route.requiresMeta) {

                userMessageTable.pendingResponse = true;
                userMessageTable.metaTypeExpected = route.metaType;
                console.log("You require" + route.mataType)
                
                // Need to get sender_psid
                callSendApi(sender_psid, {text: `Please enter ${userMessageTable.metaTypeExpected}`});

            } else {
                console.log("End of action");
                console.log("Hit endpoint from here");
                
                fetch(userMessageTable.path).then(res => {
                    console.log("successfully made the request");
                });
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

function processMetadata(messyMeta, metaType) {

    var words = messyMeta.split(' ');
    
    let cleanMeta;

    if(metaType === 'int') {
        for(let word in words) {
            if(word.isInteger()) {
                cleanMeta = word;
                break;
            }
        }
    }

    // For checking strings could put possible values in the database and do a comparison against them
    // Could loop through the array looking to see if any of those options have been entered

    return cleanMeta;
}

function handleMetadata(sender_psid, userMetaMessage)
{
    let data = {meta: processMetadata(userMetaMessage, userMessageTable.metaTypeExpected)};
    fetch(userMessageTable.path, {
        method: "POST",
        body: JSON.stringify(data)
    }).then(res => {
        userMessageTable.pendingResponse = false;
        console.log("Successfully made the request");
    })
}


module.exports = {setEndpointOnMessage: setEndpointOnMessage, handleMetadata: handleMetadata}