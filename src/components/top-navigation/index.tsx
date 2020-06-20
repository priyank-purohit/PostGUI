import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import HelpIcon from '@material-ui/icons/HelpOutline';
import HistoryIcon from '@material-ui/icons/History';
import MenuIcon from '@material-ui/icons/Menu';


interface INavigationProps {
  databaseDisplayName: string

  toggleLeftPane?(): void
}

export const Navigation: React.FC<INavigationProps> = (props) => {
  return (
    <AppBar position='absolute'>
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='Menu'
          onClick={props.toggleLeftPane}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' color='inherit'>
          {props.databaseDisplayName}
        </Typography>
        <div>
          <IconButton color='inherit' aria-label='History'>
            <HistoryIcon />
          </IconButton>
          <IconButton color='inherit' aria-label='Help'>
            <HelpIcon />
          </IconButton>
          <Button color='default' variant='contained'>
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  )
}
