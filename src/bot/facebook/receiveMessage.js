const dbManager = global.include("./util/DBManager.js"),
	bodyParser = require("body-parser"),
	bot = global.include("./bot/botHandler.js");

const app = global.app;

app.use("/webhook", bodyParser.urlencoded({
	extended: true
}));

dbManager.register((client) => {
	const db = client.db("houseData");
	usersDb = db.collection("users");
});

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
	if (!dbManager.isConnected()) return;
	// Parse the request body from the POST
	const body = req.body;
	// Check the webhook event is from a Page subscription
	if (body.object === "page") {

		// Iterate over each entry - there may be multiple if batched
		body.entry.forEach(function(entry) {

			// Get the webhook event. entry.messaging is an array, but
			// will only ever contain one event, so we get index 0
			const webhookEvent = entry.messaging[0];

			if (webhookEvent.message || webhookEvent.postback) {
				// Get Post Scoped ID
				const senderPSID = webhookEvent.sender.id;

				// Get user from ID, if user doesn't exist, it will be null, which is fine
				usersDb.findOne({ facebookid: senderPSID }).then((user) => {
					bot.processMessage("facebook", user, webhookEvent.message !== undefined ? webhookEvent.message : webhookEvent.postback);
				});
			}

		});

		// Return a '200 OK' response to all events
		res.status(200).send("EVENT_RECEIVED");

	} else {
		// Return a '404 Not Found' if event is not from a page subscription
		res.sendStatus(404);
	}

});


/*
This needs to be moved to a register endpoint, or atleast another file
Since this will only be callable via the facebook bot, we should inclue something in the db structure that lets us specify that

const notRegResponse = { text: "Oopsy Poopsy, you're not registered - news flash - WE HAVE AN APP - go download it - register and enter your key, see you soon!" };
const alreadyRegResponse = { text: "Erm, that's awkward, looks like you've got someone else's key, we don't let people we don't know into our houses, stranger danger and all that, I'm sure you're nice, but we are risk averse so you can just stand on the step!" };
const successResponse = { text: "Wooh hoo, Hi {[name]}! We're almost as surprised as you - that worked! Come on in to your new home! (We think you'll like it)" };
const catastrophicErrorResponse = { text: "We're gonna be honest, we hoped this would never happen, but if you're seeing this, it has - just head for a nuclear bunker and keep your head down, things are getting pretty spicy over here" };
usersDb.findOne({ userid: webhookEvent.message.text }).then((user) => {
	console.log(user);
	if (user) {
		if (val.facebookid) {
			callSendApi(senderPSID, alreadyRegResponse);
		} else {
			usersDb.updateOne(	{ userid: webhookEvent.message.text },
								{ $set: { facebookid: senderPSID } }
								).then((user) => {
				successResponse.text = successResponse.text.replace("{[name]}", user.name || "Anonymous");
				callSendApi(senderPSID, successResponse);
			}).catch(() => {
				callSendApi(senderPSID, catastrophicErrorResponse);
			});
		}
	} else {
		callSendApi(senderPSID, notRegResponse);
	}
}).catch(() => {
	callSendApi(senderPSID, notRegResponse);
});

*/
