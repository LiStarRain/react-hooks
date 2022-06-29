import { useMemo } from 'react';
import useToggle from '../useToggle';

interface Actions {
  setTrue: () => void;
  setFalse: () => void;
  set: (value: boolean) => void;
  toggle: () => void;
}

/**
 * @description 用于管理布尔值的hook
 * @author lixingyu
 */
function useBoolean(defaultValue = false): [boolean, Actions] {
  const [state, { toggle, set }] = useToggle(defaultValue);

  const actions = useMemo<Actions>(() => {
    const setTrue = () => set(true);
    const setFalse = () => set(false);

    return { toggle, setTrue, setFalse, set: v => set(!!v) };
  }, []);

  return [state, actions];
}

export default useBoolean;
