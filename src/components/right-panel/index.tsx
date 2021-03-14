import React from 'react';

import { useUserSelectionContext } from 'contexts/user-selection-context';

import { Paper, Typography } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';


export const RightPanel: React.FC = () => {
  const {selectedTableName} = useUserSelectionContext()

  if (!selectedTableName) {
    return (
      <Alert
        severity='info'
        style={{marginTop: 25, marginLeft: 40, maxWidth: 750}}
      >
        <AlertTitle>No table selected</AlertTitle>
        Please select a table to query from the left panel.
      </Alert>
    )
  }

  return (
    <Paper
      elevation={8}
      style={{padding: 15, margin: 15, minHeight: `${90}vh`}}
    >
      <Typography variant='h5'>{selectedTableName}</Typography>
    </Paper>
  )
}