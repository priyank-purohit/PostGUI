import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import withMobileDialog from '@material-ui/core/withMobileDialog'
import TextField from '@material-ui/core/TextField'
import {Divider, Paper} from '@material-ui/core'

import axios from 'axios'

let lib = require('../utils/library.ts')

class ResponsiveDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      table: props.table,
      columns: props.columns,
      allColumns: props.allColumns,
      primaryKeys: props.primaryKeys || [],
      qbFilters: props.qbFilters || [],
      url: props.url,
      inputVals: {},
      error: '',
      submitButtonLabel: 'Submit'
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      open: newProps.open,
      table: newProps.table,
      columns: newProps.columns,
      allColumns: newProps.allColumns,
      primaryKeys: newProps.primaryKeys || [],
      qbFilters: newProps.qbFilters || [],
      url: newProps.url,
      inputVals: {},
      error: ''
    })
  }

  handleClose = () => {
    this.props.handleNewRowClick(false)
  }

  // Reset all input fields
  handleReset = () => {
    clearTimeout(this.timer)
    let qbFiltersTemp = this.state.qbFilters
    this.setState(
      {
        qbFilters: [],
        inputVals: {},
        error: '',
        submitButtonLabel: 'Submit'
      },
      () => {
        this.setState({
          qbFilters: qbFiltersTemp
        })
      }
    )
  }

  handleInput = (event, column, dataType) => {
    let value = event.target.value // New value from user
    let inputValues = this.state.inputVals || {}

    if (value === '') {
      delete inputValues[column]
    } else {
      inputValues[column] = inputValues[column] || {}
      inputValues[column]['value'] = value
      inputValues[column]['dataType'] = dataType
    }

    this.setState({
      inputVals: inputValues
    })
  }

  commitToChangeLog(newRow) {
    let primaryKey = {}
    for (let i = 0; i < this.state.primaryKeys.length; i++) {
      primaryKey[this.state.primaryKeys[i]] =
        newRow[0][this.state.primaryKeys[i]]
    }

    this.props.postReqToChangeLog(
      this.props.dbIndex,
      new Date(Date.now()).toISOString(),
      this.state.table,
      primaryKey,
      'ROW_INSERT',
      '{}',
      newRow[0],
      'ROW INSERTED.',
      'public'
    )
  }

  handleSubmit = () => {
    if (this.state.submitButtonLabel === 'Submit') {
      // Give user 4 seconds to confirm
      this.setState({
        submitButtonLabel: 'Are you sure?'
      })
      this.timer = setTimeout(() => {
        this.setState({
          submitButtonLabel: 'Submit'
        })
      }, 4000)
    } else {
      // User wants to submit for sure, so do it
      clearTimeout(this.timer)
      this.setState({
        submitButtonLabel: 'Submit'
      })
      let input = this.state.inputVals
      let keys = Object.keys(this.state.inputVals)

      let newRowURL =
        lib.getDbConfig(this.props.dbIndex, 'url') + '/' + this.state.table
      let postReqBody = {}

      for (let i = 0; i < keys.length; i++) {
        let column = keys[i]
        let rawValue = input[keys[i]]['value']
        let dataType = input[keys[i]]['dataType']
        let value = rawValue

        if (dataType === 'string') {
          value = String(rawValue)
        } else if (dataType === 'integer' || dataType === 'double') {
          value = Number(rawValue)
        } else if (dataType === 'boolean') {
          value = Boolean(rawValue)
        }

        postReqBody[column] = value
      }

      let preparedHeaders = {Prefer: 'return=representation'}
      if (this.props.isLoggedIn && this.props.token) {
        preparedHeaders['Authorization'] = 'Bearer ' + this.props.token
      }

      axios
        .post(newRowURL, postReqBody, {headers: preparedHeaders})
        .then((response) => {
          this.commitToChangeLog(response.data)
          this.props.insertNewRow(response.data)
          this.handleReset()
          this.props.handleNewRowClick(false)
        })
        .catch((error) => {
          this.setState(
            {
              error: error.response
            },
            () => {
              let element = document.getElementById('errorPaper')
              element.scrollIntoView()
            }
          )
        })
    }
  }

  render() {
    let {fullScreen} = this.props
    let tableRename = lib.getTableConfig(
      this.props.dbIndex,
      this.state.table,
      'rename'
    )
    let tableDisplayName = tableRename ? tableRename : this.state.table

    return (
      <>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby='responsive-dialog-title'
        >
          <DialogTitle id='responsive-dialog-title'>
            {'Insert new row to ' + tableDisplayName}
          </DialogTitle>
          <DialogContent>
            {this.state.error !== '' && (
              <Paper
                id='errorPaper'
                style={styleSheet.paperError}
                elevation={4}
              >
                <Typography
                  variant='subtitle1'
                  style={styleSheet.paperMarginTopLeft}
                >
                  Request Denied
                </Typography>
                <DialogContentText style={styleSheet.paperMarginLeft}>
                  {'Code: ' +
                    (this.state.error && this.state.error.data
                      ? this.state.error.data.code
                      : '')}
                </DialogContentText>
                <DialogContentText style={styleSheet.paperMarginLeft}>
                  {'Message: ' +
                    (this.state.error && this.state.error.data
                      ? this.state.error.data.message
                      : '')}
                </DialogContentText>
                <DialogContentText style={styleSheet.paperMarginLeft}>
                  {'Details: ' +
                    (this.state.error && this.state.error.data
                      ? this.state.error.data.details
                      : '')}
                </DialogContentText>
              </Paper>
            )}

            <DialogContentText style={styleSheet.paperMarginTop}>
              {"Unique values for the table's primary key (" +
                this.state.primaryKeys.join(', ') +
                ') are mandatory (*). Other constraints may be imposed by the database schema, follow instructions in the error details.'}
            </DialogContentText>

            <Typography type='subtitle1' style={styleSheet.cardMarginTopBottom}>
              New Row
            </Typography>
            <>
              {this.state.qbFilters.map((column) => {
                return (
                  <TextField
                    onChange={(e) =>
                      this.handleInput(e, column.id, column.type)
                    }
                    key={column.id}
                    label={column.label ? column.label : column.id}
                    required={this.state.primaryKeys.indexOf(column.id) >= 0}
                    placeholder={column.type}
                    value={
                      column.default_value ||
                      (this.state.inputVals[column.id]
                        ? this.state.inputVals[column.id]['value']
                        : '') ||
                      ''
                    }
                    style={styleSheet.textField}
                    margin='normal'
                  />
                )
              })}
            </>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button onClick={this.handleClose}>Cancel</Button>
            <Button onClick={this.handleReset}>Reset</Button>
            <Button onClick={this.handleSubmit} color='secondary' autoFocus>
              {this.state.submitButtonLabel}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

const styleSheet = {
  paperMarginTopLeft: {
    paddingLeft: 16,
    paddingTop: 16,
    paddingBottom: 8
  },
  paperMarginTop: {
    paddingLeft: 16,
    paddingTop: 16
  },
  paperMarginLeft: {
    paddingLeft: 16,
    paddingBottom: 8,
    paddingRight: 8
  },
  cardMarginTopBottom: {
    // For items within the same section
    marginBottom: 8,
    marginTop: 16
  },
  cardMarginLeft: {
    marginLeft: 16
  },
  textField: {
    width: 60 + '%'
  },
  paperError: {
    backgroundColor: 'pink'
  }
}

ResponsiveDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired
}

export default withMobileDialog()(ResponsiveDialog)
