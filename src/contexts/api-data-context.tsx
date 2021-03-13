import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import axios, { AxiosRequestConfig } from 'axios';
import { useGetApiState } from 'hooks/use-api-state';

import {
    IParsedDatabaseSchema, IPostgRESTBaseUrlResponse, parseDatabaseSchema
} from './api-data-lib';
import { useAppConfigContext } from './app-config-context';
import { useUserSelectionContext } from './user-selection-context';


// Context values
export interface IApiDataContextValues {
  isLoggedIn: boolean
  parsedDatabaseSchema: IParsedDatabaseSchema
  requestConfig: AxiosRequestConfig
  login(email: string, password: string): void
}

export interface IApiDataContextProviderProps {
  value: Pick<IApiDataContextValues, 'requestConfig'>
}

export const ApiDataContext = createContext<IApiDataContextValues>(null)

/**
 * For API responses shared across the app.
 */
export const ApiDataContextProvider: React.FC<IApiDataContextProviderProps> = (
  props
) => {
  const {databaseConfig, selectedTableName} = useUserSelectionContext()

  const [authToken, setAuthToken] = useState<string>(null)

  // Database schema
  const [rawDatabaseSchema] = useGetApiState<IPostgRESTBaseUrlResponse>(
    `${databaseConfig.baseUrl}/`,
    {...props.value.requestConfig}
  )
  const parsedDatabaseSchema: IParsedDatabaseSchema = useMemo(() => {
    if (!rawDatabaseSchema) {
      return null
    }
    return parseDatabaseSchema(rawDatabaseSchema.data)
  }, [rawDatabaseSchema])

  const handleLogin = (email: string, password: string): void => {
    //
  }

  return (
    <ApiDataContext.Provider
      value={{
        ...props.value,
        isLoggedIn: !!authToken,
        parsedDatabaseSchema,
        login: handleLogin
      }}
    >
      {props.children}
    </ApiDataContext.Provider>
  )
}

/**
 * Provides commonly shared parsed API responses to all app components.
 */
export function useApiContext(): IApiDataContextValues {
  return useContext(ApiDataContext)
}
