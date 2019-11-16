const
  jsonParser = require('./../JSONParser.js'),
  callSendApi = require('./sendMessage.js');

function handleMessageWithAttachment(received_message)
{
  let response;
  let attachment_url = received_message.attachments[0].payload.url;
  response = {
      "attachment":
      {
        "type": "template",
        "payload":
        {
          "template_type": "generic",
          "elements": [
          {
            "title": "Is this the correct picture?",
            "subtitle": "Please tell me",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes"
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              },
            ],
          }
          ]
        }
      }
    }
  return response;
}

function handleTaskMessage (sender_psid, received_message)
{
  let response;
  
  if (received_message.text) 
  {
    if (received_message.text.toLowerCase() === "help")
    {
      response = jsonParser();
      console.log(jsonParser());
      console.log("Success");
    }
    else
    {
      response = 
      {
        "text": `{received_message.text} is not a recognised command, please enter a different one`  
      }
    }
  }
  else if (received_message.attachments)
  {
    response = handleMessageWithAttachment(received_message);
  }
  
  callSendApi(sender_psid, response);
}

module.exports = handleTaskMessage;