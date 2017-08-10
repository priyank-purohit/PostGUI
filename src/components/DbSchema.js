import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import FolderIcon from 'material-ui-icons/Folder';
import VisibilityIcon from 'material-ui-icons/Visibility';

let lib = require("../utils/library.js");

const styleSheet = createStyleSheet({
	column: {
		marginLeft: 27
	}
});

class DbSchema extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dbIndex: 0,
			url: lib.getDbConfig(0, "url"),
			tables: []
		};
	}

	// Called when new props are received
	componentWillReceiveProps(newProps) {
		this.setState({ 
			dbIndex: newProps.dbIndex,
			url: lib.getDbConfig(newProps.dbIndex, "url")
		});
	}

	render() {
		const classes = this.props.classes;
		return (
			<List>
				<ListItem button>
					<ListItemIcon>
					<FolderIcon />
					</ListItemIcon>
					<ListItemText primary="Table" />
				</ListItem>

				<ListItem button className={classes.column}>
					<ListItemIcon>
					<VisibilityIcon />
					</ListItemIcon>
					<ListItemText secondary={this.state.dbIndex} />
				</ListItem>
				<ListItem button className={classes.column}>
					<ListItemIcon>
					<VisibilityIcon />
					</ListItemIcon>
					<ListItemText secondary="Column" />
				</ListItem>
				<ListItem button className={classes.column}>
					<ListItemIcon>
					<VisibilityIcon />
					</ListItemIcon>
					<ListItemText secondary="Column" />
				</ListItem>
			</List>
		);
	}
}

DbSchema.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(DbSchema);
