import React, { useState } from 'react';
import QueryBuilder, { Field } from 'react-querybuilder';

import { tableColumnPropertiesAtom } from 'components/database-schema/atoms';
import { Spacer } from 'components/spacer';
import { INITIAL_ROW_LIMIT, MAX_ROW_LIMIT } from 'config/constants';
import { useUserSelectionContext } from 'contexts/user-selection-context';
import { useToggleState } from 'hooks/use-toggle-state';
import { useRecoilState } from 'recoil';

import {
    CardContent, CardHeader, Checkbox, FormControlLabel, Grid, Paper, TextField, Typography
} from '@material-ui/core';
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
            <Grid item xs={2}>
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

const QueryBuilderComponent: React.FC = () => (
  <>
    <Typography variant='h6'>Query Builder</Typography>
    <div style={{margin: 25, border: '1px solid red'}}>
      <QueryBuilder
        showNotToggle
        showCombinatorsBetweenRules
        fields={[
          {name: 'firstName', label: 'First Name'} as Field,
          {name: 'lastName', label: 'Last Name'},
          {name: 'age', label: 'Age', inputType: 'number'},
          {name: 'address', label: 'Address'},
          {name: 'phone', label: 'Phone'},
          {name: 'email', label: 'Email'},
          {name: 'twitter', label: 'Twitter'},
          {name: 'isDev', label: 'Is a Developer?', defaultValue: false}
        ]}
        onQueryChange={(query) => {
          // eslint-disable-next-line no-console
          console.log(query)
        }}
      />
    </div>
  </>
)

const QueryOptions: React.FC = () => {
  const [error, setError] = useState(false)
  const [exactRowCount, , , toggleExactRowCount] = useToggleState(false)
  return (
    <>
      <Typography variant='h6'>Query Options</Typography>
      <Spacer size='s' />
      <FormControlLabel
        control={
          <Checkbox
            color='primary'
            checked={exactRowCount}
            onChange={toggleExactRowCount}
            name='exact-row-count'
          />
        }
        label='Get exact row count'
      />
      <Spacer size='s' />
      <FormControlLabel
        control={
          <TextField
            required
            type='number'
            variant='outlined'
            label='Row limit'
            defaultValue={INITIAL_ROW_LIMIT}
            onChange={(event) => {
              if (
                Number(event.target.value) > 0 &&
                Number(event.target.value) <= MAX_ROW_LIMIT
              ) {
                // within boundaries
                setError(false)
                return
              }
              setError(true)
            }}
            error={error}
            helperText={
              error ? `Row limit must be between 1 and ${MAX_ROW_LIMIT}` : ''
            }
            style={{
              width: 300
            }}
            id='row-limit'
          />
        }
        label=''
      />
    </>
  )
}

const DataTable: React.FC = () => null
