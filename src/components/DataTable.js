import React, { Component } from 'react';

//let lib = require('../utils/library.js');

class DataTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.response,
			columns: []
		};
	}

	extractColumns() {
		let keys = [];
		for (let i in this.state.data) {
			let val = this.state.data[i];
			for (let j in val) {
				let sub_key = j;
				keys.push(sub_key);
			}
		}

		keys = keys.filter(function(x, i, a) {
			return a.indexOf(x) === i;
		});

		this.setState({ columns: keys });
	}

	componentDidMount() {
		this.extractColumns();
	}

	rowsGenerated() {
        let cols = this.state.columns,  // [{key, label}]
            data = this.state.data;

        return data.map(function(item) {
            // handle the column data within each row
            let cells = cols.map(function(colData, key) {

                // colData.key might be "firstName"
                return <td key={key}>{item[colData]}</td>;
            });
            return <tr key={item.id}>{cells}</tr>;
        });
    }

	render() {
		return (
			<table id="dataTable">
				<thead>
					<tr key="head">
					{
						this.state.columns.map( function (columnTitle, key) {
							return (<th key={key}>{columnTitle}</th>);
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
