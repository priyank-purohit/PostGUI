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
	},
	hide: {
		display: 'none'
	}
});

class DbSchema extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dbIndex: props.dbIndex,
			table: props.table,
			dbSchema: null,
			leftPaneVisibility: props.leftPaneVisibility,
			url: lib.getDbConfig(props.dbIndex, "url"),
			tables: []
		};
		// Save the database schema to state for future access
		if (this.state.url) {
			this.getDbSchema(this.state.url);
		}
	}

	componentDidMount() {}

	componentWillReceiveProps(newProps) {
		this.setState({
			dbIndex: newProps.dbIndex,
			leftPaneVisibility: newProps.leftPaneVisibility,
			table: newProps.table
		});
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
	getDbSchema(url) {
		axios.get(url + "/", { params: {} })
			.then((response) => {
				// Save the raw resp + parse tables and columns...
				this.setState({
					dbSchema: response.data
				}, () => {
					this.parseDbSchema(this.state.dbSchema);
				});
				
			})
			.catch(function(error) {
				console.log("Error getting database tables: " + error);
			});
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// Parsing Methods
	////////////////////////////////////////////////////////////////////////////////////////////////////

	// From the JSON resp, extract the names of db TABLES and update state
	parseDbSchema(data = this.state.dbSchema) {
		let dbTables = [];
		for (let i in data.definitions) {
			if (lib.getTableConfig(this.state.dbIndex, i, "visible") !== false) {
				dbTables.push(i);
				this.parseTableColumns(this.state.dbSchema.definitions[i].properties, i);
			}
		}

		this.setState({
			tables: dbTables
		});

		if (dbTables[0] !== undefined && dbTables[0] !== null && dbTables[0] !== "" && this.state.table === "") {
			this.handleTableClick(dbTables[0]);
		} else {
			this.handleTableClick(this.state.table, true);
		}
	}

	// From JSON resp, extract the names of table columns and update state
	parseTableColumns(rawResp = this.state.dbSchema, table) {
		let columns = [];

		for (let i in rawResp) { // I = COLUMN in TABLE
			if (lib.getColumnConfig(this.state.dbIndex, table, i, "visible") !== false) {
				// list of columns for TABLE
				columns.push(i);

				let columnDefaultVisibility = lib.isColumnInDefaultView(this.state.dbIndex, table, i);

				// Each COLUMN's visibility stored in state
				if (columnDefaultVisibility === false) {
					this.setState({
						[table + i + "Visibility"]: "hide"
					});
				}
			}
		}

		// Save state
		this.setState({
			[table]: columns
		});
	}

	// Set CLICKEDTABLE in state as TABLE
	handleTableClick(clickedTable, skipCheck = false) {
		// skipCheck prevents table schema collapse when leftPane toggles
		if (this.state.table !== clickedTable || skipCheck) {
			this.props.changeTable(clickedTable);
			this.setState({
				table: clickedTable
			});
		} else {
			this.props.changeTable("");
			this.setState({
				table: ""
			});
		}
	}

	// Make a column visible or invisible on click
	handleColumnClick(column, table) {
		if (this.state[table + column + "Visibility"] === "hide") {
			this.setState({
				[table + column + "Visibility"]: ""
			});
		} else {
			this.setState({
				[table + column + "Visibility"]: "hide"
			});
		}
	}

	createTableElement(tableName) {
		const truncTextStyle = {
			textOverflow: 'clip',
			overflow: 'hidden',
			width: '29%',
			height: 20
		};

		let tableRename = lib.getTableConfig(this.state.dbIndex, tableName, "rename");
		let displayName = tableRename ? tableRename : tableName;

		let tableColumnElements = [];

		// First push the table itself
		tableColumnElements.push(
			<ListItem button key={tableName} id={tableName}
				 title={displayName} onClick={(event) => this.handleTableClick(tableName)}>
				<ListItemIcon>
					{this.state.table === tableName ? <FolderIconOpen /> : <FolderIcon /> }
				</ListItemIcon>
				<ListItemText primary={displayName} style={truncTextStyle} />
			</ListItem>
		);

		// Now push each column as hidden until state.table equals table tableName...
		for (let i in this.state[tableName]) {
			let columnName = this.state[tableName][i];
			tableColumnElements.push(this.createColumnElement(columnName, tableName));
		}

		return tableColumnElements;
	}

	createColumnElement(columnName, table) {
		let columnRename = lib.getColumnConfig(this.state.dbIndex, table, columnName, "rename");
		let displayName = columnRename ? columnRename : columnName;

		let visibility = this.state[table + columnName + "Visibility"] === "hide" ? false : true;

		// If TABLE is equal to STATE.TABLE (displayed table), show the column element
		let classNames = this.props.classes.column;
		if (this.state.table !== table) {
			classNames = this.props.classes.column + " " + this.props.classes.hide;
		}

		return (
			<ListItem button key={columnName} id={columnName}
				 title={displayName} className={classNames} onClick={(event) => this.handleColumnClick(columnName, table)}>
				<ListItemIcon>
					{visibility ? <VisibilityIcon /> : <VisibilityOffIcon /> }
				</ListItemIcon>
				<ListItemText secondary={displayName} />
			</ListItem>
		);
	}

	showTables() {
		let tableElements = [];
		for (let i = 0; i < this.state.tables.length; i++) {
			let tableName = this.state.tables[i];

			// For each table, push TABLE + COLUMN elements
			tableElements.push(
				this.createTableElement(tableName)
			);
		}
		return tableElements;
	}

	render() {
		const classes = this.props.classes;

		return (
			<div>
				<List>
					{ this.showTables() }
				</List>
			</div>
		);
	}
}

DbSchema.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(DbSchema);