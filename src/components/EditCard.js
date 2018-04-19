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

import List, {
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import CreateIcon from 'material-ui-icons/Create';
import DeleteIcon from 'material-ui-icons/Delete';

//const timeout = 2000;

class EditCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dbIndex: props.dbIndex,
            table: props.table,
            columns: props.columns,
            url: props.url,
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

    render() {
        const classes = this.props.classes;

        return (<div className={classes.limitWidth} >
            <Paper elevation={2} className={classes.topMargin}>
                <Typography type="subheading" className={classes.cardcardMarginLeftTop}>Edit Table Contents</Typography>

                <FormGroup className={classes.cardMarginLeft}>
                    <FormControlLabel
                        control={<Switch checked={true} value="gilad" />}
                        label="Turn on editable table" />
                </FormGroup>

                {/* Changes made LIST */}
                <Typography type="body1" className={classes.cardcardMarginLeftTop}>Changes made to this table</Typography>

                <List dense={true}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <CreateIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary="'Player Birth Country' column changed where playerid=9999999 and seasonid=20182019"
                            secondary={"From 'CAN' to 'Canada'"}
                        />
                        <ListItemSecondaryAction>
                            <IconButton aria-label="Delete">
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>

                <Divider />

                <Button color="primary" className={classes.button} onClick={this.handleDownloadClick.bind(this)} disabled={this.state.fileFormat === 'delimitedColumn'} >Submit</Button>
                <Button className={classes.button && classes.floatRight} onClick={this.handleResetClick.bind(this)} >Remove All</Button>
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
    }
};


export default withStyles(styleSheet)(EditCard);