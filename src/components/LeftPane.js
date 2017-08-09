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
	render() {
		const classes = this.props.classes;
		return (
			<div className={classes.root}>
				<DbPicker />
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
						<ListItemText secondary="Column" />
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
