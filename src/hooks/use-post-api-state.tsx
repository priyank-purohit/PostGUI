import axios, { AxiosResponse } from 'axios';
import { useApiContext } from 'contexts/api-data-context';


/**
 * Provides a convenient POST request fetcher method. This will
 * automatically add the authentication headers from context.
 *
 * NOTE: Avoid using this unless there is a specific scenario.
 * Prefer that `useApiMutation` is used.
 *
 * @returns a method that runs a POST req with provided body
 */
export function usePostApi<TBody, TResp>(
  url: string
): [(body: TBody) => Promise<AxiosResponse<TResp>>] {
  const {reqConfig} = useApiContext()

  const fetchPostResponse = async (body: TBody) => {
    const response: AxiosResponse<TResp> = await axios(url, {
      ...reqConfig,
      method: 'POST',
      data: body
    })

    return response
  }

  return [fetchPostResponse]
}

/**
 * For API mutations, a wrapper around `usePostApi`, and try-catch.
 *
 * @returns a method that runs a API request, it is wrapped in try-catch
 */
export function useApiMutation<TBody, TResp>(
  url: string,
  onSuccess: (response: AxiosResponse<TResp>) => void,
  onError: (error: unknown) => void
): [(body: TBody) => Promise<void>] {
  const [runPostReq] = usePostApi<TBody, TResp>(url)

  const runMutation = async (body: TBody) => {
    try {
      const resp = await runPostReq(body)
      onSuccess(resp)
    } catch (error) {
      onError(error)
    }
  }

  return [runMutation]
}
