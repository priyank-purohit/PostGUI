import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import HistoryIcon from 'material-ui-icons/History';

let lib = require('../utils/library.js');


class Navigation extends Component {
	render() {
		const classes = this.props.classes;
		let dbTitle = lib.getDbConfig(this.props.dbIndex, "title");

		// Set a short window title
		document.title = dbTitle.replace("Database", "db").replace("database", "db");

		return (
			<div className={classes.root}>
				<AppBar position="absolute">
					<Toolbar>
						<IconButton color="contrast" aria-label="Menu" onClick={this.props.toggleLeftPane.bind(this)}>
							<MenuIcon />
						</IconButton>
						<Typography type="title" color="inherit" className={classes.flex}>
							{dbTitle}
						</Typography>
						<IconButton color="contrast" aria-label="Menu">
							<HistoryIcon />
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
	flex: {
		flex: 1
	}
};

export default withStyles(styleSheet)(Navigation);