import React, { Component } from 'react';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
//import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

let lib = require('../utils/library.js');

const styleSheet = createStyleSheet({
    root: {
        marginTop: 0,
        width: '100%',
    },
    flex: {
        flex: 1,
    },
});

class AppBarA extends Component {
    render() {
    	let classes = styleSheet;
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
		          {/*<Button color="contrast">Login</Button>*/}
		        </Toolbar>
		      </AppBar>
		    </div>
        );
    }
}

export default withStyles(styleSheet)(AppBarA);