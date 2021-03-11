import React, { createContext, useEffect, useMemo, useState } from 'react';

import axios from 'axios';
import { useGetApiState } from 'hooks/use-api-state';

import {
    IParsedDatabaseSchema, IPostgRESTBaseUrlResponse, parseDatabaseSchema
} from './api-data-lib';
import { useAppConfigContext } from './app-config-context';
import { useUserSelectionContext } from './user-selection-context';


export interface IApiDataContextValues {
  deleteMe: string
  parsedDatabaseSchema: any
}
export const ApiDataContext = createContext<IApiDataContextValues>(null)

export interface IApiDataContextProviderProps {
  value: Pick<IApiDataContextValues, 'deleteMe'>
}
/**
 * For API responses shared across the app.
 */
export const ApiDataContextProvider: React.FC<IApiDataContextProviderProps> = (
  props
) => {
  const {databases} = useAppConfigContext()
  const {databaseIndex, selectedTableName} = useUserSelectionContext()

  const [headers, setHeaders] = useState({
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicmVhZHVzZXIiLCJlbWFpbCI6InJlYWRAcHJpeWFua3B1cm9oaXQuY29tIiwiZXhwIjoxNjE1NDQyNzc3fQ.OlpNbuF1Fisyad2DHToT0MkHwKKaVVG-H2f_YxvG_Xo'
  })

  const [rawDatabaseSchema] = useGetApiState<IPostgRESTBaseUrlResponse>(
    `${databases[databaseIndex].baseUrl}/`,
    {headers}
  )

  const parsedDatabaseSchema: IParsedDatabaseSchema = useMemo(() => {
    if (!rawDatabaseSchema) {
      return null
    }
    return parseDatabaseSchema(rawDatabaseSchema.data)
  }, [rawDatabaseSchema])

  useEffect(() => {
    //
  }, [selectedTableName])

  return (
    <ApiDataContext.Provider
      value={{
        ...props.value,
        parsedDatabaseSchema
      }}
    >
      {props.children}
    </ApiDataContext.Provider>
  )
}
