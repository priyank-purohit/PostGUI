import React, { Component } from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import "react-table/react-table.css";

const styleSheet = createStyleSheet({
	root: {
		width: '29%',
		height: '100%',
		float: 'left',
	}
});

class DataTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dbIndex: props.dbIndex,
			table: props.table,
			data: [{
				firstName: 'Tanner',
				lastName: 'Linsley',
				age: 26,
				status: 'Unknown',
				visits: 23,
			}],
			columns: [{
					Header: "First Name",
					accessor: "firstName"
				},
				{
					Header: "Last Name",
					accessor: "lastName"
				},
				{
					Header: "Age",
					accessor: "age"
				},
				{
					Header: "Status",
					accessor: "status"
				}, {
					Header: "Visits",
					accessor: "visits"
				}
			]
		};
	}

	render() {
		const { columns, data } = this.state;

		return (
			<div>
				<ReactTable data={data} columns={ columns } defaultPageSize={10} className="-striped -highlight" />
				<br />
				<br />
				<div style={{ textAlign: "center" }}>
					<em>Tip: Hold shift when sorting to multi-sort!</em>
				</div>
			</div>
		);
	}
}

DataTable.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(DataTable);