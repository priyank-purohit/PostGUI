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
	  "condition": "AND",
	  "rules": [
	    {
	      "id": "feature_id",
	      "field": "feature_id",
	      "type": "string",
	      "input": "text",
	      "operator": "equal",
	      "value": "1"
	    },
	    {
	      "condition": "OR",
	      "rules": [
	        {
	          "id": "feature_type",
	          "field": "feature_type",
	          "type": "string",
	          "input": "text",
	          "operator": "equal",
	          "value": "1"
	        },
	        {
	          "id": "feature_type",
	          "field": "feature_type",
	          "type": "string",
	          "input": "text",
	          "operator": "equal",
	          "value": "2"
	        }
	      ]
	    }
	  ],
	  "valid": true
	};*/
}

exports.getQBRulesDELETEME = function() {
	return {
		"condition": "AND",
		"rules": [{
			"id": "genome_index_id",
			"field": "genome_index_id",
			"type": "string",
			"input": "text",
			"operator": "equal",
			"value": "1"
		}],
		"valid": true
	};
}

exports.getQBFilters = function(table, columns) {
	if (columns.length <= 0) {
		return [{ id: 'error', label: 'ERROR: select a view...', type: 'string' }];
	}

	let plain_strings_query_builder = [];
	for (let i = 0; i < columns.length; i++) {
		plain_strings_query_builder.push({ id: columns[i], label: columns[i], type: 'string', operators: ['equal', 'not_equal', 'greater', 'less', 'greater_or_equal', 'less_or_equal', 'is_not_null', 'in', 'is_null'] });
	}
	return plain_strings_query_builder;
}

exports.translateOperatorToPostgrest = function(operator) {
	let dict = [
		['equal', 'eq'],
		['not_equal', 'neq'],
		['greater', 'gt'],
		['less', 'lt'],
		['greater_or_equal', 'gte'],
		['less_or_equal', 'lte'],
		['is_not_null', 'not.is.null'],
		['in', 'in'],
		['is_null', 'is.null']
	];

	for (let i = 0; i < dict.length; i++) {
		if (dict[i][0] === operator) {
			return dict[i][1];
		}
	}
	return "eq";
}
