function buttonMessageGenerator(data) {
	var buttonJson = "";
	var title = data.title;
	for (const btn of data.items) {
		buttonJson += buttonGenerator(btn);
	}
	return jsonResponse(title, buttonJson);
}

function integerMessageGenerator(data) {
	// console.log("hello");
	return {
		text: `How long would you like to reserve it for?`
	};
}

function buttonGenerator(item) {
	return `{
        "type": "postback",
        "title": "${item.title}",
        "payload": "${item.payload}"
    },`;
}

function jsonResponse(title, buttonJson) {
	if (title === "") {
		title = "Well that's embarrasing, there's no question, but here are some options anyway:";
	}

	var jsonForResponse = `
  {
      "attachment":
      {
          "type": "template",
          "payload":
          {
              "template_type": "generic",
              "elements": 
              [
                  {
                      "title": "${title}",
                      "buttons": 
                      [
                             ${buttonJson}
                      ]
                  }
              ]
          }
      }
  }`;
	return jsonForResponse;
}

module.exports = { buttonMessageGenerator: buttonMessageGenerator, integerMessageGenerator: integerMessageGenerator };