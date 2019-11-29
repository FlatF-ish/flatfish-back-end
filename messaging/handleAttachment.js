
function handleMessageWithAttachment(receivedMessage) {
	const attachmentUrl = receivedMessage.attachments[0].payload.url;
	const response = {
		attachment: {
			type: "template",
			payload: {
				template_type: "generic",
				elements: [{
					title: "Is this the correct picture?",
					subtitle: "Please tell me",
					image_url: attachmentUrl,
					buttons: [{
						type: "postback",
						title: "Yes!",
						payload: "yes"
					}, {
						type: "postback",
						title: "No!",
						payload: "no",
					}],
				}]
			}
		}
	};
	return response;
}

module.exports = handleMessageWithAttachment;