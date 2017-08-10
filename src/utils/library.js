////////////////////////////////////////////////////////////////////////////////////////////////////
// Config Methods
////////////////////////////////////////////////////////////////////////////////////////////////////

// Returns value of KEY from config file
exports.getValueFromConfig = function(key) {
	let file, config;
	try {
		file = require("../data/config.json");
		config = JSON.parse(JSON.stringify(file));
		if (config[key] !== undefined) {
			return config[key];
		}
		else {
			return null;
		}
	} catch (error) {
		console.log("Error in getValueFromConfig: " + error.message);
		return null;
	}
}

// Returns value of OPTION for specific TABLE and DBINDEX
// NOTE: check for null value when this function is used
exports.getTableConfig = function(dbIndex, table, option) {
	if (dbIndex !== null && table !== null && option !== null) {
		try {
			let file, config;
			file = require("../data/config.json");
			config = JSON.parse(JSON.stringify(file));

			if (config["databases"][dbIndex]["tableRules"][table][option] !== undefined) {
				return config["databases"][dbIndex]["tableRules"][table][option];
			} else {
				return null;
			}
		} catch (error) {
			console.log("Error in  getTableConfig: " + error.message);
			return null;
		}
	} else {
		return null;
	}
}

// Returns value of OPTION for specific TABLE and COLUMN and DBINDEX
// NOTE: check for null value when this function is used
exports.getColumnConfig = function(dbIndex, table, column, option) {
	if (dbIndex !== null && table !== null && option !== null && option !== null) {
		try {
			let columnRules = this.getTableConfig(dbIndex, table, "columnRules");
			
			if (columnRules[column][option] !== undefined) {
				return columnRules[column][option];
			} else {
				return null;
			}
		} catch (error) {
			console.log("Error in  getColumnConfig: " + error.message);
			return null;
		}
	} else {
		return null;
	}
}

// returns true if ELEMENT is in ARRAY
exports.inArray = function(element, array) {
	if (array && element)
		return array.indexOf(element) > -1;
	else
		return false;
}

// return true iff table.column is part of the default columns defined
exports.isColumnDefaultView = function(table, column) {
	if (table && column) {
		let defaultColumns = this.getTableConfig(table, "defaultViewColumns");
		if (defaultColumns === null) {
			return null;
		} else {
			if (this.inArray(column, defaultColumns) === true) {
				return true;
			} else {
				return false;
			}
		}
	}
}
// Opens the specified URL in a different tab
exports.visitPage = function(url = "http://www.google.ca") {
	window.open(url, "_blank");
}

// Returns the initial query (i.e. pre-formatted default query for a table)
// Convert this into a function that loads a default entry for ALL tables
// If no rules are defined, it will return a blank default entry.
exports.getQBRules = function() {
	return {
		condition: 'AND',
		rules: [{
			empty: true
		}]
	};
}

// Returns a list of columns
exports.getQBFilters = function(table, columns) {
	if (columns.length <= 0) {
		return [{ id: 'error', label: 'ERROR: select a view...', type: 'string' }];
	}

	let plain_strings_query_builder = [];
	for (let i = 0; i < columns.length; i++) {
		plain_strings_query_builder.push({ id: columns[i], label: this.getColumnConfig(table, columns[i], "rename"), type: 'string', operators: ['equal', 'not_equal', 'greater', 'less', 'greater_or_equal', 'less_or_equal', 'is_not_null', 'is_null', 'in', 'contains'] });
	}
	return plain_strings_query_builder;
}

// Accepts jQB operator, and returns PostgREST equivalent of it
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
		['contains', 'ilike'],
		['is_null', 'is.null']
	];

	for (let i = 0; i < dict.length; i++) {
		if (dict[i][0] === operator) {
			return dict[i][1];
		}
	}
	return "eq";
}