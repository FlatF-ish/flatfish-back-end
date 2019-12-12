const fs = require('fs').promises;
// Nice sleep function for async
const sleep = require('util').promisify(setTimeout);

const apis = [];

let apisAdded = false;

// Start addDirectory recursive func, enforce single call
function init(path) {
	if (apisAdded) return;
	addInDirectory(path);
	apisAdded = true;
}

// Recursive function to scan directories and add apis with their file path as api path
async function addInDirectory(dir, origDir) {
	// First call, set original dir to dir
	origDir = origDir || dir;
	const files = await fs.readdir('src/' + dir);
	for (const file of files) {
		// Get full path to file
		const fileDir = dir + '/' + file;
		// Get file stats (for isDirectory())
		const stats = await fs.stat('src/' + fileDir);
		if (stats.isDirectory()) {
			// If directory, recurse with fileDir as new dir
			addInDirectory(fileDir.toLowerCase(), origDir);
		} else {
			// Else, get an api path from file path
			// e.g. ./apis/this/thing.js => this/thing
			const apiPath = fileDir.substring(origDir.length + 1, fileDir.length - 3).toLowerCase();
			let api;
			try {
				// Include api file
				// This can be a function or a map of names to functions
				// If its a function, add an api with this files path to that function
				// Else, iterate the keys in that object and add each key as an api, where path = filePath + '/' + objectKey
				// If said key is 'root', set to just filePath
				api = global.include(fileDir);
				if (typeof api === 'object') {
					if (Object.keys(api).length === 0) {
						// Give the error a nice name :)
						const e = new Error('No exports to register');
						e.name = 'APIError';
						throw e;
					}
					for (const apiName in api) {
						// Calculate sub api path, if root, just use apiPath
						const apiNameLower = apiName.toLowerCase();
						let apiPathSub;
						if (apiName === 'root') {
							apiPathSub = apiPath;
						} else {
							apiPathSub = apiPath + '/' + apiNameLower;
						}
						// Register
						console.log('Registering API "' + apiPathSub + '"...');
						await registerApi(apiPathSub, api[apiName]);
						console.log('Successful');
					}
				} else {
					// Normal function (single endpoint in file), register
					console.log('Registering API "' + apiPath + '"...');
					await registerApi(apiPath, api);
					console.log('Successful');
				}
			} catch (e) {
				// Show an error in console and continue loading other apis
				console.log('Failed to register API "' + apiPath + '" => ' + e);
			}
		}
	}
}

// Validate path and func, add to apis and create endpoint
function registerApi(path, func) {
	if (typeof path !== 'string' || path.length === 0) { throw new Error('Api path must be a string.'); }
	if (typeof func !== 'function') { throw new Error('Api function must be a function.'); }
	if (apis[path]) { throw new Error('Api "' + path + '" already exists.'); }
	apis[path] = func;
	createEndpoint(path);
}

// Create endpoint, if api not ready, wait until it is.
async function createEndpoint(path) {
	while (global.app === undefined) {
		await sleep(100);
	}
	// Get callback from api function, return in normal http fashion
	global.app.get('/api/' + path, async (req, res) => {
		const ret = await callApi(path, req.body);
		res.status(ret.status).send(JSON.stringify(ret));
	});
}

// Ensure output is object with status and responseText defined
function validateOutput(data) {
	if (typeof data !== 'object') {
		data = { status: 200, data: data };
	}
	if (typeof data.reponseText !== 'string') {
		data.responseText = data.responseText === undefined ? 'Successful' : data.responseText.toString();
	}
	return data;
}

// Grab api, call (and wait if needed), validate output and return
async function callApi(path, data) {
	const func = apis[path];
	if (func === undefined) {
		throw new Error('Api "' + path + '" does not exist');
	}
	try {
		let ret = func(data);
		if (ret instanceof Promise) {
			ret = await ret;
		}
		return validateOutput(ret);
	} catch (e) {
		return { status: 500, data: { error: e } };
	}
}

module.exports = { call: callApi, init: init };