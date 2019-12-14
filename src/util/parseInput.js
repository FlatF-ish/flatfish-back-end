const VF = global.include('./util/validationFunctions.js');
/* eslint-disable */
// To keep these formatted nicely
const booleanTrueValues =  ['true',  't', '1', 'on',  'yes', 'y', 'sure'];
const booleanFalseValues = ['false', 'f', '0', 'off', 'no',  'n', 'nah' ];

// Replaces a character at an index, thought this was as simple as str[i] = 'y' but noooo
String.prototype.replaceAt = function(index, replacement) {
	return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};
/* eslint-enable */

// First check type and validate
// Then check for validityFunc, call and parse output
async function parseInput(step, value, user) {
	const func = parseFunctions[step.type];
	if (func === undefined) {
		throw new Error('Unrecognised step type "' + step.type + '"');
	}
	const ret = func(step, value);
	if (!ret.error && step.validityFunc) {
		var validRet;
		validRet = await VF.call(step.validityFunc, ret.value, user);
		if (!validRet.isValid) {
			return { error: validRet.error };
		}
	}
	return ret;

}

function isPositiveInteger(n) {
	return n >>> 0 === parseFloat(n);
}

// Split messages like:
// this is a test => [this, is, a, test]
// this is a "real test" => [this, is, a, real test]
// this is a "cool \" hecking test" => [this, is, a, cool " hecking test]
function splitMessage(msg) {
	let token = '';
	let inQuotes = null;
	const out = [];
	for (let i = 0; i < msg.length; i++) {
		const c = msg[i];
		if (inQuotes) {
			switch (c) {
				case inQuotes:
					if (i > 0 && msg[i - 1] === '\\') token = token.replaceAt(token.length - 1, c);
					else inQuotes = null;
					continue;
			}
		} else {
			switch (c) {
				case ' ':
					out.push(token);
					token = '';
					continue;
				case '"': case '\'':
					if (i > 0 && msg[i - 1] === '\\') token = token.replaceAt(token.length - 1, c);
					else inQuotes = c;
					continue;
			}
		}
		token += c;
	}
	if (token.length > 0) out.push(token);
	return out;
}

// Return format = {value: val} or {error: error}
var parseFunctions = {
	// Text is raw, just return value
	text: function(step, value) {
		return { value: value };
	},
	// Same as text
	raw: (...data) => parseFunctions.text(...data),
	// Get min and max (or take defaults)
	// Get string versions of them, printed ranges like (0, 180427349023) don't look very nice
	// Parse, check not NaN and in range
	float: function(step, value) {
		const min = step.min || 0;
		const max = step.max || Number.MAX_SAFE_INTEGER;
		const minPrintVal = min <= -Number.MAX_SAFE_INTEGER ? '-inf' : min;
		const maxPrintVal = max >= Number.MAX_SAFE_INTEGER ? 'inf' : max;

		const parsed = +value;
		if (isNaN(parsed)) {
			return { error: '"' + value + '" is not a number' };
		} else {
			if (parsed < min || parsed > max) return { error: '"' + value + '" not in range (' + minPrintVal + ',' + maxPrintVal + ')' };
			return { value: parsed };
		}
	},
	// Call above and ensure value % 1 == 0
	int: function(step, value) {
		const ret = parseFunctions.float(step, value);
		if (ret.error) return ret;
		if (ret.value % 1 !== 0) return { error: '"' + ret.value + '" is not an integer' };
		return ret;
	},
	// Check against list of true and false values above
	boolean: function(step, value) {
		const lowerValue = value.toLowerCase();
		if (booleanTrueValues.indexOf(lowerValue) !== -1) {
			return { value: true };
		} else if (booleanFalseValues.indexOf(lowerValue) !== -1) {
			return { value: false };
		} else {
			return { error: '"' + value + '" could not be recognised as a boolean value, try true/false, y/n, on/off, etc.' };
		}
	},
	// Allow for options input by typing their payload, or doing #index
	options: function(step, value) {
		if (!step.options) throw new Error('No options in step');

		if (value[0] === '#' && isPositiveInteger(value.substring(1))) {
			// Selecting by doing #1 to #length
			const idx = +value.substring(1);
			if (idx >= 1 && idx <= step.options.length) {
				return { value: step.options[idx - 1].payload };
			} else {
				return { error: 'Index "' + idx + '" not in range (1,' + step.options.length + ')' };
			}
		} else {
			// Selecting by typing payload (case insensitive)
			const options = [];
			for (const option of step.options) {
				options.push(option.payload.toLowerCase());
			}
			const idx = options.indexOf(value.toLowerCase());
			if (idx === -1) {
				return { error: 'Invalid option, please choose from: ' + options.join(', ') };
			} else {
				return { value: step.options[idx].payload };
			}
		}
	}
};

module.exports = { parse: parseInput, split: splitMessage };