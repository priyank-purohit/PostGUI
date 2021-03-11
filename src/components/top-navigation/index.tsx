import React from 'react';

import { Grid } from '@material-ui/core';
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

  toggleLeftPanelVisibility(): void
}

export const TopNavigation: React.FC<INavigationProps> = (props) => (
  <AppBar position='static'>
    <Toolbar>
      <Grid
        container
        direction='row'
        justify='space-between'
        alignItems='center'
        spacing={0}
      >
        <Grid item xs={1}>
          <IconButton
            color='inherit'
            aria-label='Menu'
            onClick={props.toggleLeftPanelVisibility}
          >
            <MenuIcon />
          </IconButton>
        </Grid>
        <Grid item xs>
          <Typography variant='h6' color='inherit'>
            {props.databaseDisplayName}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton color='inherit' aria-label='History'>
            <HistoryIcon />
          </IconButton>
        </Grid>
        <Grid item xs={1}>
          <IconButton color='inherit' aria-label='Help'>
            <HelpIcon />
          </IconButton>
        </Grid>
        <Grid item xs={1}>
          <Button color='default' variant='contained'>
            Logout
          </Button>
        </Grid>
      </Grid>
    </Toolbar>
  </AppBar>
)
