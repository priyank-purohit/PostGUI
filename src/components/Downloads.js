import React, {Component} from 'react'
import axios from 'axios'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Snackbar from '@material-ui/core/Snackbar'

import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import CloseIcon from '@material-ui/icons/Close'

//import worker_script from './WebWorker';
//var myWorker = new Worker(worker_script);

const timeout = 2000
const maxRowsInDownload = 2500000

let lib = require('../utils/library.ts')
let json2csv = require('json2csv')
var js2xmlparser = require('js2xmlparser')

export default class Downloads extends Component {
  constructor(props) {
    super(props)
    this.state = {
      table: props.table,
      columns: props.columns,
      data: [],
      dataFull: [],
      url: props.url,
      fileFormat: 'delimited',
      delimiterChoice: ',',
      columnChosen: 0,
      tableHeader: true,
      batchDownloadCheckBox: false,
      fileNameCustom: '',
      reRunQuery: false,
      fileNameAuto: '',
      anchorEl: undefined,
      open: false,
      copyLoading: false,
      copyResult: '',
      batchSize: '100K',
      batchDownloadLowerNum: 0,
      batchDownloadUpperNum: 100000,
      snackBarVisibility: false,
      snackBarMessage: 'Unknown error occured'
    }

    this.handleDelimiterChange = this.handleDelimiterChange.bind(this)
    this.handlebatchDownloadCheckBox = this.handlebatchDownloadCheckBox.bind(
      this
    )
    this.handleLeftButtonClickRangeDownload = this.handleLeftButtonClickRangeDownload.bind(
      this
    )
    this.handleRightButtonClickRangeDownload = this.handleRightButtonClickRangeDownload.bind(
      this
    )
    this.handleTableHeaderToggle = this.handleTableHeaderToggle.bind(this)
    this.handleFileNameChange = this.handleFileNameChange.bind(this)
    this.handleCopyOutputClick = this.handleCopyOutputClick.bind(this)
    this.handleDownloadClick = this.handleDownloadClick.bind(this)
    this.handleCopyClick = this.handleCopyClick.bind(this)
    this.handleResetClick = this.handleResetClick.bind(this)
  }

  componentWillReceiveProps(newProps) {
    this.setState(
      {
        table: newProps.table,
        columns: newProps.columns,
        url: newProps.url,
        data: newProps.data,
        fileNameCustom: '',
        dataFull: [],
        columnChosen: 0
      },
      () => {
        this.createFileName()
      }
    )
  }

  downloadFile(data, fileName, mimeType) {
    if (this.state.fileNameCustom === '') {
      window.download(data, fileName, mimeType)
    } else {
      window.download(data, this.state.fileNameCustom, mimeType)
    }
  }

  createFileName(dataFullStatus = false) {
    // Parse out the delimiter
    let delimiter = this.state.delimiterChoice.replace(/\\t/g, '\t') // for tabs

    // Create a good file name for the file so user knows what the data in the file is all about
    /* EXPLANATIONS FOR THE REGEXES
            let fileName = this.state.url.replace(lib.getDbConfig(this.props.dbIndex, "url") + "/", "") // Get rid of the URL
                .replace("?", "-") /////// The params q-mark can be replaced with dash
                .replace(/&/g, '-') /////// All URL key-value separating ampersands can be replaced with dashes
                .replace(/=/g, '-') /////// Get rid of the = in favour of the -
                .replace(/\([^()]{15,}\)/g, "(vals)") /////// Replaces any single non-nested AND/OR conditions with (vals) if they're longer than 15 chars
                .replace(/\(([^()]|\(vals\)){50,}\)/g,"(nested-vals)") /////// Replaces any AND/OR conds with a single (vals) if it's longer than 50 chars
                .replace(/[.]([\w,"\s]{30,})[,]/g, "(in-vals)"); /////// Specifically targets the IN operator's comma separated vals .. replace if longer than 30 chars
            */
    let fileName = this.state.url
      .replace(lib.getDbConfig(this.props.dbIndex, 'url') + '/', '')
      .replace('?', '-')
      .replace(/&/g, '-')
      .replace(/=/g, '-')
      .replace(/\([^()]{15,}\)/g, '(vals)')
      .replace(/\(([^()]|\(vals\)){50,}\)/g, '(nested-vals)')
      .replace(/[.]([\w,"\s]{30,})[,]/g, '(in-vals)')

    if (this.state.batchDownloadCheckBox === true || dataFullStatus === true) {
      fileName = fileName.replace(
        /limit-\d*/g,
        'limit-' +
          maxRowsInDownload +
          '-range-' +
          this.state.batchDownloadLowerNum +
          '-' +
          this.state.batchDownloadUpperNum
      )
    }

    if (this.state.fileFormat === 'delimited') {
      if (delimiter === ',') {
        fileName += '.csv'
      } else if (delimiter === '\t') {
        fileName += '.tsv'
      } else {
        fileName += '.txt'
      }

      if (this.state.tableHeader === true) {
        fileName = fileName
          .replace('.csv', '-header.csv')
          .replace('.tsv', '-header.tsv')
          .replace('.txt', '-header.txt')
      }
    } else if (this.state.fileFormat === 'xml') {
      fileName += '.xml'
    } else if (this.state.fileFormat === 'json') {
      fileName += '.json'
    } else if (this.state.fileFormat === 'fasta') {
      fileName += '.fasta'
    } else {
      fileName += '.txt'
    }

    this.setState({
      fileNameAuto: fileName
    })

    return fileName
  }

  downloadTableWithDelimiter(dataFullStatus = false) {
    if (dataFullStatus === false && JSON.stringify(this.state.data) !== '[]') {
      try {
        // Parse out the delimiter
        let delimiter = this.state.delimiterChoice.replace(/\\t/g, '\t') // for tabs
        let result = json2csv.parse(this.state.data, {
          fields: this.state.columns,
          delimiter: delimiter,
          header: this.state.tableHeader
        })
        let fileName = this.createFileName()

        this.downloadFile(result, fileName, 'text/plain')
      } catch (err) {
        console.error(err)
      }
    } else if (dataFullStatus === true) {
      if (JSON.stringify(this.state.dataFull) !== '[]') {
        try {
          // Parse out the delimiter
          let delimiter = this.state.delimiterChoice.replace(/\\t/g, '\t') // for tabs
          let result = json2csv.parse(this.state.data, {
            fields: this.state.columns,
            delimiter: delimiter,
            header: this.state.tableHeader
          })
          let fileName = this.createFileName(true)

          this.downloadFile(result, fileName, 'text/plain')
        } catch (err) {
          console.error(err)
        }
      }
    }
  }

  downloadTableAsJSON(dataFullStatus = false) {
    if (dataFullStatus === false && JSON.stringify(this.state.data) !== '[]') {
      try {
        let result = JSON.stringify(this.state.data)
        let fileName = this.createFileName()

        this.downloadFile(result, fileName, 'text/plain')
      } catch (err) {
        console.error(err)
      }
    } else if (dataFullStatus === true) {
      if (JSON.stringify(this.state.dataFull) !== '[]') {
        try {
          let result = JSON.stringify(this.state.dataFull)
          let fileName = this.createFileName(true)

          this.downloadFile(result, fileName, 'text/plain')
        } catch (err) {
          console.error(err)
        }
      }
    }
  }

  copyTableAsJSON(dataFullStatus = false) {
    if (dataFullStatus === false && JSON.stringify(this.state.data) !== '[]') {
      try {
        let result = JSON.stringify(this.state.data)
        this.setState({copyResult: result})
        let copySuccess = this.insertToClipboard(result)
        if (copySuccess) {
          this.setState({copyLoading: false})
        }
      } catch (err) {
        console.error(err)
      }
    } else if (dataFullStatus === true) {
      if (JSON.stringify(this.state.dataFull) !== '[]') {
        try {
          let result = JSON.stringify(this.state.dataFull)
          let copySuccess = this.insertToClipboard(result)
          if (copySuccess) {
            this.setState({copyLoading: false})
          }
        } catch (err) {
          console.error(err)
        }
      }
    }
  }

  downloadTableAsXML(dataFullStatus = false) {
    if (dataFullStatus === false && JSON.stringify(this.state.data) !== '[]') {
      try {
        let result = js2xmlparser.parse(this.state.table, this.state.data)
        let fileName = this.createFileName()

        this.downloadFile(result, fileName, 'text/plain')
      } catch (err) {
        console.error(err)
      }
    } else if (dataFullStatus === true) {
      if (JSON.stringify(this.state.dataFull) !== '[]') {
        try {
          let result = js2xmlparser.parse(this.state.table, this.state.dataFull)
          let fileName = this.createFileName(true)

          this.downloadFile(result, fileName, 'text/plain')
        } catch (err) {
          console.error(err)
        }
      }
    }
  }

  copyTableAsXML(dataFullStatus = false) {
    if (dataFullStatus === false && JSON.stringify(this.state.data) !== '[]') {
      try {
        let result = js2xmlparser.parse(this.state.table, this.state.data)
        let copySuccess = this.insertToClipboard(result)
        if (copySuccess) {
          this.setState({copyLoading: false})
        }
      } catch (err) {
        console.error(err)
      }
    } else if (dataFullStatus === true) {
      if (JSON.stringify(this.state.dataFull) !== '[]') {
        try {
          let result = js2xmlparser.parse(this.state.table, this.state.dataFull)
          let copySuccess = this.insertToClipboard(result)
          if (copySuccess) {
            this.setState({copyLoading: false})
          }
        } catch (err) {
          console.error(err)
        }
      }
    }
  }

  identifySeqColumnInStateColumns() {
    let seqColumn = null
    let seqColumnNames = lib.getValueFromConfig('seq_column_names')
    for (let i in this.state.columns) {
      let columnName = this.state.columns[i]

      if (lib.inArray(columnName, seqColumnNames)) {
        seqColumn = columnName
        break
      }
    }
    return seqColumn
  }

  downloadTableAsFASTA(dataFullStatus = false) {
    let seqColumn = this.identifySeqColumnInStateColumns()

    // proceed if a sequence column was found, proceed w/ the first found column....
    if (seqColumn !== null) {
      if (
        dataFullStatus === false &&
        JSON.stringify(this.state.data) !== '[]'
      ) {
        // TO DO: DETECT Protein or nucleotide tables automatically by name
        try {
          let result = ''

          for (let index in this.state.data) {
            let element = this.state.data[index]
            let seq = element[seqColumn]

            // Parse header string ...
            let header = '>'
            for (let index in this.state.columns) {
              if (this.state.columns[index] !== seqColumn) {
                header += '|' + element[this.state.columns[index]]
              }
            }

            result += header.replace('>|', '>')
            result += '\n'
            result += seq
            result += '\n'
          }

          let fileName = this.createFileName()
          this.downloadFile(result, fileName, 'text/plain')
        } catch (err) {
          console.error(err)
        }
      } else if (dataFullStatus === true) {
        if (JSON.stringify(this.state.dataFull) !== '[]') {
          // TO DO: DETECT Protein or nucleotide tables automatically by name
          try {
            let result = ''

            for (let index in this.state.dataFull) {
              let element = this.state.dataFull[index]
              let seq = element[seqColumn]

              // Parse header string ...
              let header = '>'
              for (let index in this.state.columns) {
                if (this.state.columns[index] !== seqColumn) {
                  header += '|' + element[this.state.columns[index]]
                }
              }

              result += header.replace('>|', '>')
              result += '\n'
              result += seq
              result += '\n'
            }

            let fileName = this.createFileName(true)
            this.downloadFile(result, fileName, 'text/plain')
          } catch (err) {
            console.error(err)
          }
        }
      }
    } else {
      // User got here by mistake, reset Download.js options
      this.handleResetClick()
    }
  }

  insertToClipboard(str) {
    //based on https://stackoverflow.com/a/12693636
    document.oncopy = function (event) {
      event.clipboardData.setData('text/plain', str)
      event.preventDefault()
    }
    let copySuccess = document.execCommand('copy')
    document.oncopy = undefined
    return copySuccess
  }

  handleFileFormatChange = (event, fileFormat) => {
    if (event.target.id !== 'delimiterInput') {
      this.setState({fileFormat: fileFormat}, () => {
        this.createFileName()
        this.setState({fileNameCustom: ''})
      })
    }
  }

  handleTableHeaderToggle() {
    this.setState(
      {
        tableHeader: !this.state.tableHeader
      },
      () => {
        this.createFileName()
      }
    )
  }

  handlebatchDownloadCheckBox() {
    this.setState(
      {
        batchDownloadCheckBox: !this.state.batchDownloadCheckBox
      },
      () => {
        this.createFileName()
      }
    )
  }

  handlebatchDownloadChange(e) {
    this.setState(
      {
        batchSize: e,
        batchDownloadLowerNum: 0,
        batchDownloadUpperNum: parseInt(e.replace('K', ''), 10) * 1000
      },
      () => {
        this.createFileName(true)
      }
    )
  }

  handleLeftButtonClickRangeDownload() {
    let range = parseInt(this.state.batchSize.replace('K', ''), 10) * 1000
    if (this.state.batchDownloadLowerNum - range > this.props.totalRows) {
      this.setState(
        {
          batchDownloadLowerNum:
            Math.trunc(this.props.totalRows / range) * range,
          batchDownloadUpperNum: this.props.totalRows
        },
        () => {
          this.createFileName(true)
        }
      )
    } else if (
      this.state.batchDownloadLowerNum > 0 &&
      this.state.batchDownloadLowerNum - range >= 0
    ) {
      this.setState(
        {
          batchDownloadLowerNum: this.state.batchDownloadLowerNum - range,
          batchDownloadUpperNum: this.state.batchDownloadLowerNum
        },
        () => {
          this.createFileName(true)
        }
      )
    } else {
      this.setState(
        {
          batchDownloadLowerNum: 0,
          batchDownloadUpperNum: range
        },
        () => {
          this.createFileName(true)
        }
      )
    }
  }

  handleRightButtonClickRangeDownload() {
    let range = parseInt(this.state.batchSize.replace('K', ''), 10) * 1000
    if (
      this.props.totalRows &&
      this.state.batchDownloadLowerNum + range + range > this.props.totalRows
    ) {
      this.setState(
        {
          batchDownloadLowerNum:
            Math.trunc(this.props.totalRows / range) * range,
          batchDownloadUpperNum: this.props.totalRows
        },
        () => {
          this.createFileName(true)
        }
      )
    } else {
      this.setState(
        {
          batchDownloadLowerNum: this.state.batchDownloadLowerNum + range,
          batchDownloadUpperNum:
            this.state.batchDownloadLowerNum + range + range
        },
        () => {
          this.createFileName(true)
        }
      )
    }
  }

  handleDelimiterChange(event) {
    let newValue = event.target.value

    if (newValue.length === 0) {
      this.setState({delimiterChoice: ','}, () => {
        this.createFileName()
        this.setState({fileNameCustom: ''})
      })
    } else if (newValue.length <= 5) {
      this.setState({delimiterChoice: newValue}, () => {
        this.createFileName()
        this.setState({fileNameCustom: ''})
      })
    }
  }

  handleFileNameChange(event) {
    let newValue = event.target.value
    this.setState({fileNameCustom: newValue})
  }

  handleResetClick() {
    this.setState(
      {
        fileFormat: 'delimited',
        delimiterChoice: ',',
        columnChosen: 0,
        tableHeader: true,
        batchDownloadCheckBox: false,
        fileNameCustom: '',
        copyLoading: false,
        copyResult: '',
        batchSize: '100K',
        batchDownloadLowerNum: 0,
        batchDownloadUpperNum: 100000
      },
      () => {
        this.createFileName()
      }
    )
  }

  handleCopyClick() {
    this.setState({copyLoading: true}, () => {
      if (
        this.state.batchDownloadCheckBox === true &&
        this.state.fileFormat !== 'delimitedColumn' &&
        1 === 0
      ) {
        // DISABLED FOR NOW
        let dataFullURL = this.state.url.replace(
          /limit=\d*/g,
          'limit=' + maxRowsInDownload
        )
        this.fetchOutput(dataFullURL)
      } else {
        if (this.state.fileFormat === 'delimited') {
          //this.downloadTableWithDelimiter();
        } else if (this.state.fileFormat === 'delimitedColumn') {
          // With threads
          /*
                              myWorker.postMessage({ method: 'delimitedColumn', column: this.state.columnChosen, data: this.state.data, columns: this.state.columns });
                              myWorker.onmessage = (m) => {
                                  this.setState({ copyLoading: false, copyResult: m.data });
                              };
                              */

          // Without threads
          let column = this.state.columnChosen
          let data = this.state.data
          let columns = this.state.columns

          let output = ''
          for (let i = 0; i < data.length; i++) {
            let valueToCopy = data[i][columns[column]]
            if (String(valueToCopy) && String(valueToCopy).match(/[\W|\s]/g)) {
              output += '"' + valueToCopy + '",'
            } else {
              output += valueToCopy + ','
            }
          }

          output = output.replace(/,$/g, '')

          let result = this.insertToClipboard(output)

          this.setState(
            {
              copyLoading: false,
              snackBarVisibility: true,
              snackBarMessage: result ? 'Copied!' : 'Error copying data ...'
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
        } else if (this.state.fileFormat === 'json') {
          this.copyTableAsJSON()
          // myWorker.postMessage({method: 'json', data: this.state.data});
          // myWorker.onmessage = (m) => {
          //     this.setState({copyLoading: false, copyResult: m.data});
          // };
        } else if (this.state.fileFormat === 'xml') {
          this.copyTableAsXML()
          // myWorker.postMessage({method: 'xml', data: this.state.data});
          // myWorker.onmessage = (m) => {
          //     this.setState({copyLoading: false, copyResult: m.data});
          // };
        } else if (this.state.fileFormat === 'fasta') {
          //this.downloadTableAsFASTA();
        }

        this.setState({
          submitSuccess: true,
          submitError: false,
          submitLoading: false,
          dataFull: []
        })
      }
    })
  }

  handleCopyOutputClick() {
    //
  }

  handleDownloadClick() {
    this.createFileName()

    this.setState(
      {
        submitLoading: true,
        submitSuccess: false,
        submitError: false,
        dataFull: []
      },
      () => {
        if (this.state.batchDownloadCheckBox === true) {
          let dataFullURL = this.state.url.replace(
            /limit=\d*/g,
            'limit=' + maxRowsInDownload
          )
          this.fetchOutput(dataFullURL)
        } else {
          if (this.state.fileFormat === 'delimited') {
            this.downloadTableWithDelimiter()
          } else if (this.state.fileFormat === 'json') {
            this.downloadTableAsJSON()
          } else if (this.state.fileFormat === 'xml') {
            this.downloadTableAsXML()
          } else if (this.state.fileFormat === 'fasta') {
            this.downloadTableAsFASTA()
          }

          this.setState({
            submitSuccess: true,
            submitError: false,
            submitLoading: false,
            dataFull: []
          })
        }
      }
    )
  }

  handleClickListItem = (event) => {
    this.setState({open: true, anchorEl: event.currentTarget})
  }

  handleMenuItemClick = (event, index) => {
    this.setState({columnChosen: index, open: false})
  }

  handleRequestClose = () => {
    this.setState({open: false})
  }

  fetchOutput(url) {
    let preparedHeaders = {}
    if (this.state.batchDownloadCheckBox === true) {
      preparedHeaders = {
        Range:
          String(this.state.batchDownloadLowerNum) +
          '-' +
          String(this.state.batchDownloadUpperNum - 1),
        Accept: 'application/json',
        Prefer: 'count=exact'
      }
    }

    if (this.props.isLoggedIn && this.props.token) {
      preparedHeaders['Authorization'] = 'Bearer ' + this.props.token
    }

    axios
      .get(url, {headers: preparedHeaders, requestId: 'qbAxiosReq'})
      .then((response) => {
        this.setState(
          {
            dataFull: response.data,
            submitLoading: false,
            submitError: false,
            submitSuccess: true
          },
          () => {
            this.timer = setTimeout(() => {
              this.setState({
                submitLoading: false,
                submitSuccess: false,
                submitError: false
              })
            }, timeout)
            if (this.state.fileFormat === 'delimited') {
              this.downloadTableWithDelimiter(true)
            } else if (this.state.fileFormat === 'json') {
              this.downloadTableAsJSON(true)
            } else if (this.state.fileFormat === 'xml') {
              this.downloadTableAsXML(true)
            } else if (this.state.fileFormat === 'fasta') {
              this.downloadTableAsFASTA(true)
            }
          }
        )
      })
      .catch((error) => {
        console.error('HTTP Req:', error)
        this.setState(
          {
            dataFull: [],
            submitLoading: false,
            submitSuccess: true,
            submitError: true // both true implies request successfully reported an error
          },
          () => {
            this.timer = setTimeout(() => {
              this.setState({
                submitLoading: false,
                submitSuccess: false,
                submitError: false
              })
            }, timeout)
          }
        )
      })
  }

  render() {
    return (
      <>
        <Paper elevation={2} style={styleSheet.topMargin}>
          <Typography
            variant='subtitle1'
            style={styleSheet.cardcardMarginLeftTop}
          >
            Download Query Results
          </Typography>

          {/* FILE FORMAT RADIO GROUP */}
          <Typography variant='body1' style={styleSheet.cardcardMarginLeftTop}>
            File Format
          </Typography>
          <FormControl component='fieldset' required>
            <RadioGroup
              onChange={this.handleFileFormatChange}
              value={this.state.fileFormat}
              style={styleSheet.cardcardMarginLeftTop}
            >
              <FormControlLabel
                label='Delimited file (spreadsheet)'
                value='delimited'
                control={<Radio />}
              />
              {this.state.fileFormat === 'delimited' && (
                <TextField
                  required
                  onChange={this.handleDelimiterChange}
                  label={'Use , or \\t delimiter for sheet'}
                  value={this.state.delimiterChoice}
                  disabled={
                    this.state.fileFormat !== 'delimited' ? true : false
                  }
                  style={
                    styleSheet.textField &&
                    styleSheet.cardMarginLeft &&
                    styleSheet.inlineTextField
                  }
                  id='delimiterInput'
                  type='text'
                  margin='none'
                  fullWidth={true}
                />
              )}
              <FormControlLabel
                label='JSON File'
                value='json'
                control={<Radio />}
              />
              <FormControlLabel
                label='XML File'
                value='xml'
                control={<Radio />}
              />
              <FormControlLabel
                label='FASTA File'
                value='fasta'
                control={<Radio />}
                style={
                  this.identifySeqColumnInStateColumns() === null
                    ? styleSheet.hidden
                    : null
                }
              />

              {this.state.fileFormat === 'fasta' && (
                <Typography style={styleSheet.inlineTextField}>
                  Note: FASTA header is composed from visible columns
                </Typography>
              )}

              <FormControlLabel
                label='Copy single column values'
                value='delimitedColumn'
                control={<Radio />}
              />
              {/* The options are loaded below in the <span>. This was needed because RadioGroup/FormControl does not work with a Span child element...*/}
            </RadioGroup>
          </FormControl>
          {this.state.fileFormat === 'delimitedColumn' && (
            <span>
              <List style={styleSheet.inlineTextFieldSpan}>
                <ListItem
                  button
                  onClick={this.handleClickListItem}
                  aria-haspopup='true'
                  aria-controls='columnMenu'
                  aria-label='Choose column'
                >
                  <ListItemText
                    primary='Choose a column'
                    secondary={this.state.columns[this.state.columnChosen]}
                  />
                </ListItem>
              </List>
              <Menu
                open={this.state.open}
                onClose={this.handleRequestClose}
                id='columnMenu'
                anchorEl={this.state.anchorEl}
              >
                {this.state.columns.map((option, index) => (
                  <MenuItem
                    selected={index === this.state.columnChosen}
                    onClick={(event) => this.handleMenuItemClick(event, index)}
                    key={option}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </span>
          )}

          {/* ADDITIONAL DOWNLOADS OPTIONS */}
          <Typography variant='body1' style={styleSheet.cardcardMarginLeftTop}>
            Options
          </Typography>
          <FormGroup style={styleSheet.cardcardMarginLeftTop}>
            <FormControlLabel
              label={'Batch download'}
              control={
                <Checkbox
                  onChange={this.handlebatchDownloadCheckBox}
                  value='batchDownloadCheckBox'
                />
              }
              disabled={
                this.state.fileFormat === 'delimitedColumn' ? true : false
              }
              checked={this.state.batchDownloadCheckBox}
            />
            <span
              style={
                this.state.batchDownloadCheckBox !== true ||
                this.state.fileFormat === 'delimitedColumn'
                  ? styleSheet.hidden
                  : styleSheet.inlineTextField1
              }
            >
              <div
                style={
                  isNaN(this.props.totalRows) === false &&
                  this.props.totalRows >= 0
                    ? styleSheet.hidden
                    : null
                }
              >
                <Typography variant='body2' style={styleSheet.inlineTextField1}>
                  Re-run query with "Get exact row count" option selected
                </Typography>
              </div>
              <>
                <Button
                  onClick={this.handlebatchDownloadChange.bind(this, '10K')}
                  color={this.state.batchSize === '10K' ? 'primary' : 'inherit'}
                  style={styleSheet.button}
                >
                  10K
                </Button>
                <Button
                  onClick={this.handlebatchDownloadChange.bind(this, '25K')}
                  color={this.state.batchSize === '25K' ? 'primary' : 'inherit'}
                  style={styleSheet.button}
                >
                  25K
                </Button>
                <Button
                  onClick={this.handlebatchDownloadChange.bind(this, '100K')}
                  color={
                    this.state.batchSize === '100K' ? 'primary' : 'inherit'
                  }
                  style={styleSheet.button}
                >
                  100K
                </Button>
                <Button
                  onClick={this.handlebatchDownloadChange.bind(this, '250K')}
                  color={
                    this.state.batchSize === '250K' ? 'primary' : 'inherit'
                  }
                  style={styleSheet.button}
                >
                  250K
                </Button>
              </>
              <div style={styleSheet.inlineTextField}>
                <Typography variant='body1' style={styleSheet.inlineTextField}>
                  {String(this.state.batchDownloadLowerNum).replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ','
                  )}{' '}
                  to{' '}
                  {String(this.state.batchDownloadUpperNum).replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ','
                  )}{' '}
                  of{' '}
                  {String(this.props.totalRows)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    .replace('NaN', 'unknown')}{' '}
                  rows
                </Typography>
              </div>
              <div style={styleSheet.inlineTextField3}>
                <IconButton
                  onClick={this.handleLeftButtonClickRangeDownload}
                  color='primary'
                  style={styleSheet.button}
                  aria-label='COPY'
                >
                  <NavigateBeforeIcon />
                </IconButton>
                <IconButton
                  onClick={this.handleRightButtonClickRangeDownload}
                  color='primary'
                  style={styleSheet.button}
                  aria-label='COPY'
                >
                  <NavigateNextIcon />
                </IconButton>
              </div>
            </span>

            <FormControlLabel
              label={'Include table headers'}
              control={
                <Checkbox
                  onChange={this.handleTableHeaderToggle}
                  disabled={
                    this.state.fileFormat !== 'delimited' ? true : false
                  }
                  value='tableHeader'
                />
              }
              checked={this.state.tableHeader}
            />
          </FormGroup>

          {/* FILE NAME INPUT */}
          <FormGroup
            style={
              styleSheet.cardcardMarginLeftTop &&
              styleSheet.cardcardMarginBottomRight
            }
          >
            <TextField
              required
              disabled={this.state.fileFormat === 'delimitedColumn'}
              id='fileNameInput'
              type='text'
              label='File name'
              onChange={this.handleFileNameChange}
              value={
                this.state.fileNameCustom === ''
                  ? this.state.fileNameAuto
                  : this.state.fileNameCustom
              }
              style={styleSheet.textField && styleSheet.cardMarginLeft}
              margin='normal'
            />
          </FormGroup>

          {/* COPY FEATURE OUTPUT BOX + 2ND BUTTON */}
          {/*<div style={styleSheet.cardcardMarginLeftTop && styleSheet.cardcardMarginBottomRight}>
                    <TextField
                        id="copyOutput"
                        type="text"
                        label="Ctrl A and Ctrl C to copy"
                        value={this.state.copyResult}
                        onChange={this.handleCopyOutputClick}
                        style={this.state.copyResult === "" ? styleSheet.hidden : styleSheet.textFieldCopyOutput}
                        margin="normal" />
                    <IconButton onClick={this.insertToClipboard.bind(this, this.state.copyResult)} style={this.state.copyResult === "" ? styleSheet.hidden : styleSheet.button} aria-label="Copy">
                        <CopyIcon />
                    </IconButton>
                </div>*/}

          {this.state.copyLoading || this.state.submitLoading ? (
            <img
              src={require('../resources/progress.gif')}
              width='100%'
              alt='Progress indicator'
            />
          ) : (
            <Divider />
          )}

          <Button
            color='primary'
            style={styleSheet.button}
            onClick={this.handleDownloadClick}
            disabled={this.state.fileFormat === 'delimitedColumn'}
          >
            Download
          </Button>
          <Button
            color='primary'
            disabled={
              this.state.fileFormat !== 'delimitedColumn' &&
              this.state.fileFormat !== 'json' &&
              this.state.fileFormat !== 'xml'
            }
            style={styleSheet.button}
            onClick={this.handleCopyClick}
          >
            Copy
          </Button>
          <Button
            style={styleSheet.button && styleSheet.floatRight}
            onClick={this.handleResetClick}
          >
            Reset
          </Button>
          {/* <Button style={styleSheet.button}>Help</Button> */}
        </Paper>

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
  linearProgressClass: {
    height: 2
  },
  inlineTextField: {
    marginLeft: 34
  },
  inlineTextField1: {
    float: 'none',
    margin: '0 auto'
  },
  inlineTextField2: {
    marginLeft: 50
  },
  inlineTextField3: {
    marginLeft: 135
  },
  button: {
    marginBottom: 4
  },
  topMargin: {
    marginTop: 16
  },
  cardMarginLeft: {
    // For items within the same section
    marginLeft: 32
  },
  cardMarginLeftRightTop: {
    marginLeft: 16,
    marginTop: 16,
    marginRight: 6
  },
  cardcardMarginLeftTop: {
    // For a new section
    marginLeft: 16,
    paddingTop: 16
  },
  inlineTextFieldSpan: {
    marginLeft: 48,
    width: 275 + 'px'
  },
  cardcardMarginBottomRight: {
    // For a new section
    marginRight: 16,
    paddingBottom: 16
  },
  cardMarginLeftTop: {
    marginTop: 32
  },
  textField: {
    marginLeft: 8,
    marginRight: 8
  },
  textFieldCopyOutput: {
    marginLeft: 32,
    marginRight: 0,
    width: '70%'
  },
  hidden: {
    display: 'none'
  },
  floatRight: {
    float: 'right'
  }
}
