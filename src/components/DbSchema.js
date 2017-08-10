import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import FolderIcon from 'material-ui-icons/Folder';
import VisibilityIcon from 'material-ui-icons/Visibility';
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
			tables: []
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
	/*getDbTableColumns(table) {
		console.log("table = " + table);
		let url = this.state.url + "/";
		axios.get(url, { params: {} })
			.then((response) => {
				this.parseTableColumns(response.data.definitions[table].properties, table);
			})
			.catch(function(error) {
				console.log(error);
			});
	}*/


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
	/*parseTableColumns(rawResp, table) {
		let columns = [];
		let selectColumns = [];
		for (let i in rawResp) {
			if (lib.getColumnConfig(this.state.dbIndex, table, i, "visible") !== false) {
				columns.push(i);

				let columnDefaultVisibility = lib.isColumnInDefaultView(this.state.dbIndex, table, i);
				if (columnDefaultVisibility === false) {
					this.setState({
						[i]: "strikeOut"
					});
				} else {
					selectColumns.push(i);
				}
			}
		}
		this.setState({
			[table]: columns
		}, function () {
			console.log(this.state[table]);
		});
	}*/

	handleTableClick(event) {
		console.log("Clicked on " + event.target.id);
		//this.getDbTableColumns(event.target.id);
	}

	render() {
		const classes = this.props.classes;
		// We can use inline-style
		const style = {
			textOverflow: 'clip',
			overflow: 'hidden',
			width: '29%',
			height: 20
		};

		return (
			<List>
				{
					this.state.tables.map((tableName) => {
						let tableRename = lib.getTableConfig(this.state.dbIndex, tableName, "rename");
						return(
							<ListItem button key={tableName} id={tableName}
								onClick={this.handleTableClick.bind(this)}>
								<ListItemIcon>
								<FolderIcon />
								</ListItemIcon>
								<ListItemText primary={tableRename ? tableRename : tableName} style={style} />
							</ListItem>
						);
					})
				}
			</List>
		);
	}
}

DbSchema.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(DbSchema);