import 'styles/reset.css';

import React, { useState } from 'react';

import { UserSelectionContextProvider } from 'contexts/user-selection-context';
import { useToggleState } from 'hooks/use-toggle-state';

import { Grid } from '@material-ui/core';

import { ApiDataContextProvider } from '../contexts/api-data-context';
import { DatabaseSchema } from './database-schema';
import { TopNavigation } from './top-navigation';


export const App: React.FC = () => {
  const [leftPanelVisibility, toggleLeftPanelVisibility] = useToggleState(true)

  return (
    <UserSelectionContextProvider
      value={{
        deleteMe: 'Possibly use these to provide defaults or overrides'
      }}
    >
      <ApiDataContextProvider value={{deleteMe: 'Just a random prop...'}}>
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
                <DatabaseSchema />
              </Grid>
            )}
            <Grid item xs={leftPanelVisibility ? 8 : 12}>
              <div>Right Panel</div>
            </Grid>
          </Grid>
        </Grid>
      </ApiDataContextProvider>
    </UserSelectionContextProvider>
  )
}
