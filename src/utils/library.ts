////////////////////////////////////////////////////////////////////////////////////////////////////
// Config Methods
////////////////////////////////////////////////////////////////////////////////////////////////////

// Returns value of KEY from config file
export function getValueFromConfig(key: string) {
  try {
    let file, config;
    file = require("../data/config.json");
    config = JSON.parse(JSON.stringify(file));
    if (config[key] !== undefined) {
      return config[key];
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

// Returns value of OPTION for specific TABLE and DBINDEX
// NOTE: check for null value when this function is used
export function getDbConfig(dbIndex: number, option: string) {
  if (dbIndex !== null && option !== null) {
    try {
      let dbConfig = getValueFromConfig("databases");

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
export function getTableConfig(dbIndex: number, table: string, option: string) {
  if (dbIndex !== null && table !== null && option !== null) {
    try {
      let tableConfig = getDbConfig(dbIndex, "tableRules");

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
export function getColumnConfigGlobal(
  dbIndex: number,
  column: string,
  option: string
) {
  try {
    if (getDbConfig(dbIndex, "columnRulesGlobal")) {
      let allGlobalColumnConfigs = getDbConfig(dbIndex, "columnRulesGlobal")[
        column
      ];
      if (
        allGlobalColumnConfigs &&
        allGlobalColumnConfigs[option] !== undefined
      ) {
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
export function getColumnConfig(
  dbIndex: number,
  table: string,
  column: string,
  option: string
) {
  if (
    dbIndex !== null &&
    table !== null &&
    column !== null &&
    option !== null
  ) {
    try {
      let columnRules = getTableConfig(dbIndex, table, "columnRules");

      if (
        columnRules[column][option] !== null &&
        columnRules[column][option] !== undefined
      ) {
        return columnRules[column][option];
      } else {
        return getColumnConfigGlobal(dbIndex, column, option);
      }
    } catch (error) {
      return getColumnConfigGlobal(dbIndex, column, option);
    }
  } else {
    return getColumnConfigGlobal(dbIndex, column, option);
  }
}

// Returns true iff COLUMN is part of the default columns defined for TABLE and DBINDEX
export function isColumnInDefaultView(
  dbIndex: number,
  table: string,
  column: string
): Nullable<boolean> {
  if (dbIndex !== null && table !== null && column !== null) {
    try {
      let defaultColumns = getTableConfig(dbIndex, table, "defaultViewColumns");

      if (defaultColumns === null || defaultColumns === undefined) {
        return null;
      } else {
        return inArray(column, defaultColumns);
      }
    } catch (error) {
      return null;
    }
  }
  return null;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Query Builder Methods
////////////////////////////////////////////////////////////////////////////////////////////////////

// Returns the initial query (i.e. pre-formatted default query for a table)
// Convert this into a function that loads a default entry for ALL tables
// If no rules are defined, it will return a blank default entry.
export function getQBRules() {
  return {
    condition: "AND",
    rules: [
      {
        empty: true
      }
    ]
  };
}

// Returns operator translations
export function getQBLang() {
  return {
    operators: {
      regex: "matches regex"
    }
  };
}

// Returns the default operators
export function getQBOperators(): Array<any> {
  return [
    { type: "equal" },
    { type: "not_equal" },
    { type: "in" },
    { type: "not_in" },
    { type: "less" },
    { type: "less_or_equal" },
    { type: "greater" },
    { type: "greater_or_equal" },
    { type: "between" },
    { type: "not_between" },
    { type: "begins_with" },
    { type: "not_begins_with" },
    { type: "contains" },
    { type: "not_contains" },
    { type: "ends_with" },
    { type: "not_ends_with" },
    { type: "is_empty" },
    { type: "is_not_empty" },
    { type: "is_null" },
    { type: "is_not_null" },
    { type: "regex", nb_inputs: 1, multiple: false, apply_to: ["string"] }
  ];
}

// Returns a list of columns
export function getQBFilters(
  dbIndex: number,
  table: string,
  columns: string,
  definitions: Nullable<any> = null
) {
  // allSupportedQBFilters are the ones present in the translateOperatorToPostgrest() method below...
  let allSupportedQBFilters = [
    "equal",
    "not_equal",
    "greater",
    "less",
    "greater_or_equal",
    "less_or_equal",
    "is_not_null",
    "is_null",
    "in",
    "contains"
  ];
  let numericQBFilters = [
    "equal",
    "not_equal",
    "greater",
    "less",
    "greater_or_equal",
    "less_or_equal",
    "is_not_null",
    "is_null",
    "in"
  ];
  let stringQBFilters = [
    "equal",
    "not_equal",
    "is_not_null",
    "is_null",
    "in",
    "contains"
  ];
  let booleanQBFilters = ["equal", "not_equal", "is_not_null", "is_null", "in"];

  if (getDbConfig(dbIndex, "regexSupport") === true) {
    allSupportedQBFilters.push("regex");
    stringQBFilters.push("regex");
  }

  if (!columns || columns.length <= 0) {
    return [{ id: "error", label: "ERROR: select a view...", type: "string" }];
  }

  let plain_strings_query_builder = [];
  for (let i = 0; i < columns.length; i++) {
    // PostgREST DEFINITIONS can be used to supplement TYPE and OPERATORS if they're not defined by the user
    let type = getColumnConfig(dbIndex, table, columns[i], "type");
    if (
      type === null &&
      definitions !== null &&
      definitions[table]["properties"][columns[i]] !== null &&
      definitions[table]["properties"][columns[i]] !== undefined
    ) {
      let pgRestType = definitions[table]["properties"][columns[i]]["type"];
      if (pgRestType === "number" || pgRestType === "numeric") {
        pgRestType = "double";
      }
      type = pgRestType;
    }

    let operators = getColumnConfig(dbIndex, table, columns[i], "operators");
    if (operators === null && type !== null) {
      if (type === "integer" || type === "double") {
        operators = numericQBFilters;
      } else if (type === "string") {
        operators = stringQBFilters;
      } else if (type === "boolean") {
        operators = booleanQBFilters;
      } else {
        operators = allSupportedQBFilters;
      }
    }

    plain_strings_query_builder.push({
      id: columns[i],
      label: getColumnConfig(dbIndex, table, columns[i], "rename"),
      type: type,
      input:
        type === "integer" || type === "double"
          ? "text"
          : getColumnConfig(dbIndex, table, columns[i], "input"),
      value_separator: ",",
      values: getColumnConfig(dbIndex, table, columns[i], "values"),
      validation: getColumnConfig(dbIndex, table, columns[i], "validation"),
      default_value: getColumnConfig(
        dbIndex,
        table,
        columns[i],
        "defaultValue"
      ),
      operators: operators
    });
  }

  return plain_strings_query_builder;
}

// Accepts jQB operator, and returns PostgREST equivalent of it
export function translateOperatorToPostgrest(operator: string): string {
  let dict = [
    ["equal", "eq"],
    ["not_equal", "neq"],
    ["greater", "gt"],
    ["less", "lt"],
    ["greater_or_equal", "gte"],
    ["less_or_equal", "lte"],
    ["is_not_null", "not.is"],
    ["in", "in"],
    ["contains", "ilike"],
    ["regex", "rx"],
    ["is_null", "is"]
  ];

  for (let i = 0; i < dict.length; i++) {
    if (dict[i][0] === operator) {
      return dict[i][1];
    }
  }
  return "eq";
}

// Accepts PostgREST operator, and returns jQB equivalent of it
export function translateOperatorTojQB(operator: string): string {
  let dict = [
    ["eq", "equal"],
    ["neq", "not_equal"],
    ["gt", "greater"],
    ["lt", "less"],
    ["gte", "greater_or_equal"],
    ["lte", "less_or_equal"],
    ["not.s", "is_not_null"],
    ["in", "in"],
    ["ilike", "contains"],
    ["rx", "regex"],
    ["is", "is_null"]
  ];

  for (let i = 0; i < dict.length; i++) {
    if (dict[i][0] === operator) {
      return dict[i][1];
    }
  }
  return "equal";
}

// Accepts jQB operator, and returns HUMAN equivalent of it
export function translateOperatorToHuman(operator: string): string {
  let dict = [
    ["equal", "="],
    ["not_equal", "!="],
    ["greater", ">"],
    ["less", "<"],
    ["greater_or_equal", ">="],
    ["less_or_equal", "<="],
    ["is_not_null", "is not NULL"],
    ["in", "in"],
    ["contains", "CONTAINS"],
    ["regex", "matches"],
    ["is_null", "is NULL"]
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
export function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

// searches for an array element in an array of arrays (2D only)
export function searchForArrayInArray(
  element: Array<any>,
  array: Array<any>
): number {
  for (let i = 0; i < array.length; i++) {
    // Only search if lengths match
    if (element.length === array[i].length) {
      for (let j = 0; j < element.length; j++) {
        if (JSON.stringify(element[j]) !== JSON.stringify(array[i][j])) {
          break;
        }
        // Match FOUND, return the position of element in array .. which is index i
        if (j === element.length - 1) {
          return i;
        }
      }
    }
  }
  return -1;
}

// returns true if ELEMENT is in ARRAY
export function inArray(element: any, array: Array<any>): boolean {
  if (array && element)
    if (element.constructor === Array) {
      return searchForArrayInArray(element, array) > -1;
    } else {
      return array.indexOf(element) > -1;
    }
  else return false;
}

// returns index of ELEMENT is in ARRAY
export function elementPositionInArray(
  element: any,
  array: Array<any>
): number {
  if (array && element)
    if (element.constructor === Array) {
      return searchForArrayInArray(element, array);
    } else {
      return array.indexOf(element);
    }
  else return -1;
}

export function moveArrayElementFromTo(
  targetArray: Array<any>,
  indexFrom: number,
  indexTo: number
): Array<any> {
  let targetElement = targetArray[indexFrom];
  let magicIncrement = (indexTo - indexFrom) / Math.abs(indexTo - indexFrom);

  for (let e = indexFrom; e !== indexTo; e += magicIncrement) {
    targetArray[e] = targetArray[e + magicIncrement];
  }

  targetArray[indexTo] = targetElement;
  return targetArray;
}

// Opens the specified URL in a different tab
export function visitPage(url = "https://www.google.ca") {
  window.open(url, "_blank");
}

// Extracts the keys from a JSON string DATA
export function getKeysFromJSON(data: any): Array<string> {
  let keys = [];
  for (let i in data) {
    let val = data[i];
    for (let j in val) {
      let sub_key = j;
      keys.push(sub_key);
    }
  }
  return keys;
}

// Extracts unique values from an array ARR
export function arrNoDup(arr: Array<any>): Array<any> {
  var temp: any = {};
  for (var i = 0; i < arr.length; i++) {
    temp[arr[i]] = true;
  }
  var ret = [];
  for (var k in temp) {
    ret.push(k);
  }
  return ret;
}
