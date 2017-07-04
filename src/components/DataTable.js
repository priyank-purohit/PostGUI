import React, { Component } from 'react';

import '../styles/DataTable.css';

//let lib = require('../utils/library.js');

class DataTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.response,
			columns: []
		};
	}


	// Called when new props are received by the QB component
	componentWillReceiveProps(newProps) {
		this.setState({ data: newProps.response }, function() {
			this.extractColumns();
		});
	}

	// Extracts columns from state.data and stores the list in state.columns for use in table head
	extractColumns() {
		let keys = [];
		for (let i in this.state.data) {
			let val = this.state.data[i];
			for (let j in val) {
				let subKey = j;
				keys.push(subKey);
			}
		}

		keys = keys.filter(function(x, i, a) {
			return a.indexOf(x) === i;
		});

		this.setState({ columns: keys });
	}

	// After mounting, extracts columns
	componentDidMount() {
		this.extractColumns();
	}

	// Generates the data rows
	rowsGenerated() {
		let cols = this.state.columns, // [{key, label}]
			data = this.state.data;

		return data.map(function(item, i) {
			// handle the column data within each row
			let cells = cols.map(function(colData, key) {

				// colData.key might be "firstName"
				return <td key={key} className="fontSize8">{item[colData]}</td>;
			});
			return <tr key={i}>{cells}</tr>;
		});
	}

	render() {
		return (
			<table id="dataTable">
				<thead>
					<tr key="head">
					{
						this.state.columns.map( function (columnTitle, key) {
							return (<th key={key} className="fontSize8">{columnTitle}</th>);
						})
					}
					</tr>
				</thead>
				<tbody>
					{this.rowsGenerated()}
				</tbody>
			</table>
		);
	}
}

export default DataTable;
