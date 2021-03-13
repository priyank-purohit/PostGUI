import React, { createContext, useContext, useState } from 'react';


export interface IConfigDatabase {
  baseUrl: string
  publicDbAcessType: 'read' | 'private'
  foreignKeySearch: boolean
  primaryKeyFunction: boolean
  regexSupport: boolean
}

export interface IConfigDatabases {
  [key: string]: IConfigDatabase
}

// Context Values
export interface IAppConfigContextValues {
  databases: IConfigDatabases
  logoUrl: string
  seqColumnNames: string[]
  token?: string
}

export const AppConfigContext = createContext<IAppConfigContextValues>(null)

export interface IAppConfigContextProviderProps {
  value: IAppConfigContextValues
}

export const AppConfigContextProvider: React.FC<IAppConfigContextProviderProps> = (
  props
) => (
  <AppConfigContext.Provider
    value={{
      ...props.value
    }}
  >
    {props.children}
  </AppConfigContext.Provider>
)

/**
 * For all user selections to propogate throughout the app.
 */
export function useAppConfigContext(): IAppConfigContextValues {
  return useContext(AppConfigContext)
}
