/*
 * Starter Project for Messenger Platform Quick Start Tutorial
 *
 * Remix this as the starting point for following the Messenger Platform
 * quick start tutorial.
 *
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 *
 */

"use strict";

const dotenv = require("dotenv");
dotenv.config();

global.include = (path) => require.main.require(path); // Oddly, doing global.include = require.main.require doesn't work?

// Imports dependencies and set up http server
const
	express = require("express"),
	bodyParser = require("body-parser"),
	app = express().use(bodyParser.json()), // creates express http server
	dbManager = require("./util/DBManager.js");

global.app = app; // This might be nicer than calling setApp on some includes

require("./bot/facebook/sendMessage.js");
require("./bot/facebook/receiveMessage.js");

// require("./api/apis/android.js").setApp(app);

var usersDb;

dbManager.register((client) => {
	const db = client.db("houseData");
	usersDb = db.collection("users");
});

// Sets server port and logs message on success
var port = process.env.PORT || 1337;
app.listen(port, () => console.log("Listening on port " + port));

app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.status(200).send("Its up!");
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
