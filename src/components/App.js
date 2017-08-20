import React from 'react';
import ReactDOM from 'react-dom';

import 'typeface-roboto';

import Navigation from './Navigation.js';
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
			visibleColumns: [],
			leftPaneVisibility: true
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

	changeVisibleColumns(newVisibleColumns) {
		this.setState({
			visibleColumns: newVisibleColumns
		});
	}

	render() {
		return (
			<div>
				<Navigation toggleLeftPane={this.toggleLeftPane.bind(this)} dbIndex={this.state.dbIndex} />
				<div className="bodyDiv">
					<LeftPane changeDbIndex={this.changeDbIndex.bind(this)} changeTable={this.changeTable.bind(this)} changeColumns={this.changeColumns.bind(this)} changeVisibleColumns={this.changeVisibleColumns.bind(this)} dbIndex={this.state.dbIndex} table={this.state.table} leftPaneVisibility={this.state.leftPaneVisibility} />
					<RightPane  dbIndex={this.state.dbIndex} table={this.state.table} columns={this.state.columns} visibleColumns={this.state.visibleColumns} leftPaneVisibility={this.state.leftPaneVisibility} />
				</div>
			</div>
		);
	}
}

const app = document.getElementById('root');
ReactDOM.render(<Layout/>, app);
