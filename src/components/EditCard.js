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
                <Typography type="subheading" className={classes.cardcardMarginLeftTop}>Edit table</Typography>

                <FormGroup className={classes.cardMarginLeft}>
                    <FormControlLabel
                        control={ <Switch checked={true} value="gilad" /> }
                        label="Enable cell edit feature" />
                </FormGroup>

                {/* Changes made LIST */}
                <Typography type="body1" className={classes.cardcardMarginLeftTop}>Changes made to this table</Typography>

                <Divider />

                <Button color="primary" className={classes.button} onClick={this.handleDownloadClick.bind(this)} disabled={this.state.fileFormat === 'delimitedColumn'} >Commit</Button>
                <Button className={classes.button && classes.floatRight} onClick={this.handleResetClick.bind(this)} >Reset</Button>
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
        width: '50%',
        display: 'block'
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