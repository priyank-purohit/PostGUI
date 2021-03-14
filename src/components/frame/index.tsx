import 'styles/reset.css';

import React from 'react';

import { AuthForm } from 'components/authentication';
import { DatabasePicker } from 'components/database-picker';
import { DatabaseSchema } from 'components/database-schema';
import { RightPanel } from 'components/right-panel';
import { TopNavigation } from 'components/top-navigation';
import { useApiContext } from 'contexts/api-data-context';
import { useToggleState } from 'hooks/use-toggle-state';

import { Divider, Grid } from '@material-ui/core';


export const AppContent: React.FC = () => {
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
