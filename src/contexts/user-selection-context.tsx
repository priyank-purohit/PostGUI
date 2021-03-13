import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useStringToggleState } from 'hooks/use-element-toggle-state';

import { IConfigDatabase, IConfigDatabases, useAppConfigContext } from './app-config-context';


// Context Values
export interface IUserSelectionContextValues {
  /**
   * Name of the chosen database in the response of `GET /`.
   */
  databaseName: string
  /**
   * Configuration of the `databaseName` database.
   */
  databaseConfig: IConfigDatabase
  /**
   * Name of the table to query for the selected `databaseName`.
   */
  selectedTableName: string
  setDatabaseName(dbName: string): void
  setSelectedTableName(tableName: string): void
}

export const UserSelectionContext = createContext<IUserSelectionContextValues>(
  null
)

// Provider props
export interface IUserSelectionContextProviderProps {
  value: IUserSelectionContextValues
}

export const UserSelectionContextProvider: React.FC<IUserSelectionContextProviderProps> = (
  props
) => {
  const {databases} = useAppConfigContext()

  const [databaseName, setDatabaseName] = useState<string>(
    Object.keys(databases)[0]
  )

  const [databaseConfig, setDatabaseConfig] = useState<IConfigDatabase>(
    databases[databaseName]
  )
  useEffect(() => {
    setDatabaseConfig(databases[databaseName])
  }, [databaseName])

  const [selectedTableName, setSelectedTableName] = useStringToggleState(null)

  return (
    <UserSelectionContext.Provider
      value={{
        ...props.value,
        databaseName,
        databaseConfig,
        selectedTableName,
        setDatabaseName,
        setSelectedTableName
      }}
    >
      {props.children}
    </UserSelectionContext.Provider>
  )
}

/**
 * For all user selections to propogate throughout the app.
 */
export function useUserSelectionContext(): IUserSelectionContextValues {
  return useContext(UserSelectionContext)
}
