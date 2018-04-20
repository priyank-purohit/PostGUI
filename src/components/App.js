import React from 'react';
import ReactDOM from 'react-dom';

import 'typeface-roboto';

import Navigation from './Navigation.js';
import HistoryPane from './HistoryPane.js';
import RightPane from './RightPane.js';
import LeftPane from './LeftPane.js';

import '../styles/index.css';

let lib = require("../utils/library.js");

export default class Layout extends React.Component {
	constructor() {
		super();

		// Parse URL
		let parsedURL = this.parseURL();

		this.state = {
			dbIndex: parsedURL['db'] || 0,
			table: parsedURL['table'] || "",
			rowLimit: parsedURL['rowLimit'] || null,
			exactCount: parsedURL['exactCount'] || null,
			rulesFromURL: parsedURL['urlRules'] || null,
			rulesFromHistoryPane: null,
			columns: [],
			newHistoryItem: [],
			visibleColumns: [],
			leftPaneVisibility: true,
			historyPaneVisibility: false,
			searchTerm: "",
			dbSchemaDefinitions: null,
			dbPkInfo: null
		};
	}

	// This should be called once, when app loads, to load a shared query via URL
	parseURL() {
		let url = "" + window.location.href;

		let databaseRx = /\/db\/\d\//g;
		let tableRx = /\/table\/\w+\/?/g;
		let queryRx = /query=.*/g;
		let rowLimitRx = /rowLimit=\d+/g;
		let exactCountRx = /exactCount=True|exactCount=False/g;

		// Extract the db
		let db = databaseRx.exec(url);
		if (db) {
			db = parseInt(db[0].replace(/\/db\//g, "").replace(/\//g, ""), 10);
		} else {
			db = null;
		}
		// Confirm DB exists
		let databasesMapped = [];
		lib.getValueFromConfig("databases").map((obj, index) => databasesMapped[index] = obj.title || "Untitled database");
		if (!databasesMapped[db]) {
			db = null;
		}

		// Extract the table
		let table = tableRx.exec(url);
		if (table) {
			table = table[0].replace(/\/table\//g, "").replace(/\//g, "");
		} else {
			table = null;
		}

		// Extract the query
		let query = queryRx.exec(url);
		if (query) {
			query = query[0].replace("query=", "");
		} else {
			query = null;
		}
		query = decodeURIComponent(query);
		if (query) {
			query = JSON.parse(query);
		}

		// Extract the rowLimit
		let rowLimit = rowLimitRx.exec(url);
		if (rowLimit) {
			rowLimit = parseInt(rowLimit[0].replace(/rowLimit=/g, ""), 10);
		} else {
			rowLimit = null;
		}

		// Extract the exactCount
		let exactCount = exactCountRx.exec(url);
		if (exactCount) {
			exactCount = exactCount[0].replace(/exactCount=/g, "") === "True";
		} else {
			exactCount = false;
		}

		return ({
			db: db,
			table: table,
			urlRules: query,
			rowLimit: rowLimit,
			exactCount: exactCount
		});
	}

	toggleLeftPane() {
		if (this.state.leftPaneVisibility) {
			this.setState({
				leftPaneVisibility: false
			});
		} else {
			this.setState({
				leftPaneVisibility: true
			});
		}
	}

	toggleHistoryPane() {
		if (this.state.historyPaneVisibility) {
			this.setState({
				historyPaneVisibility: false
			});
		} else {
			this.setState({
				historyPaneVisibility: true
			});
		}
	}

	closeHistoryPane() {
		this.setState({
			historyPaneVisibility: false
		});
	}

	changeDbIndex(newIndex) {
		this.setState({
			dbIndex: newIndex
		});
	}

	changeSearchTerm(newTerm) {
		this.setState({ searchTerm: newTerm });
	}

	changeTable(newTable) {
		this.setState({
			table: newTable
		});
	}

	changeRules(newRules) {
		this.setState({
			rulesFromHistoryPane: newRules
		});
	}

	changeDbSchemaDefinitions(newDefinitions) {
		this.setState({
			dbSchemaDefinitions: newDefinitions
		});
	}

	changeDbPkInfo(pkInfo) {
		this.setState({
			dbPkInfo: pkInfo
		});
	}

	changeColumns(newColumns) {
		this.setState({
			columns: newColumns
		});
	}

	addToHistory(newUrl, newRules) {
		this.setState({
			newHistoryItem: [newUrl, newRules]
		});
	}

	changeVisibleColumns(newVisibleColumns) {
		this.setState({
			visibleColumns: newVisibleColumns
		});
	}

	componentDidMount() {
		if (this.state.rulesFromURL) {
			this.changeRules(this.state.rulesFromURL);
			// setTimeout( ()=> {
			// 	history.pushState('Shared Query', 'Shared Query', 'http://localhost:3000/');
			// }, 1000);
		}
	}

	render() {
		return (
			<div>
				<Navigation
					dbIndex={this.state.dbIndex}
					changeSearchTerm={this.changeSearchTerm.bind(this)}
					toggleLeftPane={this.toggleLeftPane.bind(this)}
					toggleHistoryPane={this.toggleHistoryPane.bind(this)} />

				<div className="bodyDiv">
					<LeftPane
						dbIndex={this.state.dbIndex}
						table={this.state.table}
						searchTerm={this.state.searchTerm}
						changeSearchTerm={this.changeSearchTerm.bind(this)}
						leftPaneVisibility={this.state.leftPaneVisibility}
						changeDbIndex={this.changeDbIndex.bind(this)}
						changeTable={this.changeTable.bind(this)}
						changeColumns={this.changeColumns.bind(this)}
						changeDbSchemaDefinitions={this.changeDbSchemaDefinitions.bind(this)}
						changeDbPkInfo={this.changeDbPkInfo.bind(this)}
						changeVisibleColumns={this.changeVisibleColumns.bind(this)} />
					<HistoryPane
						newHistoryItem={this.state.newHistoryItem}
						dbIndex={this.state.dbIndex}
						historyPaneVisibility={this.state.historyPaneVisibility}
						closeHistoryPane={this.closeHistoryPane.bind(this)}
						changeTable={this.changeTable.bind(this)}
						changeRules={this.changeRules.bind(this)} />
					<RightPane
						dbIndex={this.state.dbIndex}
						table={this.state.table}
						rulesFromHistoryPane={this.state.rulesFromHistoryPane}
						changeRules={this.changeRules.bind(this)}
						columns={this.state.columns}
						dbSchemaDefinitions={this.state.dbSchemaDefinitions}
						dbPkInfo={this.state.dbPkInfo}
						visibleColumns={this.state.visibleColumns}
						leftPaneVisibility={this.state.leftPaneVisibility}
						addToHistory={this.addToHistory.bind(this)}
						rowLimit={this.state.rowLimit}
						exactCount={this.state.exactCount} />

				</div>
			</div>
		);
	}
}

const app = document.getElementById('root');
ReactDOM.render(<Layout />, app);

	// Takes the query part of the URL used to make PostgREST API call and converts to an array object that can be traversed
	/*parseURLRules(urlQuery) {
		if (urlQuery === null) {
			return null;
		}

		urlQuery = urlQuery.replace(/not.and=\(/g, "(not.and,").replace(/not.or=\(/g, "(not.or,");
		urlQuery = urlQuery.replace(/not.and\(/g, "(not.and,").replace(/not.or\(/g, "(not.or,");
		urlQuery = urlQuery.replace(/and=\(/g, "(and,").replace(/or=\(/g, "(or,");
		urlQuery = urlQuery.replace(/and\(/g, "(and,").replace(/or\(/g, "(or,");
		
		urlQuery = urlQuery.replace(/\(/g, "[").replace(/\)\s/g, "], ");
		urlQuery = urlQuery.replace(/\)/g, "]");
		urlQuery = urlQuery.replace(/\s+/, ", ");
		urlQuery = "[" + urlQuery + "]";
		urlQuery = urlQuery.replace(/[^[\],\s]+/g, "\"$&\"");
		urlQuery = urlQuery.replace(/" /g, "\", ");

		urlQuery = JSON.parse(urlQuery);
		if (urlQuery.length === 1 && urlQuery[0] instanceof Array) {
			urlQuery = urlQuery[0];
		}
		
		return this.recursiveRulesCreation(urlQuery);
	}*/

	// Takes a tranversable array object and converts to jQB compliant JSON object
	/*recursiveRulesCreation(arrayObj) {
		let rules = {};
		let rulesElement = [];
		for (let i = 0; i < arrayObj.length; i++) {
			if (i === 0) {
				// Condition + Not + Valid
				rules.condition = arrayObj[0].replace("not.","").toUpperCase();
				rules.not = arrayObj[0].replace(".and", "").replace(".or", "") === "not";
				rules.valid = true;
			} else {
				// Rules
				if (arrayObj[i] instanceof Array) {
					rulesElement.push(this.recursiveRulesCreation(arrayObj[i]));
				} else {
					let rule = arrayObj[i].split(".");
					rulesElement.push({
						id: rule[0],
						field: rule[0],
						operator: lib.translateOperatorTojQB(rule[1]),
						value: rule[2]
					});
				}
				rules.rules = rulesElement;
			}
		}
		return rules;
	}*/