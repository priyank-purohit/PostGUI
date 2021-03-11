import React, { createContext, useContext, useState } from 'react';


// Context Values
export interface IUserSelectionContextValues {
  deleteMe: string
  databaseIndex: string
  selectedTableName: string

  setDatabaseIndex(dbName: string): void
  setSelectedTableName(tableName: string): void
}

export const UserSelectionContext = createContext<IUserSelectionContextValues>(
  null
)

// Provider props
export interface IUserSelectionContextProviderProps {
  value: Pick<IUserSelectionContextValues, 'deleteMe'>
}

export const UserSelectionContextProvider: React.FC<IUserSelectionContextProviderProps> = (
  props
) => {
  const [dbName, setDbName] = useState<string>(null)
  const [selectedTableName, setSelectedTableName] = useState<string>(null)

  return (
    <UserSelectionContext.Provider
      value={{
        ...props.value,
        databaseIndex: dbName,
        selectedTableName,
        setDatabaseIndex: setDbName,
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
