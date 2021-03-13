import React, { createContext, useContext, useState } from 'react';

import { AxiosRequestConfig } from 'axios';


// Context values
export interface IApiDataContextValues {
  isLoggedIn: boolean
  reqConfig: AxiosRequestConfig
  setReqConfig(reqConfig: AxiosRequestConfig): void
}

export interface IApiDataContextProviderProps {
  value: Partial<IApiDataContextValues>
}

export const ApiDataContext = createContext<IApiDataContextValues>(null)

/**
 * For API responses shared across the app.
 */
export const ApiDataContextProvider: React.FC<IApiDataContextProviderProps> = (
  props
) => {
  const [reqConfig, setReqConfig] = useState<AxiosRequestConfig>(null)

  return (
    <ApiDataContext.Provider
      value={{
        ...props.value,
        isLoggedIn: !!reqConfig?.headers,
        reqConfig,
        setReqConfig
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
