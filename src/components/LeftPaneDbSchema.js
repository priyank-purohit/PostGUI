import React, { Component } from 'react';
import axios from 'axios';

let lib = require('../utils/library.js');

class LeftPaneDbSchema extends Component {
    constructor(props) {
        super(props);
        this.state = { rawResp: "", tables: [], columnsNotVisible: [] };
    }

    // When a table is clicked, close any open ones, and load the columns of the selected table
    handleTableClick(e) {
        let columnsNotVisible = this.state.columnsNotVisible;
        for (let i = 0; i < columnsNotVisible.length; i++) {
            this.setState({
                [columnsNotVisible[i]]: "notStrikeOut"
            });
        }
        this.setState({ columnsNotVisible: [] });

        let buttonClicked = e.target.id;

        //Can use the below to propogate table change back to index.js
        this.props.changeTargetTable(buttonClicked);

        // If the columns are already known and displayed, then hide them
        if (this.state[buttonClicked]) {
            this.setState({
                [buttonClicked]: null
            });
            // clear out the columns and their styling properties
            this.props.changeTargetTable(lib.getFromConfig("noTableMsg"));
            this.props.changeTargetTableColumns([]);
            this.props.changeSelectTableColumns([]);
        } else {
            // before showing any table's columns, hide any other open tables
            for (let i = 0; i < this.state.tables.length; i++) {
                this.setState({
                    [this.state.tables[i]]: null
                })
            }
            this.fetchTableColumns(buttonClicked);
        }
    }

    // When a column is clicked, hide it from output if shown, and vice versa
    handleColumnClick(e) {
        let columnClicked = e.target.id;
        let status = this.props.addRemoveSelectTableColumns(columnClicked); // true = added, false = removed
        if (!status) {
            // strike it out
            this.setState({
                [e.target.id]: "strikeOut"
            });
        } else {
            // unstrike it
            this.setState({
                [e.target.id]: "notStrikeOut"
            });
        }

        let columnsNotVisible = this.state.columnsNotVisible;
        columnsNotVisible.push(e.target.id);

        this.setState({
            "columnsNotVisible": columnsNotVisible
        });
    }

    // Produces the displayed buttons for the COLUMNS
    displayColumns(table) {
        let ret = [];
        let columns = this.state[table];
        if (columns) {
            for (let i = 0; i < columns.length; i++) {
                let columnName = lib.getColumnConfig(table, columns[i], "rename");
                ret.push(
                    <div key={i}>
					<button key={i} id={columns[i]} title={lib.getColumnConfig(table, columns[i], "description")} className={"columnsButtons " + this.state[columns[i]]} onClick={this.handleColumnClick.bind(this)}>{columnName ? columnName : columns[i]}</button>
					</div>
                );
            }
        }
        return ret;
    }

    // Produces the displayed buttons for the TABLES
    displayTables(listOfTables = this.state.tables) {
        let ret = [];
        for (let i = 0; i < listOfTables.length; i++) {
            let tableName = lib.getTableConfig(listOfTables[i], "rename");
            ret.push(
                <div key={i}>
					<button key={i} id={listOfTables[i]} className="tablesButtons" onClick={this.handleTableClick.bind(this)}>{tableName ? tableName : listOfTables[i]}</button>
					{this.displayColumns(listOfTables[i])}
				</div>
            );
        }
        return ret;
    }

    // From the JSON resp, extract the names of db tables and update state
    parseTables(rawResp = this.state.rawResp) {
        let dbTables = [];
        for (let i in rawResp.definitions) {
            if (lib.getTableConfig(i, "visible") !== false) {
                dbTables.push(i);
            }
        }
        this.setState({ tables: dbTables });
    }

    // From JSON resp, extract the names of table columns and update state
    parseTableColumns(rawResp, table) {
        let columns = [];
        let selectColumns = [];
        for (let i in rawResp) {
            if (lib.getColumnConfig(table, i, "visible") !== false) {
                columns.push(i);

                let columnDefaultVisibility = lib.isColumnDefaultView(table, i);
                
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
        });
        this.props.changeTargetTableColumns(columns);
        this.props.changeSelectTableColumns(selectColumns);
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
        let url = lib.getFromConfig("baseUrl") + "/";
        axios.get(url, { params: {} })
            .then((response) => {
                this.parseTableColumns(response.data.definitions[table].properties, table);
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