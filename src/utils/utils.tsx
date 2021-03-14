/**
 * Wrapper around setTimeout.
 *
 * @example `await delay(1000)` to wait 1 second
 *
 * @param ms number of milliseconds to wait, 1000 ms = 1 second
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms))
