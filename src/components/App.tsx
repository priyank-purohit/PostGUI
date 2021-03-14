import 'styles/reset.css';

import React, { useMemo } from 'react';

import { AppConfigContextProvider } from 'contexts/app-config-context';
import { UserSelectionContextProvider } from 'contexts/user-selection-context';
import { APP_CONFIGURATION } from 'data/config';

import { Color, CssBaseline, useMediaQuery } from '@material-ui/core';
import { deepPurple, pink } from '@material-ui/core/colors';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { ApiDataContextProvider } from '../contexts/api-data-context';
import { AppContent } from './frame';


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
