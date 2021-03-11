import React, { createContext, useEffect, useState } from 'react';

import axios from 'axios';

import { useUserSelectionContext } from './user-selection-context';


export interface IApiDataContextValues {
  deleteMe: string
  // queryResult: any
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
  const [headers, setHeaders] = useState({
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicmVhZHVzZXIiLCJlbWFpbCI6InJlYWRAcHJpeWFua3B1cm9oaXQuY29tIiwiZXhwIjoxNjE1NDM1NDk0fQ.w1k2YZKvBaAFTw2hG9wALnNikV1F43qZvtJgXdNDtx8'
  })

  const {databaseIndex, selectedTableName} = useUserSelectionContext()

  useEffect(() => {
    const fetchDatabaseSchema = async () => {
      const response = await axios(
        'http://ec2-3-96-54-2.ca-central-1.compute.amazonaws.com:3001',
        {headers}
      )

      // eslint-disable-next-line no-console
      console.log(response.data)
    }

    fetchDatabaseSchema()
  }, [databaseIndex])

  useEffect(() => {
    //
  }, [selectedTableName])

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
