import React, { createContext, useContext, useState } from 'react';


export interface IConfigDatabase {
  title: string
  baseUrl: string
  publicDbAcessType: 'read' | 'private'
  foreignKeySearch: boolean
  primaryKeyFunction: boolean
  regexSupport: boolean
}

// Context Values
export interface IAppConfigContextValues {
  databases: IConfigDatabase[]
  logoUrl: string
  seqColumnNames: string[]
}

export const AppConfigContext = createContext<IAppConfigContextValues>(null)

// Provider props
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
