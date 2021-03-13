import React, { useMemo, useState } from 'react';

import { useApiContext } from 'contexts/api-data-context';
import {
    IParsedColumnSchema, IParsedDatabaseSchema, IParsedTableSchema, IPostgRESTBaseUrlResponse,
    parseDatabaseSchema
} from 'contexts/api-data-lib';
import { useUserSelectionContext } from 'contexts/user-selection-context';
import { useGetApiState } from 'hooks/use-api-state';
import { useStringToggleState } from 'hooks/use-element-toggle-state';

import {
    CircularProgress, Collapse, Grid, List, ListItem, ListItemIcon, ListItemText, ListSubheader,
    Tooltip, useTheme
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ForeignKeyToIcon from '@material-ui/icons/CallReceived';
import ClearIcon from '@material-ui/icons/Clear';
import CloseIcon from '@material-ui/icons/Close';
import FolderIconOpen from '@material-ui/icons/FolderOpen';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import TableIcon from '@material-ui/icons/TableChart';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import KeyIcon from '@material-ui/icons/VpnKey';


export interface IDatabaseSchemaProps {}

export const DatabaseSchema: React.FC<IDatabaseSchemaProps> = () => {
  const theme = useTheme()

  // The table to query in right panel
  const {
    databaseConfig,
    selectedTableName,
    setSelectedTableName
  } = useUserSelectionContext()

  // Database schema
  const [rawDatabaseSchema] = useGetApiState<IPostgRESTBaseUrlResponse>(
    `${databaseConfig.baseUrl}/`
  )
  const parsedDatabaseSchema: IParsedDatabaseSchema = useMemo(() => {
    if (!rawDatabaseSchema) {
      return null
    }
    return parseDatabaseSchema(rawDatabaseSchema.data)
  }, [rawDatabaseSchema])

  // Properties of a column, per table
  const [tableColumnProperties, setTableColumnProperties] = useState<{
    [tableColumnName: string]: {
      visible: boolean
    }
  }>({})

  // Can expand one more table's schema without affecting the selected table
  const [expandedTableName, setExpandedTableName] = useStringToggleState(null)

  const tablesAndColumnsElements = ((): JSX.Element[] => {
    if (!parsedDatabaseSchema) {
      return []
    }

    const tablesColumns = []

    const columnElement = (
      columnName: string,
      columnSchema: IParsedColumnSchema,
      tableName: string
    ): JSX.Element => {
      const key = `${tableName}.${columnName}`

      const isVisible = tableColumnProperties[key]?.visible ?? true

      return (
        <ListItem
          button
          onClick={() =>
            setTableColumnProperties({
              ...tableColumnProperties,
              [key]: {
                visible: !!!(isVisible ?? true)
              }
            })
          }
          key={columnName}
        >
          <ListItemIcon>
            {isVisible ? (
              <VisibilityIcon color='primary' />
            ) : (
              <VisibilityOffIcon color='disabled' />
            )}
          </ListItemIcon>
          <ListItemText primary={columnName} />
          <ListItemIcon>
            {columnSchema.isPrimaryKey && (
              <Tooltip title='Primary key'>
                <KeyIcon style={{padding: '5px'}} />
              </Tooltip>
            )}
            {columnSchema.foreignKeyTo && (
              <Tooltip
                title={`Foreign key to ${columnSchema.foreignKeyTo.table}.${columnSchema.foreignKeyTo.column}`}
                placement='right'
              >
                <ForeignKeyToIcon style={{padding: '5px'}} />
              </Tooltip>
            )}
          </ListItemIcon>
        </ListItem>
      )
    }

    const tableElement = (
      tableName: string,
      tableSchema: IParsedTableSchema
    ) => {
      const isSelected = tableName === selectedTableName

      const columnElements: JSX.Element[] = []

      for (const columnName of Object.keys(tableSchema)) {
        columnElements.push(
          columnElement(columnName, tableSchema[columnName], tableName)
        )
      }

      return (
        <>
          <ListItem
            button
            title={tableName}
            style={
              isSelected
                ? {background: theme.palette.primary[100], borderRadius: 5}
                : undefined
            }
            onClick={() => setSelectedTableName(tableName)}
            key={tableName}
          >
            <ListItemIcon>
              <TableIcon color={isSelected ? 'primary' : undefined} />
            </ListItemIcon>
            <ListItemText primary={tableName} />
            <ListItemIcon>
              <KeyboardArrowDownIcon />
            </ListItemIcon>
          </ListItem>
          <Collapse
            in={[selectedTableName, expandedTableName].includes(tableName)}
            timeout='auto'
            style={{marginLeft: '35px'}}
            key={`${tableName}-collapse`}
          >
            <List component='div' key={`${tableName}-columns`}>
              {columnElements}
            </List>
          </Collapse>
        </>
      )
    }

    for (const tableName of Object.keys(parsedDatabaseSchema)) {
      tablesColumns.push(
        tableElement(tableName, parsedDatabaseSchema[tableName])
      )
    }

    return tablesColumns
  })()

  return (
    <div style={{width: '450px'}}>
      <List
        subheader={
          <ListSubheader disableSticky component='div'>
            Tables and Columns
          </ListSubheader>
        }
      >
        {parsedDatabaseSchema ? (
          tablesAndColumnsElements
        ) : (
          <Grid container alignContent='center' direction='column'>
            <CircularProgress />
          </Grid>
        )}
      </List>
    </div>
  )
}
