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
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            dbIndex: props.dbIndex,
            table: props.table,
            columns: props.columns,
            allColumns: props.allColumns,
            dbPkInfo: props.dbPkInfo,
            url: props.url
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            open: newProps.open || true,
            dbIndex: newProps.dbIndex,
            table: newProps.table,
            columns: newProps.columns,
            allColumns: newProps.allColumns,
            dbPkInfo: newProps.dbPkInfo,
            url: newProps.url
        });
    }

    handleClickOpen = () => {
        this.props.handleNewRowClick();
    };

    handleClose = () => {
        this.props.handleNewRowClick();
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