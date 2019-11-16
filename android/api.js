var app;

const mongodb = require('mongodb');

const uri = "mongodb+srv://admin:WEv6C7X8vKmV9dqn@flatfishdb-47b1n.mongodb.net?retryWrites=true&w=majority";
const client = mongodb.MongoClient;

var connected = false;
var houseDb;
var userDb;
var db;

client.connect(uri, { useNewUrlParser: true }, (err, client) => {
  if (err) throw err;
  db = client.db("houseData");
  houseDb = db.collection("houses");
  userDb = db.collection("users");
  connected = true;
});

function setApp(_app) {
  app = _app;
  
  app.post('/create-house', function(req, res) {
    console.log(req);
//     let pword = "a";
//     makeNewHouse(pword)
//       .then((userid, houseid) => {
        
//       })
//       .catch(() => {res.status(400)});
    res.status(200).send();
  });
}

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

// returns promise, cb: (houseid, userid)
function makeNewHouse(pword) {
  return new Promise((accept, reject) => {
    houseDb.distinct("flatid").then((data) => {
      let id = ""
      do {
        id = makeid(5);
      } while(data.indexOf(id) != -1);
      houseDb.insertOne({flatid: id, members: [], pword: pword}).then(() => {
        makeNewUser(id).then((uid) => {
          houseDb.updateOne({flatid: id}, { $push: {"members": uid} }).then(() => {
            accept(id, uid);
          }).catch(() => {reject()});
        });
      }).catch(() => {reject()});
      
    });
  });
}

// returns promise, cb: (userid)
function makeNewUser(flatid) {
  return new Promise((accept, reject) => {
    userDb.distinct("userid").then((data) => {
      let id = ""
      do {
        id = makeid(5);
      } while(data.indexOf(id) != -1);
      userDb.insertOne({userid: id, flatid: flatid}).then(() => {
        accept(id);  
      }).catch(() => {reject()});
      
    });
  });
}

module.exports = {setApp: setApp}