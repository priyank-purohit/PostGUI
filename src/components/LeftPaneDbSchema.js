import React, { Component } from 'react';
import axios from 'axios';

let lib = require('../utils/library.js');

class LeftPaneDbSchema extends Component {
	constructor(props) {
		super(props);
		this.state = { rawResp: "", tables: [] };
	}

	handleClick(e) {
		var buttonClicked = e.target.id;
		
		//Can use the below to propogate table change back to index.js
		this.props.changeTargetTag(buttonClicked);

		// If the columns are already known and displayed, then hide them
		if (this.state[buttonClicked]) {
			this.setState({[buttonClicked] : null});
			this.props.changeTargetTag(lib.getFromConfig("noTableMsg"));
		}
		else {
			// before showing any table's columns, hide any other open tables
			for (let i = 0; i < this.state.tables.length; i++) {
				console.log(i);
				this.setState({[this.state.tables[i]] : null})
			}
			this.fetchTableColumns(buttonClicked);
		}
	}

	displayColumns(table) {
		let ret = [];
		let columns = this.state[table];
		if (columns) {
			for (let i = 0; i < columns.length; i++) {
				ret.push(
					<div key={i}>
					<button key={i} id={columns[i]} className="tablesButtons indent">{columns[i]}</button>
				</div>
				);
			}
		}
		return ret;
	}

	// Produces buttons for the UI
	displayTables(listOfTables = this.state.tables) {
		let ret = [];
		for (let i = 0; i < listOfTables.length; i++) {
			ret.push(
				<div key={i}>
					<button key={i} id={listOfTables[i]} className="tablesButtons" onClick={this.handleClick.bind(this)}>{listOfTables[i]}</button>
					{this.displayColumns(listOfTables[i])}
				</div>
			);
		}
		return ret;
	}

	// Extract the names of db tables and update state
	parseTables(rawResp = this.state.rawResp) {
		let dbTables = [];
		for (let i = 0; i < rawResp.length; i++) {
			dbTables.push(rawResp[i].name);
		}
		this.setState({ tables: dbTables });
	}

	// Extract the names of db tables and update state
	parseTableColumns(rawResp, table) {
		let columns = [];
		for (let i = 0; i < rawResp.length; i++) {
			columns.push(rawResp[i].name);
		}
		this.setState({
			[table]: columns });
	}

	// Makes a GET call to '/' to retrieve the db schema from PostgREST
	fetchDbSchema(url = lib.getFromConfig('baseUrl') + '/') {
		axios.get(url, { params: {} })
			.then((response) => {
				this.parseTables(response.data);
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	// Gets the columns of the specified table, uses the OPTIONS method
	fetchTableColumns(table) {
		let url = lib.getFromConfig("baseUrl") + "/" + table;
		axios.options(url, { params: {} })
			.then((response) => {
				this.parseTableColumns(response.data.columns, table);
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	// Makes the API call once the basic UI has been rendered
	componentDidMount() {
		this.fetchDbSchema();
	}

	render() {
		return (
			<div id="tagsDiv">
				{this.displayTables()}
			</div>
		);
	}
}

export default LeftPaneDbSchema;
