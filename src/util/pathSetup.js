const dbManager = global.include('./util/DBManager.js');

var pathDb;
var app = global.app;

dbManager.register((client) => {
	var db = client.db('facebookData');

	pathDb = db.collection('pathData');
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
		actionIndex: 'help',
		path: '',
		botAliases: ['help', '?', 'h'],
		type: 'invoke',
		title: 'How can I help',
		options: [
			{ title: 'Make a reservation', payload: 'reserve' },
			{ title: 'Something has run out, raise the alarm', payload: 'out' },
			{ title: 'Control lighting', payload: 'lights' }
		],
		requireAccount: 'false'
	},

	{
		actionIndex: 'reserve',
		path: '',
		botAliases: ['reserve', 'r'],
		type: 'invoke',
		title: 'What would you like to reserve',
		options: [
			{ title: 'Reserve oven', payload: 'reserve-oven' },
			{ title: 'Reserve washing machine', payload: 'reserve-washing-machine' }
		],
		requireAccount: 'true'
	},

	{
		actionIndex: 'reserve-oven',
		path: 'reserve/oven/',
		botAliases: ['oven', 'reserve-oven', 'ro'],
		type: 'action',
		steps: [
			{
				title: 'How long would you like to reserve the oven for?',
				key: 'reserve-time',
				type: 'int',
				min: 5,
				max: 60
			}
		],
		postInvoke: 'anything-else',
		requireAccount: 'true'
	},
	{
		actionIndex: 'reserve-washing-machine',
		path: 'reserve/washing-machine',
		botAliases: ['rw', 'reserve-washing-machine', 'washing-machine'],
		type: 'action',
		steps: [
			{
				title: 'How long would you like to reserve the washing machine for?',
				key: 'reserve-time',
				type: 'int',
				min: 50,
				max: 240
			}
		],
		postInvoke: 'anything-else',
		requireAccount: 'true'
	},
	{
		actionIndex: 'out',
		path: '',
		botAliases: ['out', 'run-out'],
		type: 'invoke',
		title: 'What has run out?',
		options: [
			{ title: 'Toilet paper', payload: 'out-toilet-paper' },
			{ title: 'Kitchen Roll', payload: 'out-kitchen-roll' }
		],
		requireAccount: 'true'
	},
	{
		actionIndex: 'out-toilet-paper',
		path: 'out/toilet-paper/',
		botAliases: ['tp', 'tr', 'toilet-paper', 'toilet-roll'],
		type: 'action',
		postInvoke: 'anything-else',
		requireAccount: 'true'
	},
	{
		actionIndex: 'out-kitchen-roll',
		path: 'out/kitchen-roll/',
		botAliases: ['kp', 'kr', 'kitchen-paper', 'kitchen-roll'],
		type: 'action',
		postInvoke: 'anything-else',
		requireAccount: 'true'
	},

	// Lights
	{
		actionIndex: 'lights',
		path: '',
		botAliases: ['control-lights', 'light', 'lights', 'cl'],
		type: 'invoke',
		title: 'What would you like to do to the lights?',
		options: [
			{ title: 'Set state', payload: 'lights-state' },
			{ title: 'Set mode', payload: 'lights-mode' }
		],
		requireAccount: 'true'
	},
	{
		actionIndex: 'lights-state',
		path: 'lighting-control/',
		botAliases: ['set-lights', 'turn-lights', 'sl'],
		type: 'action',
		steps: [
			{
				title: 'What state would you like to set the lights to?',
				type: 'boolean',
				key: 'state',
				trueText: 'On',
				falseText: 'Of'
			}
		],
		postInvoke: 'anything-else',
		requireAccount: 'true'
	},
	{
		actionIndex: 'lights-mode',
		path: 'lighting-control/',
		botAliases: ['lights-mode', 'lm'],
		type: 'action',
		steps: [
			{
				title: 'What setting would you like?',
				key: 'light-function',
				type: 'int',
				min: 1,
				max: 7
			}
		],
		postInvoke: 'anything-else',
		requireAccount: 'true'
	},


	{
		actionIndex: 'anything-else',
		path: '',
		botAliases: ['anything-else'],
		type: 'invoke',
		title: 'Do you need anything else?',
		options: [
			{ title: 'Yes', payload: 'help' },
			{ title: 'No', payload: 'exit' }
		],
		requireAccount: 'false'
	},
];


function addPathsToDatabase() {
	pathDb.insertMany(
		items
	);
}

app.get('/reset-paths', (req, res) => {
	if (!dbManager.isConnected()) { res.status(400).send('Try again my g'); return; }
	pathDb.deleteMany().then(() => {
		addPathsToDatabase();
		res.status(200).send('All done!');
	});
});