import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import HistoryIcon from 'material-ui-icons/History';

let _ = require('lodash');
let lib = require('../utils/library.js');

//join: predicted genes, protein seqs
class Navigation extends Component {
	
	constructor(props) {
		super(props);
		this.changeSearchTermDebounce = _.debounce(value => this.props.changeSearchTerm(value), 350);
	}

	changeSearchTerm(e) {
		/*if (e && ((e.key && e.key === 'Enter') || !e.target.value)) {
			this.props.changeSearchTerm(e.target.value);
		}*/
		this.changeSearchTermDebounce(e.target.value);
	}

	render() {
		const classes = this.props.classes;
		let dbTitle = lib.getDbConfig(this.props.dbIndex, "title") || "Untitled database";

		// Set a short window title
		document.title = dbTitle.replace("Database", "db").replace("database", "db");

		return (
			<div className={classes.root}>
				<AppBar position="absolute">
					<Toolbar>
						<IconButton color="inherit" aria-label="Menu" onClick={this.props.toggleLeftPane.bind(this)}>
							<MenuIcon />
						</IconButton>
						<Typography type="title" color="inherit" className={classes.dbTitleFlex}>
							{dbTitle}
						</Typography>
						<div className={classes.searchBarFlex}>
							<TextField id="search" placeholder="Search tables and columns" onKeyPress={this.changeSearchTerm.bind(this)} onChange={this.changeSearchTerm.bind(this)} onFocus={this.changeSearchTerm.bind(this)} type="search" className={classes.searchBar}/>
						</div>
						<IconButton className={classes.rightIconsFlex} color="inherit" aria-label="Menu" onClick={this.props.toggleHistoryPane.bind(this)}>
							<HistoryIcon className={classes.floatRight} />
						</IconButton>
					</Toolbar>
				</AppBar>
			</div>
		);
	}
}

Navigation.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styleSheet = {
	root: {
		width: '100%'
	},
	dbTitleFlex: {
		flex: 0.3
	},
	searchBarFlex: {
		flex: 0.6,
		display: 'block',
		marginLeft: 5,
    	marginRight: 5,
    	marginTop: 0,
	},
	searchBar: {
		width: 300,
		marginLeft: 5,
    	marginRight: 5,
    	background: 'white',
    	padding: 10,
    	paddingBottom: 5,
    	border: '1px solid grey',
    	borderRadius: 3,
    	float: 'right'
	},
	rightIconsFlex: {
		flex: 0.1,
		display: 'block'
	},
	floatRight: {
		float: 'right'
	}
};

export default withStyles(styleSheet)(Navigation);