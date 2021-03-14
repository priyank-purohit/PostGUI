import React from 'react';

import { useApiContext } from 'contexts/api-data-context';
import { useUserSelectionContext } from 'contexts/user-selection-context';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import HelpIcon from '@material-ui/icons/HelpOutline';
import HistoryIcon from '@material-ui/icons/History';
import MenuIcon from '@material-ui/icons/Menu';


interface INavigationProps {
  toggleLeftPanelVisibility(): void
}

export const TopNavigation: React.FC<INavigationProps> = (props) => {
  const {setReqConfig} = useApiContext()
  const {databaseName} = useUserSelectionContext()

  return (
    <AppBar position='static'>
      <Toolbar>
        <IconButton color='inherit' onClick={props.toggleLeftPanelVisibility}>
          <MenuIcon />
        </IconButton>
        <Typography variant='h6'>{databaseName}</Typography>
        <div style={{flexGrow: 1}} />
        <div>
          <IconButton color='inherit'>
            <HistoryIcon />
          </IconButton>
          <IconButton color='inherit'>
            <HelpIcon />
          </IconButton>
          <Button onClick={() => setReqConfig(null)} variant='contained'>
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  )
}
