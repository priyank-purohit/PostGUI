import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import FolderIcon from 'material-ui-icons/Folder';
import VisibilityIcon from 'material-ui-icons/Visibility';

const styleSheet = createStyleSheet({
	column: {
		marginLeft: 27
	}
});

class DbSchema extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dbIndex: 0
		};
	}

	// Changes the index of DB in state + App.js state
	changeDbIndex(newIndex) {
		this.setState({
			dbIndex: newIndex
		});
		this.props.changeDbIndex(newIndex);
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
