import React, { Component } from 'react';
//import axios from 'axios';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
//import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import { FormLabel, FormControl, FormGroup, FormControlLabel, FormHelperText } from 'material-ui/Form';
//import List, { ListItem, ListItemText } from 'material-ui/List';
import Switch from 'material-ui/Switch';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

import List, { ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText, } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import CreateIcon from 'material-ui-icons/Create';
import ErrorIcon from 'material-ui-icons/Error';
import DeleteIcon from 'material-ui-icons/Delete';

import pink from 'material-ui/colors/pink';
import { StringDecoder } from 'string_decoder';

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

            featureEnabled: false,
            changesMade: { "stats": { "assists": { "4309247|20172018": { "oldValue": 123, "newValue": 124, "primaryKey": { "playerid": 43092472, "seasonid": 20172018 } } }, "goals": { "4309247|20172018": { "oldValue": 12, "newValue": 13, "primaryKey": { "playerid": 43092472, "seasonid": 20172018 } } } }, "stats2": { "OT Goals": { "4309247|20172018": { "oldValue": 1, "newValue": 2, "primaryKey": { "playerid": 43092472, "seasonid": 20172018 } } }, "points": { "4309247|20172018": { "oldValue": 120, "newValue": 130, "primaryKey": { "playerid": 43092472, "seasonid": 20172018 } } } } },

            snackBarVisibility: false,
            snackBarMessage: "Unknown error occured",
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

    handleResetClick() {
        this.setState({
        });
    }

    handleDownloadClick() {
    }

    handleFeatureEnabledSwitch() {
        // Set the featureEnabled state to opposite of what it is at the moment...
        this.setState({
            featureEnabled: !this.state.featureEnabled
        });
    }

    primaryKeyStringify(primaryKey) {
        let keys = Object.keys(primaryKey);
        let stringified = "";

        for (let i in Object.keys(primaryKey)) {
            stringified += keys[i] + " = " + primaryKey[keys[i]];
            if (i != keys.length - 1) { stringified += " and "; }
        }

        return stringified;
    }

    createChangeLogList() {
        let length = Object.keys(this.state.changesMade[this.state.table]).length;
        let keys = Object.keys(this.state.changesMade[this.state.table]);
        let listItems = [];

        for (let i = 0; i < length; i++) {
            let change = this.state.changesMade[this.state.table][keys[i]];

            listItems.push(
                <ListItem key={i}>
                    <ListItemAvatar>
                        <Avatar>
                            <CreateIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={keys[i] + " column changed"}
                        secondary={"From " + change[Object.keys(change)[0]]['oldValue'] + " to " + change[Object.keys(change)[0]]['newValue'] + " where " + this.primaryKeyStringify(change[Object.keys(change)[0]]['primaryKey'])} />
                    <ListItemSecondaryAction>
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
                <Button onClick={this.handleResetClick.bind(this)} disabled={!(this.state.featureEnabled && this.state.primaryKeysAvailable)} className={classes.button && classes.floatRight}>Remove All</Button>
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