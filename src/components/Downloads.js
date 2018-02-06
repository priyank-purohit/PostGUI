import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControl, FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import { LinearProgress } from 'material-ui/Progress';
import Menu, { MenuItem } from 'material-ui/Menu';
import List, { ListItem, ListItemText } from 'material-ui/List';

import CopyIcon from 'material-ui-icons/ContentCopy';
import NavigateNextIcon from 'material-ui-icons/NavigateNext';
import NavigateBeforeIcon from 'material-ui-icons/NavigateBefore';

import worker_script from './WebWorker';
var myWorker = new Worker(worker_script);

const timeout = 2000;
const maxRowsInDownload = 2500000;

let lib = require('../utils/library.js');
let json2csv = require('json2csv');
var js2xmlparser = require("js2xmlparser");

class Downloads extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dbIndex: props.dbIndex,
            table: props.table,
            columns: props.columns,
            data: [],
            dataFull: [],
            url: props.url,
            fileFormat: 'delimited',
            delimiterChoice: ',',
            columnChosen: 0,
            tableHeader: true,
            getRangeDownload: false,
            fileNameCustom: '',
            reRunQuery: false,
            fileNameAuto: '',
			anchorEl: undefined,
            open: false,
            copyLoading: false,
            copyResult: "",
            downloadRangeSelected: "100K",
            downloadRangeLowerNum: 0,
            downloadRangeUpperNum: 100000
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            dbIndex: newProps.dbIndex,
            table: newProps.table,
            columns: newProps.columns,
            url: newProps.url,
            data: newProps.data,
            fileNameCustom: '',
            dataFull: [],
            columnChosen: 0
        }, () => {
            this.createFileName();
        });
    }

    downloadFile(data, fileName, mimeType) {
        if (this.state.fileNameCustom === '') {
            window.download(data, fileName, mimeType);
        } else {
            window.download(data, this.state.fileNameCustom, mimeType);
        }
    }

    createFileName(dataFullStatus = false) {
        // Parse out the delimiter
        let delimiter = this.state.delimiterChoice.replace(/\\t/g, '\t'); // for tabs

        // Create a good file name for the file so user knows what the data in the file is all about
        /* EXPLANATIONS FOR THE REGEXES
        let fileName = this.state.url.replace(lib.getDbConfig(this.state.dbIndex, "url") + "/", "") // Get rid of the URL
            .replace("?", "-") /////// The params q-mark can be replaced with dash
            .replace(/&/g, '-') /////// All URL key-value separating ampersands can be replaced with dashes
            .replace(/=/g, '-') /////// Get rid of the = in favour of the -
            .replace(/\([^()]{15,}\)/g, "(vals)") /////// Replaces any single non-nested AND/OR conditions with (vals) if they're longer than 15 chars
            .replace(/\(([^()]|\(vals\)){50,}\)/g,"(nested-vals)") /////// Replaces any AND/OR conds with a single (vals) if it's longer than 50 chars
            .replace(/[.]([\w,"\s]{30,})[,]/g, "(in-vals)"); /////// Specifically targets the IN operator's comma separated vals .. replace if longer than 30 chars
        */
        let fileName = this.state.url.replace(lib.getDbConfig(this.state.dbIndex, "url") + "/", "").replace("?", "-").replace(/&/g, '-').replace(/=/g, '-').replace(/\([^()]{15,}\)/g, "(vals)").replace(/\(([^()]|\(vals\)){50,}\)/g,"(nested-vals)").replace(/[.]([\w,"\s]{30,})[,]/g, "(in-vals)");

        if (this.state.getRangeDownload === true || dataFullStatus === true) {
            fileName = fileName.replace(/limit-\d*/g, "limit-" + maxRowsInDownload);
        }

        if (this.state.fileFormat === "delimited") {
            if (delimiter === ",") {
                fileName += ".csv";
            } else if (delimiter === "\t") {
                fileName += ".tsv";
            } else {
                fileName += ".txt";
            }

            if (this.state.tableHeader === true) {
                fileName = fileName.replace(".csv", "-header.csv").replace(".tsv", "-header.tsv").replace(".txt", "-header.txt");
            }
        } else if (this.state.fileFormat === "xml") {
            fileName += ".xml";
        } else if (this.state.fileFormat === "json") {
            fileName += ".json";
        } else if (this.state.fileFormat === "fasta") {
            fileName += ".fasta";
        } else {
            fileName += ".txt";
        }

        this.setState({
            fileNameAuto: fileName
        });

        return fileName;
    }

    downloadTableWithDelimiter(dataFullStatus = false) {
        if (dataFullStatus === false && JSON.stringify(this.state.data) !== "[]") {
            try {
                // Parse out the delimiter
                let delimiter = this.state.delimiterChoice.replace(/\\t/g, '\t'); // for tabs
                let result = json2csv({ data: this.state.data, fields: this.state.columns, del: delimiter, hasCSVColumnTitle: this.state.tableHeader });
                let fileName = this.createFileName();

                this.downloadFile(result, fileName, "text/plain");
            } catch (err) {
                console.error(err);
            }
        } else if (dataFullStatus === true) {
            if (JSON.stringify(this.state.dataFull) !== "[]") {
                try {
                    // Parse out the delimiter
                    let delimiter = this.state.delimiterChoice.replace(/\\t/g, '\t'); // for tabs
                    let result = json2csv({ data: this.state.dataFull, fields: this.state.columns, del: delimiter, hasCSVColumnTitle: this.state.tableHeader });
                    let fileName = this.createFileName(true);

                    this.downloadFile(result, fileName, "text/plain");
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    downloadTableAsJSON(dataFullStatus = false) {
        if (dataFullStatus === false && JSON.stringify(this.state.data) !== "[]") {
            try {
                let result = JSON.stringify(this.state.data);
                let fileName = this.createFileName();

                this.downloadFile(result, fileName, "text/plain");
            } catch (err) {
                console.error(err);
            }
        } else if (dataFullStatus === true) {
            if (JSON.stringify(this.state.dataFull) !== "[]") {
                try {
                    let result = JSON.stringify(this.state.dataFull);
                    let fileName = this.createFileName(true);

                    this.downloadFile(result, fileName, "text/plain");
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    copyTableAsJSON(dataFullStatus = false) {
        if (dataFullStatus === false && JSON.stringify(this.state.data) !== "[]") {
            try {
                let result = JSON.stringify(this.state.data);
                this.setState({copyResult: result});
                let copySuccess = this.insertToClipboard(result)
                if (copySuccess) {
                    this.setState({copyLoading: false});
                }
            } catch (err) {
                console.error(err);
            }
        } else if (dataFullStatus === true) {
            if (JSON.stringify(this.state.dataFull) !== "[]") {
                try {
                    let result = JSON.stringify(this.state.dataFull);    
                    let copySuccess = this.insertToClipboard(result)
                    if (copySuccess) {
                        this.setState({copyLoading: false});
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    downloadTableAsXML(dataFullStatus = false) {
        if (dataFullStatus === false && JSON.stringify(this.state.data) !== "[]") {
            try {
                let result = js2xmlparser.parse(this.state.table, this.state.data);
                let fileName = this.createFileName();

                this.downloadFile(result, fileName, "text/plain");
            } catch (err) {
                console.error(err);
            }
        } else if (dataFullStatus === true) {
            if (JSON.stringify(this.state.dataFull) !== "[]") {
                try {
                    let result = js2xmlparser.parse(this.state.table, this.state.dataFull);
                    let fileName = this.createFileName(true);

                    this.downloadFile(result, fileName, "text/plain");
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    copyTableAsXML(dataFullStatus = false) {
        if (dataFullStatus === false && JSON.stringify(this.state.data) !== "[]") {
            try {
                let result = js2xmlparser.parse(this.state.table, this.state.data);
                let copySuccess = this.insertToClipboard(result)
                if (copySuccess) {
                    this.setState({copyLoading: false});
                }
            } catch (err) {
                console.error(err);
            }
        } else if (dataFullStatus === true) {
            if (JSON.stringify(this.state.dataFull) !== "[]") {
                try {
                    let result = js2xmlparser.parse(this.state.table, this.state.dataFull);   
                let copySuccess = this.insertToClipboard(result)
                if (copySuccess) {
                    this.setState({copyLoading: false});
                }
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    identifySeqColumnInStateColumns() {
        let seqColumn = null;
        let seqColumnNames = lib.getValueFromConfig('seq_column_names');
        for (let i in this.state.columns) {
            let columnName = this.state.columns[i];

            if (lib.inArray(columnName, seqColumnNames)) {
                seqColumn = columnName;
                break;
            }
        }
        return seqColumn;
    }

    downloadTableAsFASTA(dataFullStatus = false) {
        let seqColumn = this.identifySeqColumnInStateColumns();

        // proceed if a sequence column was found, proceed w/ the first found column....
        if (seqColumn !== null) {
            if (dataFullStatus === false && JSON.stringify(this.state.data) !== "[]") {
                // TO DO: DETECT Protein or nucleotide tables automatically by name
                try {
                    let result = "";

                    for (let index in this.state.data) {
                        let element = this.state.data[index];
                        let seq = element[seqColumn];

                        // Parse header string ...
                        let header = ">";
                        for (let index in this.state.columns) {
                            if (this.state.columns[index] !== seqColumn) {
                                header += "|" + element[this.state.columns[index]];
                            }
                        }

                        result += header.replace(">|", ">");
                        result += "\n";
                        result += seq;
                        result += "\n";
                    }

                    let fileName = this.createFileName();
                    this.downloadFile(result, fileName, "text/plain");
                } catch (err) {
                    console.log(err);
                }
            } else if (dataFullStatus === true) {
                if (JSON.stringify(this.state.dataFull) !== "[]") {
                    // TO DO: DETECT Protein or nucleotide tables automatically by name
                    try {
                        let result = "";

                        for (let index in this.state.dataFull) {
                            let element = this.state.dataFull[index];
                            let seq = element[seqColumn];

                            // Parse header string ...
                            let header = ">";
                            for (let index in this.state.columns) {
                                if (this.state.columns[index] !== seqColumn) {
                                    header += "|" + element[this.state.columns[index]];
                                }
                            }

                            result += header.replace(">|", ">");
                            result += "\n";
                            result += seq;
                            result += "\n";
                        }

                        let fileName = this.createFileName(true);
                        this.downloadFile(result, fileName, "text/plain");
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        } else {
            // User got here by mistake, reset Download.js options
            this.handleResetClick();
        }
    }

    insertToClipboard(str) {
        //based on https://stackoverflow.com/a/12693636
        document.oncopy = function (event) {
            event.clipboardData.setData("Text", str);
            event.preventDefault();
        };
        let copySuccess = document.execCommand("Copy");
        document.oncopy = undefined;
        return copySuccess;
    }

    handleFileFormatChange = (event, fileFormat) => {
        if (event.target.id !== 'delimiterInput') {
            this.setState({ fileFormat: fileFormat }, () => {
                this.createFileName();
                this.setState({ fileNameCustom: '' });
            });
        }
    };

    handleTableHeaderToggle() {
        if (this.state.tableHeader === true) {
            this.setState({
                tableHeader: false
            }, () => {
                this.createFileName();
            });
        } else {
            this.setState({
                tableHeader: true
            }, () => {
                this.createFileName();
            });
        }
    }

    handleGetRangeDownload() {
        if (this.state.getRangeDownload === true) {
            this.setState({
                getRangeDownload: false
            }, () => {
                this.createFileName();
            });
        } else {
            this.setState({
                getRangeDownload: true
            }, () => {
                this.createFileName();
            });
        }
    }

    handleDownloadRangeChange(e) {
        this.setState({
            downloadRangeSelected: e,
            downloadRangeLowerNum: 0,
            downloadRangeUpperNum: parseInt(e.replace("K", ""), 10) * 1000
        });
    }

    handleLeftButtonClickRangeDownload() {
        let range = parseInt(this.state.downloadRangeSelected.replace("K", ""), 10) * 1000;
        if (this.state.downloadRangeLowerNum-range > this.props.totalRows) {
            this.setState({
                downloadRangeLowerNum: Math.trunc(this.props.totalRows / range) * range,
                downloadRangeUpperNum: this.props.totalRows
            });
        } else if (this.state.downloadRangeLowerNum > 0 && this.state.downloadRangeLowerNum - range >= 0) {
            this.setState({
                downloadRangeLowerNum: this.state.downloadRangeLowerNum-range,
                downloadRangeUpperNum: this.state.downloadRangeLowerNum
            });
        } else {
            this.setState({
                downloadRangeLowerNum: 0,
                downloadRangeUpperNum: range
            });
        }
    }

    handleRightButtonClickRangeDownload() {
        let range = parseInt(this.state.downloadRangeSelected.replace("K", ""), 10) * 1000;
        if (this.props.totalRows && this.state.downloadRangeLowerNum+range+range > this.props.totalRows) {
            this.setState({
                downloadRangeLowerNum: Math.trunc(this.props.totalRows / range) * range,
                downloadRangeUpperNum: this.props.totalRows
            });
        } else {
            this.setState({
                downloadRangeLowerNum: this.state.downloadRangeLowerNum+range,
                downloadRangeUpperNum: this.state.downloadRangeLowerNum+range+range
            });
        }
    }

    handleDelimiterChange(event) {
        let newValue = event.target.value;

        if (newValue.length === 0) {
            this.setState({ delimiterChoice: ',' }, () => {
                this.createFileName();
                this.setState({ fileNameCustom: '' });
            });
        } else if (newValue.length <= 5) {
            this.setState({ delimiterChoice: newValue }, () => {
                this.createFileName();
                this.setState({ fileNameCustom: '' });
            });
        }
    }

    handleFileNameChange(event) {
        let newValue = event.target.value;
        this.setState({ fileNameCustom: newValue });
    }

    handleResetClick() {
        this.setState({
            fileFormat: 'delimited',
            delimiterChoice: ',',
            columnChosen: 0,
            tableHeader: true,
            getRangeDownload: false,
            fileNameCustom: '',
            copyLoading: false,
            copyResult: "",
            downloadRangeSelected: "100K",
            downloadRangeLowerNum: 0,
            downloadRangeUpperNum: 100000
        }, () => {
            this.createFileName();
        });
    }
    
    handleCopyClick() {
        this.setState({copyLoading: true}, () => {
            if (this.state.getRangeDownload === true) {
                let dataFullURL = this.state.url.replace(/limit=\d*/g, "limit=" + maxRowsInDownload);
                this.fetchOutput(dataFullURL);
            } else {
                if (this.state.fileFormat === "delimited") {
                    //this.downloadTableWithDelimiter();
                } else if (this.state.fileFormat === "delimitedColumn") {
                    myWorker.postMessage({method: 'delimitedColumn', column: this.state.columnChosen, data: this.state.data, columns: this.state.columns});
                    myWorker.onmessage = (m) => {
                        this.setState({copyLoading: false, copyResult: m.data});
                    };
                } else if (this.state.fileFormat === "json") {
                    this.copyTableAsJSON();
                    // myWorker.postMessage({method: 'json', data: this.state.data});
                    // myWorker.onmessage = (m) => {
                    //     this.setState({copyLoading: false, copyResult: m.data});
                    // };
                } else if (this.state.fileFormat === "xml") {
                    this.copyTableAsXML();
                    // myWorker.postMessage({method: 'xml', data: this.state.data});
                    // myWorker.onmessage = (m) => {
                    //     this.setState({copyLoading: false, copyResult: m.data});
                    // };
                } else if (this.state.fileFormat === "fasta") {
                    //this.downloadTableAsFASTA();
                }

                this.setState({
                    submitSuccess: true,
                    submitError: false,
                    submitLoading: false,
                    dataFull: []
                });
            }
        });
    }

    handleCopyOutputClick() {
        //
    }

    handleDownloadClick() {
        this.createFileName();

        this.setState({
            submitLoading: true,
            submitSuccess: false,
            submitError: false,
            dataFull: []
        }, () => {
            if (this.state.getRangeDownload === true) {
                let dataFullURL = this.state.url.replace(/limit=\d*/g, "limit=" + maxRowsInDownload);
                this.fetchOutput(dataFullURL);
            } else {
                if (this.state.fileFormat === "delimited") {
                    this.downloadTableWithDelimiter();
                } else if (this.state.fileFormat === "json") {
                    this.downloadTableAsJSON();
                } else if (this.state.fileFormat === "xml") {
                    this.downloadTableAsXML();
                } else if (this.state.fileFormat === "fasta") {
                    this.downloadTableAsFASTA();
                }

                this.setState({
                    submitSuccess: true,
                    submitError: false,
                    submitLoading: false,
                    dataFull: []
                });
            }
        });
    }

    handleClickListItem = (event) => {
		this.setState({ open: true, anchorEl: event.currentTarget });
	};
    
    handleMenuItemClick = (event, index) => {
        this.setState({ columnChosen: index, open: false });
    };

	handleRequestClose = () => {
		this.setState({ open: false });
    };

    fetchOutput(url) {
        let headersList = {};
        if (this.state.getRangeDownload === true) {
            headersList = {'Range': String(this.state.downloadRangeLowerNum) + '-' + String(this.state.downloadRangeUpperNum-1), 'Accept':'application/json', 'Prefer': 'count=exact'};
        }

        axios.get(url, { headers: headersList, requestId: "qbAxiosReq" })
            .then((response) => {
                this.setState({
                    dataFull: response.data,
                    submitLoading: false,
                    submitError: false,
                    submitSuccess: true
                }, () => {
                    this.timer = setTimeout(() => {
                        this.setState({
                            submitLoading: false,
                            submitSuccess: false,
                            submitError: false
                        })
                    }, timeout);
                    if (this.state.fileFormat === "delimited") {
                        this.downloadTableWithDelimiter(true);
                    } else if (this.state.fileFormat === "json") {
                        this.downloadTableAsJSON(true);
                    } else if (this.state.fileFormat === "xml") {
                        this.downloadTableAsXML(true);
                    } else if (this.state.fileFormat === "fasta") {
                        this.downloadTableAsFASTA(true);
                    }
                });
            })
            .catch((error) => {
                console.log("HTTP Req:", error);
                this.setState({
                    dataFull: [],
                    submitLoading: false,
                    submitSuccess: true,
                    submitError: true // both true implies request successfully reported an error
                }, () => {
                    this.timer = setTimeout(() => {
                        this.setState({
                            submitLoading: false,
                            submitSuccess: false,
                            submitError: false
                        })
                    }, timeout);
                });
            });
    }

    render() {
        const classes = this.props.classes;

        return (<div className={classes.limitWidth} >
                    <Paper elevation={2} className={classes.topMargin}>
                        <Typography type="subheading" className={classes.cardcardMarginLeftTop}>Download Query Results</Typography>
                        
                        {/* FILE FORMAT RADIO GROUP */}
                        <Typography type="body1" className={classes.cardcardMarginLeftTop}>File Format</Typography>
                        <FormControl component="fieldset" required>
                            <RadioGroup className={classes.cardcardMarginLeftTop} value={this.state.fileFormat} onChange={this.handleFileFormatChange} >
                                <FormControlLabel control={ <Radio /> } label="Delimited File" value="delimited" />
                                <span className={this.state.fileFormat !== 'delimited' ? classes.hidden : null}>
                                    <TextField
                                        required
                                        id="delimiterInput"
                                        type="text"
                                        label={"Enter delimiter (e.g. \\t)"}
                                        value={this.state.delimiterChoice}
                                        className={classes.textField && classes.cardMarginLeft && classes.inlineTextField}
                                        margin="none"
                                        disabled={this.state.fileFormat !== 'delimited' ? true : false} 
                                        onChange={this.handleDelimiterChange.bind(this)} />
                                </span>
                                <FormControlLabel control={ <Radio /> } label="JSON File" value="json" />
                                <FormControlLabel control={ <Radio /> } label="XML File" value="xml" />
                                <FormControlLabel control={ <Radio /> } label="FASTA File" value="fasta" className={this.identifySeqColumnInStateColumns() === null ? classes.hidden : null}/>

                                <span className={this.state.fileFormat !== 'fasta' ? classes.hidden : classes.inlineTextField}>
                                    <Typography>Note: FASTA header is composed from visible columns</Typography>
                                </span>

                                <FormControlLabel control={ <Radio /> } label="Copy single column values" value="delimitedColumn" />
                                <span className={this.state.fileFormat !== 'delimitedColumn' ? classes.hidden : classes.inlineTextField}>
                                    <List>
                                        <ListItem button aria-haspopup="true" aria-controls="columnMenu" aria-label="Choose column" onClick={this.handleClickListItem} >
                                            <ListItemText primary="Choose a column" secondary={this.state.columns[this.state.columnChosen]} />
                                        </ListItem>
                                    </List>
                                    <Menu id="columnMenu" anchorEl={this.state.anchorEl} open={this.state.open} onClose={this.handleRequestClose} >
                                        {
                                            this.state.columns.map((option, index) =>
                                                <MenuItem key={option} selected={index === this.state.columnChosen} onClick={event => this.handleMenuItemClick(event, index)} >
                                                    {option}
                                                </MenuItem>
                                            )
                                        }
                                    </Menu>
                                </span>
                                {/*<FormControlLabel disabled control={ <Radio /> } label="Newick Tree" value="newicktree" />
                                <FormControlLabel disabled control={ <Radio /> } label="Nexus Tree" value="nexustree" />
                                <FormControlLabel disabled control={ <Radio /> } label="PhyloXML" value="phyloxml" />*/}
                            </RadioGroup>
                        </FormControl>

                        {/* ADDITIONAL DOWNLOADS OPTIONS */}
                        <Typography type="body1" className={classes.cardcardMarginLeftTop}>Options</Typography>
                        <FormGroup className={classes.cardcardMarginLeftTop}>
                            <FormControlLabel control={ <Checkbox onChange={this.handleGetRangeDownload.bind(this)} value="getRangeDownload" /> } checked={this.state.getRangeDownload} label={"Batch download"} />
                                <span className={this.state.getRangeDownload !== true ? classes.hidden : classes.inlineTextField1}>
                                    <div className={this.props.totalRows !== NaN && this.props.totalRows >= 0 ? classes.hidden : null} >
                                        <Typography type="body2" className={classes.inlineTextField1}>Re-run query with "Get exact row count" option selected</Typography>
                                    </div>
                                    <div>
                                        <Button onClick={this.handleDownloadRangeChange.bind(this, "10K")} color={this.state.downloadRangeSelected === "10K" ? 'primary' : 'inherit'} className={classes.button} >10K</Button>
                                        <Button onClick={this.handleDownloadRangeChange.bind(this, "25K")} color={this.state.downloadRangeSelected === "25K" ? 'primary' : 'inherit'} className={classes.button} >25K</Button>
                                        <Button onClick={this.handleDownloadRangeChange.bind(this, "100K")} color={this.state.downloadRangeSelected === "100K" ? 'primary' : 'inherit'} className={classes.button} >100K</Button>
                                        <Button onClick={this.handleDownloadRangeChange.bind(this, "250K")} color={this.state.downloadRangeSelected === "250K" ? 'primary' : 'inherit'} className={classes.button} >250K</Button>
                                    </div>
                                    <div>
                                        <Typography type="body1" className={classes.inlineTextField2}>{String(this.state.downloadRangeLowerNum).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} to {String(this.state.downloadRangeUpperNum).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} of {String(this.props.totalRows).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} rows</Typography>
                                    </div>
                                    <div className={classes.inlineTextField3}>
                                        <IconButton onClick={this.handleLeftButtonClickRangeDownload.bind(this)} color="primary" className={classes.button} aria-label="COPY">
                                            <NavigateBeforeIcon />
                                        </IconButton>
                                        <IconButton onClick={this.handleRightButtonClickRangeDownload.bind(this)} color="primary" className={classes.button} aria-label="COPY">
                                            <NavigateNextIcon />
                                        </IconButton>
                                    </div>
                                </span>

                            <FormControlLabel control={ <Checkbox onChange={this.handleTableHeaderToggle.bind(this)} disabled={this.state.fileFormat !== 'delimited' ? true : false} value="tableHeader" /> } checked={this.state.tableHeader} label={"Include table headers"} />
                        </FormGroup>

                        {/* FILE NAME INPUT */}
                        <FormGroup className={classes.cardcardMarginLeftTop && classes.cardcardMarginBottomRight}>
                            <TextField 
                                required 
                                disabled={this.state.fileFormat === 'delimitedColumn'}
                                id="delimiterInput" 
                                type="text" 
                                label="File name"
                                onChange={this.handleFileNameChange.bind(this)}
                                value={this.state.fileNameCustom === '' ? this.state.fileNameAuto : this.state.fileNameCustom}
                                className={classes.textField && classes.cardMarginLeft} 
                                margin="normal" />
                        </FormGroup>

                        <div className={classes.cardcardMarginLeftTop && classes.cardcardMarginBottomRight}>
                            <TextField
                                id="copyOutput" 
                                type="text"
                                label="Ctrl A and Ctrl C to copy"
                                value={this.state.copyResult}
                                onChange={this.handleCopyOutputClick.bind(this)}
                                className={this.state.copyResult === "" ? classes.hidden : classes.textFieldCopyOutput} 
                                margin="normal" />
                            <IconButton onClick={this.insertToClipboard.bind(this, this.state.copyResult)} className={this.state.copyResult === "" ? classes.hidden : classes.button} aria-label="Copy">
                                <CopyIcon />
                            </IconButton>
                        </div>

                        {this.state.copyLoading === true ? <LinearProgress color="primary" className={classes.linearProgressClass} /> : <Divider />}
                        
                        <Button color="primary" className={classes.button} onClick={this.handleDownloadClick.bind(this)} disabled={this.state.fileFormat === 'delimitedColumn'} >Download</Button>
                        <Button color="primary" disabled={this.state.fileFormat !== 'delimitedColumn' && this.state.fileFormat !== 'json' && this.state.fileFormat !== 'xml'} className={classes.button} onClick={this.handleCopyClick.bind(this)} >Copy</Button>
                        <Button className={classes.button && classes.floatRight} onClick={this.handleResetClick.bind(this)} >Reset</Button>
                        {/* <Button className={classes.button}>Help</Button> */}
                    </Paper>
                </div>);
    }
}

Downloads.propTypes = {
    classes: PropTypes.object.isRequired,
};


const styleSheet = {
    root: {
        paddingBottom: 50,
        marginLeft: '30%',
        marginBottom: '2%'
    },
    linearProgressClass: {
        height: 2
    },
    inlineTextField: {
        marginLeft: 34
    },
    inlineTextField1: {
        float: "none",
        margin: "0 auto"
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
    limitWidth: {
        width: '50%',
        marginLeft: '50%'
    },
    topMargin: {
        marginTop: 16,
        marginLeft: 16
    },
    cardMarginLeft: { // For items within the same section
        marginLeft: 32
    },
    cardMarginLeftRightTop: {
        marginLeft: 16,
        marginTop: 16,
        marginRight: 6
    },
    cardcardMarginLeftTop: { // For a new section
        marginLeft: 16,
        paddingTop: 16
    },
    cardcardMarginBottomRight: { // For a new section
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
};


export default withStyles(styleSheet)(Downloads);