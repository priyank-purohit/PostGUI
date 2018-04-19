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
            featureEnabled: false,
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
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <CreateIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary="'Player Birth Country' column changed"
                                secondary={"From 'CAN' to 'Canada' where playerid = 9999999 and seasonid = 20182019"} />
                            <ListItemSecondaryAction>
                                <IconButton aria-label="Delete">
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </div>) : (<div></div>)}
                <Divider />

                <Button onClick={this.handleDownloadClick.bind(this)} disabled={! (this.state.featureEnabled && this.state.primaryKeysAvailable)} color="primary" className={classes.button}>Submit</Button>
                <Button onClick={this.handleResetClick.bind(this)} disabled={! (this.state.featureEnabled && this.state.primaryKeysAvailable)} className={classes.button && classes.floatRight}>Remove All</Button>
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