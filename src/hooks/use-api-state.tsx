import { useCallback, useEffect, useState } from 'react';

import axios, { AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios';


/**
 * Provides a convenient wrapper around useState, fetch API, and useEffect.
 */
export function useGetApiState<T>(
  url: string,
  requestConfig: AxiosRequestConfig
): [AxiosResponse<T>] {
  const cancelToken = axios.CancelToken

  const [response, setResponse] = useState<AxiosResponse<T>>(null)

  useEffect(() => {
    const fetchResponse = async () => {
      cancelToken.source().cancel()
      setResponse(null)

      const response: AxiosResponse<T> = await axios(url, {
        ...requestConfig,
        cancelToken: cancelToken.source().token
      })
      setResponse(response)
    }

    fetchResponse()
  }, [url])

  return [response]
}
