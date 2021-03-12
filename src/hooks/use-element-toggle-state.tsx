import { useCallback, useState } from 'react';


/**
 * Provides a convenient method to toggle a string state.
 *
 * If you setState to the same value, it updates the state to `null` instead.
 *
 * Allows for table name to be clicked to open it, and to collapse it by setting the state to null instead of table name again.
 *
 * @returns
 *  Current string state
 *  Set state method that will set current state to null if same value is provided
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
