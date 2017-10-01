import React, { Component } from 'react';
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

import green from 'material-ui/colors/green';

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
            fileNameCustom: ''
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

    createFileName() {
        // Parse out the delimiter
        let delimiter = this.state.delimiterChoice.replace(/\\t/g, '\t'); // for tabs

        // Create a good file name for the file so user knows what the data in the file is all about
        let fileName = this.state.url.replace(lib.getDbConfig(this.state.dbIndex, "url") + "/", "").replace("?", "-").replace(/&/g, '-').replace(/=/g, '-');

        if (this.state.fileFormat === "delimited") {
            if (delimiter === ",") {
                fileName += ".csv";
            } else if (delimiter === "\t") {
                fileName += ".tsv";
            } else {
                fileName += ".txt";
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

    downloadTableWithDelimiter() {
        if (JSON.stringify(this.state.data) !== "[]") {
            try {
                // Parse out the delimiter
                let delimiter = this.state.delimiterChoice.replace(/\\t/g, '\t'); // for tabs

                let result = json2csv({ data: this.state.data, fields: this.state.columns, del: delimiter, hasCSVColumnTitle: this.state.tableHeader });

                let fileName = this.createFileName();

                this.downloadFile(result, fileName, "text/plain");
            } catch (err) {
                console.error(err);
            }
        }
    }

    downloadTableAsJSON() {
        if (JSON.stringify(this.state.data) !== "[]") {
            try {
                let result = JSON.stringify(this.state.data);

                let fileName = this.createFileName();

                this.downloadFile(result, fileName, "text/plain");
            } catch (err) {
                console.error(err);
            }
        }
    }

    downloadTableAsXML() {
        if (JSON.stringify(this.state.data) !== "[]") {
            try {
                let result = js2xmlparser.parse(this.state.table, this.state.data);

                let fileName = this.createFileName();

                this.downloadFile(result, fileName, "text/plain");
            } catch (err) {
                console.error(err);
            }
        }
    }

    downloadTableAsFASTA() {
        if (JSON.stringify(this.state.data) !== "[]" && (this.state.table === "nucleotide_seq" || this.state.table === "protein_seq")) {
            // TO DO: DETECT Protein or nucleotide tables automatically by name
            try {
                let result = "";
                
                for (let index in this.state.data) {
                    let element = this.state.data[index];
                    
                    let seq = element["nuc_seq"];
                    if (this.state.table === "protein_seq") {
                        seq = element["aa_seq"]
                    }

                    // Parse header string ...
                    let header = ">";
                    for (let index in this.state.columns) {
                        if (this.state.columns[index] !== "nuc_seq" && this.state.columns[index] !== "aa_seq") {
                            header += " | " + element[this.state.columns[index]];
                        }
                    }
                    
                    result+=header.replace("> | ", ">");
                    result+="\n";
                    result+=seq;
                    result+="\n";
                }
                
                let fileName = this.createFileName();
                this.downloadFile(result, fileName, "text/plain");
            } catch (err) {
                console.log(err);
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
            });
        } else {
            this.setState({
                tableHeader: true
            });
        }
    }

    handleReRunQueryToggle() {
        if (this.state.reRunQuery === true) {
            this.setState({
                reRunQuery: false
            });
        } else {
            this.setState({
                reRunQuery: true
            });
        }
    }

    handleGetFullResultToggle() {
        if (this.state.getFullResult === true) {
            this.setState({
                getFullResult: false
            });
        } else {
            this.setState({
                getFullResult: true
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
        if (this.state.fileFormat === "delimited") {
            this.downloadTableWithDelimiter();
        } else if (this.state.fileFormat === "json") {
            this.downloadTableAsJSON();
        }  else if (this.state.fileFormat === "xml") {
            this.downloadTableAsXML();
        } else if (this.state.fileFormat === "fasta") {
            this.downloadTableAsFASTA();
        }

        if (this.state.getFullResult === true) {
            console.log("URL was: " + this.state.url);
            console.log("URL now is: " + this.state.url.replace(/limit=\d*/g, "limit=2500000"));
        }
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
                            <FormControlLabel control={ <Checkbox onChange={this.handleGetFullResultToggle.bind(this)} value="getFullResult" /> } label={"Download up-to 2.5 million rows"} />

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

                        <Divider />
                        
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
    rootInvisibleLeft: {
        paddingBottom: 50,
        marginLeft: '1%',
    },
    middlePaperSection: {
        width: '99%',
        height: '100%',
        marginTop: 75
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
    hide: {
        opacity: 0.0,
        marginTop: 75
    },
    checked: {
        color: green[500],
    }
};


export default withStyles(styleSheet)(Downloads);