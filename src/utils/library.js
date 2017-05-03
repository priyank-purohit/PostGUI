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
	if (columns.length <= 0) {
		return [{id: 'error', label: 'ERROR: select a view...', type: 'string'}];
	}

	let plain_strings_query_builder = [];
	for (let i = 0; i < columns.length; i++) {
		plain_strings_query_builder.push({id: columns[i], label: columns[i], type: 'string'});
	}
	return plain_strings_query_builder;
}
