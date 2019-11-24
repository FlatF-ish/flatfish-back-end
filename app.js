/*
 * Starter Project for Messenger Platform Quick Start Tutorial
 *
 * Remix this as the starting point for following the Messenger Platform
 * quick start tutorial.
 *
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 *
 */

'use strict';

const dotenv = require('dotenv');
dotenv.config();

// Imports dependencies and set up http server
const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()), // creates express http server
  bodyParser = require("body-parser"),
  jsonParser = require('./JSONParser.js'),
  sendMessage = require('./messaging/sendMessage.js'),
  processMessage = require('./messaging/processTaskMessage.js'),
  dbManager = require('./DBManager.js'),
  callSendApi = require('./messaging/sendMessage.js'),
  processPostback = require('./messaging/handleTaskPostback.js');



require('./android/api.js').setApp(app);
require('./messaging/message_paths/pathSetup.js').setApp(app)

var usersDb;

dbManager.register((client) => {
  let db = client.db("houseData");
  usersDb = db.collection("users");
})


// Sets server port and logs message on success
var port = process.env.PORT || 1337
app.listen(port, () => console.log('Listening on port '+port));


app.use('/', bodyParser.urlencoded({
    extended: true
}));

app.use('/create-house', body_parser.json());
app.use('/join-house', body_parser.json());
app.use('/set-name', body_parser.json());
app.use('/set-facebook-id', body_parser.json());
app.use('/reserve/oven', body_parser.json());
app.use('/reserve/wasing-machine', body_parser.json());
app.use('/out/toilet-paper', body_parser.json());
app.use('/out/kitchen-roll', body_parser.json());
app.use('/lighting-control', body_parser.json());

app.get("/", (req, res) => {
  res.status(200).send("Its up!");
})

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  
  if (!dbManager.isConnected()) return;
  // Parse the request body from the POST
  let body = req.body;
  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {
    
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Get the webhook event. entry.messaging is an array, but 
      // will only ever contain one event, so we get index 0
      let webhook_event = entry.messaging[0];
      
      if(webhook_event.message || webhook_event.postback)
      {
         // Get Post Scoped ID
        let sender_psid = webhook_event.sender.id;

        usersDb.findOne({facebookid: sender_psid}).then((user) => {
          if(user) {
            // Check the type of request
            if (webhook_event.message)
            {
              processMessage(sender_psid, webhook_event.message);    
            } else if (webhook_event.postback)
            {
                processPostback(sender_psid, webhook_event.postback)
            }
          } else {
            // Send something like "Oops, you're not registered, send register [id] to connect your facebook account"?
            let notRegResponse = { text: "Oopsy Poopsy, you're not registered - news flash - WE HAVE AN APP - go download it - register and enter your key, see you soon!" }
            let alreadyRegResponse = { text: "Erm, that's awkward, looks like you've got someone else's key, we don't let people we don't know into our houses, stranger danger and all that, I'm sure you're nice, but we are risk averse so you can just stand on the step!" }
            let successResponse = { text: "Wooh hoo, Hi {[name]}! We're almost as surprised as you - that worked! Come on in to your new home! (We think you'll like it)" }
            let catastrophicErrorResponse = { text: "We're gonna be honest, we hoped this would never happen, but if you're seeing this, it has - just head for a nuclear bunker and keep your head down, things are getting pretty spicy over here" }
            usersDb.findOne({userid: webhook_event.message.text}).then((val) => {
              console.log(val);
              if(val) {
                if(val.facebookid) {
                  callSendApi(sender_psid, alreadyRegResponse);
                } else {
                  usersDb.updateOne({userid: webhook_event.message.text}, {$set: {"facebookid": sender_psid}}).then(() => {
                    usersDb.findOne({userid: webhook_event.message.text}).then((user) => {
                      successResponse.text = successResponse.text.replace("{[name]}", user.name || "Anonymous");
                      callSendApi(sender_psid, successResponse);
                    })
                  }).catch(() => {
                    callSendApi(sender_psid, catastrophicErrorResponse);
                  })
                }
              } else {
                callSendApi(sender_psid, notRegResponse);
              }
            }).catch(() => {
              callSendApi(sender_psid, notRegResponse);
            });
            
            
          }
        })
      }
      
      
    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// This not needed anymore???
// // Accepts GET requests at the /webhook endpoint
// app.get('/webhook', (req, res) => {
  
//   /** UPDATE YOUR VERIFY TOKEN **/
//   const VERIFY_TOKEN = "flatf-ish-demo";
  
//   // Parse params from the webhook verification request
//   let mode = req.query['hub.mode'];
//   let token = req.query['hub.verify_token'];
//   let challenge = req.query['hub.challenge'];
    
//   // Check if a token and mode were sent
//   if (mode && token) {
  
//     // Check the mode and token sent are correct
//     if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
//       // Respond with 200 OK and challenge token from the request
//       console.log('WEBHOOK_VERIFIED');
//       res.status(200).send(challenge);
    
//     } else {
//       // Responds with '403 Forbidden' if verify tokens do not match
//       console.log("got " + mode);
//       res.status(200);
//     }
//   }
// });



function handlePostback(sender_psid, received_postback)
{
  let response;
  let payload = received_postback.payload;
  
  if (payload === 'yes')
  {
    response = { "text": "Thanks!" }    
  } 
  else if (payload === 'no')
  {
    response = { "text": "Oops, try sending another image." }
  }
  
  sendMessage(sender_psid, response);

}



