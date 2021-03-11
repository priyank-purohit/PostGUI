import React, { createContext, useContext, useState } from 'react';


// Context Values
export interface IUserSelectionContextValues {
  deleteMe: string
  /**
   * Index of the chosen database in the response of `GET /`.
   */
  databaseIndex: number
  /**
   * Name of the table to query for the selected `databaseIndex`.
   */
  selectedTableName: string
  setDatabaseIndex(dbIndex: number): void
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
  const [databaseIndex, setDatabaseIndex] = useState<number>(0)

  return (
    <UserSelectionContext.Provider
      value={{
        ...props.value,
        databaseIndex,
        selectedTableName,
        setDatabaseIndex,
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
