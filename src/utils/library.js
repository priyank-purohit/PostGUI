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
			empty: true
		}]
	};
	// This return statment shows example for having default query
	/*return {
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
	};*/
}

exports.getQBFilters = function(table, columns) {
	return [{
		id: 'column1',
		label: 'Column 1',
		type: 'string'
	},
	{
		id: 'column2',
		label: 'Column 2',
		type: 'string'
	},
	{
		id: 'column3',
		label: 'Column 3',
		type: 'string'
	},
	{
		id: 'column4',
		label: 'Column 4',
		type: 'string'
	},
	{
		id: 'column5',
		label: 'Column 5',
		type: 'string'
	}];
}
