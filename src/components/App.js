import React from 'react';
import ReactDOM from 'react-dom';

import 'typeface-roboto';

import Navigation from './Navigation.js';
import HistoryPane from './HistoryPane.js';
import RightPane from './RightPane.js';
import LeftPane from './LeftPane.js';

import '../styles/index.css';

//let lib = require("../utils/library.js");

export default class Layout extends React.Component {
	constructor() {
		super();
		this.parseURL();
		this.state = {
			dbIndex: 0,
			table: "",
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

	parseURL() {
		console.log(window.location.href);
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
