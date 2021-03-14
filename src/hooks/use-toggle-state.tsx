import { useCallback, useState } from 'react';


/**
 * Provides a convenient method to toggle a boolean state.
 *
 * This is preferred over `useState<boolean>()` for improved clarity
 * and readability over `setState(true)`. For example, `openModal()` is
 * more readable than `setModalVisibility(true)`.
 * For the same reason, the `toggleState` method returned by this hook is
 * NOT usually named.
 *
 * @returns [state, toggle method, set true method, set false method]
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

  return [state, setTrue, setFalse, toggleState, setState]
}
