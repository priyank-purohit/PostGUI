////////////////////////////////////////////////////////////////////////////////////////////////////
// Config Methods
////////////////////////////////////////////////////////////////////////////////////////////////////

// Returns value of KEY from config file
exports.getValueFromConfig = function(key) {
	try {
		let file, config;
		file = require("../data/config.json");
		config = JSON.parse(JSON.stringify(file));
		if (config[key] !== undefined) {
			return config[key];
		}
		else {
			return null;
		}
	} catch (error) {
		return null;
	}
}

// Returns value of OPTION for specific TABLE and DBINDEX
// NOTE: check for null value when this function is used
exports.getDbConfig = function(dbIndex, option) {
	if (dbIndex !== null && option !== null) {
		try {
			let dbConfig = this.getValueFromConfig("databases");

			if (dbConfig[dbIndex][option] !== undefined) {
				return dbConfig[dbIndex][option];
			} else {
				return null;
			}
		} catch (error) {
			return null;
		}
	} else {
		return null;
	}
}

// Returns value of OPTION for specific TABLE and DBINDEX
// NOTE: check for null value when this function is used
exports.getTableConfig = function(dbIndex, table, option) {
	if (dbIndex !== null && table !== null && option !== null) {
		try {
			let tableConfig = this.getDbConfig(dbIndex, "tableRules");

			if (tableConfig[table][option] !== undefined) {
				return tableConfig[table][option];
			} else {
				return null;
			}
		} catch (error) {
			return null;
		}
	} else {
		return null;
	}
}

// Returns value of OPTION for specific COLUMN and DBINDEX .. from the defined global configs
// NOTE: do not use this function, it is called automatically from the getColumnConfig() function
exports.getColumnConfigGlobal = function(dbIndex, column, option) {
	try {
		if (this.getDbConfig(dbIndex, "columnRulesGlobal")) {
			let allGlobalColumnConfigs = (this.getDbConfig(dbIndex, "columnRulesGlobal"))[column];
			if (allGlobalColumnConfigs && allGlobalColumnConfigs[option] !== undefined) {
				return allGlobalColumnConfigs[option];
			} else {
				return null;
			}
		}
	} catch (error) {
		return null;
	}
	return null;
}

// Returns value of OPTION for specific TABLE and COLUMN and DBINDEX
// NOTE: check for null value when this function is used
exports.getColumnConfig = function(dbIndex, table, column, option) {
	if (dbIndex !== null && table !== null && option !== null && option !== null) {
		try {
			let columnRules = this.getTableConfig(dbIndex, table, "columnRules");

			if (columnRules[column][option]) {
				return columnRules[column][option];
			} else {
				return this.getColumnConfigGlobal(dbIndex, column, option);
			}
		} catch (error) {
			return this.getColumnConfigGlobal(dbIndex, column, option);
		}
	} else {
		return this.getColumnConfigGlobal(dbIndex, column, option);
	}
}

// Returns true iff COLUMN is part of the default columns defined for TABLE and DBINDEX
exports.isColumnInDefaultView = function(dbIndex, table, column) {
	if (dbIndex !== null && table !== null && column !== null) {
		try {
			let defaultColumns = this.getTableConfig(dbIndex, table, "defaultViewColumns");

			if (defaultColumns === null || defaultColumns === undefined) {
				return null;
			} else {
				return this.inArray(column, defaultColumns);
			}
		} catch (error) {
			return null;
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Query Builder Methods
////////////////////////////////////////////////////////////////////////////////////////////////////

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

exports.getQBOperators = function() {
	return [ { type:"equal" },
	{ type:"not_equal" },
	{ type:"in" },
	{ type:"not_in" },
	{ type:"less" },
	{ type:"less_or_equal" },
	{ type:"greater" },
	{ type:"greater_or_equal" },
	{ type:"between" },
	{ type:"not_between" },
	{ type:"begins_with" },
	{ type:"not_begins_with" },
	{ type:"contains" },
	{ type:"not_contains" },
	{ type:"ends_with" },
	{ type:"not_ends_with" },
	{ type:"is_empty" },
	{ type:"is_not_empty" },
	{ type:"is_null" },
	{ type:"is_not_null" },
	{ type:"regex",  nb_inputs: 1, multiple: false, apply_to: ["string"] }];
}


// Returns a list of columns
exports.getQBFilters = function(dbIndex, table, columns, definitions = null) {
	// allSupportedQBFilters are the ones present in the translateOperatorToPostgrest() method below...
	let allSupportedQBFilters = ["equal", "not_equal", "greater", "less", "greater_or_equal", "less_or_equal", "is_not_null", "is_null", "in", "contains", "regex"];
	let numericQBFilters = ["equal", "not_equal", "greater", "less", "greater_or_equal", "less_or_equal", "is_not_null", "is_null", "in"];
	let stringQBFilters = ["equal", "not_equal", "is_not_null", "is_null", "in", "contains", "regex"];
	let booleanQBFilters = ["equal", "not_equal", "is_not_null", "is_null", "in"];

	if (!columns || columns.length <= 0) {
		return [{ id: 'error', label: 'ERROR: select a view...', type: 'string' }];
	}

	let plain_strings_query_builder = [];
	for (let i = 0; i < columns.length; i++) {
		// PostgREST DEFINITIONS can be used to supplement TYPE and OPERATORS if they're not defined by the user
		let type = this.getColumnConfig(dbIndex, table, columns[i], "type");
		if (type === null && definitions !== null) {
			let pgRestType = definitions[table]['properties'][columns[i]]['type'];
			if (pgRestType === 'number' || pgRestType === 'numeric') {
				pgRestType = 'double';
			}
			type = pgRestType;
			//console.log("Assigning type of column =", columns[i], "from the PostgREST resp as", type);
		}
		
		let operators = this.getColumnConfig(dbIndex, table, columns[i], "operators");
		if (operators === null && type !== null) {
			if (type === 'integer' || type === 'double') {
				operators = numericQBFilters;
			} else if (type === 'string') {
				operators = stringQBFilters;
			} else if (type === 'boolean') {
				operators = booleanQBFilters;
			} else {
				operators = allSupportedQBFilters;
			}

			//console.log("Assigning operators of column =", columns[i], "based on type =", type, "as opreators =", JSON.stringify(operators));
		}

		plain_strings_query_builder.push(
			{
				id: columns[i],
				label: this.getColumnConfig(dbIndex, table, columns[i], "rename"),
				type: type,
				input: this.getColumnConfig(dbIndex, table, columns[i], "input"),
				values: this.getColumnConfig(dbIndex, table, columns[i], "values"),
				validation: this.getColumnConfig(dbIndex, table, columns[i], "validation"),
				default_value: this.getColumnConfig(dbIndex, table, columns[i], "defaultValue"),
				operators: operators
			});
	}
	//console.log(JSON.stringify(plain_strings_query_builder));
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
		['is_not_null', 'not.is'],
		['in', 'in'],
		['contains', 'ilike'],
		['regex', 'rx'],
		['is_null', 'is']
	];

	for (let i = 0; i < dict.length; i++) {
		if (dict[i][0] === operator) {
			return dict[i][1];
		}
	}
	return "eq";
}

// Accepts jQB operator, and returns HUMAN equivalent of it
exports.translateOperatorToHuman = function(operator) {
	let dict = [
		['equal', '='],
		['not_equal', '!='],
		['greater', '>'],
		['less', '<'],
		['greater_or_equal', '>='],
		['less_or_equal', '<='],
		['is_not_null', 'is not NULL'],
		['in', 'in'],
		['contains', 'CONTAINS'],
		['regex', 'regex'],
		['is_null', 'is NULL']
	];

	for (let i = 0; i < dict.length; i++) {
		if (dict[i][0] === operator) {
			return dict[i][1];
		}
	}
	return operator;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Other Methods
////////////////////////////////////////////////////////////////////////////////////////////////////
// 
exports.isJsonString = function(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// searches for an array element in an array of arrays (2D only)
exports.searchForArrayInArray = function (element, array) {
	for (let i = 0; i < array.length; i++) {
		// Only search if lengths match
		if (element.length === array[i].length) {
			for (let j = 0; j < element.length; j++) {
				if (JSON.stringify(element[j]) !== JSON.stringify(array[i][j])) {
					break;
				}
				// Match FOUND, return the position of element in array .. which is index i
				if (j === (element.length - 1)) {
					return i;
				}
			}
		}
	}
	return -1;
}

// returns true if ELEMENT is in ARRAY
exports.inArray = function(element, array) {
	if (array && element)
		if (element.constructor === Array) {
			return this.searchForArrayInArray(element, array) > -1;
		} else {
			return array.indexOf(element) > -1;
		}
	else
		return false;
}

// returns index of ELEMENT is in ARRAY
exports.elementPositionInArray = function(element, array) {
	if (array && element)
		if (element.constructor === Array) {
			return this.searchForArrayInArray(element, array);
		} else {
			return array.indexOf(element);
		}
	else
		return -1;
}

exports.moveArrayElementFromTo = function(targetArray, indexFrom, indexTo) {
	let targetElement = targetArray[indexFrom];
	let magicIncrement = (indexTo - indexFrom) / Math.abs (indexTo - indexFrom);

	for (let e = indexFrom; e !== indexTo; e += magicIncrement){
		targetArray[e] = targetArray[e + magicIncrement];
	}

	targetArray[indexTo] = targetElement;
	return targetArray;
}

// Opens the specified URL in a different tab
exports.visitPage = function(url = "http://www.google.ca") {
	window.open(url, "_blank");
}

// Extracts the keys from a JSON string DATA
exports.getKeysFromJSON = function(data) {
	let keys = [];
	for(let i in data){
		let val = data[i];
		for(let j in val){
			let sub_key = j;
			keys.push(sub_key);
		}
	}
	return keys;
}

// Extracts unique values from an array ARR
exports.arrNoDup = function(arr) {
	var temp = {};
	for (var i = 0; i < arr.length; i++) {
		temp[arr[i]] = true;
	}
	var ret = [];
	for (var k in temp) {
		ret.push(k);
	}
	return ret;
}
