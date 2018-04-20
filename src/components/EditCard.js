import React, { Component } from 'react';
//import axios from 'axios';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
//import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
//import List, { ListItem, ListItemText } from 'material-ui/List';
import Switch from 'material-ui/Switch';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

import List, { ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import CreateIcon from 'material-ui-icons/Create';
import ErrorIcon from 'material-ui-icons/Error';
import DeleteIcon from 'material-ui-icons/Delete';

import pink from 'material-ui/colors/pink';

//const timeout = 2000;

class EditCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dbIndex: props.dbIndex,
            table: props.table,
            columns: props.columns,
            url: props.url,

            primaryKeysAvailable: true,
            primaryKeys: [],

            featureEnabled: true,
            changesMade: { "stats": { "assists": { "4309247|20172018": { "oldValue": 123, "newValue": 124, "primaryKey": { "playerid": 43092472, "seasonid": 20172018 } } }, "goals": { "4309247|20172018": { "oldValue": 12, "newValue": 13, "primaryKey": { "playerid": 43092472, "seasonid": 20172018 } } } }, "stats2": { "OT Goals": { "4309247|20172018": { "oldValue": 1, "newValue": 2, "primaryKey": { "playerid": 43092472, "seasonid": 20172018 } } }, "points": { "4309247|20172018": { "oldValue": 120, "newValue": 130, "primaryKey": { "playerid": 43092472, "seasonid": 20172018 } } } } },

            snackBarVisibility: false,
            snackBarMessage: "Unknown error occured",

            removeButtonLabel: "Remove All"
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            dbIndex: newProps.dbIndex,
            table: newProps.table,
            columns: newProps.columns,
            url: newProps.url
        });
    }

    // Given a COLUMN and KEY, deletes the change from the state's changesMade value
    deleteTableChanges() {
        // First delete the exact change
        let tempChanges = this.state.changesMade;
        delete tempChanges[this.state.table];

        this.setState({
            changesMade: tempChanges
        });
    }

    // Given a COLUMN and KEY, deletes the change from the state's changesMade value
    deleteChange(column, key) {
        // First delete the exact change
        let tempChanges = this.state.changesMade;
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
            changesMade: tempChanges
        });
    }

    handleRemoveAllClick(e) {
        if (this.state.removeButtonLabel === "Remove All") {
            this.setState({
                removeButtonLabel: "Confirm Remove All?"
            });
            this.timer = setTimeout(() => {
                this.setState({
                    removeButtonLabel: "Remove All"
                });
            }, 4000);
        } else {
            this.setState({
                removeButtonLabel: "Remove All"
            });
            this.deleteTableChanges();
        }
    }

    handleDownloadClick() {
    }

    // Toggle the switch
    handleFeatureEnabledSwitch() {
        // Set the featureEnabled state to opposite of what it is at the moment...
        this.setState({
            featureEnabled: !this.state.featureEnabled
        });
    }

    // Converts the JSON object for PK into a string that can be displayed to user
    primaryKeyStringify(primaryKey) {
        let keys = Object.keys(primaryKey);
        let stringified = "";

        for (let i in Object.keys(primaryKey)) {
            stringified += keys[i] + " = " + primaryKey[keys[i]];
            if (i !== keys.length - 1) { stringified += " and "; }
        }
        return stringified;
    }

    // Creates the <list> that shows the changes made
    createChangeLogList() {
        if (this.state.table === "" || JSON.stringify(this.state.changesMade) === "{}" || this.state.changesMade[this.state.table] === null || this.state.changesMade[this.state.table] === undefined) {
            return;
        }

        let length = Object.keys(this.state.changesMade[this.state.table]).length;
        let keys = Object.keys(this.state.changesMade[this.state.table]);
        let listItems = [];

        for (let i = 0; i < length; i++) {
            let column = keys[i];

            let change = this.state.changesMade[this.state.table][column];
            let oldValue = change[Object.keys(change)[0]]['oldValue'];
            let newValue = change[Object.keys(change)[0]]['newValue'];
            let primaryKey = change[Object.keys(change)[0]]['primaryKey'];

            listItems.push(
                <ListItem key={i}>
                    <ListItemAvatar>
                        <Avatar>
                            <CreateIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={column + " column changed"}
                        secondary={"From " + oldValue + " to " + newValue + " where " + this.primaryKeyStringify(primaryKey)} />
                    <ListItemSecondaryAction onClick={this.deleteChange.bind(this, column, Object.keys(change)[0])}>
                        <IconButton aria-label="Delete">
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>);
        }
        return listItems;
    }

    render() {
        const classes = this.props.classes;

        return (<div className={classes.limitWidth} >
            <Paper elevation={2} className={classes.topMargin}>
                <Typography variant="subheading" className={classes.cardcardMarginLeftTop}>Edit Table Contents</Typography>

                {this.state.primaryKeysAvailable ? (<FormGroup className={classes.cardMarginLeft}>
                    <FormControlLabel
                        control={<Switch checked={this.state.featureEnabled} onChange={this.handleFeatureEnabledSwitch.bind(this)} value="featureStatus" />}
                        label="Turn on editable table" />
                </FormGroup>) : (<div>
                    <List dense={true}>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar className={classes.secondaryAvatar}>
                                    <ErrorIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary="This table cannot be edited because it does not have any Primary Key defined in the PostgreSQL database."
                            />
                        </ListItem>
                    </List>
                </div>)}

                {this.state.featureEnabled && this.state.primaryKeysAvailable ? (<div>
                    <Typography variant="body1" className={classes.cardcardMarginLeftTop}>Changes made to this table</Typography>

                    <List dense={true}>
                        {this.createChangeLogList()}
                    </List>
                </div>) : (<div></div>)}
                <Divider />

                <Button onClick={this.handleDownloadClick.bind(this)} disabled={!(this.state.featureEnabled && this.state.primaryKeysAvailable)} color="primary" className={classes.button}>Submit</Button>
                <Button onClick={this.handleRemoveAllClick.bind(this)} disabled={!(this.state.featureEnabled && this.state.primaryKeysAvailable)} className={classes.button && classes.floatRight} value={this.state.removeButtonLabel}>{this.state.removeButtonLabel}</Button>
            </Paper>

            <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={this.state.snackBarVisibility}
                onClose={this.handleRequestClose}
                SnackbarContentProps={{ 'aria-describedby': 'message-id', }}
                message={<span id="message-id">{this.state.snackBarMessage}</span>}
                action={[<IconButton key="close" aria-label="Close" color="secondary" className={classes.close} onClick={this.handleRequestClose}> <CloseIcon /> </IconButton>]} />

        </div>);
    }
}

const styleSheet = {
    button: {
        marginBottom: 4
    },
    limitWidth: {
        width: '50%'
    },
    topMargin: {
        marginTop: 16,
        marginLeft: 16
    },
    cardMarginLeft: { // For items within the same section
        marginLeft: 32
    },
    cardcardMarginLeftTop: { // For a new section
        marginLeft: 16,
        paddingTop: 16
    },
    floatRight: {
        float: 'right'
    },
    secondaryAvatar: {
        margin: 10,
        color: '#fff',
        backgroundColor: pink[500]
    }
};


export default withStyles(styleSheet)(EditCard);