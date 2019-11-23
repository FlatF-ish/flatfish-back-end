
function handleMessageWithAttachment(received_message)
{
  let response;
  let attachment_url = received_message.attachments[0].payload.url;
  response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the correct picture?",
            "subtitle": "Please tell me",
            "image_url": attachment_url,
            "buttons": [{
                "type": "postback",
                "title": "Yes!",
                "payload": "yes"
              }, {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }],
          }]
        }
      }
    }
  return response;
}

module.exports = handleMessageWithAttachment;