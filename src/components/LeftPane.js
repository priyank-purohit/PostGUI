import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FolderIcon from 'material-ui-icons/Folder';
import VisibilityIcon from 'material-ui-icons/Visibility';
import DbPicker from './DbPicker.js'

const styleSheet = createStyleSheet({
	root: {
		width: '29%',
		height: '100%',
		float: 'left',
	},
	column: {
		marginLeft: 27
	}
});

class LeftPane extends Component {
	constructor(props) {
		super(props);
		this.state = {
			databaseIndex: 0
		};
	}

	changeDatabaseIndex(newIndex) {
		this.setState({
			databaseIndex: newIndex
		});
		this.props.changeDatabaseIndex(newIndex);
	}

	render() {
		const classes = this.props.classes;
		return (
			<div className={classes.root}>
				<DbPicker changeDatabaseIndex={this.changeDatabaseIndex.bind(this)} />
				<Divider />
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
						<ListItemText secondary={this.state.databaseIndex} />
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


					<ListItem button>
						<ListItemIcon>
						<FolderIcon />
						</ListItemIcon>
						<ListItemText primary="Table"/>
					</ListItem>
					<ListItem button>
						<ListItemIcon>
						<FolderIcon />
						</ListItemIcon>
						<ListItemText primary="Table" />
					</ListItem>
					<ListItem button>
						<ListItemIcon>
						<FolderIcon />
						</ListItemIcon>
						<ListItemText primary="Table" />
					</ListItem>
					<ListItem button>
						<ListItemIcon>
						<FolderIcon />
						</ListItemIcon>
						<ListItemText primary="Table" />
					</ListItem>
				</List>
			</div>
		);
	}
}

LeftPane.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(LeftPane);
