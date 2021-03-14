import { compact, flatten, isObject, isString, map } from 'lodash';


/**
 * Wrapper around setTimeout.
 *
 * @example `await delay(1000)` to wait 1 second
 *
 * @param ms number of milliseconds to wait, 1000 ms = 1 second
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms))

type classArgs = string | [string, boolean] | {[name: string]: boolean}

export function classNames(...args: classArgs[]): string {
  return compact(
    flatten(
      args.map((className) => {
        if (isString(className)) {
          return className
        }

        if (Array.isArray(className)) {
          return className[1] ? className[0] : null
        }

        if (isObject(className)) {
          return map(className, (val, key) => (val ? key : null))
        }

        return null
      })
    )
  ).join(' ')
}
