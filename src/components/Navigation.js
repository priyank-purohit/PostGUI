import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
//import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
//import HomeIcon from 'material-ui-icons/Home';

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
				<AppBar position="static">
					<Toolbar>
						<IconButton color="contrast" aria-label="Menu">
							<MenuIcon />
						</IconButton>
						<Typography type="title" color="inherit" className={classes.flex}>
							{lib.getFromConfig("title")}
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