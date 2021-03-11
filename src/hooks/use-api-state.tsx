import { useCallback, useEffect, useState } from 'react';

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';


/**
 * Provides a convenient wrapper around useState, fetch API, and useEffect.
 */
export function useGetApiState<T>(
  url: string,
  headers: AxiosRequestConfig
): [AxiosResponse<T>] {
  const [response, setResponse] = useState<AxiosResponse<T>>(null)

  useEffect(() => {
    const fetchResponse = async () => {
      const response: AxiosResponse<T> = await axios(url, headers)

      setResponse(response)
    }

    fetchResponse()
  }, [])

  return [response]
}
