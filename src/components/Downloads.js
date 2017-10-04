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
import { LinearProgress } from 'material-ui/Progress';

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
            tableHeader: true,
            reRunQuery: false,
            getFullResult: false,
            delimiterChoice: ',',
            fileNameCustom: '',
            fileNameAuto: ''
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
            dataFull: []
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
        let fileName = this.state.url.replace(lib.getDbConfig(this.state.dbIndex, "url") + "/", "").replace("?", "-").replace(/&/g, '-').replace(/=/g, '-');

        if (this.state.getFullResult === true || dataFullStatus === true) {
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

    downloadTableAsFASTA(dataFullStatus = false) {
        let seqColumnNames = lib.getValueFromConfig('seq_column_names');
        let seqColumn = null;
        for (let i in this.state.columns) {
            let columnName = this.state.columns[i];

            if (lib.inArray(columnName, seqColumnNames)) {
                seqColumn = columnName;
                break;
            }
        }

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
                            if (this.state.columns[index] !== "nuc_seq" && this.state.columns[index] !== "aa_seq") {
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
                                if (this.state.columns[index] !== "nuc_seq" && this.state.columns[index] !== "aa_seq") {
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
        }
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

    handleGetFullResultToggle() {
        if (this.state.getFullResult === true) {
            this.setState({
                getFullResult: false
            }, () => {
                this.createFileName();
            });
        } else {
            this.setState({
                getFullResult: true
            }, () => {
                this.createFileName();
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

    handleDownloadClick() {
        this.createFileName();

        this.setState({
            submitLoading: true,
            submitSuccess: false,
            submitError: false,
            dataFull: []
        }, () => {
            if (this.state.getFullResult === true) {
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

    fetchOutput(url) {
        axios.get(url, { params: {}, requestId: "qbAxiosReq" })
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
                                <FormControlLabel control={ <Radio /> } label="Delimited" value="delimited" />
                                <span>
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
                                <FormControlLabel control={ <Radio /> } label="JSON" value="json" />
                                <FormControlLabel control={ <Radio /> } label="XML" value="xml" />
                                <FormControlLabel control={ <Radio /> } label="FASTA" value="fasta" />
                                {/*<FormControlLabel disabled control={ <Radio /> } label="Newick Tree" value="newicktree" />
                                <FormControlLabel disabled control={ <Radio /> } label="Nexus Tree" value="nexustree" />
                                <FormControlLabel disabled control={ <Radio /> } label="PhyloXML" value="phyloxml" />*/}
                            </RadioGroup>
                        </FormControl>


                        {/* ADDITIONAL DOWNLOADS OPTIONS */}
                        <Typography type="body1" className={classes.cardcardMarginLeftTop}>Options</Typography>
                        <FormGroup className={classes.cardcardMarginLeftTop}>
                            <FormControlLabel control={ <Checkbox onChange={this.handleGetFullResultToggle.bind(this)} value="getFullResult" /> } label={"Download up to 2.5 million rows"} />

                            <FormControlLabel control={ <Checkbox onChange={this.handleTableHeaderToggle.bind(this)} disabled={this.state.fileFormat !== 'delimited' ? true : false} value="tableHeader" /> } checked={this.state.tableHeader} label={"Include table headers"} />
                        </FormGroup>

                        {/* FILE NAME INPUT */}
                        <FormGroup className={classes.cardcardMarginLeftTop && classes.cardcardMarginBottomRight}>
                            <TextField 
                                required 
                                id="delimiterInput" 
                                type="text" 
                                label="File name"
                                onChange={this.handleFileNameChange.bind(this)}
                                value={this.state.fileNameCustom === '' ? this.state.fileNameAuto : this.state.fileNameCustom}
                                className={classes.textField && classes.cardMarginLeft} 
                                margin="normal" />
                        </FormGroup>

                        {this.state.submitLoading === true ? <LinearProgress color="primary" className={classes.linearProgressClass} /> : <Divider />}
                        
                        
                        <Button color="primary" className={classes.button} onClick={this.handleDownloadClick.bind(this)} >Download</Button>
                        <Button disabled className={classes.button}>Copy</Button>
                        <Button disabled className={classes.button}>Reset</Button>
                        <Button disabled className={classes.button}>Help</Button>                        
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
    }
};


export default withStyles(styleSheet)(Downloads);