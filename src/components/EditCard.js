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
import CloseIcon from '@material-ui/icons/Close';

import List, { ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import CreateIcon from '@material-ui/icons/Create';
import SearchIcon from '@material-ui/icons/Search';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import DeleteIcon from '@material-ui/icons/Delete';

import pink from 'material-ui/colors/pink';
import red from 'material-ui/colors/red';
import amber from 'material-ui/colors/amber';

//const timeout = 2000;

class EditCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dbIndex: props.dbIndex,
            table: props.table,
            columns: props.columns,
            url: props.url,

            dbPkInfo: {},
            primaryKeysAvailable: false,
            primaryKeys: [],

            featureEnabled: props.featureEnabled | false,
            changesMade: props.changesMade | {},

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
            url: newProps.url,
            dbPkInfo: newProps.dbPkInfo,
            primaryKeys: [],
            primaryKeysAvailable: false,
            changesMade: newProps.changesMade,
            featureEnabled: newProps.featureEnabled
        });

        // Enable PK related features if table has a PK
        if (newProps.dbPkInfo && this.state.table) {
            for (let i = 0; i < newProps.dbPkInfo.length; i++) {
                if (newProps.dbPkInfo[i]["table"] === this.state.table) {
                    this.setState({
                        primaryKeys: newProps.dbPkInfo[i]["primary_keys"],
                        primaryKeysAvailable: JSON.stringify(newProps.dbPkInfo[i]["primary_keys"]) !== "[]"
                    });
                }
            }
        }
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
            this.props.deleteTableChanges();
        }
    }

    handleSubmitClick() {
        console.clear();
        this.props.submitChanges();
    }

    // Toggle the switch
    handleFeatureEnabledSwitch() {
        // Set the featureEnabled state to opposite of what it is at the moment...
        this.setState({
            featureEnabled: !this.state.featureEnabled
        }, () => {
            this.props.changeEditFeatureEnabled(this.state.featureEnabled);
        });
    }

    // Converts the JSON object for PK into a string that can be displayed to user
    primaryKeyStringify(primaryKey) {
        let keys = Object.keys(primaryKey);
        let stringified = "";

        for (let i in Object.keys(primaryKey)) {
            stringified += keys[i] + " = " + primaryKey[keys[i]];
            if (parseInt(i, 10) !== keys.length - 1) { stringified += " and "; }
        }
        return stringified;
    }

    // Creates the <list> that shows the changes made
    createChangeLogList() {
        if (this.state.table === "" || JSON.stringify(this.state.changesMade) === "{}" || this.state.changesMade[this.state.table] === null || this.state.changesMade[this.state.table] === undefined) {
            return (
                <ListItem key={-1}>
                    <ListItemAvatar>
                        <Avatar>
                            <SearchIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={"No unsubmitted changes found..."} />
                </ListItem>);
        }

        let length = Object.keys(this.state.changesMade[this.state.table]).length;
        let keys = Object.keys(this.state.changesMade[this.state.table]);
        let listItems = [];

        for (let i = 0; i < length; i++) {
            let column = keys[i];

            let change = this.state.changesMade[this.state.table][column];
            let changeCount = Object.keys(change).length;

            for (let ii = 0; ii < changeCount; ii++) {
                let oldValue = change[Object.keys(change)[ii]]['oldValue'];
                let newValue = change[Object.keys(change)[ii]]['newValue'];
                let primaryKey = change[Object.keys(change)[ii]]['primaryKey'];
                let error = change[Object.keys(change)[ii]]['error'];

                listItems.push(
                    <ListItem key={String(i) + String(ii)}>
                        <ListItemAvatar>
                            {error ? (<Avatar className={this.props.classes.errorAvatar}><CloseIcon /></Avatar>) : (<Avatar> <CreateIcon /> </Avatar>)}
                        </ListItemAvatar>
                        <ListItemText
                            primary={column + " column changed"}
                            secondary={"From " + oldValue + " to " + newValue + " where " + this.primaryKeyStringify(primaryKey)} />
                        <ListItemSecondaryAction onClick={this.props.deleteChange.bind(this, column, Object.keys(change)[ii])}>
                            <IconButton aria-label="Delete">
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>);
            }
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
                        label="Enable table edit feature" />
                </FormGroup>) : (<div>
                    <List dense={false}>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar className={classes.secondaryAvatar}><ErrorIcon /></Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="This table cannot be edited because it does not have any Primary Key defined in the PostgreSQL database." />
                        </ListItem>
                    </List>
                </div>)}

                {this.state.featureEnabled && this.state.primaryKeysAvailable ? (<div>
                    <Typography variant="body1" className={classes.cardcardMarginLeftTop}>Changes made to this table</Typography>

                    <List dense={true}>
                        {this.createChangeLogList()}
                    </List>
                </div>) : JSON.stringify(this.state.changesMade) !== "{}" ? (<div>
                    <List dense={false}>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar className={classes.amberAvatar}><WarningIcon /></Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Unsubmitted changes are detected, these changes will be lost if not submitted." />
                        </ListItem>
                    </List>
                </div>) : (<div></div>)}
                <Divider />

                <Button onClick={this.handleSubmitClick.bind(this)} disabled={!(this.state.featureEnabled && this.state.primaryKeysAvailable)} color="primary" className={classes.button}>Submit</Button>
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
        color: '#fff',
        backgroundColor: pink[500]
    },
    amberAvatar: {
        color: '#fff',
        backgroundColor: amber[500]
    },
    errorAvatar: {
        color: '#fff',
        backgroundColor: red[500]
    }
};


export default withStyles(styleSheet)(EditCard);