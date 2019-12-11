const VF = global.include('./util/validationFunctions.js');
/* eslint-disable */
// To keep these formatted nicely
const booleanTrueValues =  ['true',  't', '1', 'on',  'yes', 'y', 'sure'];
const booleanFalseValues = ['false', 'f', '0', 'off', 'no',  'n', 'nah' ];
/* eslint-enable */

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

var parseFunctions = {
	text: function(step, value) {
		return { value: value };
	},
	raw: (...data) => parseFunctions.text(...data),
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
	int: function(step, value) {
		const ret = parseFunctions.float(step, value);
		if (ret.error) return ret;
		if (ret.value % 1 !== 0) return { error: '"' + ret.value + '" is not an integer' };
		return ret;
	},
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
	options: function(step, value) {
		if (!step.options) throw new Error('No options in step');

		if (value[0] === '#' && isPositiveInteger(value.substring(1))) {
			const idx = +value.substring(1);
			if (idx >= 1 && idx <= step.options.length) {
				return { value: step.options[idx - 1].payload };
			} else {
				return { error: 'Index "' + idx + '" not in range (1,' + step.options.length + ')' };
			}
		} else {
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

module.exports = { parse: parseInput };