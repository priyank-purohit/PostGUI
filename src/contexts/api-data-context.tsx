import React, { createContext, useState } from 'react';


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
) => (
  <ApiDataContext.Provider
    value={{
      ...props.value
    }}
  >
    {props.children}
  </ApiDataContext.Provider>
)
