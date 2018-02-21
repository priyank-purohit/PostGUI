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
		let parsedDbTable = this.parseURL();
		let db = parsedDbTable['db'];
		let table = parsedDbTable['table'];
		


		this.state = {
			dbIndex: db || 0,
			table: table || "",
			rulesFromHistoryPane: null,
			columns: [],
			newHistoryItem: [],
			visibleColumns: [],
			leftPaneVisibility: true,
			historyPaneVisibility: false,
			searchTerm: "",
			dbSchemaDefinitions: null
		};
	}

	// This should be called once per session
	parseURL() {
		let url = "" + window.location.href;
		console.log("Parsing URL: " + url);
		
		// Extract the db
		let databaseRx = /\/db\/\d\//g;
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
		console.log("Extracted db as " + db);
		
		// Extract the table
		let tableRx = /\/table\/\w+\/?/g;
		let table = tableRx.exec(url);
		if (table) {
			table = table[0].replace(/\/table\//g, "").replace(/\//g, "");
		} else {
			table = null;
		}
		console.log("Extracted table as " + table);
		
		// Extract the query
		let queryRx = /query=[^&\s]*/g;
		let query = queryRx.exec(url);
		if (query) {
			query = query[0].replace("query=", "");
		} else {
			query = null;
		}
		console.log("Extracted query as " + query);

		return ({
			db: db,
			table: table,
			query: query
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
		this.setState({searchTerm: newTerm});
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
						visibleColumns={this.state.visibleColumns}
						leftPaneVisibility={this.state.leftPaneVisibility}
						addToHistory={this.addToHistory.bind(this)} />

				</div>
			</div>
		);
	}
}

const app = document.getElementById('root');
ReactDOM.render(<Layout/>, app);
