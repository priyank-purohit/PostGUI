import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

let lib = require('../utils/library.js');

class ResponsiveDialog extends React.Component {
    state = {
        open: false,
    };

    componentWillReceiveProps(newProps) {
        this.setState({
            open: newProps.open,
        });
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { fullScreen } = this.props;
        let tableRename = lib.getTableConfig(this.state.dbIndex, this.state.table, "rename");
        let tableDisplayName = tableRename ? tableRename : this.state.table;

        return (
            <div>
                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">{"Insert new row to '" + tableDisplayName + "' table:"}</DialogTitle>
                    <DialogContent>
                        {this.props.allColumns.map((column) => {
                            return (
                                <DialogContentText key={column}>{column}</DialogContentText>
                            )
                        })}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Disagree</Button>
                        <Button onClick={this.handleClose} color="primary" autoFocus>Agree</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

ResponsiveDialog.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(ResponsiveDialog);