import React, { useRef } from 'react';

import { useAppConfigContext } from 'contexts/app-config-context';
import { useUserSelectionContext } from 'contexts/user-selection-context';
import { useToggleState } from 'hooks/use-toggle-state';

import { List, ListItem, ListItemText, Menu, MenuItem, Typography } from '@material-ui/core';


export interface IDatabasePickerProps {}

export const DatabasePicker: React.FC<IDatabasePickerProps> = () => {
  const {databases} = useAppConfigContext()

  const {databaseName, setDatabaseName} = useUserSelectionContext()

  const dbPickerRef = useRef(null)
  const [menuOpen, , setMenuOpen, setMenuClosed] = useToggleState(false)

  return (
    <div style={{width: '450px'}}>
      <List ref={dbPickerRef}>
        <ListItem
          button
          aria-haspopup='true'
          aria-label='Database'
          onClick={setMenuOpen}
        >
          <ListItemText primary='Database' secondary={databaseName} />
        </ListItem>
      </List>
      <Menu
        open={menuOpen}
        onClose={setMenuClosed}
        anchorEl={dbPickerRef.current}
        getContentAnchorEl={null}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'center'
        }}
        transformOrigin={{
          horizontal: 'center',
          vertical: 'top'
        }}
      >
        {Object.keys(databases).map((dbName: string) => (
          <MenuItem
            key={dbName}
            selected={dbName === databaseName}
            onClick={() => setDatabaseName(dbName)}
            style={{minWidth: '200px'}}
          >
            {dbName}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
