import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';


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
            url: props.url
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
 
        return (<div className={classes.topMargin}>
                    <Typography
                        type="subheading"
                        className={classes.cardMarginLeftTop}>Download Query Results</Typography>
                        <Button
                            raised
                            disabled={(JSON.stringify(this.state.data) === "[]") ? true : false}
                            color="primary"
                            className={classes.button}
                            onClick={(e) => this.downloadTableWithDelimiter(",")}>Download as .csv</Button>
                        <Button
                            raised
                            disabled={(JSON.stringify(this.state.data) === "[]") ? true : false}
                            color="primary"
                            className={classes.button}
                            onClick={(e) => this.downloadTableWithDelimiter("\t")}>Download as .tsv</Button>
                </div>
        );
    }
}

Downloads.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styleSheet = createStyleSheet(theme => ({
    root: {
        width: '29%',
        height: '100%',
        float: 'left',
    },
    headerClass: {
        fontWeight: "bold"
    },
    button: {
        margin: theme.spacing.unit,
        float: 'right'
    },
    topMargin: {
        margin: theme.spacing.unit,
        marginTop: (theme.spacing.unit)*5
    }
}));
export default withStyles(styleSheet)(Downloads);