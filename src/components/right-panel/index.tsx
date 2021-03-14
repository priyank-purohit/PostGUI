import React from 'react';

import { tableColumnPropertiesAtom } from 'components/database-schema/atoms';
import { useUserSelectionContext } from 'contexts/user-selection-context';
import { useRecoilState } from 'recoil';

import { Paper, Typography } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';


export const RightPanel: React.FC = () => {
  const {selectedTableName} = useUserSelectionContext()

  const [tableColumnProperties] = useRecoilState(tableColumnPropertiesAtom)

  if (!selectedTableName) {
    return (
      <Alert
        severity='info'
        style={{marginTop: 25, marginLeft: 40, maxWidth: 750}}
      >
        <AlertTitle>No table selected</AlertTitle>
        Please select a table to query from the database schema panel on the
        left.
      </Alert>
    )
  }

  return (
    <Paper
      elevation={8}
      style={{padding: 15, margin: 15, minHeight: `${90}vh`}}
    >
      <Typography variant='h5'>{selectedTableName}</Typography>
      <Typography variant='h5'>
        {JSON.stringify(tableColumnProperties[selectedTableName])}
      </Typography>
      <QueryBuilderContainer />
      <DataTable />
    </Paper>
  )
}

// STOPPED HERE, WORKING TO BUILD THE QUERY BUILDER CONTAINER

const QueryBuilderContainer: React.FC = () => (
  <>
    <QueryBuilderComponent />
    <QueryOptions />
  </>
)

const QueryBuilderComponent: React.FC = () => (
  <div id='query-builder' ref='queryBuilder' />
)

const QueryOptions: React.FC = () => null

const DataTable: React.FC = () => null
