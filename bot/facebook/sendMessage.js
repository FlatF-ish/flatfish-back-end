const request = require("request"),
	bot = global.include("./bot/botHandler.js"),
	generators = global.include("./bot/facebook/messageGenerators.js");

// Send a facebook message
bot.register("facebook", function(user, message) {
	const response = { text: message };
	sendMessage(user.facebookid, response);
});

function sendMessage(senderPSID, response) {
	const requestBody = {
		recipient: {
			id: senderPSID
		},
		message: response
	};

	// Send the http request to messenger

	request({
		uri: "https://graph.facebook.com/v2.6/me/messages",
		qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
		method: "POST",
		json: requestBody
	}, (err, res, body) => {
		if (!err) {
			console.log("Sent successfully");
		} else {
			console.error("Failed" + err);
		}
	});
}