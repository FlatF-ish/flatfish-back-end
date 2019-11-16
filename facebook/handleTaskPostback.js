const
  callSendApi = require('./sendMessage.js');

function handleTaskPostback(sender_psid, postback)
{
  let response;
  let payload = postback.payload;
  
  if (payload === 'reservation')
  {
    console.log('Reservation made');
    response = { "text": "This is a work in progress, for now, do it yourself" }
  }
  
  callSendApi(sender_psid, response);
}

module.exports = handleTaskPostback;