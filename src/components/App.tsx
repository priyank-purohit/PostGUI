import 'styles/reset.css';

import React, { useMemo, useState } from 'react';

import { AppConfigContextProvider } from 'contexts/app-config-context';
import {
    UserSelectionContextProvider, useUserSelectionContext
} from 'contexts/user-selection-context';
import { APP_CONFIGURATION } from 'data/config';
import { useApiMutation } from 'hooks/use-post-api-state';
import { useToggleState } from 'hooks/use-toggle-state';

import {
    Button, Color, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Divider, Grid, TextField, useMediaQuery
} from '@material-ui/core';
import { deepPurple, pink } from '@material-ui/core/colors';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { ApiDataContextProvider, useApiContext } from '../contexts/api-data-context';
import { DatabasePicker } from './database-picker';
import { DatabaseSchema } from './database-schema';
import { RightPanel } from './right-panel';
import { TopNavigation } from './top-navigation';


export const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: deepPurple as Color,
          secondary: pink as Color
        }
      }),
    [prefersDarkMode]
  )
  return (
    <ThemeProvider theme={theme}>
      <AppConfigContextProvider value={{...APP_CONFIGURATION}}>
        <UserSelectionContextProvider value={{}}>
          <ApiDataContextProvider value={{}}>
            <CssBaseline />
            <AppContent />
          </ApiDataContextProvider>
        </UserSelectionContextProvider>
      </AppConfigContextProvider>
    </ThemeProvider>
  )
}

const AuthForm: React.FC = () => {
  const {databaseConfig} = useUserSelectionContext()
  const {setReqConfig} = useApiContext()
  const [loginError, setLoginError] = useState<boolean>(false)

  const [email, setEmail] = useState<string>(null)
  const [pass, setPass] = useState<string>(null)

  const [handleLogin] = useApiMutation<
    {email: string; pass: string},
    {token: string}[]
  >(
    `${databaseConfig.baseUrl}/rpc/login`,
    (response) => {
      setReqConfig({
        headers: {
          Authorization: `Bearer ${response?.data[0].token}`
        }
      })
    },
    () => {
      setLoginError(true)
      setReqConfig(null)
    }
  )

  return (
    <Dialog open fullWidth>
      <DialogTitle>PostGUI Login</DialogTitle>
      <DialogContent>
        <DialogContentText color={loginError ? 'error' : undefined}>
          {loginError
            ? 'Incorrect credentials provided.'
            : 'Provide your credentials for this database.'}
        </DialogContentText>
        <div style={{paddingTop: 15}} />
        <TextField
          autoFocus
          required
          color='secondary'
          variant='outlined'
          id='email'
          type='email'
          label='Email Address'
          error={loginError}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <div style={{paddingTop: 15}} />
        <TextField
          required
          color='secondary'
          variant='outlined'
          id='password'
          type='password'
          label='Password'
          error={loginError}
          onChange={(e) => setPass(e.target.value)}
          fullWidth
        />
        <div style={{paddingTop: 15}} />
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={() => handleLogin({email, pass})} color='secondary'>
          Login
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const AppContent: React.FC = () => {
  const {isLoggedIn} = useApiContext()

  const [leftPanelVisibility, , , toggleLeftPanelVisibility] = useToggleState(
    true
  )

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
              <Grid item xs={3}>
                <DatabasePicker />
                <Divider />
                <DatabaseSchema />
              </Grid>
            )}
            <Grid item xs={leftPanelVisibility ? 9 : 12}>
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
