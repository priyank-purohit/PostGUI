import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';

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

    render() {
        const classes = this.props.classes;
 
        return (<div className={classes.limitWidth} >
                    <Typography
                        type="subheading"
                        className={classes.cardMarginLeftTop}>Download Query Results</Typography>

                    <Paper elevation={2} className={classes.topMargin}>
                        <Typography type="body1" className={classes.cardcardMarginLeftTop}>File Formats</Typography>
                        <div>
                            {/*Delimited option*/}
                        </div>


                        <FormGroup column className={classes.cardcardMarginLeftTop}>
                            <FormControlLabel control={ <Checkbox checked={this.state.checkedA} /*onChange={this.handleChange('checkedA')}*/ value="checkedA" /> } label="Option A" />
                            <FormControlLabel control={ <Checkbox checked={this.state.checkedB} /*onChange={this.handleChange('checkedB')}*/ value="checkedB" /> } label="Option B" />
                            <FormControlLabel control={<Checkbox value="checkedC" />} label="Option C" />
                            <FormControlLabel disabled control={<Checkbox value="checkedD" />} label="Disabled" />
                            <FormControlLabel disabled control={<Checkbox checked value="checkedE" />} label="Disabled" />
                            <FormControlLabel control={ <Checkbox checked={this.state.checkedF} /*onChange={this.handleChange('checkedF')}*/ value="checkedF" indeterminate /> } label="Indeterminate" />
                        </FormGroup>


                        <Typography type="body1" className={classes.cardcardMarginLeftTop}>Options</Typography>
                    </Paper>

                </div>
        );
    }
}

Downloads.propTypes = {
    classes: PropTypes.object.isRequired,
};


const styleSheet = createStyleSheet(theme => ({
    root: {
        paddingBottom: 50,
        marginLeft: '30%',
        marginBottom: '2%'
    },
    limitWidth: {
        width: '50%',
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
    cardMarginLeftTop: {
        marginTop: 32
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 300
    },
    hide: {
        opacity: 0.0,
        marginTop: 75
    },
    checked: {
        color: green[500],
    }
}));


export default withStyles(styleSheet)(Downloads);