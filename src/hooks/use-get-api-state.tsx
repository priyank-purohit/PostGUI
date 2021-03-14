import { useEffect, useState } from 'react';

import axios, { AxiosResponse } from 'axios';
import { useApiContext } from 'contexts/api-data-context';


/**
 * For GET requests.
 *
 * @returns [response, refetch response method]
 *
 * Provides a convenient wrapper around fetch API, useState, and useEffect.
 */
export function useGETApiState<T>(
  url: string
): [AxiosResponse<T>, () => Promise<AxiosResponse<T>>] {
  const {reqConfig} = useApiContext()

  const [getResp, setGETResp] = useState<AxiosResponse<T>>(null)

  const fetchGETResponse = async () => {
    setGETResp(null)

    if (!reqConfig) {
      // No request without headers
      return null
    }

    const response: AxiosResponse<T> = await axios(url, {
      ...reqConfig
    })

    setGETResp(response)
    return response
  }

  useEffect(() => {
    fetchGETResponse()
  }, [url, reqConfig])

  return [getResp, fetchGETResponse]
}
