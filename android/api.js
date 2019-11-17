var app;

// Should export all endpoint names to a dedicated file, along with database and collections names

const dbManager = require('../DBManager.js'),
      callSendApi = require('../facebook/sendMessage.js'),
      bcrypt = require('bcryptjs');

var houseDb;
var userDb;
var db;
var salt = 8;

dbManager.register((client) => {
  db = client.db("houseData");
  houseDb = db.collection("houses");
  userDb = db.collection("users");
});

function setApp(_app) {
  app = _app;
  
  app.post('/create-house', function(req, res) {
     let pword = req.body.password;
     makeNewHouse(pword)
       .then((data) => {
         res.status(200).send(JSON.stringify(data));
       })
       .catch(() => {res.status(400).send()});
  });
  
  app.post('/join-house', function(req, res) {
    let houseid = req.body.houseid
    let pword = req.body.password
    
    joinHouse(houseid, pword).then((data) => {
      res.status(200).send(JSON.stringify(data));
    })
    .catch((errCode) => {
      res.status(errCode || 400).send();
    })
  });
  
  app.post('/set-user-data', function(req, res) {
    setUserField("name", req.body.userid, req.body.name).then(() => {
      userDb.findOne({userid: req.body.userid}).then((user) => {
        var houseid = user.flatid;
        houseDb.findOne({flatid : houseid}).then((house) => {
          if(house) {
            let members = house.members;
            userDb.find({userid: {$in: members}, facebookid: {$exists: true}}).toArray().then((users) => {
              for(let user of users)
              {
                callSendApi(user.facebookid, {text : `Hey! ${req.body.name} has joined your flat on FlatFish!` });
              }
            });
          }
        });
      });
      res.status(200).send();
    }).catch((errCode) => {res.status(errCode).send()});
  });
  
  app.post('/set-facebook-id', function(req, res) {
    setUserField("facebookid", req.body.userid, req.body.id).then(() => {
      res.status(200).send();
    }).catch((errCode) => {res.status(errCode).send()});
  });
  
  
  return module.exports; // Allows chaining functions, e.g. require('this').setApp().somethingElse();
}

function setUserField(field, userid, value) {
  
  return new Promise((accept, reject) => {
    userDb.updateOne({userid: userid, [field]: {$exists : false}}, {$set: {[field]: value}}).then((data) => {
      if(data.modifiedCount == 1)
        accept();
      else
        reject(401);
    }).catch(() => {
      reject(400);
    });
  })
}

function joinHouse(id, pword) {
  return new Promise((accept, reject) => {
    houseDb.findOne({flatid: id}).then((data) => {
      if(!data) {reject(401); return; }
      if(!bcrypt.compareSync(pword, data.pword)) {reject(402); return; }
      makeNewUser(id).then((uid) => {
        houseDb.updateOne({flatid: id}, { $push: {"members": uid} }).then(() => {
          accept({userid: uid, houseid: id});
        });
      });
    });
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
      var hash = bcrypt.hashSync(pword, 8)
      houseDb.insertOne({flatid: id, members: [], pword: hash}).then(() => {
        makeNewUser(id).then((uid) => {
          houseDb.updateOne({flatid: id}, { $push: {"members": uid} }).then(() => {
            accept({userid: uid, houseid: id});
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