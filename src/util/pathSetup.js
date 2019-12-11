const dbManager = global.include("./util/DBManager.js");

var pathDb;
var app = global.app;

dbManager.register((client) => {
	var db = client.db("facebookData");

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


// var items = [
// 	{ pathId: "help", title: "How can I help", items: [{ title: "Make a reservation", payload: "r" }, { title: "Something has run out, raise the alarm", payload: "out" }, { title: "Control lighting", payload: "cl" }], status: "generic", path: "", requiresMeta: "false", mataType: "null" },
// 	{ pathId: "r", title: "What would you like to reserve", items: [{ title: "Reserve oven", payload: "ro" }, { title: "Reserve washing machine", payload: "rw" }], status: "generic", path: "", requiresMeta: "false", mataType: "null" },
// 	{ pathId: "ro", title: "Oven Reserved, would you like help with anything else?", items: [{ title: "Yes", payload: "help" }, { title: "No", payload: "exit" }], status: "action", path: "reserve/oven/", requiresMeta: "true", mataType: "int" },
// 	{ pathId: "rw", title: "Washing Machine Reserved, would you like help with anything else?", items: [{ title: "Yes", payload: "help" }, { title: "No", payload: "exit" }], status: "action", path: "reserve/washing-machine/", requiresMeta: "true", mataType: "int" },
// 	{ pathId: "out", title: "What has run out?", items: [{ title: "Toilet paper", payload: "tp" }, { title: "Kitchen Roll", payload: "kr" }], status: "generic", path: "", requiresMeta: "false", mataType: "null" },
// 	{ pathId: "tp", title: "Red alert for Toilet Paper sent, would you like help with anything else?", items: [{ title: "Yes", payload: "help" }, { title: "No", payload: "exit" }], status: "action", path: "out/toilet-paper/", requiresMeta: "false", mataType: "null" },
// 	{ pathId: "kr", title: "Red alert for Kitchen Roll sent, would you like help with anything else?", items: [{ title: "Yes", payload: "help" }, { title: "No", payload: "exit" }], status: "action", path: "out/kitchen-roll/", requiresMeta: "false", mataType: "null" },

// 	{ pathId: "cl", title: "What setting would you like?", items: [{ title: "Random", payload: "1" }, { title: "Random", payload: "1" }, { title: "Still", payload: "7" }], status: "action", path: "/lighting-control/", requiresMeta: "true", mataType: "int" },
// 	// {pathId: "", question: "", items: {title: "", payload: ""}}
// ];



var items = [
	{
		actionIndex: "help",
		path: "", 
		botAliases: ["help", "?", "h"],
		type: "invoke",
		title: "How can I help",
		options: [
			{ title: "Make a reservation", payload: "r" },
			{ title: "Something has run out, raise the alarm", payload: "out" },
			{ title: "Control lighting", payload: "cl" }
		],
		requireAccount: "false" 
	},

	{
		actionIndex: "r",
		path: "", 
		botAliases: ["reserve", "r"], 
		type: "invoke", 
		title: "What would you like to reserve",
		options: [
			{ title: "Reserve oven", payload: "ro" }, 
			{ title: "Reserve washing machine", payload: "rw" }
		], 
		requireAccount: "true" 
	},

	{
		actionIndex: "ro",
		path: "reserve/oven/", 
		botAliases: ["oven", "reserve-oven", "ro"], 
		type: "action", 
		options: [{title: "Yes", payload: "help"}], 
		steps: [{title: "How long would you like to reserve the oven for?", key: "reserve-time". type="int", min="5", max="60"}], 
		postInvoke: "anything-else", 
		requireAccount: "true"
	},
	{
		actionIndex: "rw",
		path: "reserve/washing-machine", 
		botAliases: ["rw", "reserve-washing-machine", "washing-machine"], 
		type: "action", 
		options: [{ title: "Yes", payload: "help" }, { title: "No", payload: "exit" }], 
		steps: [{title: "How long would you like to reserve the washing machine for?", key: "reserve-time". type="int", min="50", max="240"}], 
		postInvoke: "anything-else", 
		requireAccount: "true" 
	},
	{
		actionIndex: "out",
		path: "invoke", 
		botAliases: ["out", "run-out"], 
		type: "action", 
		title: "What has run out?",
		options: [{ title: "Toilet paper", payload: "tp" }, { title: "Kitchen Roll", payload: "kr" }], 
		requireAccount: "true" 
	},
	{
		actionIndex: "tp",
		path: "out/toilet-paper/", 
		botAliases: ["tp", "tr", "toilet-paper", "toilet-roll"], 
		type: "action", 
		title: "Red alert for Toilet Paper sent",
		// options: [{ title: "Yes", payload: "help" }, { title: "No", payload: "exit" }], 
		steps: [{title: "", key: "". type="", min="", max="", trueText="", falseText="", validityFunction: ""}], 
		postInvoke: "anything-else", 
		requireAccount: "true" 
	},
	{
		actionIndex: "kr",
		path: "out/kitchen-roll/", 
		botAliases: ["kp", "kr", "kitchen-paper", "kitchen-roll"], 
		type: "action",
		title: "Red alert for Kitchen Roll sent",
		// options: [{ title: "Yes", payload: "help" }, { title: "No", payload: "exit" }], 
		// steps: [{title: "", key: "". type="", min="", max="", trueText="", falseText="", validityFunction: ""}], 
		postInvoke: "anything-else", 
		requireAccount: "true" 
	},
	{
		actionIndex: "cl",
		path: "lighting-control/", 
		botAliases: ["control-lights, light, lights, cl"], 
		type: "action",
		// title: "What setting would you like?",
		// options: [{title: "", payload: ""}], 
		steps: [{title: "What setting would you like?", key: "light-function". type="int", min="0", max="7"}], 
		postInvoke: "anything-else", 
		requireAccount: "true" 
	},
	{
		actionIndex: "anything-else",
		path: "", 
		botAliases: ["anything-else"], 
		type: "invoke",
		title: "Do you need anything else?",
		options: [{title: "Yes", payload: "help"}, {title: "No", payload: "exit"}], 
		requireAccount: "false" 
	},
	// {
	// 	actionIndex: "light-function",
	// 	path: "", 
	// 	botAliases: ["light-function"], 
	// 	type: "",
	// 	title: "Choose the light function",
	// 	options: [{title: "", payload: ""}], 
	// 	steps: [{title: "", key: "". type="", min="", max="", trueText="", falseText="", validityFunction: ""}], 
	// 	postInvoke: "", 
	// 	requireAccount: "" 
	// },
	// {
	// 	actionIndex: "reserve-time"",
	// 	path: "", 
	// 	botAliases: [""], 
	// 	type: "",
	// 	title: "",
	// 	options: [{title: "", payload: ""}], 
	// 	steps: [{title: "", key: "". type="", min="", max="", trueText="", falseText="", validityFunction: ""}], 
	// 	postInvoke: "", 
	// 	requireAccount: "" 
	// },
]


// {
// 	actionIndex: "",
// 	path: "", 
// 	botAliases: [""], 
// 	type: "", 
// 	options: [{title: "", payload: ""}], 
// 	steps: [{title: "", key: "". type="", min="", max="", trueText="", falseText="", validityFunction: ""}], 
// 	postInvoke: "", 
// 	requireAccount: "" 
// }




function addPathsToDatabase() {
	pathDb.insertMany(
		items
	);
}

app.get("/reset-paths", (req, res) => {
	if (!dbManager.isConnected()) { res.status(400).send("Try again my g"); return; }
	pathDb.deleteMany().then(() => {
		addPathsToDatabase();
		res.status(200).send("All done!");
	});
});