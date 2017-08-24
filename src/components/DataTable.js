import React, { Component } from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Button from 'material-ui/Button';

import "react-table/react-table.css";

let lib = require('../utils/library.js');
let json2csv = require('json2csv');


class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dbIndex: props.dbIndex,
            table: props.table,
            columns: props.columns,
            data: props.data
        };
    }

    componentWillReceiveProps(newProps) {
		this.setState({
			dbIndex: newProps.dbIndex,
			table: newProps.table,
			columns: newProps.columns,
			data: newProps.data
		});
    }

    downloadTableWithDelimiter(delimiter) {
        try {
            var result = json2csv({ data: this.state.data, fields: this.state.columns, del: delimiter });
            console.log(result);
        } catch (err) {
            console.error(err);
        }
    }

    render() {
        const classes = this.props.classes;
        let { columns, data } = this.state;
        let parsedColumns = [];

        if (columns) {
            parsedColumns = columns.map((columnName) => {
            	let columnRename = lib.getColumnConfig(this.state.dbIndex, this.state.table, columnName, "rename");
                let columnVisibility = lib.getColumnConfig(this.state.dbIndex, this.state.table, columnName, "visible");

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
                    headerStyle: {fontWeight: 'bold'}
                });
            });
        }

        return (<div>
                    <Button raised color="primary" className={classes.button} onClick={() => this.downloadTableWithDelimiter(",")} >Copy to clipboard</Button>

                    <br/>
                    <br/>
                    <br/>

        			<ReactTable
                        data={ data }   
                        columns={ parsedColumns }
                        defaultPageSize={ 10 } className="-striped -highlight"
                        pageSizeOptions={ [10, 50, 100, 200, 500, 1000] }
                        previousText="Previous Page"
                        nextText="Next Page"
                        noDataText={this.props.noDataText} />
        		</div>
        );
    }
}

DataTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styleSheet = createStyleSheet(theme => ({
    root: {
        width: '29%',
        height: '100%',
        float: 'left',
    },
    headerClass: {
        fontWeight: "bold"
    },
    button: {
        margin: theme.spacing.unit,
        float: 'right'

    }
}));
export default withStyles(styleSheet)(DataTable);