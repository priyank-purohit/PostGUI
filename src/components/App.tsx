import 'styles/reset.css';

import React, { useState } from 'react';

import { AppConfigContextProvider, useAppConfigContext } from 'contexts/app-config-context';
import {
    UserSelectionContextProvider, useUserSelectionContext
} from 'contexts/user-selection-context';
import { APP_CONFIGURATION } from 'data/config';
import { usePostApiState } from 'hooks/use-api-state';
import { useToggleState } from 'hooks/use-toggle-state';
import { report } from 'node:process';

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
      <UserSelectionContextProvider value={{}}>
        <ApiDataContextProvider value={{}}>
          <AppContent />
        </ApiDataContextProvider>
      </UserSelectionContextProvider>
    </AppConfigContextProvider>
  </ThemeProvider>
)

const AuthForm: React.FC = () => {
  const {databaseConfig} = useUserSelectionContext()
  const {setReqConfig} = useApiContext()

  const [, loginRequest] = usePostApiState<{token: string}[]>(
    `${databaseConfig.baseUrl}/rpc/login`
  )

  const [loginError, setLoginError] = useState<boolean>(false)

  const [email, setEmail] = useState<string>(null)
  const [pass, setPass] = useState<string>(null)

  const handleLogin = async (email: string, pass: string): Promise<void> => {
    try {
      const response = await loginRequest({
        email,
        pass
      })

      setLoginError(false)
      setReqConfig({
        headers: {
          Authorization: `Bearer ${response?.data[0].token}`
        }
      })
    } catch (error) {
      setLoginError(true)
      setReqConfig(null)
    }
  }

  return (
    <Dialog open fullWidth>
      <DialogTitle>PostGUI Login</DialogTitle>
      <DialogContent>
        {loginError ? (
          <DialogContentText color='secondary'>
            Incorrect credentials.
          </DialogContentText>
        ) : (
          <DialogContentText>
            Provide your credentials for this database.
          </DialogContentText>
        )}
        <div style={{paddingTop: 15}} />
        <TextField
          autoFocus
          required
          color='secondary'
          variant='outlined'
          id='email'
          label='Email Address'
          type='email'
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
          label='Password'
          type='password'
          error={loginError}
          onChange={(e) => setPass(e.target.value)}
          fullWidth
        />
        <div style={{paddingTop: 15}} />
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={() => handleLogin(email, pass)} color='secondary'>
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
