import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';

import TextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';

import Divider from 'material-ui/Divider';

import green from 'material-ui/colors/green';


let lib = require('../utils/library.js');
let json2csv = require('json2csv');


class Downloads extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dbIndex: props.dbIndex,
            table: props.table,
            columns: props.columns,
            data: props.data,
            url: props.url,
            checkedA: true,
            checkedB: false,
            checkedF: true,
            checkedG: true,
            fileFormatRadioOption: 'delimited'
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            dbIndex: newProps.dbIndex,
            table: newProps.table,
            columns: newProps.columns,
            url: newProps.url,
            data: newProps.data
        });
    }

    downloadFile(data, fileName, mimeType) {
        window.download(data, fileName, mimeType);
    }

    downloadTableWithDelimiter(delimiter) {
        if (JSON.stringify(this.state.data) !== "[]") {
            try {
                let result = json2csv({ data: this.state.data, fields: this.state.columns, del: delimiter });

                // Create a good file name for the file so user knows what the data in the file is all about
                let fileName = this.state.url.replace(lib.getDbConfig(this.state.dbIndex, "url") + "/", "").replace("?", "-").replace(/&/g, '-');
                if (delimiter === ",") {
                    fileName += ".csv";
                } else if (delimiter === "\t") {
                    fileName += ".tsv";
                } else {
                    fileName += ".txt";
                }

                this.downloadFile(result, fileName, "text/plain");
            } catch (err) {
                console.error(err);
            }
        }
    }

    handleChange = (event, fileFormatRadioOption) => {
        console.log(this.state.fileFormatRadioOption);
        this.setState({ fileFormatRadioOption: fileFormatRadioOption });
    };

    render() {
        const classes = this.props.classes;

        return (<div className={classes.limitWidth} >
                    <Paper elevation={2} className={classes.topMargin}>
                        <Typography type="subheading" className={classes.cardcardMarginLeftTop}>Download Query Results</Typography>
                        <Typography type="body1" className={classes.cardcardMarginLeftTop}>File Format</Typography>
                        <FormControl component="fieldset" required>
                            <RadioGroup className={classes.cardcardMarginLeftTop} value={this.state.fileFormatRadioOption} onChange={this.handleChange} >
                                <FormControlLabel control={ <Radio /> } label="Delimited" value="delimited" />
                                <TextField required id="delimiterInput" type="text" label=", for csv or \t for tsv or any" value="," className={classes.textField && classes.cardMarginLeft && classes.inlineTextField} margin="none" />
                                <FormControlLabel control={ <Radio /> } label="XML" value="xml" />
                                <FormControlLabel control={ <Radio /> } label="FASTA" value="fasta" />
                                <FormControlLabel control={ <Radio /> } label="ASN.1" value="asn1" />
                                <FormControlLabel control={ <Radio /> } label="Newick Tree" value="newick" />
                                <FormControlLabel control={ <Radio /> } label="Nexus Tree" value="nexus" />
                                <FormControlLabel control={ <Radio /> } label="PhyloXML" value="phyloxml" />
                            </RadioGroup>
                        </FormControl>


                        <Typography type="body1" className={classes.cardcardMarginLeftTop}>Options</Typography>


                        <FormGroup column className={classes.cardcardMarginLeftTop}>
                            <FormControlLabel control={ <Checkbox /*onChange={this.handleChange('checkedB')}*/ value="checkedB" /> } label="Download up-to 2.5 million rows" />

                            <FormControlLabel control={ <Checkbox /*onChange={this.handleChange('checkedB')}*/ value="checkedB" /> } label="Re-run query" />

                            <FormControlLabel control={ <Checkbox /*onChange={this.handleChange('checkedB')}*/ disabled={this.state.fileFormatRadioOption !== 'delimited' ? true : false} value="checkedB" /> } label="Include table headers" />
                        </FormGroup>

                        <FormGroup column className={classes.cardcardMarginLeftTop && classes.cardcardMarginBottomRight}>
                            <TextField 
                                required 
                                id="delimiterInput" 
                                type="text" 
                                label="File name"
                                value="organism_info_limit_100.csv"
                                className={classes.textField && classes.cardMarginLeft} 
                                margin="normal" />
                        </FormGroup>
                        <Divider />
                        <Button color="primary" className={classes.button}>Download</Button>
                        <Button className={classes.button}>Copy</Button>
                        <Button className={classes.button}>Reset</Button>
                        <Button className={classes.button}>Help</Button>
                        
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
        marginLeft: 35
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