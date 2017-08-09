import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';

const styleSheet = createStyleSheet(theme => ({
	root: {
		width: '100%',
		maxWidth: 300
	},
}));

const databaseOptions = [
	'P. syringae Database',
	'Burkholderia Database',
	'C. albicans Database',
];

class DbPicker extends Component {
	state = {
		anchorEl: undefined,
		open: false,
		selectedIndex: 0,
	};

	button = undefined;

	handleClickListItem = (event) => {
		this.setState({ open: true, anchorEl: event.currentTarget });
	};

	handleMenuItemClick = (event, index) => {
		this.setState({ selectedIndex: index, open: false });
	};

	handleRequestClose = () => {
		this.setState({ open: false });
	};

	render() {
		const classes = this.props.classes;
		return (
			<div className={classes.root}>
				<List>
					<ListItem button aria-haspopup="true" aria-controls="lock-menu" aria-label="Database" onClick={this.handleClickListItem} >
						<ListItemText primary="Database" secondary={databaseOptions[this.state.selectedIndex]} />
					</ListItem>
				</List>
				<Menu id="lock-menu" anchorEl={this.state.anchorEl} open={this.state.open} onRequestClose={this.handleRequestClose} >
					{databaseOptions.map((option, index) =>
						<MenuItem key={option} selected={index === this.state.selectedIndex} onClick={event => this.handleMenuItemClick(event, index)} >
							{option}
						</MenuItem>
					)}
				</Menu>
			</div>
		);
	}
}

DbPicker.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(DbPicker);