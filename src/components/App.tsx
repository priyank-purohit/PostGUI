import 'styles/reset.css';

import React, { useState } from 'react';

import { AppConfigContextProvider, useAppConfigContext } from 'contexts/app-config-context';
import {
    UserSelectionContextProvider, useUserSelectionContext
} from 'contexts/user-selection-context';
import { APP_CONFIGURATION } from 'data/config';
import { useToggleState } from 'hooks/use-toggle-state';

import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid,
    Paper, TextField
} from '@material-ui/core';
import { deepPurple, pink } from '@material-ui/core/colors';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { ApiDataContextProvider, useApiContext } from '../contexts/api-data-context';
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

const AuthForm: React.FC = () => {
  const {login} = useApiContext()

  return (
    <Dialog open fullWidth>
      <DialogTitle>PostGUI Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Provide your credentials for this database.
        </DialogContentText>
        <div style={{paddingTop: 15}} />
        <TextField
          autoFocus
          required
          color='secondary'
          variant='outlined'
          id='email'
          label='Email Address'
          type='email'
          onChange={() => {}}
          fullWidth
        />
        <div style={{paddingTop: 15}} />
        <TextField
          required
          color='secondary'
          variant='outlined'
          id='password'
          label='Password'
          type='password'
          onChange={() => {}}
          fullWidth
        />
        <div style={{paddingTop: 15}} />
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={() => {}} color='secondary'>
          Login
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const AppContent: React.FC = () => {
  const {isLoggedIn} = useApiContext()

  const [leftPanelVisibility, toggleLeftPanelVisibility] = useToggleState(true)

  return (
    <Grid container direction='column'>
      {isLoggedIn ? (
        <>
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
        </>
      ) : (
        <AuthForm />
      )}
    </Grid>
  )
}
