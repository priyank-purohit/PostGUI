import React from 'react';

import { useUserSelectionContext } from 'contexts/user-selection-context';

import { Paper, Typography } from '@material-ui/core';


export const RightPanel: React.FC = () => {
  const {selectedTableName} = useUserSelectionContext()

  if (!selectedTableName) {
    return null
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
