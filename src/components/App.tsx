import 'styles/reset.css';

import React, { useState } from 'react';

import { AppConfigContextProvider } from 'contexts/app-config-context';
import { UserSelectionContextProvider } from 'contexts/user-selection-context';
import { APP_CONFIGURATION } from 'data/config';
import { useToggleState } from 'hooks/use-toggle-state';

import { Divider, Grid, Paper } from '@material-ui/core';
import { deepPurple, orange, pink } from '@material-ui/core/colors';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { ApiDataContextProvider } from '../contexts/api-data-context';
import { DatabasePicker } from './database-picker';
import { DatabaseSchema } from './database-schema';
import { RightPanel } from './right-panel';
import { TopNavigation } from './top-navigation';


const theme = createMuiTheme({
  palette: {
    primary: deepPurple,
    secondary: pink
  }
})

export const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AppConfigContextProvider value={{...APP_CONFIGURATION}}>
      <UserSelectionContextProvider value={null}>
        <ApiDataContextProvider
          value={{
            requestConfig: {
              headers: {
                Authorization: APP_CONFIGURATION.token
              }
            }
          }}
        >
          <AppContent />
        </ApiDataContextProvider>
      </UserSelectionContextProvider>
    </AppConfigContextProvider>
  </ThemeProvider>
)

const AppContent: React.FC = () => {
  const [leftPanelVisibility, toggleLeftPanelVisibility] = useToggleState(true)

  return (
    <Grid container direction='column'>
      <Grid item xs={12}>
        <TopNavigation
          databaseDisplayName='Database Name'
          toggleLeftPanelVisibility={toggleLeftPanelVisibility}
        />
      </Grid>
      <Grid
        container
        direction='row'
        justify='flex-start'
        alignItems='flex-start'
      >
        {leftPanelVisibility && (
          <Grid item xs={4}>
            <DatabasePicker />
            <Divider style={{width: '450px'}} />
            <DatabaseSchema />
          </Grid>
        )}
        <Grid item xs={leftPanelVisibility ? 8 : 12}>
          <RightPanel />
        </Grid>
      </Grid>
    </Grid>
  )
}
