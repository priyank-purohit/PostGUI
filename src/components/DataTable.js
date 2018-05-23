import React, { Component } from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Downloads from './Downloads.js';
import EditCard from './EditCard.js';

import axios from 'axios';
import "react-table/react-table.css";

import checkboxHOC from "react-table/lib/hoc/selectTable";
let CheckboxTable = checkboxHOC(ReactTable);

let lib = require('../utils/library.js');

// Adds a PK column to each row for the selection part
function addPkAsId(originalData) {
    if (!originalData) {
        return [];
    }

    let data = originalData.map(item => {
        // using chancejs to generate guid
        // shortid is probably better but seems to have performance issues
        // on codesandbox.io
        let _id = [item.playerid, item.seasonid];
        return {
            _id,
            ...item
        };
    });
    return data;
}

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dbIndex: props.dbIndex,
            table: props.table,
            columns: props.columns,
            data: [],
            url: props.url,
            dbPrimaryKeys: [],
            tablePrimaryKeys: [],
            editFeatureEnabled: false,
            editFeatureChangesMade: {},
            rowsStrikedOut: []
        };
        this.renderEditableCell = this.renderEditableCell.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            dbIndex: newProps.dbIndex,
            table: newProps.table,
            columns: newProps.columns,
            url: newProps.url,
            data: addPkAsId(newProps.data),
            editFeatureEnabled: this.state.table !== newProps.table ? false : this.state.editFeatureEnabled
        });

        // Enable PK related features if table has a PK
        if (newProps.dbPkInfo && this.state.table) {
            for (let i = 0; i < newProps.dbPkInfo.length; i++) {
                if (newProps.dbPkInfo[i]["table"] === this.state.table) {
                    this.setState({
                        tablePrimaryKeys: newProps.dbPkInfo[i]["primary_keys"]
                    });
                }
            }
        }
    }

    // Allows EditCard.js to change the state here
    changeEditFeatureEnabled(featureEnabled) {
        this.setState({
            editFeatureEnabled: featureEnabled
        });
    }

    // Allows EditCard.js to change the state here
    changeEditFeatureChangesMade(newChanges) {
        this.setState({
            editFeatureChangesMade: newChanges
        });
    }

    // Deletes all changes in the current table
    deleteTableChanges() {
        let tempChanges = this.state.editFeatureChangesMade[this.state.table];
        let columnsChanged = Object.keys(tempChanges);
        let columnsChangeCount = columnsChanged.length;

        // Iterate over all keys (list of column specific changes)
        for (let i = 0; i < columnsChangeCount; i++) {
            let column = columnsChanged[i];
            let keysChanged = Object.keys(tempChanges[column]);
            let changeCount = keysChanged.length;

            // Iterate over all keys (all changes individually)
            for (let ii = 0; ii < changeCount; ii++) {
                let key = keysChanged[ii];

                // delete using column + key
                this.deleteChange(column, key, false);
            }
        }
    }

    // Given a COLUMN and KEY, deletes the change from the state's changesMade value
    // If noRestore is true, it does not restore the original value (used for successfully submitted changes)
    deleteChange(column, key, noRestore = false) {
        let tempChanges = this.state.editFeatureChangesMade;

        if (noRestore === false) {
            // Restore original value in state.data
            let originalValue = tempChanges[this.state.table][column][key]["oldValue"];
            let data = this.state.data;
            data[tempChanges[this.state.table][column][key]["rowIndex"]][column] = originalValue;
            this.setState({
                data: data
            });
        }

        // Delete the change from list of changes
        delete tempChanges[this.state.table][column][key];

        // Delete the column object if that was the only change for that column...
        if (JSON.stringify(tempChanges[this.state.table][column]) === "{}") {
            delete tempChanges[this.state.table][column];
        }

        // Delete the table object if that was the only change for that table...
        if (JSON.stringify(tempChanges[this.state.table]) === "{}") {
            delete tempChanges[this.state.table];
        }

        this.setState({
            editFeatureChangesMade: tempChanges
        });
    }

    // Given a COLUMN and KEY, toggles the error code for a change
    setChangeError(column, key, error) {
        let tempChanges = this.state.editFeatureChangesMade;

        // Toggle the change...
        tempChanges[this.state.table][column][key]["error"] = error | true;

        this.setState({
            editFeatureChangesMade: tempChanges,
        });
    }


    // Converts the JSON object for PK into a string into part of a PostgREST compliant URL
    primaryKeyParams(primaryKey) {
        let keys = Object.keys(primaryKey);
        let stringified = "";

        for (let i in Object.keys(primaryKey)) {
            stringified += keys[i] + ".eq." + primaryKey[keys[i]];
            if (parseInt(i, 10) !== keys.length - 1) { stringified += ","; }
        }
        return stringified;
    }

    // Makes PATCH calls to submit current table's changes + deletes them as the reqs are successful. Keeps track of all changes in the updates table.
    // Marks any changes that are not successful.
    submitChanges() {
        //
        let currentChanges = this.state.editFeatureChangesMade[this.state.table];

        if (currentChanges === null || currentChanges === undefined) {
            return;
        }

        for (let i = 0; i < Object.keys(currentChanges).length; i++) {
            let currentColumnChanges = currentChanges[Object.keys(currentChanges)[i]];
            for (let ii = 0; ii < Object.keys(currentColumnChanges).length; ii++) {
                let change = currentChanges[Object.keys(currentChanges)[i]][Object.keys(currentColumnChanges)[ii]];

                let primaryKey = change["primaryKey"];
                let columnChanged = Object.keys(currentChanges)[i];
                let keyChanged = Object.keys(currentColumnChanges)[ii];
                let oldValue = change["oldValue"];
                let newValue = change["newValue"];

                if (String(oldValue) !== String(newValue)) { // There is a change...
                    // Create the URL, add in the new value as URL param
                    let url = lib.getDbConfig(this.state.dbIndex, "url") + "/" + this.state.table + "?and=(" + this.primaryKeyParams(primaryKey) + ")";

                    // Data type assignment for newValue based on the data type of oldValue
                    if (String(newValue) === "") {
                        newValue = null;
                    } else {
                        if (typeof oldValue === 'string') {
                            newValue = String(newValue);
                        } else if (typeof oldValue === 'number') {
                            newValue = Number(newValue);
                        } else if (typeof oldValue === 'boolean') {
                            newValue = Boolean(newValue);
                        }
                    }

                    // Patch body
                    let patchReqBody = {};
                    patchReqBody[columnChanged] = newValue;

                    console.log("Submitting change: PATCH: " + url);
                    console.log("Change=" + JSON.stringify(change));
                    console.log("PATCH req BODY=" + JSON.stringify({ [columnChanged]: newValue }));

                    // Send the Request and check its response:
                    // PATCH the request
                    axios.patch(url, { [columnChanged]: newValue }, { headers: { Prefer: 'return=representation' } })
                        .then((response) => {
                            console.log("PATCH RESPONSE:", JSON.stringify(response.data));
                            this.deleteChange(columnChanged, keyChanged, true); // true => do not restore original value when deleting change
                        })
                        .catch((error) => {
                            console.log("PATCH ERROR RESP:" + String(error));
                            this.setChangeError(columnChanged, keyChanged, true);
                            // Show error in top-right Snack-Bar
                            this.setState({
                                snackBarVisibility: true,
                                snackBarMessage: "Database update failed."
                            }, () => {
                                this.timer = setTimeout(() => {
                                    this.setState({
                                        snackBarVisibility: false,
                                        snackBarMessage: "Unknown error"
                                    });
                                }, 5000);
                            });
                        });
                } else {
                    // Tell user that the change was not actually detected... and that they should submit a bug
                    console.log("Tell user that the change was not actually detected... and that they should submit a bug");
                }
            }
        }
    }

    // Renders an editable cell + manages changes made to it using helpers
    renderEditableCell(cellInfo) {
        return (
            <div
                style={{ backgroundColor: "#fafafa", "border": "none", "borderBottom": "1px solid lightpink", padding: "1px" }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    let data = [...this.state.data];

                    let changedRowIndex = cellInfo.index;
                    let changedColumnName = cellInfo.column.id;
                    //let oldRow = JSON.stringify(this.state.data[changedRowIndex]);
                    let oldCellValue = data[changedRowIndex][changedColumnName];
                    let newCellValue = e.target.innerHTML;

                    // ToDo: when original value is NULL, and you don't change it, it sets it to "" from NULL... prevent it
                    if (String(oldCellValue) !== String(newCellValue) && !(String(oldCellValue) === "null" && String(newCellValue) === "") && String(newCellValue).indexOf("<br>") < 0 && String(newCellValue).indexOf("<div>") < 0) {
                        let changedRowPk = {};
                        let changedRowPkStr = "";
                        for (let i = 0; i < this.state.tablePrimaryKeys.length; i++) {
                            changedRowPk[this.state.tablePrimaryKeys[i]] = data[changedRowIndex][this.state.tablePrimaryKeys[i]];
                            changedRowPkStr += String(data[changedRowIndex][this.state.tablePrimaryKeys[i]]);
                        }

                        // console.log(changedColumnName, "column of row #", changedRowIndex, "with pk = (", JSON.stringify(changedRowPk), ") changed from ", oldCellValue, "to", newCellValue);

                        // Update the local variable to this function
                        data[changedRowIndex][changedColumnName] = newCellValue;
                        //let newRow = data[changedRowIndex];

                        let currentChanges = this.state.editFeatureChangesMade;

                        // Create the JSON objects if they do not exist
                        if (!currentChanges[this.state.table]) { currentChanges[this.state.table] = {} }
                        if (!currentChanges[this.state.table][changedColumnName]) { currentChanges[this.state.table][changedColumnName] = {} }
                        if (!currentChanges[this.state.table][changedColumnName][changedRowPkStr]) { currentChanges[this.state.table][changedColumnName][changedRowPkStr] = {} }

                        // Keep track of the original* value.
                        // * Original means the value in the db on server
                        if (!currentChanges[this.state.table][changedColumnName][changedRowPkStr]["oldValue"]) { currentChanges[this.state.table][changedColumnName][changedRowPkStr]["oldValue"] = oldCellValue; }

                        // Insert the updates + keep track of the PK
                        currentChanges[this.state.table][changedColumnName][changedRowPkStr]["newValue"] = newCellValue;
                        currentChanges[this.state.table][changedColumnName][changedRowPkStr]["primaryKey"] = changedRowPk;
                        currentChanges[this.state.table][changedColumnName][changedRowPkStr]["rowIndex"] = changedRowIndex;

                        console.log(JSON.stringify(currentChanges));

                        this.setState({
                            data: data,
                            editFeatureChangesMade: currentChanges
                        });
                    }
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.data[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }

    toggleAll = () => {
        // Intentioanlly removed the functionality to select all, can only unselect all
        let rowsStrikedOut = [];
        this.setState({ rowsStrikedOut });
    };

    toggleSelection = (key, shift, row) => {
        // start off with the existing state
        let rowsStrikedOut = [...this.state.rowsStrikedOut];
        let keyIndex = rowsStrikedOut.indexOf(key);
        // check to see if the key exists
        if (keyIndex >= 0) {
            // it does exist so we will remove it using destructing
            rowsStrikedOut = [
                ...rowsStrikedOut.slice(0, keyIndex),
                ...rowsStrikedOut.slice(keyIndex + 1)
            ];
        } else {
            // it does not exist so add it
            rowsStrikedOut.push(key);
        }

        // Toggle Selection in editDbFeatureChanges state ...
        // Create a PK {} and STRING
        let changedRowPk = {};
        let changedRowPkStr = key.join("");
        for (let i = 0; i < this.state.tablePrimaryKeys.length; i++) {
            changedRowPk[this.state.tablePrimaryKeys[i]] = key[i];
        }

        let currentChanges = this.state.editFeatureChangesMade;
        // Create the JSON objects if they do not exist
        if (!currentChanges[this.state.table]) { currentChanges[this.state.table] = {} }
        if (!currentChanges[this.state.table]["id"]) { currentChanges[this.state.table]["id"] = {} }
        if (!currentChanges[this.state.table]["id"][changedRowPkStr]) { currentChanges[this.state.table]["id"][changedRowPkStr] = {} }


        currentChanges[this.state.table]["id"][changedRowPkStr]["primaryKey"] = changedRowPk;
        // Mark it to delete, or unmark it
        console.log("Current = " + String(currentChanges[this.state.table]["id"][changedRowPkStr]["delete"]));
        currentChanges[this.state.table]["id"][changedRowPkStr]["delete"] = !currentChanges[this.state.table]["id"][changedRowPkStr]["delete"];

        console.log("New = " + String(currentChanges[this.state.table]["id"][changedRowPkStr]["delete"]));

        this.setState({
            rowsStrikedOut,
            editFeatureChangesMade: currentChanges
        });
    };

    isSelected = key => {
        return this.state.rowsStrikedOut.includes(key);
    };

    logSelection = () => {
        console.log("rowsStrikedOut:", JSON.stringify(this.state.rowsStrikedOut));
    };

    render() {
        //let classes = this.props.classes;
        let { columns, data } = this.state;
        let parsedColumns = [];

        // Create columns with expected column properties
        if (columns) {
            parsedColumns = columns.map((columnName) => {
                let columnRename = lib.getColumnConfig(this.state.dbIndex, this.state.table, columnName, "rename");
                let columnVisibility = lib.getColumnConfig(this.state.dbIndex, this.state.table, columnName, "visible");
                let columnEditability = lib.getColumnConfig(this.state.dbIndex, this.state.table, columnName, "editable");

                let columnWidthDefault = lib.getTableConfig(this.state.dbIndex, this.state.table, "defaultWidthPx");
                let columnWidth = lib.getColumnConfig(this.state.dbIndex, this.state.table, columnName, "widthPx");

                let columnMinWidth = lib.getColumnConfig(this.state.dbIndex, this.state.table, columnName, "minWidthPx");
                let columnMaxWidth = lib.getColumnConfig(this.state.dbIndex, this.state.table, columnName, "maxWidthPx");

                return ({
                    id: columnName,
                    Header: columnRename ? columnRename : columnName,
                    accessor: columnName,
                    show: columnVisibility !== null ? columnVisibility : true,
                    width: columnWidth !== null ? columnWidth : (columnWidthDefault ? columnWidthDefault : undefined),
                    maxWidth: columnMaxWidth !== null ? columnMaxWidth : undefined,
                    minWidth: columnMinWidth !== null ? columnMinWidth : 100,
                    headerStyle: { fontWeight: 'bold' },
                    Cell: this.state.editFeatureEnabled === true && columnEditability !== false ? this.renderEditableCell : row => (row.value !== undefined && row.value !== null ? String(row.value) : row.value)
                });
            });
        }

        let { toggleSelection, isSelected, logSelection, toggleAll } = this;

        let checkboxProps = {
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: "checkbox",
            getTrProps: (s, r) => {
                // someone asked for an example of a background color change
                // here it is...
                let selected = false;
                try {
                    selected = this.isSelected(r.original._id);
                } catch (error) {
                    selected = false;
                    //console.log("error:" + String(error));
                }
                return {
                    style: {
                        backgroundColor: selected ? "lightpink" : "inherit",
                        textDecoration: selected ? "line-through" : "none"
                        // color: selected ? 'white' : 'inherit',
                    }
                };
            }
        };

        // render()
        return (
            <div>
                {this.state.editFeatureEnabled ? (
                    <CheckboxTable
                        data={data}
                        columns={parsedColumns}
                        defaultPageSize={10} className="-striped -highlight"
                        pageSizeOptions={[10, 50, 100, 200, 500, 1000]}
                        previousText="Previous Page"
                        nextText="Next Page"
                        noDataText={this.props.noDataText}
                        {...checkboxProps} />) : (
                        <ReactTable
                            data={data}
                            columns={parsedColumns}
                            defaultPageSize={10} className="-striped -highlight"
                            pageSizeOptions={[10, 50, 100, 200, 500, 1000]}
                            previousText="Previous Page"
                            nextText="Next Page"
                            noDataText={this.props.noDataText} />)}

                <div className={this.props.classes.cardGroups} >
                    <EditCard
                        dbIndex={this.state.dbIndex}
                        table={this.state.table}
                        columns={this.state.columns}
                        dbPkInfo={this.props.dbPkInfo}
                        url={this.state.url}
                        featureEnabled={this.state.editFeatureEnabled}
                        changesMade={this.state.editFeatureChangesMade}
                        rowsStrikedOut={this.state.rowsStrikedOut}
                        submitChanges={this.submitChanges.bind(this)}
                        deleteChange={this.deleteChange.bind(this)}
                        deleteTableChanges={this.deleteTableChanges.bind(this)}
                        changeEditFeatureEnabled={this.changeEditFeatureEnabled.bind(this)} />

                    <Downloads
                        dbIndex={this.state.dbIndex}
                        table={this.state.table}
                        columns={this.state.columns}
                        data={this.state.data}
                        url={this.state.url}
                        totalRows={this.props.totalRows} />
                </div>
            </div>);
    }
}

DataTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styleSheet = {
    root: {
        width: '29%',
        height: '100%',
        float: 'left',
    },
    headerClass: {
        fontWeight: "bold"
    },
    button: {
        margin: 5,
        float: 'right'
    },
    topMargin: {
        margin: 5,
        marginTop: (5) * 5
    },
    cardGroups: {
        display: 'flex',
        flexDirection: 'row'
    }
};
export default withStyles(styleSheet)(DataTable);