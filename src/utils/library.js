// Returns value of KEY from config file
exports.getValueFromConfig = function(key = "title") {
    let file = require("../data/config.json");
    let config = JSON.parse(JSON.stringify(file));
    return config[key];
}

// Returns value of OPTION for specific TABLE and DBINDEX
// NOTE: check for null value when this function is used
exports.getTableConfig = function(dbIndex = 0, table = "error", option = "error") {
    let file = require("../data/config.json");
    let config = JSON.parse(JSON.stringify(file));

    // If the table option is found, return; else return null
    if (table !== this.getValueFromConfig("noTableMsg") && table !== "error" && table !== null) {
        if (config["databases"][dbIndex]["tableRules"] && config["databases"][dbIndex]["tableRules"][table] && config["databases"][dbIndex]["tableRules"][table][option] !== null) {
            return config["databases"][dbIndex]["tableRules"][table][option];
        } else {
            return null;
        }
    } else {
        return this.getValueFromConfig("noTableMsg");
    }
}

// Retrieves value of key from the config file
exports.getColumnConfig = function(table = "error", column = "error", option = "error") {
    let file = require("../data/config.json");
    let config = JSON.parse(JSON.stringify(file));

    // If the table column option is found, return; else return null
    // NOTE: check for null value when this function is used
    if (table !== this.getValueFromConfig("noTableMsg") && table !== "error" && column !== "error") {
        if (config["tableRules"][table] &&
            config["tableRules"][table]["columnRules"] &&
            config["tableRules"][table]["columnRules"][column] &&
            config["tableRules"][table]["columnRules"][column][option] !== null) {
            return config["tableRules"][table]["columnRules"][column][option];
        } else {
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
