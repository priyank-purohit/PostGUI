import { useEffect, useState } from 'react';

import axios, { AxiosResponse } from 'axios';
import { useApiContext } from 'contexts/api-data-context';


/**
 * For GET requests.
 *
 * Provides a convenient wrapper around useState, fetch API, and useEffect.
 */
export function useGetApiState<T>(url: string): [AxiosResponse<T>] {
  const {reqConfig} = useApiContext()

  const [response, setResponse] = useState<AxiosResponse<T>>(null)

  useEffect(() => {
    const fetchGetResponse = async () => {
      setResponse(null)

      if (!reqConfig) {
        // No request without token
        return null
      }

      const response: AxiosResponse<T> = await axios(url, {
        ...reqConfig
      })
      setResponse(response)
    }

    fetchGetResponse()
  }, [url, reqConfig])

  return [response]
}

/**
 * For POST requests.
 *
 * Provides a convenient wrapper around useState, fetch API.
 */
export function usePostApiState<T>(
  url: string
): [AxiosResponse<T>, (body: any) => Promise<AxiosResponse<T>>] {
  const apiVals = useApiContext()

  const [response, setResponse] = useState<AxiosResponse<T>>(null)

  const fetchPostResponse = async (body: any) => {
    setResponse(null)

    const response: AxiosResponse<T> = await axios(url, {
      ...(apiVals?.reqConfig ? apiVals.reqConfig : {}),
      method: 'POST',
      data: body
    })
    setResponse(response)
    return response
  }

  return [response, fetchPostResponse]
}
