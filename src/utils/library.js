exports.rot13ED = function(str) {
	// eslint-disable-next-line
	return str.replace(/[a-zA-Z]/g, function(c) {
		// eslint-disable-next-line
		return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
	});
}

// Retrieves value of key from the config file
exports.getFromConfig = function(key = "title") {
	let configFile = require("../data/config.json");
	let config = JSON.parse(JSON.stringify(configFile));
	return config[key]
}

exports.visitPage = function(url = "http://www.google.ca") {
	window.open(url, "_blank");
}

exports.getQBRules = function() {
	return {
		condition: 'AND',
		rules: [{
			id: 'price',
			operator: 'less',
			value: 10.25
		}, {
			condition: 'OR',
			rules: [{
				id: 'category',
				operator: 'equal',
				value: 2
			}, {
				id: 'category',
				operator: 'equal',
				value: 1
			}]
		}]
	};
}

exports.getQBFilters = function() {
	return [{
		id: 'name',
		label: 'Name',
		type: 'string'
	}, {
		id: 'category',
		label: 'Category',
		type: 'integer',
		input: 'select',
		values: {
			1: 'Books',
			2: 'Movies',
			3: 'Music',
			4: 'Tools',
			5: 'Goodies',
			6: 'Clothes'
		},
		operators: ['equal', 'not_equal', 'in', 'not_in', 'is_null', 'is_not_null']
	}, {
		id: 'in_stock',
		label: 'In stock',
		type: 'integer',
		input: 'radio',
		values: {
			1: 'Yes',
			0: 'No'
		},
		operators: ['equal']
	}, {
		id: 'price',
		label: 'Price',
		type: 'double',
		validation: {
			min: 0,
			step: 0.01
		}
	}, {
		id: 'id',
		label: 'Identifier',
		type: 'string',
		placeholder: '____-____-____',
		operators: ['equal', 'not_equal'],
		validation: {
			format: /^.{4}-.{4}-.{4}$/
		}
	}];
}
