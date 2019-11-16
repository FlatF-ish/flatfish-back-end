var title = "How can I help";

var items = [{title: "Send response a", payload:"reservation"}, {title: "Send response b", payload:"reservation"}, {title: "Send response c", payload:"reservation"}]

var buttonJson = "";

items.forEach(buttonGenerator)

function buttonGenerator(item)
{
    buttonJson += `{
        "type": "postback",
        "title": "${item.title}",
        "payload": "${item.payload}"
    },`
}


function jsonResponse()
{
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

module.exports = jsonResponse;