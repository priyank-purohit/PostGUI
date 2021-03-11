import { useCallback, useState } from 'react';


/**
 * Provides a convenient method to toggle a boolean state.
 *
 * @returns
 *  Current boolean state
 *  Toggle method
 *  Set True method
 *  Set False method
 */
export function useToggleState(
  defaultValue: boolean
): [boolean, () => void, () => void, () => void, (newState: boolean) => void] {
  const [state, setState] = useState(defaultValue)

  const toggleState = useCallback(() => {
    setState(!state)
  }, [state])

  const setTrue = useCallback(() => {
    setState(true)
  }, [state])

  const setFalse = useCallback(() => {
    setState(false)
  }, [state])

  return [state, toggleState, setTrue, setFalse, setState]
}
