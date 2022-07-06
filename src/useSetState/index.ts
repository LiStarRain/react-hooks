import { useCallback, useState } from 'react';
import isFunction from '../utils/isFunction';

export type SetState<S extends Record<string, any>> = <K extends keyof S>(
  state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null)
) => void;

/**
 * @description 管理object类型的state
 * @author lixingyu
 */
function useSetState<S extends Record<string, any>>(initialState: S | (() => S)): [S, SetState<S>] {
  const [state, setState] = useState<S>(initialState);

  // merge state and update
  const setMergeState = useCallback<SetState<S>>(patch => {
    setState(prevState => {
      const newState = isFunction(patch) ? patch(state) : patch;
      return newState ? { ...prevState, ...newState } : prevState;
    });
  }, []);

  return [state, setMergeState];
}

export default useSetState;
