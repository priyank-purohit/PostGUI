import React, { useState } from 'react';

import { useApiContext } from 'contexts/api-data-context';
import { useUserSelectionContext } from 'contexts/user-selection-context';
import { useApiMutation } from 'hooks/use-post-api-state';

import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, TextField
} from '@material-ui/core';


export const AuthForm: React.FC = () => {
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
