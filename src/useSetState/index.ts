import { useCallback, useState } from 'react';
import { isFunction } from '../utils';

// 更新状态的setState函数类型约束
export type SetState<S extends Record<string, any>> = (
  state: Partial<S> | null | ((prevState: Readonly<S>) => Partial<S> | null),
) => void;

/**
 * @description 管理`object`类型的hook，用法与类组件的`this.setState`基本一致
 * @param initialState 初始状态或者获取初始状态的回调函数
 * @returns [state, setMergeState] 返回当前的状态对象及更新状态的函数
 */
function useSetState<S extends Record<string, any>>(initialState: S | (() => S)): [S, SetState<S>] {
  // 初始状态
  const [state, setState] = useState<S>(initialState);

  // 合并更新状态
  const setMergeState = useCallback<SetState<S>>(patch => {
    setState(prevState => {
      // 取得新的状态值，如果传入的是函数则获取函数返回值；否则将传入的值作为新的状态
      const newState = isFunction(patch) ? patch(prevState) : patch;
      // 返回最新的合并后的状态值，如果新的状态是null，则返回原始状态，此时react会对state的地址进行比较，新老状态相等，不会进入更新流程
      return newState ? { ...prevState, ...newState } : prevState;
    });
  }, []);

  return [state, setMergeState];
}
export default useSetState;
