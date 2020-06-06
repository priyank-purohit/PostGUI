import React, { Component } from 'react';

import { Divider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import amber from '@material-ui/core/colors/amber';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import LinkIcon from '@material-ui/icons/Link';


let _ = require('lodash')
let lib = require('../utils/library.ts')
let displayLengthCutoff = 50

interface HistoryPaneProps {
  dbIndex: number
  historyPaneVisibility: boolean
  newHistoryItem: any

  closeHistoryPane: Function
  changeTable: Function
  changeRules: Function
  publicDBStatus: Function
}

interface HistoryPaneState {
  newHistoryItem: any
  displayIndex: number
  historyArray: Array<any>
  deleteHistoryDialogVisibilityStyles: any
  snackBarVisibility: boolean
  snackBarMessage: string
}

export default class HistoryPane extends Component<
  HistoryPaneProps,
  HistoryPaneState
> {
  changeDisplayIndexDebounce: Function
  timer: any

  constructor(props: HistoryPaneProps) {
    super(props)

    let localHistoryArray: any = JSON.parse(
      localStorage.getItem('localHistory') || '[]'
    )
    localHistoryArray =
      JSON.stringify(localHistoryArray) === '[]' ? null : localHistoryArray

    // historyArray will have the latest URL at the end ... i.e. 0 position is the earliest query, and the highest position index is the latest query...
    // TODO: Need to make historyArray db specific!!!
    this.state = {
      newHistoryItem: this.props.newHistoryItem,
      displayIndex: -1,
      historyArray: localHistoryArray ? localHistoryArray : [],
      deleteHistoryDialogVisibilityStyles: styleSheet.hide,
      snackBarVisibility: false,
      snackBarMessage: 'Unknown error occured'
    }
    this.changeDisplayIndexDebounce = _.debounce(
      (value: number) => this.setState({displayIndex: value}),
      300
    )

    this.closeDrawer = this.closeDrawer.bind(this)
    this.showDeleteHistoryDialog = this.showDeleteHistoryDialog.bind(this)
    this.deleteHistory = this.deleteHistory.bind(this)
  }

  // Keeps track of the incoming queries in an array
  componentWillReceiveProps(newProps: HistoryPaneProps) {
    // If the incoming newHistoryItem isn't already the current state.newHistoryItem AND it actually exists THEN
    if (
      this.state.newHistoryItem !== newProps.newHistoryItem &&
      newProps.newHistoryItem !== [] &&
      newProps.newHistoryItem !== undefined &&
      newProps.newHistoryItem !== null &&
      newProps.newHistoryItem
    ) {
      // Check if the new item already exists in the historyArray
      if (
        lib.inArray(newProps.newHistoryItem, this.state.historyArray) === false
      ) {
        // doesn't exist, so insert it at highestIndex+1 position (i.e. 0th index is oldest)
        var arrayvar = this.state.historyArray.slice()
        arrayvar.push(newProps.newHistoryItem)

        this.setState(
          {
            newHistoryItem: newProps.newHistoryItem,
            historyArray: arrayvar
          },
          () => {
            try {
              localStorage.setItem(
                'localHistory',
                JSON.stringify(this.state.historyArray)
              )
            } catch (e) {
              console.error(e)
            }
          }
        )
      } else {
        // already exists, move it to "top" (which in this case is the highest index...)
        this.setState(
          {
            newHistoryItem: newProps.newHistoryItem,
            historyArray: lib.moveArrayElementFromTo(
              this.state.historyArray,
              lib.elementPositionInArray(
                newProps.newHistoryItem,
                this.state.historyArray
              ),
              this.state.historyArray.length - 1
            )
          },
          () => {
            try {
              localStorage.setItem(
                'localHistory',
                JSON.stringify(this.state.historyArray)
              )
            } catch (e) {
              console.error(e)
            }
          }
        )
      }
    }
  }

  // Loads the History Item in the Query Builder
  handleHistoryItemClick(index: number) {
    let url = this.state.historyArray[index][0]
    let rules = this.state.historyArray[index][1]

    this.props.changeTable(this.extractTableNameFromURL(url, true))
    this.props.changeRules(rules)
  }

  // Inserts shareable URL to clipboard
  handleLinkIconClick(index: number) {
    let error = false,
      insertSuccess = false

    let url = this.state.historyArray[index][0]
    let rules = this.state.historyArray[index][1]

    // Extract the table name from URL
    let tableRx = /\/\w+/g
    let tableName
    let tableNameRegExp = tableRx.exec(
      url.replace(lib.getDbConfig(this.props.dbIndex, 'url'), '')
    )
    if (tableNameRegExp) {
      tableName = tableNameRegExp[0].replace(/\//g, '')
    } else {
      tableName = null
      error = true
    }

    // Create the URL needed for sharing
    let shareUrl = ''
    if (!error) {
      shareUrl =
        window.location.origin +
        '/queryBuilder/db/' +
        this.props.dbIndex +
        '/table/' +
        tableName
      if (rules !== null) {
        shareUrl += '?query=' + encodeURIComponent(JSON.stringify(rules))
      }

      // Insert to clipboard
      insertSuccess = this.insertToClipboard(shareUrl)
    }

    // if no errors, show a successfully inserted message to user...
    if (!error && insertSuccess) {
      this.setState(
        {
          snackBarVisibility: true,
          snackBarMessage: 'Link copied!'
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

  insertToClipboard(str: string) {
    //based on https://stackoverflow.com/a/12693636
    document.oncopy = function (event) {
      if (event && event.clipboardData) {
        event.clipboardData.setData('Text', str)
        event.preventDefault()
      }
    }
    let copySuccess = document.execCommand('Copy')
    document.oncopy = null
    return copySuccess
  }

  closeDrawer() {
    this.props.closeHistoryPane()
  }

  extractTableNameFromURL(url: string, getRaw = false) {
    let rawTableName = url
      .replace(lib.getDbConfig(this.props.dbIndex, 'url'), '')
      .replace(/\?.*/, '')
      .replace(/\s/g, '')
      .replace('/', '')

    if (getRaw) {
      return rawTableName
    }

    let tableRename = lib.getTableConfig(
      this.props.dbIndex,
      rawTableName,
      'rename'
    )
    let displayName = tableRename ? tableRename : rawTableName

    return displayName
  }

  cleanUpRules(url: string) {
    return url
      .replace(lib.getDbConfig(this.props.dbIndex, 'url'), '')
      .replace(/.*\?/, '')
      .replace(/&/g, '\n')
      .replace(/,/g, ',\n')
      .replace(/limit=\d*/g, '')
  }

  recursiveRulesExtraction(rules: any, condition: any, depth = 0) {
    let rulesArray: Array<any> = []
    if (rules.length > 1) {
      rulesArray = [[Array(depth).join('\t') + condition]]
    }
    for (let i = 0; i < rules.length; i++) {
      let potentialName = rules[i]['field']
      if (potentialName !== null && potentialName !== undefined) {
        rulesArray.push([
          Array(depth + 1).join('\t') + potentialName,
          rules[i]['operator'],
          rules[i]['value']
        ])
      } else {
        // Check if it's a GROUP by looking for "condition" key
        if (rules[i]['condition'] === 'AND' || rules[i]['condition'] === 'OR') {
          let subGroupRules = this.recursiveRulesExtraction(
            rules[i]['rules'],
            rules[i]['condition'],
            depth + 1
          )
          for (let ii = 0; ii < subGroupRules.length; ii++) {
            if (subGroupRules[ii] !== null && subGroupRules[ii] !== undefined) {
              rulesArray.push(subGroupRules[ii])
            }
          }
        }
      }
    }
    return rulesArray
  }

  changeDisplayIndex(newDisplayIndex: number) {
    this.changeDisplayIndexDebounce(newDisplayIndex)
  }

  showDeleteHistoryDialog() {
    if (this.state.deleteHistoryDialogVisibilityStyles === null) {
      this.setState({
        deleteHistoryDialogVisibilityStyles: styleSheet.hide
      })
    } else {
      this.setState({
        deleteHistoryDialogVisibilityStyles: null
      })
    }
  }

  deleteHistory() {
    this.setState({historyArray: []}, () => {
      try {
        localStorage.setItem('localHistory', '[]')
      } catch (e) {
        console.error(e)
      }
    })
    this.showDeleteHistoryDialog()
  }

  render() {
    const historyPanelItemsList = (
      <div style={styleSheet.list}>
        <List
          dense
          subheader={
            <ListSubheader style={styleSheet.subheaderBackgroundColour}>
              Query History
              <IconButton
                onClick={this.closeDrawer}
                style={{float: 'right'}}
                aria-label='Close'
              >
                <CloseIcon />
              </IconButton>
              <IconButton
                onClick={this.showDeleteHistoryDialog}
                style={{float: 'right'}}
                aria-label='Delete'
              >
                <DeleteIcon />
              </IconButton>
            </ListSubheader>
          }
        >
          {/* Delete History Button and Dialog */}
          <div
            style={{
              ...this.state.deleteHistoryDialogVisibilityStyles,
              ...{height: '100px', float: 'right'}
            }}
          >
            <ListSubheader>Delete history?</ListSubheader>
            <Button
              onClick={this.deleteHistory}
              variant='contained'
              style={{margin: '5px'}}
            >
              Yes
            </Button>
            <Button
              onClick={this.showDeleteHistoryDialog}
              variant='contained'
              style={{margin: '5px', background: amber[500]}}
            >
              No
            </Button>
          </div>

          <Divider />

          {/* History Items List */}
          {this.state.historyArray
            .slice(0)
            .reverse()
            .map((item) => {
              // Item[0] is the URL
              // Item[1] are the rules?

              // Display the current item iff it belongs to currently active db
              if (
                item[0].indexOf(lib.getDbConfig(this.props.dbIndex, 'url')) >= 0
              ) {
                let tableName = this.extractTableNameFromURL(item[0])
                if (tableName.length > displayLengthCutoff) {
                  tableName =
                    tableName.substring(0, displayLengthCutoff) + '...'
                }

                // If there are rules are present, then display it with limited number of rows for rules
                if (item[0] && item[1]) {
                  let rules = this.recursiveRulesExtraction(
                    item[1]['rules'],
                    item[1]['condition'],
                    0
                  )
                  let index = lib.elementPositionInArray(
                    item,
                    this.state.historyArray
                  )

                  // When user hovers over a history item, show rest of the lines
                  let classNames = styleSheet.hide
                  if (this.state.displayIndex === index) {
                    classNames = null
                  }

                  return (
                    <ListItem
                      button
                      key={index}
                      onMouseEnter={this.changeDisplayIndex.bind(this, index)}
                      onClick={this.handleHistoryItemClick.bind(this, index)}
                    >
                      {/* Clicking on this edit button should load the history item in the Query Builder */}
                      <Tooltip
                        id='tooltip-bottom'
                        title={'Copy shareable link'}
                        placement='bottom'
                      >
                        <ListItemIcon
                          style={styleSheet.noStyleButton}
                          onClick={this.handleLinkIconClick.bind(this, index)}
                        >
                          <LinkIcon />
                        </ListItemIcon>
                      </Tooltip>

                      {/* Nicely formatted history item */}
                      <>
                        <ListItemText primary={tableName} />
                        {rules.map((rule) => {
                          let displayStr = ''
                          let columnName = ''
                          let displayName = ''
                          let rawOperator = ''
                          let niceOperator = ''
                          for (let i = 0; i < rule.length; i++) {
                            displayStr += ' ' + rule[i] + ' '
                            // if there are more than 1 rules (i.e. it's not AND/OR only) then extract column name
                            if (i === 1) {
                              columnName = rule[0].replace(/\s/g, '')
                              rawOperator = rule[1].replace(/\s/g, '')
                              niceOperator = lib.translateOperatorToHuman(
                                rawOperator
                              )
                            }
                          }

                          // find column's rename rules from config
                          if (columnName) {
                            let columnRename = lib.getColumnConfig(
                              this.props.dbIndex,
                              this.extractTableNameFromURL(item[0], true),
                              columnName,
                              'rename'
                            )
                            displayName = columnRename
                              ? columnRename
                              : columnName
                          }

                          displayStr = displayStr
                            .replace(columnName, displayName)
                            .replace(rawOperator, niceOperator)
                            .replace(/\t/g, ' . . ')
                          let currRuleIndexInRules = lib.elementPositionInArray(
                            rule,
                            rules
                          )

                          if (displayStr.length > displayLengthCutoff) {
                            displayStr =
                              displayStr.substring(0, displayLengthCutoff) +
                              '...'
                          }

                          return (
                            <ListItemText
                              secondary={displayStr}
                              key={index + rule}
                              style={
                                currRuleIndexInRules > 3 ? classNames : null
                              }
                            />
                          )
                        })}
                      </>
                    </ListItem>
                  )
                } else {
                  // If only table name is present, then display just a table name
                  let index = lib.elementPositionInArray(
                    item,
                    this.state.historyArray
                  )

                  return (
                    <ListItem
                      button
                      key={index}
                      onMouseEnter={this.changeDisplayIndex.bind(this, index)}
                      onClick={this.handleHistoryItemClick.bind(this, index)}
                    >
                      <Tooltip
                        id='tooltip-bottom'
                        title={'Copy shareable link'}
                        placement='bottom'
                      >
                        <ListItemIcon
                          style={styleSheet.noStyleButton}
                          onClick={this.handleLinkIconClick.bind(this, index)}
                        >
                          <LinkIcon />
                        </ListItemIcon>
                      </Tooltip>

                      <>
                        <ListItemText primary={tableName} />
                        <ListItemText
                          secondary={'Get random rows...'}
                          key={index + tableName}
                        />
                      </>
                    </ListItem>
                  )
                }
              } else {
                return null
              }
            })}
        </List>
        <Snackbar
          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
          open={this.state.snackBarVisibility}
          onClose={() => {
            this.setState({snackBarVisibility: false})
          }}
          ContentProps={{'aria-describedby': 'message-id'}}
          message={<span id='message-id'>{this.state.snackBarMessage}</span>}
          action={[
            <IconButton
              key='close'
              aria-label='Close'
              color='secondary'
              style={styleSheet.close}
              onClick={() => {
                this.setState({snackBarVisibility: false})
              }}
            >
              {' '}
              <CloseIcon />{' '}
            </IconButton>
          ]}
        />
      </div>
    )

    return (
      <Drawer
        anchor='right'
        open={this.props.historyPaneVisibility}
        onClose={this.closeDrawer}
      >
        <div tabIndex={0} role='button'>
          {historyPanelItemsList}
        </div>
      </Drawer>
    )
  }
}

const styleSheet: any = {
  root: {
    width: '30%',
    height: '100%',
    float: 'right'
  },
  list: {
    width: 400
  },
  listFull: {
    width: 'auto'
  },
  noStyleButton: {
    border: 'none',
    fill: amber[700]
  },
  subheaderBackgroundColour: {
    background: amber[500]
  },
  hide: {
    display: 'none'
  }
}
