import React, { useState } from 'react';

import { useApiContext } from 'contexts/api-data-context';
import { useUserSelectionContext } from 'contexts/user-selection-context';

import { List, ListItem, ListSubheader } from '@material-ui/core';


export interface IDatabaseSchemaProps {}

export const DatabaseSchema: React.FC<IDatabaseSchemaProps> = () => {
  const {parsedDatabaseSchema} = useApiContext()

  // eslint-disable-next-line no-console
  console.log('parsedDatabaseSchema =', parsedDatabaseSchema)

  // The table to query in right panel
  const {selectedTableName, setSelectedTableName} = useUserSelectionContext()

  // Can expand one more table's schema without affecting the selected table
  const [expandedTable, setExpandedTable] = useState(null)

  return (
    <div>
      <List
        subheader={
          <ListSubheader component='div'>Tables and Columns</ListSubheader>
        }
      >
        <ListItem>Testing</ListItem>
      </List>
    </div>
  )
}
