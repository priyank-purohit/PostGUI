import React, { useMemo } from 'react';

import { useUserSelectionContext } from 'contexts/user-selection-context';
import { useStringToggleState } from 'hooks/use-element-toggle-state';
import { useGETApiState } from 'hooks/use-get-api-state';
import { useRecoilState } from 'recoil';

import {
    CircularProgress, Collapse, Grid, List, ListItem, ListItemIcon, ListItemText, ListSubheader,
    Tooltip, useTheme
} from '@material-ui/core';
import { ColorPartial } from '@material-ui/core/styles/createPalette';
import ForeignKeyToIcon from '@material-ui/icons/CallReceived';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import TableIcon from '@material-ui/icons/TableChart';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import KeyIcon from '@material-ui/icons/VpnKey';

import { tableColumnPropertiesAtom } from './atoms';
import { parseDatabaseSchema } from './lib';
import {
    IParsedColumnSchema, IParsedDatabaseSchema, IParsedTableSchema, IPostgRESTBaseUrlResponse
} from './typings';


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
  const [rawDatabaseSchema] = useGETApiState<IPostgRESTBaseUrlResponse>(
    `${databaseConfig.baseUrl}/`
  )
  const parsedDatabaseSchema: IParsedDatabaseSchema = useMemo(() => {
    if (!rawDatabaseSchema) {
      return null
    }
    return parseDatabaseSchema(rawDatabaseSchema.data)
  }, [rawDatabaseSchema])

  const [tableColumnProperties, setTableColumnProperties] = useRecoilState(
    tableColumnPropertiesAtom
  )

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
      const isVisible =
        (tableColumnProperties[tableName] &&
          tableColumnProperties[tableName][columnName] &&
          tableColumnProperties[tableName][columnName].visible) ??
        true

      return (
        <ListItem
          button
          onClick={() =>
            setTableColumnProperties({
              ...tableColumnProperties,
              [tableName]: {
                ...tableColumnProperties[tableName],
                [columnName]: {
                  visible: !!!(isVisible ?? true)
                }
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
                <KeyIcon style={{padding: 3}} />
              </Tooltip>
            )}
            {columnSchema.foreignKeyTo && (
              <Tooltip
                title={`Foreign key to ${columnSchema.foreignKeyTo.table}.${columnSchema.foreignKeyTo.column}`}
                placement='right'
              >
                <ForeignKeyToIcon style={{padding: 3}} />
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
      const isExpanded = tableName === expandedTableName

      const columnElements: JSX.Element[] = []

      for (const columnName of Object.keys(tableSchema)) {
        columnElements.push(
          columnElement(columnName, tableSchema[columnName], tableName)
        )
      }

      return (
        <span key={`${tableName}-block`}>
          <ListItem
            button
            title={tableName}
            style={
              isSelected
                ? {
                    background:
                      theme.palette.type === 'dark'
                        ? (theme.palette.primary as ColorPartial)[300]
                        : (theme.palette.primary as ColorPartial)[100],
                    borderRadius: 5
                  }
                : undefined
            }
            onClick={() => setSelectedTableName(tableName)}
            key={tableName}
          >
            <ListItemIcon>
              <TableIcon color={isSelected ? 'primary' : undefined} />
            </ListItemIcon>
            <ListItemText primary={tableName} />
            {!isSelected && (
              <Tooltip
                title='Peek at schema without loading table'
                placement='bottom'
              >
                <ListItemIcon
                  onClick={(event) => {
                    event.stopPropagation()
                    setExpandedTableName(tableName)
                  }}
                >
                  {isExpanded ? <CloseIcon /> : <KeyboardArrowDownIcon />}
                </ListItemIcon>
              </Tooltip>
            )}
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
        </span>
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
    <div>
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
