import { useState, useMemo } from 'react';

export interface Actions<T> {
  /**
   * @description 设置为左边的值
   */
  setLeft: () => void;
  /**
   * @description 设置为右边的值
   */
  setRight: () => void;
  /**
   * @description 设置值
   */
  set: (value: T) => void;
  /**
   * @description 切换
   */
  toggle: () => void;
}

/**
 * @description 用于在两个状态间切换的hook
 * @author lixingyu
 */
function useToggle<T = boolean>(): [boolean, Actions<T>];

function useToggle<T>(defaultValue: T): [T, Actions<T>];

function useToggle<T, U>(defaultValue: T, reverseValue: U): [T | U, Actions<T | U>];

function useToggle<D, R>(defaultValue: D = false as unknown as D, reverseValue?: R) {
  const [state, setState] = useState<D | R>(defaultValue);

  const actions = useMemo<Actions<D | R>>(() => {
    const reverseValueOrigin = (reverseValue === undefined ? !defaultValue : reverseValue) as D | R;

    const toggle = () => setState(s => (s === defaultValue ? reverseValueOrigin : defaultValue));
    const set = (value: D | R) => setState(value);
    const setLeft = () => setState(defaultValue);
    const setRight = () => setState(reverseValueOrigin);

    return { toggle, set, setLeft, setRight };
  }, []);

  return [state, actions];
}

export default useToggle;
