import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import TextField from '@material-ui/core/TextField';
import { withStyles, Divider } from '@material-ui/core';

let lib = require('../utils/library.js');

class ResponsiveDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            dbIndex: props.dbIndex,
            table: props.table,
            columns: props.columns,
            allColumns: props.allColumns,
            primaryKeys: props.primaryKeys || [],
            qbFilters: props.qbFilters || [],
            url: props.url,
            inputVals: {}
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            open: newProps.open,
            dbIndex: newProps.dbIndex,
            table: newProps.table,
            columns: newProps.columns,
            allColumns: newProps.allColumns,
            primaryKeys: newProps.primaryKeys || [],
            qbFilters: newProps.qbFilters || [],
            url: newProps.url
        });
    }

    handleClose = () => {
        this.props.handleNewRowClick(false);
    };

    // Reset all input fields
    handleReset = () => {
        let qbFiltersTemp = this.state.qbFilters;
        this.setState({
            qbFilters: []
        }, () => {
            this.setState({
                qbFilters: qbFiltersTemp,
                inputVals: {}
            })
        });
    };

    handleInput = (event, column, dataType) => {
        let value = event.target.value; // New value from user
        let inputValues = this.state.inputVals || {};

        // Assign one of three data types to VALUE
        if (dataType === "string" && (String(value) !== "")) {
            value = String(value);
            inputValues[column] = value;
        }
        else if (dataType === "string" && (String(value) === "")) {
            delete inputValues[column];
        }
        else if ((dataType === "integer" || dataType === "double") && (String(value) !== "")) {
            value = Number(value);
            inputValues[column] = value;
        }
        else if ((dataType === "integer" || dataType === "double") && (String(value) === "")) {
            delete inputValues[column];
        }
        else if (dataType === "boolean" && (String(value) !== "")) {
            value = Boolean(value);
            inputValues[column] = value;
        }
        else if (dataType === "boolean" && (String(value) === "")) {
            delete inputValues[column];
        }
        else {
            inputValues[column] = value;
        }

        this.setState({
            inputVals: inputValues
        });
    }

    handleSubmit = () => {
        // Submit HTTP Request
        // If successful, close it; else show the error as it is...
    };

    render() {
        const classes = this.props.classes;
        let { fullScreen } = this.props;
        let tableRename = lib.getTableConfig(this.state.dbIndex, this.state.table, "rename");
        let tableDisplayName = tableRename ? tableRename : this.state.table;

        return (
            <div>
                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">{"Insert new row to " + tableDisplayName}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Fill in a value for each column, be sure to ensure data type is correct. Often, new rows are rejected because the database schema does not allow blank values for certain columns. Make sure any columns marked as NOT NULL are not left blank.</DialogContentText>

                        <Typography type="subheading" className={classes.cardMarginTopBottom}>New Row</Typography>
                        <div className={classes.cardMarginLeft}>
                            {
                                this.state.qbFilters.map((column) => {
                                    return (
                                        <TextField
                                            onChange={(e) => this.handleInput(e, column.id, column.type)}
                                            key={column.id}
                                            label={column.label ? column.label : column.id}
                                            required={(this.state.primaryKeys).indexOf(column.id) >= 0}
                                            placeholder={column.type}
                                            value={(column.default_value || this.state.inputVals[column.id]) || ""}
                                            className={classes.textField}
                                            margin="normal" />
                                    )
                                })
                            }
                        </div>
                    </DialogContent>
                    <Divider />
                    <DialogActions>
                        <Button onClick={this.handleClose} >Cancel</Button>
                        <Button onClick={this.handleReset} >Reset</Button>
                        <Button onClick={this.handleSubmit} color="secondary" autoFocus>Submit</Button>
                    </DialogActions>
                </Dialog>
            </div >
        );
    }
}

const styleSheet = {
    cardMarginTopBottom: { // For items within the same section
        marginBottom: 8,
        marginTop: 16
    },
    cardMarginLeft: {
        marginLeft: 16
    },
    textField: {
        width: 60 + '%',
    }
};


ResponsiveDialog.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
};

export default withStyles(styleSheet)(withMobileDialog()(ResponsiveDialog));