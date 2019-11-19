const dbManager = require('../../DBManager.js');

var app;
var pathDb;

dbManager.register((client) => {
  var db = client.db("facebookData")

  pathDb = db.collection("pathData");
});

// var items = [
//     {pathId: "help", type: "string", title: "How can I help", items: [{title: "Make a reservation", payload: "r"}, {title: "Something has run out, raise the alarm", payload: "out"}]}, 
//     {pathId: "r", type: "button", title: "What would you like to reserve", items: [{title: "Reserve oven", payload: "ro"}, {title: "Reserve washing machine", payload: "rw"}]},
//     {pathId: "ro", type: "integer", title: "Oven Reserved, would you like help with anything else?", items: [{title: "Yes", payload: "help"}, {title: "No", payload: "exit"}]}, 
//     {pathId: "rw", type: "integer", title: "Washing Machine Reserved, would you like help with anything else?", items: [{title: "Yes", payload: "help"}, {title: "No", payload: "exit"}]}, 
//     {pathId: "out", type: "button", title: "What has run out?", items: [{title: "Toilet paper", payload: "tp"}, {title: "Kitchen Roll", payload: "kr"}]},
//     {pathId: "tp", type: "button", title: "Red alert for Toilet Paper sent, would you like help with anything else?", items: [{title: "Yes", payload: "help"}, {title: "No", payload: "exit"}]}, 
//     {pathId: "kr", type: "button", title: "Red alert for Kitchen Roll sent, would you like help with anything else?", items: [{title: "Yes", payload: "help"}, {title: "No", payload: "exit"}]}, 
  
//     //{pathId: "", question: "", items: {title: "", payload: ""}}
// ]



var items = [
    {pathId: "help", title: "How can I help", items: [{title: "Make a reservation", payload: "r"}, {title: "Something has run out, raise the alarm", payload: "out"}], status: "generic", path: "", requiresMeta: "false", mataType: "null"}, 
    {pathId: "r", title: "What would you like to reserve", items: [{title: "Reserve oven", payload: "ro"}, {title: "Reserve washing machine", payload: "rw"}], status: "generic", path: "", requiresMeta: "false", mataType: "null"},
    {pathId: "ro", title: "Oven Reserved, would you like help with anything else?", items: [{title: "Yes", payload: "help"}, {title: "No", payload: "exit"}], status: "action", path: "reserve/oven/", requiresMeta: "true", mataType: "int"}, 
    {pathId: "rw", title: "Washing Machine Reserved, would you like help with anything else?", items: [{title: "Yes", payload: "help"}, {title: "No", payload: "exit"}], status: "action", path: "reserve/washing-machine/", requiresMeta: "true", mataType: "int"}, 
    {pathId: "out", title: "What has run out?", items: [{title: "Toilet paper", payload: "tp"}, {title: "Kitchen Roll", payload: "kr"}], status: "generic", path: "", requiresMeta: "false", mataType: "null"},
    {pathId: "tp", title: "Red alert for Toilet Paper sent, would you like help with anything else?", items: [{title: "Yes", payload: "help"}, {title: "No", payload: "exit"}], status: "action", path: "out/toilet-paper/", requiresMeta: "false", mataType: "null"}, 
    {pathId: "kr", title: "Red alert for Kitchen Roll sent, would you like help with anything else?", items: [{title: "Yes", payload: "help"}, {title: "No", payload: "exit"}], status: "action", path: "out/kitchen-roll/", requiresMeta: "false", mataType: "null"}, 
  
    //{pathId: "", question: "", items: {title: "", payload: ""}}
]


function AddPathsToDatabase()
{
    pathDb.insertMany(
        items
    ) 
}

function setApp(_app)
{
    app = _app;
    app.get("/reset-paths", (req, res) => {
        if(!dbManager.isConnected()) {res.status(400).send("Try again my g"); return;}
        pathDb.deleteMany().then( () => {
            AddPathsToDatabase()
            res.status(200).send("All done!");
        });
    })
}

module.exports = {setApp: setApp}