/* eslint-disable no-console */
import React, { createContext, useEffect, useState } from 'react';

import axios from 'axios';

import { IParsedDatabaseSchema, parseDatabaseSchema } from './api-data-lib';
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
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicmVhZHVzZXIiLCJlbWFpbCI6InJlYWRAcHJpeWFua3B1cm9oaXQuY29tIiwiZXhwIjoxNjE1NDM5MzYzfQ.jYkAin5AaAw2TO4WXJuqHHOUJP0MmZvWVZETOT_3k5k'
  })

  const [
    parsedDatabaseSchema,
    setParsedDatabaseSchema
  ] = useState<IParsedDatabaseSchema>(null)

  console.log(parsedDatabaseSchema)

  useEffect(() => {
    const fetchDatabaseSchema = async () => {
      const response = await axios(`${databases[databaseIndex].baseUrl}/`, {
        headers
      })

      setParsedDatabaseSchema(parseDatabaseSchema(response.data))
    }

    fetchDatabaseSchema()
  }, [databaseIndex])

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
