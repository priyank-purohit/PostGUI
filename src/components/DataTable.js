import React, {Component} from 'react'
import ReactTable from 'react-table'

import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import Downloads from './Downloads.js'
import EditCard from './EditCard.js'

import Grid from '@material-ui/core/Grid'

import axios from 'axios'
import 'react-table/react-table.css'

import checkboxHOC from 'react-table/lib/hoc/selectTable'

const CheckboxTable = checkboxHOC(ReactTable)

const lib = require('../utils/library.ts')

export default class DataTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      table: props.table,
      columns: props.columns,
      data: [],
      url: props.url,
      dbPrimaryKeys: [],
      tablePrimaryKeys: [],
      editFeatureEnabled: false,
      editFeatureChangesMade: {},
      rowsStrikedOut: []
    }

    this.renderEditableCell = this.renderEditableCell.bind(this)
    this.submitChanges = this.submitChanges.bind(this)
    this.deleteChange = this.deleteChange.bind(this)
    this.deleteTableChanges = this.deleteTableChanges.bind(this)
    this.postReqToChangeLog = this.postReqToChangeLog.bind(this)
    this.changeEditFeatureEnabled = this.changeEditFeatureEnabled.bind(this)
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      table: newProps.table,
      columns: newProps.columns,
      url: newProps.url,
      data: this.addPkAsId(newProps.data),
      tablePrimaryKeys: [],
      editFeatureEnabled:
        this.state.table !== newProps.table
          ? false
          : this.state.editFeatureEnabled
    })

    // Enable PK related features if table has a PK
    if (newProps.dbPkInfo && this.state.table) {
      for (let i = 0; i < newProps.dbPkInfo.length; i++) {
        if (newProps.dbPkInfo[i].table === this.state.table) {
          this.setState({
            tablePrimaryKeys: newProps.dbPkInfo[i].primary_keys
          })
        }
      }
    }
  }

  // Adds a PK column to each row for the selection part
  addPkAsId(originalData) {
    if (!originalData) {
      return []
    }

    const data = originalData.map((item) => {
      const pkValues = []
      for (let i = 0; i < this.state.tablePrimaryKeys.length; i++) {
        pkValues.push(item[this.state.tablePrimaryKeys[i]])
      }
      const _id = pkValues
      return {
        _id,
        ...item
      }
    })
    return data
  }

  // Allows EditCard.js to change the state here
  changeEditFeatureEnabled(featureEnabled) {
    this.setState({
      editFeatureEnabled: featureEnabled
    })
  }

  // Allows EditCard.js to change the state here
  changeEditFeatureChangesMade(newChanges) {
    this.setState({
      editFeatureChangesMade: newChanges
    })
  }

  // Deletes all changes in the current table (for Remove All button functionality)
  deleteTableChanges() {
    const tempChanges = this.state.editFeatureChangesMade[this.state.table]
    if (tempChanges) {
      const columnsChanged = Object.keys(tempChanges)
      const columnsChangeCount = columnsChanged.length

      // Iterate over all keys (list of column specific changes)
      for (let i = 0; i < columnsChangeCount; i++) {
        const column = columnsChanged[i]
        const keysChanged = Object.keys(tempChanges[column])
        const changeCount = keysChanged.length

        // Iterate over all keys (all changes individually)
        for (let ii = 0; ii < changeCount; ii++) {
          const key = keysChanged[ii]

          // delete using column + key
          this.deleteChange(column, key, false)
        }
      }
    }
  }

  // Given a COLUMN and KEY, deletes the change from the state's changesMade value (for individual deletion of changes)
  // If noRestore is true, it does not try to restore the original value
  deleteChange(column, key, noRestore) {
    const tempChanges = this.state.editFeatureChangesMade

    if (noRestore === false) {
      // Restore original value in state.data if it is available
      const originalValue = tempChanges[this.state.table][column][key].oldValue
      if (originalValue) {
        const data = this.state.data
        data[tempChanges[this.state.table][column][key].rowIndex][
          column
        ] = originalValue
        this.setState({
          data
        })
      }
    }

    // Delete the row from state.data
    if (column === 'id' && key && noRestore === 'delete') {
      // Find the index of row to be deleted
      const dataLength = this.state.data.length
      let rowToDeleteIndex = null
      for (let i = 0; i < dataLength; i++) {
        if (this.state.data[i]._id.join('') === key) {
          rowToDeleteIndex = i
          break
        }
      }

      // Delete the found row...
      const data = this.state.data
      data.splice(rowToDeleteIndex, 1)
      this.setState({
        data
      })
    }

    // Delete the change from list of changes
    delete tempChanges[this.state.table][column][key]

    // Delete the column object if that was the only change for that column...
    if (JSON.stringify(tempChanges[this.state.table][column]) === '{}') {
      delete tempChanges[this.state.table][column]
    }

    // Delete the table object if that was the only change for that table...
    if (JSON.stringify(tempChanges[this.state.table]) === '{}') {
      delete tempChanges[this.state.table]
    }

    this.setState({
      editFeatureChangesMade: tempChanges
    })
  }

  // Given a COLUMN and KEY, toggles the error code for a change (when server responds with error)
  setChangeError(column, key, error, errorResp) {
    const tempChanges = this.state.editFeatureChangesMade

    // Toggle the change...
    tempChanges[this.state.table][column][key].error = error || true
    tempChanges[this.state.table][column][key].errorResp = errorResp

    this.setState({
      editFeatureChangesMade: tempChanges
    })
  }

  // Converts the JSON object for PK into a string and into part of a PostgREST compliant URL
  primaryKeyAsUrlParam(primaryKey) {
    const keys = Object.keys(primaryKey)
    let stringified = ''

    for (const i in Object.keys(primaryKey)) {
      stringified += `${keys[i]}.eq.${primaryKey[keys[i]]}`
      if (parseInt(i, 10) !== keys.length - 1) {
        stringified += ','
      }
    }
    return stringified
  }

  postReqToChangeLog(
    dbIndex,
    changeTimeStamp,
    tableChanged,
    primaryKey,
    columnChanged,
    oldValue,
    newValue,
    notes,
    userName
  ) {
    const changeLogURL = `${lib.getDbConfig(dbIndex, 'url')}/change_log`
    const changeLogPostReqBody = {}

    // These columns are hardcoded ... the db schema for the change-log table is provided separately
    changeLogPostReqBody.change_timestamp = changeTimeStamp
    changeLogPostReqBody.table_changed = tableChanged
    changeLogPostReqBody.primary_key_of_changed_row = JSON.stringify(primaryKey)
    changeLogPostReqBody.column_changed = columnChanged
    changeLogPostReqBody.old_value = String(oldValue) || 'error'
    changeLogPostReqBody.new_value = String(newValue) || 'error'
    changeLogPostReqBody.notes = notes
    changeLogPostReqBody.user_name = userName // TODO: This will change after LOGIN SYSTEM is developed.

    const preparedHeaders = {Prefer: 'return=representation'}
    if (this.props.isLoggedIn && this.props.token) {
      preparedHeaders.Authorization = `Bearer ${this.props.token}`
    }

    axios
      .post(changeLogURL, changeLogPostReqBody, {headers: preparedHeaders})
      .then((response) => {
        // console.info("Change Log POST Successful:" + JSON.stringify(response));
      })
      .catch((error) => {
        // Show error in Snack-Bar
        this.setState(
          {
            snackBarVisibility: true,
            snackBarMessage: 'Error committing CHANGE LOG!'
          },
          () => {
            this.timer = setTimeout(() => {
              this.setState({
                snackBarVisibility: false,
                snackBarMessage: 'Unknown error'
              })
            }, 5000)
          }
        )
      })
  }

  // Makes PATCH requests to submit current table's changes +
  // deletes them from local list of changes as the reqs are successful.
  // TODO: Keeps track of all changes in the updates table.
  // Also marks any changes that are not successful.
  submitChanges() {
    const currentChanges = this.state.editFeatureChangesMade[this.state.table]

    // Nothing to submit
    if (currentChanges === null || currentChanges === undefined) {
      return
    }

    for (let i = 0; i < Object.keys(currentChanges).length; i++) {
      // For all columns changed
      const currentColumnChanges =
        currentChanges[Object.keys(currentChanges)[i]]
      for (let ii = 0; ii < Object.keys(currentColumnChanges).length; ii++) {
        // For all rows of a column changed
        const change =
          currentChanges[Object.keys(currentChanges)[i]][
            Object.keys(currentColumnChanges)[ii]
          ]

        const primaryKey = change.primaryKey
        const columnChanged = Object.keys(currentChanges)[i]
        const keyChanged = Object.keys(currentColumnChanges)[ii]
        const oldValue = change.oldValue
        const newValue = change.newValue
        const deleteRow = change.delete

        if (deleteRow !== true && String(oldValue) !== String(newValue)) {
          // UPDATE SINGLE CELL VALUE
          // Create the URL, add in the new value as URL param
          const url = `${lib.getDbConfig(this.props.dbIndex, 'url')}/${
            this.state.table
          }?and=(${this.primaryKeyAsUrlParam(primaryKey)})`

          // Patch HTTP request
          const patchReqBody = {}
          patchReqBody[columnChanged] = newValue

          const preparedHeaders = {Prefer: 'return=representation'}
          if (this.props.isLoggedIn && this.props.token) {
            preparedHeaders.Authorization = `Bearer ${this.props.token}`
          }

          // Send the Request and check its response:
          // PATCH the request
          axios
            .patch(url, {[columnChanged]: newValue}, {headers: preparedHeaders})
            .then((response) => {
              this.deleteChange(columnChanged, keyChanged, true) // true => do not restore original value when deleting change

              // Add an entry to the database's change log
              this.postReqToChangeLog(
                this.props.dbIndex,
                new Date(Date.now()).toISOString(),
                this.state.table,
                primaryKey,
                columnChanged,
                oldValue,
                newValue,
                '',
                this.props.userName || 'Unknown Username'
              )
            })
            .catch((error) => {
              console.error(`PATCH ERROR RESP:${String(error)}`)
              this.setChangeError(
                columnChanged,
                keyChanged,
                true,
                error.response.data
              )
              // Show error in Snack-Bar
              this.setState(
                {
                  snackBarVisibility: true,
                  snackBarMessage: 'Database update failed.'
                },
                () => {
                  this.timer = setTimeout(() => {
                    this.setState({
                      snackBarVisibility: false,
                      snackBarMessage: 'Unknown error'
                    })
                  }, 5000)
                }
              )
            })
        } else if (deleteRow) {
          // DELETE ROW FEATURE
          // Create the URL, add in the new value as URL param
          const url = `${lib.getDbConfig(this.props.dbIndex, 'url')}/${
            this.state.table
          }?and=(${this.primaryKeyAsUrlParam(primaryKey)})`

          const preparedHeaders = {Prefer: 'return=representation'}
          if (this.props.isLoggedIn && this.props.token) {
            preparedHeaders.Authorization = `Bearer ${this.props.token}`
          }

          // Send the DELETE request and check response
          axios
            .delete(url, {headers: preparedHeaders})
            .then((response) => {
              // Add an entry to the database's change log
              let oldRow = null
              const needle = []
              for (let i = 0; i < this.state.tablePrimaryKeys.length; i++) {
                needle.push(primaryKey[this.state.tablePrimaryKeys[i]])
              }

              for (let i = 0; i < this.state.data.length; i++) {
                // look for the entry with a matching `code` value
                if (String(this.state.data[i]._id) === String(needle)) {
                  oldRow = JSON.stringify(this.state.data[i])
                }
              }

              this.postReqToChangeLog(
                this.props.dbIndex,
                new Date(Date.now()).toISOString(),
                this.state.table,
                primaryKey,
                'ROW_DELETE',
                oldRow || 'Error finding old row...',
                '{}',
                'ROW DELETED.',
                this.props.userName || 'Unknown Username'
              )

              this.deleteChange('id', keyChanged, 'delete')
            })
            .catch((error) => {
              console.error(`ERROR RESP: ${String(error)}`)
              this.setChangeError('id', keyChanged, true, error.response.data)
              // Show error in Snack-Bar
              this.setState(
                {
                  snackBarVisibility: true,
                  snackBarMessage: 'Row delete request failed.'
                },
                () => {
                  this.timer = setTimeout(() => {
                    this.setState({
                      snackBarVisibility: false,
                      snackBarMessage: 'Unknown error'
                    })
                  }, 5000)
                }
              )
            })
        } else {
          // Tell user that the change was not actually detected... and that they should submit a bug
          console.error(
            'Tell user that the change was not actually detected... and that they should submit a bug'
          )
          // Show error in Snack-Bar
          this.setState(
            {
              snackBarVisibility: true,
              snackBarMessage: 'Change was not detected.'
            },
            () => {
              this.timer = setTimeout(() => {
                this.setState({
                  snackBarVisibility: false,
                  snackBarMessage: 'Unknown error'
                })
              }, 2500)
            }
          )
        }
      }
    }
  }

  // Renders an editable cell + manages changes made to it using helpers
  renderEditableCell(cellInfo) {
    return (
      <div
        style={{
          backgroundColor: '#fafafa',
          border: 'none',
          borderBottom: '1px solid lightpink',
          padding: '1px'
        }}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const data = [...this.state.data]

          const changedRowIndex = cellInfo.index
          const changedColumnName = cellInfo.column.id
          // let oldRow = JSON.stringify(this.state.data[changedRowIndex]);
          const oldCellValue = data[changedRowIndex][changedColumnName]
          let newCellValue = e.target.innerHTML

          // Data type assignment for newValue based on the data type of oldValue
          // TODO: this should be done when a change is detected?
          if (String(newCellValue) === '') {
            newCellValue = null
          } else if (typeof oldCellValue === 'string') {
            newCellValue = String(newCellValue)
          } else if (typeof oldCellValue === 'number') {
            newCellValue = Number(newCellValue)
          } else if (typeof oldCellValue === 'boolean') {
            newCellValue = Boolean(newCellValue)
          }

          // ToDo: when original value is NULL, and you don't change it, it sets it to "" from NULL... prevent it
          if (
            String(oldCellValue) !== String(newCellValue) &&
            !(String(oldCellValue) === 'null' && String(newCellValue) === '') &&
            String(newCellValue).indexOf('<br>') < 0 &&
            String(newCellValue).indexOf('<div>') < 0
          ) {
            const changedRowPk = {}
            let changedRowPkStr = ''
            for (let i = 0; i < this.state.tablePrimaryKeys.length; i++) {
              changedRowPk[this.state.tablePrimaryKeys[i]] =
                data[changedRowIndex][this.state.tablePrimaryKeys[i]]
              changedRowPkStr += String(
                data[changedRowIndex][this.state.tablePrimaryKeys[i]]
              )
            }

            // Update the local variable to this function
            data[changedRowIndex][changedColumnName] = newCellValue
            // let newRow = data[changedRowIndex];

            const currentChanges = this.state.editFeatureChangesMade

            // Create the JSON objects if they do not exist
            currentChanges[this.state.table] =
              currentChanges[this.state.table] || {}
            currentChanges[this.state.table][changedColumnName] =
              currentChanges[this.state.table][changedColumnName] || {}
            currentChanges[this.state.table][changedColumnName][
              changedRowPkStr
            ] =
              currentChanges[this.state.table][changedColumnName][
                changedRowPkStr
              ] || {}

            // Keep track of the original* value.
            // * Original means the value in the db on server
            currentChanges[this.state.table][changedColumnName][
              changedRowPkStr
            ].oldValue =
              currentChanges[this.state.table][changedColumnName][
                changedRowPkStr
              ].oldValue || oldCellValue

            // Insert the updates + keep track of the PK
            currentChanges[this.state.table][changedColumnName][
              changedRowPkStr
            ].newValue = newCellValue
            currentChanges[this.state.table][changedColumnName][
              changedRowPkStr
            ].primaryKey = changedRowPk
            currentChanges[this.state.table][changedColumnName][
              changedRowPkStr
            ].rowIndex = changedRowIndex

            // If the newly made change causes the old and new values to be the same, then this change should be deleted altogether
            if (
              String(
                currentChanges[this.state.table][changedColumnName][
                  changedRowPkStr
                ].oldValue
              ) === String(newCellValue)
            ) {
              this.deleteChange(changedColumnName, changedRowPkStr, true)
            }

            this.setState({
              data,
              editFeatureChangesMade: currentChanges
            })
          }
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    )
  }

  // Unchecks all rows, never sets all to be checked
  toggleAll = () => {
    if (
      this.state.editFeatureChangesMade &&
      this.state.editFeatureChangesMade[this.state.table] &&
      this.state.editFeatureChangesMade[this.state.table].id
    ) {
      // Intentioanlly removed the functionality to select all, can only unselect all
      const keysChanged = Object.keys(
        this.state.editFeatureChangesMade[this.state.table].id
      )
      const changeCount = keysChanged.length

      // Iterate over all keys (all changes individually)
      for (let i = 0; i < changeCount; i++) {
        this.deleteChange('id', keysChanged[i], true)
      }
    }
  }

  // Toggles single rows' status from checked to unchecked (delete the change)
  toggleSelection = (primaryKey, shift, row) => {
    // Create a PK {} and STRING
    const changedRowPk = {}
    const changedRowPkStr = primaryKey.join('')
    for (let i = 0; i < this.state.tablePrimaryKeys.length; i++) {
      changedRowPk[this.state.tablePrimaryKeys[i]] = primaryKey[i]
    }

    const currentChanges = this.state.editFeatureChangesMade
    // Create the JSON objects if they do not exist
    currentChanges[this.state.table] = currentChanges[this.state.table] || {}
    currentChanges[this.state.table].id =
      currentChanges[this.state.table].id || {}
    currentChanges[this.state.table].id[changedRowPkStr] =
      currentChanges[this.state.table].id[changedRowPkStr] || {}

    // Mark the row for deletion (set delete property true), or delete the change from editFeatureChangesMade state object
    if (currentChanges[this.state.table].id[changedRowPkStr].delete) {
      // the row was marked for deletion, and user unchecked the row
      this.deleteChange('id', changedRowPkStr, true)
    } else {
      // the row was not marked for deletion, but user wants to mark it for deletion
      currentChanges[this.state.table].id[
        changedRowPkStr
      ].primaryKey = changedRowPk
      currentChanges[this.state.table].id[
        changedRowPkStr
      ].delete = !currentChanges[this.state.table].id[changedRowPkStr].delete
    }

    this.setState({
      editFeatureChangesMade: currentChanges
    })
  }

  // Returns true iff row identified by KEY is marked for deletion in editFeatureChangesMade
  isSelected = (key) => {
    // Change doesn't even exist, so return false
    if (
      this.state.editFeatureChangesMade === {} ||
      this.state.editFeatureChangesMade[this.state.table] === undefined ||
      this.state.editFeatureChangesMade[this.state.table].id === undefined
    ) {
      return false
    }
    return Object.keys(
      this.state.editFeatureChangesMade[this.state.table].id
    ).includes(key.join(''))
  }

  // For the Snackbar close button
  handleRequestClose = () => {
    this.setState({snackBarVisibility: false})
  }

  render() {
    const {columns, data} = this.state
    let parsedColumns = []

    // Create columns with expected column properties
    if (columns) {
      parsedColumns = columns.map((columnName) => {
        const columnRename = lib.getColumnConfig(
          this.props.dbIndex,
          this.state.table,
          columnName,
          'rename'
        )
        const columnVisibility = lib.getColumnConfig(
          this.props.dbIndex,
          this.state.table,
          columnName,
          'visible'
        )
        const columnEditability = lib.getColumnConfig(
          this.props.dbIndex,
          this.state.table,
          columnName,
          'editable'
        )

        const columnWidthDefault = lib.getTableConfig(
          this.props.dbIndex,
          this.state.table,
          'defaultWidthPx'
        )
        const columnWidth = lib.getColumnConfig(
          this.props.dbIndex,
          this.state.table,
          columnName,
          'widthPx'
        )

        const columnMinWidth = lib.getColumnConfig(
          this.props.dbIndex,
          this.state.table,
          columnName,
          'minWidthPx'
        )
        const columnMaxWidth = lib.getColumnConfig(
          this.props.dbIndex,
          this.state.table,
          columnName,
          'maxWidthPx'
        )

        return {
          id: columnName,
          Header: columnRename || columnName,
          accessor: columnName,
          show: columnVisibility !== null ? columnVisibility : true,
          width:
            columnWidth !== null
              ? columnWidth
              : columnWidthDefault || undefined,
          maxWidth: columnMaxWidth !== null ? columnMaxWidth : undefined,
          minWidth: columnMinWidth !== null ? columnMinWidth : 100,
          headerStyle: {fontWeight: 'bold'},
          Cell:
            this.state.editFeatureEnabled === true &&
            columnEditability !== false
              ? this.renderEditableCell
              : (row) =>
                  row.value !== undefined && row.value !== null
                    ? String(row.value)
                    : row.value
        }
      })
    }

    // Prepare for CheckboxTable
    const {toggleSelection, isSelected, toggleAll} = this
    const checkboxProps = {
      isSelected,
      toggleSelection,
      toggleAll,
      selectType: 'checkbox',
      getTrProps: (s, r) => {
        let selected = false
        try {
          selected = this.isSelected(r.original._id)
        } catch (error) {
          selected = false
        }
        return {
          style: {
            backgroundColor: selected ? 'lightpink' : 'inherit',
            textDecoration: selected ? 'line-through' : 'none'
          }
        }
      }
    }

    // render() return
    return (
      <>
        {this.state.editFeatureEnabled ? (
          <CheckboxTable
            data={data}
            columns={parsedColumns}
            defaultPageSize={10}
            className='-striped -highlight'
            pageSizeOptions={[10, 50, 100, 200, 500, 1000]}
            previousText='Previous Page'
            nextText='Next Page'
            noDataText={this.props.noDataText}
            {...checkboxProps}
          />
        ) : (
          <ReactTable
            data={data}
            columns={parsedColumns}
            defaultPageSize={10}
            className='-striped -highlight'
            pageSizeOptions={[10, 50, 100, 200, 500, 1000]}
            previousText='Previous Page'
            nextText='Next Page'
            noDataText={this.props.noDataText}
          />
        )}

        <div style={styleSheet.cardGroups}>
          <Grid
            container
            spacing={10}
            direction={
              this.state.tablePrimaryKeys.join(',') === ''
                ? 'row-reverse'
                : 'row'
            }
          >
            {this.state.tablePrimaryKeys.join(',') !== '' && (
              <Grid item sm={12} md={6}>
                <EditCard
                  {...this.props}
                  table={this.state.table}
                  columns={this.state.columns}
                  url={this.state.url}
                  featureEnabled={this.state.editFeatureEnabled}
                  changesMade={this.state.editFeatureChangesMade}
                  rowsStrikedOut={this.state.rowsStrikedOut}
                  submitChanges={this.submitChanges}
                  deleteChange={this.deleteChange}
                  deleteTableChanges={this.deleteTableChanges}
                  postReqToChangeLog={this.postReqToChangeLog}
                  changeEditFeatureEnabled={this.changeEditFeatureEnabled}
                />
              </Grid>
            )}
            <Grid item sm={12} md={6}>
              <Downloads
                {...this.props}
                table={this.state.table}
                columns={this.state.columns}
                data={this.state.data}
                url={this.state.url}
              />
            </Grid>
          </Grid>
        </div>

        <Snackbar
          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
          open={this.state.snackBarVisibility}
          onClose={this.handleRequestClose}
          ContentProps={{'aria-describedby': 'message-id'}}
          message={<span id='message-id'>{this.state.snackBarMessage}</span>}
          action={[
            <IconButton
              key='close'
              aria-label='Close'
              color='secondary'
              style={styleSheet.close}
              onClick={this.handleRequestClose}
            >
              {' '}
              <CloseIcon />{' '}
            </IconButton>
          ]}
        />
      </>
    )
  }
}

const styleSheet = {
  root: {
    width: '29%',
    height: '100%',
    float: 'left'
  },
  headerClass: {
    fontWeight: 'bold'
  },
  button: {
    margin: 5,
    float: 'right'
  },
  topMargin: {
    margin: 5,
    marginTop: 5 * 5
  },
  cardGroups: {
    flexGrow: 1
  }
}
