// @flow weak
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { CardHeader } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import SubmitButton from './SubmitButton.js';
import Typography from 'material-ui/Typography';
import '../styles/QueryBuilder.css';

let lib = require('../utils/library.js');

const defaultRules = lib.getQBRules();

const styleSheet = createStyleSheet(theme => ({
	root: {
		paddingBottom: 50,
		marginLeft: '30%',
	},
	middlePaperSection: {
		width: '99%',
		height: '100%',
		marginTop: 75
	},
	cardMarginLeft: { // For items within the same section
		marginLeft: 32
	},
	cardMarginLeftTop: { // For a new section
		marginLeft: 16,
		marginTop: 16 // want a bit more space at top to clearly indicate new section...
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 300
	}
}));

class MiddlePane extends Component {

    componentDidMount() {
        const element = this.refs.queryBuilder;
        this.initializeQueryBuilder(element);
    }

    componentWillUnmount() {
        window.$(this.refs.queryBuilder).queryBuilder('destroy');
    }

    // Creates the QB on first render with default table (error msg for now)
    initializeQueryBuilder(element, newRules) {
        const filters = lib.getQBFilters("", []);
        const rules = newRules ? newRules : defaultRules;
        window.$(element).queryBuilder({ filters, rules });
    }

    // Destroys the old one, and creates a new QB based on the selected view's attributes
    rebuildQueryBuilder(element, table, columns, newRules) {
        window.$(this.refs.queryBuilder).queryBuilder('destroy');

        const rules = newRules ? newRules : defaultRules;
        const filters = lib.getQBFilters(table, columns);

        window.$(element).queryBuilder({ filters, rules });
    }

	render() {
		const classes = this.props.classes;
		return (
			<div className={classes.middlePaperSection}>
				<Paper className={classes.root} elevation={5}>
					<CardHeader title="Table" subheader="A somewhat short description for the table. Could include helpful info about the data, or how to query the table." />

					<Typography type="subheading" className={classes.cardMarginLeftTop}>Query Builder</Typography>
					{/*<Paper className={classes.root} elevation={3}>*/}
						<div id='query-builder' ref='queryBuilder'/>
					{/*</Paper>*/}

					<Typography type="body1" className={classes.cardMarginLeftTop}>Options</Typography>
					<SubmitButton />
					<TextField required id="rowLimit" label="Row-limit" defaultValue="10000" className={classes.textField && classes.cardMarginLeft} margin="normal" />

					<Typography type="subheading" className={classes.cardMarginLeftTop}>Sample Data</Typography>
				</Paper>
			</div>
		);
	}
}

MiddlePane.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(MiddlePane);
