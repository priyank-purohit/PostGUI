import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FolderIcon from 'material-ui-icons/Folder';
import VisibilityIcon from 'material-ui-icons/Visibility';
import DraftsIcon from 'material-ui-icons/Drafts';
import DbPicker from './DbPicker.js'

const styleSheet = createStyleSheet(theme => ({
  root: {
    width: '100%',
    maxWidth: 300
  },
  column: {
    marginLeft: 27
  }
}));

function SimpleList(props) {
  const classes = props.classes;
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

SimpleList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(SimpleList);