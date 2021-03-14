import { useCallback, useState } from 'react';


/**
 * Provides a convenient method to toggle a string state.
 *
 * If you `setState` to the same value, it updates the state
 * to `null` instead.
 * Allows for table name to be clicked to open it, and to
 * collapse it by setting the state to `null` instead of table name again.
 *
 * @returns [state, set state method]
 */
export function useStringToggleState(
  defaultValue: string
): [string, (newState: string) => void] {
  const [state, setState] = useState<string>(defaultValue)

  const setNullState = useCallback(
    (newState) => {
      if (newState === state) {
        setState(null)
      } else {
        setState(newState)
      }
    },
    [state]
  )

  return [state, setNullState]
}
