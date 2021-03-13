import React from 'react';

import { useUserSelectionContext } from 'contexts/user-selection-context';

import { Paper, Typography } from '@material-ui/core';


export const RightPanel: React.FC = () => {
  const {selectedTableName} = useUserSelectionContext()

  if (!selectedTableName) {
    return null
  }

  return (
    <Paper style={{padding: 15, margin: 15}}>
      <Typography variant='h5'>{selectedTableName}</Typography>
    </Paper>
  )
}
