import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

import '../styles/Navigation.css';

let lib = require('../utils/library.js');

const styleSheet = createStyleSheet(theme => ({
	root: {
		width: '100%'
	},
	flex: {
		flex: 1
	}
}));

class Navigation extends Component {
	render() {
		const classes = this.props.classes;
		return (
			<div className={classes.root}>
				<AppBar position="fixed">
					<Toolbar>
						<IconButton color="contrast" aria-label="Menu" onClick={this.props.toggleLeftPane.bind(this)}>
							<MenuIcon />
						</IconButton>
						<Typography type="title" color="inherit" className={classes.flex}>
							{lib.getFromConfig("databases")[this.props.databaseIndex].title}
						</Typography>
						{/*<IconButton color="contrast" aria-label="Menu">
							<HomeIcon />
						</IconButton>*/}
					</Toolbar>
				</AppBar>
			</div>
		);
	}
}

Navigation.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Navigation);