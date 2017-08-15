// @flow weak
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { CardHeader } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import SubmitButton from './SubmitButton.js';
import Typography from 'material-ui/Typography';

import axios from 'axios';
import DataTable from './DataTable.js';

import '../styles/QueryBuilder.css';

let lib = require('../utils/library.js');

const defaultRules = lib.getQBRules();

const timeout = 4000;

const styleSheet = createStyleSheet(theme => ({
	root: {
		paddingBottom: 50,
		marginLeft: '30%',
		marginBottom: '2%'
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
	cardMarginLeftTop: { // For a new section
		marginLeft: 16,
		marginTop: 16 // want a bit more space at top to clearly indicate new section...
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 300
	},
	hide: {
		opacity: 0.0,
		marginTop: 75
	}
}));

class RightPane extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dbIndex : props.dbIndex,
			table: props.table,
			columns: props.columns,
			leftPaneVisibility: props.leftPaneVisibility,
			rules: null,
			submitLoading: false,
			submitError: false,
			submitSuccess: false
		}
	}

	componentWillReceiveProps(newProps) {
		if (this.state.columns !== newProps.columns) {
			this.setState({
				table: newProps.table,
				columns: newProps.columns,
				dbIndex: newProps.dbIndex
			}, () => {
				this.rebuildQueryBuilder(this.refs.queryBuilder, newProps.dbIndex, newProps.table, newProps.columns);
			});
		}

		if (this.state.dbIndex !== newProps.dbIndex) {
			this.setState({
				dbIndex: newProps.dbIndex
			});
		}

		if (this.state.table !== newProps.table) {
			this.setState({
				table: newProps.table
			});
		}

		if (this.state.leftPaneVisibility !== newProps.leftPaneVisibility) {
			this.setState({
				leftPaneVisibility: newProps.leftPaneVisibility
			});
		}
	}

	componentDidMount() {
		const element = this.refs.queryBuilder;
		this.initializeQueryBuilder(element);
	}

	componentWillUnmount() {
		window.$(this.refs.queryBuilder).queryBuilder('destroy');
	}

	// Creates the QB on first render with default table (error msg for now)
	initializeQueryBuilder(element, newRules = null) {
		try {
			const filters = lib.getQBFilters(this.state.dbIndex, this.state.table, this.state.columns);
			const rules = newRules ? newRules : defaultRules;

			window.$(element).queryBuilder({ filters, rules });
		} catch (error) {
			console.log(error);
		}
	}

	// Destroys the old one, and creates a new QB based on the selected view's attributes
	rebuildQueryBuilder(element, dbIndex, table, columns, newRules) {
		window.$(this.refs.queryBuilder).queryBuilder('destroy');

		const rules = newRules ? newRules : defaultRules;
		const filters = lib.getQBFilters(dbIndex, table, columns);

		window.$(element).queryBuilder({ filters, rules });
	}

	handleGetRulesClick() {
		this.setState({
			submitLoading: true
		}, () => {
			const rules = window.$(this.refs.queryBuilder).queryBuilder('getRules');
			this.setState({ rules: rules }, () => {
				this.setState({ 
						submitLoading: true, 
						submitSuccess: false 
				}, () => {
					// fetchout
					this.fetchOutput("http://hopper.csb.utoronto.ca:3001/" + this.state.table);
				});
			});
			return rules;
		});
	}

	fetchOutput(url) {
		axios.get(url, { params: {} })
			.then((response) => {
				this.setState({
					rawData: response.data,
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
				});
			})
			.catch((error) => {
				console.log(error);
				this.setState({
					rawData: [],
					submitLoading: false,
					submitSuccess: true,
					submitError: true
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

		let tableRename = lib.getTableConfig(this.state.dbIndex, this.state.table, "rename");
		let tableDisplayName = tableRename ? tableRename : this.state.table;

		let tableDescription = lib.getTableConfig(this.props.dbIndex, this.props.table, "description") ? lib.getTableConfig(this.props.dbIndex, this.props.table, "description") : "";

		let hideClass = this.state.table ? "" : classes.hide;
		let leftMarginClass = this.state.leftPaneVisibility === true ? classes.root : classes.rootInvisibleLeft;
		let paperClasses = hideClass + " " + leftMarginClass;

		return (
			<div className={classes.middlePaperSection}>
				<Paper className={paperClasses} elevation={5}>
					<CardHeader title={tableDisplayName} subheader={tableDescription} />

					<Typography type="subheading" className={classes.cardMarginLeftTop}>Query Builder</Typography>
					<div id='query-builder' ref='queryBuilder'/>

					<Typography type="body1" className={classes.cardMarginLeftTop}>Options</Typography>

					<SubmitButton dbIndex={this.state.dbIndex} table={this.state.table} leftPaneVisibility={this.state.leftPaneVisibility} getRules={this.handleGetRulesClick.bind(this)} loading={this.state.submitLoading} success={this.state.submitSuccess} error={this.state.submitError} />

					<TextField disabled required id="rowLimit" label="Row-limit" defaultValue="10000" className={classes.textField && classes.cardMarginLeft} margin="normal" />

					<Typography type="subheading" className={classes.cardMarginLeftTop}>Sample Data</Typography>
					{/*<Typography type="subheading" className={classes.cardMarginLeftTop}>Table = {this.state.table}</Typography>

					<Typography type="subheading" className={classes.cardMarginLeftTop}>{JSON.stringify(this.state.rawData)}</Typography>*/}
					<DataTable />
				</Paper>
			</div>
		);
	}
}

RightPane.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RightPane);
