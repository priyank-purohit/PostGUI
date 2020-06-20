import React, { createContext, useState } from 'react';


export interface IApiDataContextValues {
  deleteMe: string
  // queryResult: any
}
export const ApiDataContext = createContext<IApiDataContextValues>(null)

export interface IApiDataContextProviderProps {
  value: Pick<IApiDataContextValues, 'deleteMe'>
}
export const ApiDataContextProvider: React.FC<IApiDataContextProviderProps> = (
  props
) => {
  return (
    <ApiDataContext.Provider
      value={{
        ...props.value
      }}
    >
      {props.children}
    </ApiDataContext.Provider>
  )
}

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
