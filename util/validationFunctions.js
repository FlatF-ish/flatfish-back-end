var validationFuncs = {};
var userDb;

const dbManager = require("./util/DBManager.js");

dbManager.register((client) => {
	const db = client.db("houseData");
	userDb = db.collection("users");
});

// "Validation Function" has been shortened to VF in this file.

/*
	Takes a VF name and the function itself
	the VF can be asynchonous
	cannot override existing VFs
*/
function registerValidationFunction(name, func) {
	if (typeof name !== "string" || name.length === 0) { throw new Error("Validation function name must be a string."); }
	if (typeof func !== "function") { throw new Error("Validation function must be a function."); }
	if (validationFuncs[name]) { throw new Error("Validation function \"" + name + "\" already exists."); }
	validationFuncs[name] = func;
}

/*
	Creates a promise and errors in it immediately
	For when you need to error before you create the promise
	to ensure you always return a promise
*/
async function promiseError(err) {
	throw new Error(err);
}

/*
	This checks a VFs return object is well formed
	the VF can return a boolean, in which case this is not called
	the return structure should be
	{
		isValid: boolean
		// if isValid: false
		error: string
	}
*/
function checkValidFunctionObject(val) {
	if (Object.keys(val).length === 1 && typeof val.isValid === "boolean") { return true; }
	if (val.isValid === true && val.error !== undefined) { return false; }
	if (Object.keys(val).length === 2 && typeof val.isValid === "boolean" && typeof val.error === "string") { return true; }
	return false;
}

/*
	This checks the return variable of the VF and throws errors
	If boolean, form a return object from that
	elseif Object, check valid, throw error if not
	else throw error
*/
function checkValidFunctionReturn(val, name) {
	switch (typeof val) {
		case "boolean":
			if (val) {
				return { isValid: true };
			} else {
				return { isValid: false, error: "Unknown." };
			}
		case "object":
			if (checkValidFunctionObject(val)) {
				return val;
			} else {
				throw new Error("Invalid validation function return value for \"" + name + "\".");
			}
		default:
			throw new Error("Invalid validation function return value for \"" + name + "\".");
	}
}

/*
	This is the function that calls the VF and waits if the VF is asynchonous
	It then checks the VF gave a valid output and returns that
*/
async function handleValidationFunction(validFunc, val, name, userId, houseId) {
	var ret = validFunc(val, userId, houseId);
	if (ret instanceof Promise) {
		ret = await ret;
	}
	return checkValidFunctionReturn(ret, name);
}

/*
	First check dbManager is connect
	Then check the VF exists, if not throw a promise error
	If no userId given (aka anonymous call), return the promise given by handleValidationFunction
	Else, find the user's houseId, then do the same
*/
function callValidationFunction(name, val, userId) {
	if (!dbManager.isConnected()) { return promiseError("Called too early, database not connected."); }

	const validFunc = validationFuncs[name];
	if (validFunc === undefined) { return promiseError("No such validation function."); }

	if (userId === undefined) {
		return handleValidationFunction(validFunc, val, name);
	} else {
		return userDb.findOne({ userid: userId }).then(async (user) => {
			const houseId = user.houseid;
			// This will pass the promise from handleValidationFunction to be handled by the next "then" in this chain.
			// This "then" will be the one attached to callValidationFunction externally, due to the return before "userDb"
			return handleValidationFunction(validFunc, val, name, userId, houseId);
		});
	}
}

module.exports = { register: registerValidationFunction, call: callValidationFunction };