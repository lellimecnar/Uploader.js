let keys = [],
	vals = [];

export default class Private {
	set(key, val) {
		var index = keys.indexOf(key);

		if (index <= 0) {
			index = keys.push(key) - 1;
		}

		vals[index] = val;
	}

	get(key) {
		return vals[keys.indexOf(key)];
	}
}
