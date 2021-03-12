import React, { useMemo, useState } from 'react';

import { useApiContext } from 'contexts/api-data-context';
import { IParsedColumnSchema, IParsedTableSchema } from 'contexts/api-data-lib';
import { useUserSelectionContext } from 'contexts/user-selection-context';
import { useStringToggleState } from 'hooks/use-element-toggle-state';

import {
    Collapse, List, ListItem, ListItemIcon, ListItemText, ListSubheader
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import CloseIcon from '@material-ui/icons/Close';
import FolderIcon from '@material-ui/icons/Folder';
import FolderIconOpen from '@material-ui/icons/FolderOpen';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';


export interface IDatabaseSchemaProps {}

export const DatabaseSchema: React.FC<IDatabaseSchemaProps> = () => {
  const {parsedDatabaseSchema} = useApiContext()

  // eslint-disable-next-line no-console
  console.log('parsedDatabaseSchema =', parsedDatabaseSchema)

  // The table to query in right panel
  const {selectedTableName, setSelectedTableName} = useUserSelectionContext()

  // Can expand one more table's schema without affecting the selected table
  const [expandedTableName, setExpandedTableName] = useStringToggleState(null)

  const tablesAndColumns = (): JSX.Element[] => {
    if (!parsedDatabaseSchema) {
      return []
    }

    const tablesColumns = []

    const columnElement = (
      columnName: string,
      columnSchema: IParsedColumnSchema
    ): JSX.Element => (
      <ListItem button key={columnName}>
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText primary={columnName} />
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
      </ListItem>
    )

    const tableElement = (
      tableName: string,
      tableSchema: IParsedTableSchema
    ) => {
      const columnElements: JSX.Element[] = []

      for (const columnName of Object.keys(tableSchema)) {
        columnElements.push(columnElement(columnName, tableSchema[columnName]))
      }

      return (
        <>
          <ListItem
            button
            onClick={() => setSelectedTableName(tableName)}
            key={tableName}
            title={tableName}
          >
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary={tableName} />
            <ListItemIcon>
              <KeyboardArrowDownIcon />
            </ListItemIcon>
          </ListItem>
          <Collapse
            in={[selectedTableName, expandedTableName].includes(tableName)}
            timeout='auto'
            style={{marginLeft: '25px'}}
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
  }

  return (
    <div>
      <List
        subheader={
          <ListSubheader component='div'>Tables and Columns</ListSubheader>
        }
      >
        {tablesAndColumns()}
      </List>
    </div>
  )
}
