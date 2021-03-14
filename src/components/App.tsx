import 'styles/reset.css';

import React, { useMemo } from 'react';

import { APP_CONFIGURATION } from 'config/config';
import { AppConfigContextProvider } from 'contexts/app-config-context';
import { UserSelectionContextProvider } from 'contexts/user-selection-context';
import { RecoilRoot } from 'recoil';

import { Color, CssBaseline, useMediaQuery } from '@material-ui/core';
import { deepPurple, pink } from '@material-ui/core/colors';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { ApiDataContextProvider } from '../contexts/api-data-context';
import { AppContent } from './app-frame';


export const PostGUI: React.FC = () => {
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
      <RecoilRoot>
        <AppConfigContextProvider value={{...APP_CONFIGURATION}}>
          <UserSelectionContextProvider value={{}}>
            <ApiDataContextProvider value={{}}>
              <CssBaseline />
              <AppContent />
            </ApiDataContextProvider>
          </UserSelectionContextProvider>
        </AppConfigContextProvider>
      </RecoilRoot>
    </ThemeProvider>
  )
}
