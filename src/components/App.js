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
		this.state = {
			dbIndex: 0,
			table: "",
			columns: [],
			url: "",
			visibleColumns: [],
			leftPaneVisibility: true,
			historyPaneVisibility: false
		};
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

	changeTable(newTable) {
		this.setState({
			table: newTable
		});
	}

	changeColumns(newColumns) {
		this.setState({
			columns: newColumns
		});
	}

	changeUrl(newUrl) {
		this.setState({
			url: newUrl
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
					toggleLeftPane={this.toggleLeftPane.bind(this)}
					toggleHistoryPane={this.toggleHistoryPane.bind(this)} />

				<div className="bodyDiv">
					<LeftPane
						dbIndex={this.state.dbIndex}
						table={this.state.table}
						leftPaneVisibility={this.state.leftPaneVisibility}
						changeDbIndex={this.changeDbIndex.bind(this)}
						changeTable={this.changeTable.bind(this)}
						changeColumns={this.changeColumns.bind(this)}
						changeVisibleColumns={this.changeVisibleColumns.bind(this)} />
					<HistoryPane 
						url={this.state.url}
						dbIndex={this.state.dbIndex}
						historyPaneVisibility={this.state.historyPaneVisibility}
						closeHistoryPane={this.closeHistoryPane.bind(this)} />
					<RightPane
						dbIndex={this.state.dbIndex}
						table={this.state.table}
						columns={this.state.columns}
						visibleColumns={this.state.visibleColumns}
						leftPaneVisibility={this.state.leftPaneVisibility}
						changeUrl={this.changeUrl.bind(this)} />

				</div>
			</div>
		);
	}
}

const app = document.getElementById('root');
ReactDOM.render(<Layout/>, app);
