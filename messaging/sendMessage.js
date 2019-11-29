const request = require("request");

function callSendApi(senderPSID, response) {
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

module.exports = callSendApi;