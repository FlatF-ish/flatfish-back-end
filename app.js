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

// Imports dependencies and set up http server
const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()), // creates express http server
  bodyParser = require("body-parser"),
  jsonParser = require('./JSONParser.js'),
  sendMessage = require('./facebook/sendMessage.js'),
  processMessage = require('./facebook/processTaskMessage.js'),
  processPostback = require('./facebook/handleTaskPostback.js');

require('./android/api.js').setApp(app);

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));


app.use(bodyParser.urlencoded({
    extended: true
}));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  

  // Parse the request body from the POST
  let body = req.body;
  console.log('Hi');
  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Get the webhook event. entry.messaging is an array, but 
      // will only ever contain one event, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      
       // Get Post Scoped ID
      let sender_psid = webhook_event.sender.id;
      console.log('Sent by: ' + sender_psid)
      
      // Check the type of request
      if (webhook_event.message)
      {
        processMessage(sender_psid, webhook_event.message);    
      } else if (webhook_event.postback)
      {
        if (webhook_event.postback.payload.toLowerCase() === "reservation")
        {
          console.log("Ah, you want to make a reservation");
          processPostback(sender_psid, webhook_event.postback);
        }
        else
        {
          handlePostback(sender_psid, webhook_event.postback);    
        }
      }
    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "flatf-ish-demo";
  
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Check if a token and mode were sent
  if (mode && token) {
  
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      console.log("got " + mode);
      res.status(200);
    }
  }
});



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



