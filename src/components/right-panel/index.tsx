import React, { useRef } from 'react';

import { tableColumnPropertiesAtom } from 'components/database-schema/atoms';
import { useUserSelectionContext } from 'contexts/user-selection-context';
import { useRecoilState } from 'recoil';

import { CardContent, CardHeader, Grid, Paper, Typography } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import { SubmitButton } from './submit-button';


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
      <CardHeader
        title={
          <Grid container alignItems='center'>
            <Grid item xs>
              <Typography variant='h5'>{selectedTableName}</Typography>
              <Typography variant='body1'>tableDescription</Typography>
            </Grid>
            <Grid item xs={1}>
              <SubmitButton />
            </Grid>
          </Grid>
        }
      />
      <CardContent>
        <QueryBuilderContainer />
        <DataTable />
        <Typography variant='caption'>
          {JSON.stringify(tableColumnProperties[selectedTableName])}
        </Typography>
      </CardContent>
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

const QueryBuilderComponent: React.FC = () => {
  const queryBuilderRef = useRef(null)
  return (
    <>
      <Typography variant='h6'>Query Builder</Typography>
      <div id='query-builder' ref={queryBuilderRef} />
    </>
  )
}

const QueryOptions: React.FC = () => null

const DataTable: React.FC = () => null
