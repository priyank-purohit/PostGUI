import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';

let lib = require("../utils/library.js");

const styleSheet = createStyleSheet(theme => ({
	root: {
		width: '99%'
	},
}));


class DbPicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dbIndex: props.dbIndex,
			table: props.table,
			leftPaneVisibility: props.leftPaneVisibility,
			anchorEl: undefined,
			open: false,
			databases: []
		};
	}

	//button = undefined;

	handleClickListItem = (event) => {
		this.setState({ open: true, anchorEl: event.currentTarget });
	};

	handleMenuItemClick = (event, index) => {
		this.setState({ dbIndex: index, open: false });
		this.props.changeDbIndex(index);
	};

	handleRequestClose = () => {
		this.setState({ open: false });
	};

	// get a list of databases in the config.json
	componentWillMount() {
		let databasesMapped = [];
		lib.getValueFromConfig("databases").map((obj, index) => databasesMapped[index] = obj.title);
		this.setState({
			databases: databasesMapped
		});
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			dbIndex: newProps.dbIndex,
			leftPaneVisibility: newProps.leftPaneVisibility,
			table: newProps.table
		});
	}

	render() {
		const classes = this.props.classes;
		
		return (
			<div className={classes.root}>
				<List>
					<ListItem button aria-haspopup="true" aria-controls="lock-menu" aria-label="Database" onClick={this.handleClickListItem} >
						<ListItemText primary="Database" secondary={this.state.databases[this.state.dbIndex]} />
					</ListItem>
				</List>
				<Menu id="lock-menu" anchorEl={this.state.anchorEl} open={this.state.open} onRequestClose={this.handleRequestClose} >
					{
						this.state.databases.map((option, index) =>
							<MenuItem key={option} selected={index === this.state.dbIndex} onClick={event => this.handleMenuItemClick(event, index)} >
								{option}
							</MenuItem>
						)
					}
				</Menu>
			</div>
		);
	}
}

DbPicker.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(DbPicker);