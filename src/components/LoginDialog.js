import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import FeatureDiscoveryPrompt from './FeatureDiscoveryPrompt/FeatureDiscoveryPrompt';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';

class LoginDialog extends Component {
    render() {
        return (
            <Dialog
                open={this.props.open || false}
                onClose={this.props.handleClose}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Login to PostGUI</DialogTitle>
                <DialogContent>
                    <DialogContentText>Provide your credentials for this database, it may allow you more privileges.</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose} color="primary">Cancel</Button>
                    <Button onClick={this.props.handleClose} color="primary">Subscribe</Button>
                </DialogActions>
            </Dialog>
        );
    }
}


LoginDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styleSheet = theme => ({
    root: {
        width: '100%'
    },
    dbTitleFlex: {
        flex: 0.3
    },
    searchBarFlex: {
        flex: 0.6,
        display: 'block',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 0,
    },
    searchBar: {
        marginLeft: 5,
        marginRight: 5,
        background: 'white',
        padding: 10,
        paddingBottom: 5,
        borderRadius: 3,
        float: 'right',
        transition: 'all 0.2s'
    },
    rightIconsFlex: {
        flex: 0.05,
        display: 'block'
    },
    floatRight: {
        float: 'right'
    },
    floatRightPadded: {
        float: 'right',
        marginRight: 5
    },
    button: {
        margin: theme.spacing.unit,
    },
});

export default withStyles(styleSheet)(LoginDialog);