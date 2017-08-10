import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import FolderIcon from 'material-ui-icons/Folder';
import FolderIconOpen from 'material-ui-icons/FolderOpen';
import VisibilityIcon from 'material-ui-icons/Visibility';
import VisibilityOffIcon from 'material-ui-icons/VisibilityOff';
import axios from 'axios';

let lib = require("../utils/library.js");

const styleSheet = createStyleSheet({
	column: {
		marginLeft: 27
	}
});

class DbSchema extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dbIndex: 0,
			url: lib.getDbConfig(0, "url"),
			tables: [],
			displayTable: ''
		};
	}

	// Make the API call when the basic UI has been rendered
	componentDidMount() {
		this.getDbTables(this.state.url);
	}

	// Called when new props are received
	/*componentWillReceiveProps(newProps) {
		if (this.state.dbIndex !== newProps.dbIndex) {
			let newDbIndex = newProps.dbIndex;
			this.setState({
				dbIndex: newDbIndex,
				url: lib.getDbConfig(newDbIndex, "url"),
				tables: []
			}, function() {
				this.changeDatabase();
			});
		}
	}*/

	// Update the schema and what not as the db has changed...
	/*changeDatabase() {
		console.log(this.state.dbIndex, this.state.url);
	}*/


	////////////////////////////////////////////////////////////////////////////////////////////////////
	// HTTP Methods
	////////////////////////////////////////////////////////////////////////////////////////////////////

	// Returns a list of tables from URL
	getDbTables(url) {
		axios.get(url + "/", { params: {} })
			.then((response) => {
				this.parseTables(response.data);
			})
			.catch(function(error) {
				console.log("Error getting database tables: " + error);
			});
	}

	// Gets the columns of the specified table, uses the OPTIONS method
	getDbTableColumns(table) {
		let url = this.state.url + "/";
		axios.get(url, { params: {} })
			.then((response) => {
				this.parseTableColumns(response.data.definitions[table].properties, table);
			})
			.catch(function(error) {
				console.log(error);
			});
	}


	////////////////////////////////////////////////////////////////////////////////////////////////////
	// Parsing Methods
	////////////////////////////////////////////////////////////////////////////////////////////////////

	// From the JSON resp, extract the names of db tables and update state
	parseTables(data) {
		let dbTables = [];
		for (let i in data.definitions) {
			if (lib.getTableConfig(this.state.dbIndex, i, "visible") !== false) {
				dbTables.push(i);
			}
		}

		this.setState({
			tables: dbTables
		});
	}

	// From JSON resp, extract the names of table columns and update state
	parseTableColumns(rawResp, table) {
		let columns = [];
		let selectColumns = [];

		for (let i in rawResp) {
			if (lib.getColumnConfig(this.state.dbIndex, table, i, "visible") !== false) {
				columns.push(i);

				let columnDefaultVisibility = lib.isColumnInDefaultView(this.state.dbIndex, table, i);

				if (columnDefaultVisibility === false) {
					this.setState({
						[table + i]: "hide"
					});
				} else {
					selectColumns.push(i);
				}
			}
		}
		this.setState({
			[table]: columns
		});
		this.displayColumns(table);
	}

	handleTableClick(table) {
		//let buttonClicked = event.target.id;
		//console.log("Clicked on " + table);
		this.getDbTableColumns(table);
		this.setState({
			displayTable: table
		});
	}

	createLeftPaneElement(name, displayName, isColumn = false, columnVisibility = true) {
		const truncTextStyle = {
			textOverflow: 'clip',
			overflow: 'hidden',
			width: '29%',
			height: 20
		};

		return (
			<ListItem button key={name} id={name}
				 title={displayName} onClick={(event) => this.handleTableClick(name)}>
				<ListItemIcon>
					{this.state.displayTable === name ? <FolderIconOpen /> : <FolderIcon /> }
				</ListItemIcon>
				<ListItemText primary={displayName} style={truncTextStyle} />
			</ListItem>
		);
	}

	displayTables() {
		let tableElements = [];
		for (let i = 0; i < this.state.tables.length; i++) {
			let tableName = this.state.tables[i];
			let tableRename = lib.getTableConfig(this.state.dbIndex, tableName, "rename");
			let tableDisplayName = tableRename ? tableRename : tableName;

			tableElements.push(
				this.createLeftPaneElement(tableName, tableDisplayName)
			);
		}
		return tableElements;
	}

	displayColumns(table) {
		console.log("Displaying columsn for table = " + table);
		let columns = this.state[table];
		let columnElements = [];

		for (let i = 0; i < columns.length; i++) {
			let columnName = columns[i];
			let columnRename = lib.getColumnConfig(this.state.dbIndex, this.state.displayTable,columnName, "rename");
			let columnDisplayName = columnRename ? columnRename : columnName;

			let columnVisibility = this.state[table + columns[i]] === "hide" ? false : true;

			columnElements.push(
				<ListItem button key={columnName} id={columnName}
					 title={columnDisplayName} className={this.props.classes.column} >
					<ListItemIcon>
						{columnVisibility ? <VisibilityIcon /> : <VisibilityOffIcon /> }
					</ListItemIcon>
					<ListItemText secondary={columnDisplayName} />
				</ListItem>
			);
		}
		this.setState({
			columnsTest: columnElements
		});

		//return columnElements;
	}

	render() {
		const classes = this.props.classes;

		return (
			<div>
				<List>
					{ this.state.columnsTest }
					{ this.displayTables() }
				</List>
			</div>
		);
	}
}

DbSchema.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(DbSchema);