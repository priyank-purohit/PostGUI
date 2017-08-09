import React, { Component } from 'react';
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


export default class Navigation extends Component {
	render() {
		return (
			<div className="root">
				<AppBar position="static">
					<Toolbar>
						<IconButton color="contrast" aria-label="Menu">
							<MenuIcon />
						</IconButton>
						<Typography type="title" color="inherit" className="flex">
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
