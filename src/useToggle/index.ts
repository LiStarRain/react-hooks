import { useMemo, useState } from 'react';

// 约束更新状态的函数类型
export interface Actions<T> {
  // 将state更新为传入的第一个状态（左边的那个值）
  setLeft: () => void;
  // 将state更新为传入的第二个状态（右边的那个值）
  setRight: () => void;
  // 将state更新为传入的两个初始状态中的其中一个
  set: (value: T) => void;
  // 将state切换为另一个状态
  toggle: () => void;
}

/**
 * @description 用于在两个状态值之间切换的hook
 */

/**
 * @description 匹配不传入任何状态的情况，若不传入任何状态，则默认初始状态为false
 * @returns {[boolean, Actions<boolean>]} 返回当前状态及改变状态的方法集
 */
function useToggle<T = boolean>(): [boolean, Actions<T>];

/**
 * @description 匹配只传入一个状态的情况
 * @param {T} defaultValue 初始值
 * @returns {[T, Actions<T>]} 返回当前状态及改变状态的方法集
 */
function useToggle<T>(defaultValue: T): [T, Actions<T>];

/**
 * @description 匹配传入了两个状态的情况
 * @param {T} defaultValue 第一个状态
 * @param {U} reverseValue 第二个状态
 * @returns {[T | U, Actions<T | U>]} 返回当前状态及改变状态的方法集
 */
function useToggle<T, U>(defaultValue: T, reverseValue: U): [T | U, Actions<T | U>];

/**
 * @description 对前面几个函数重载的实现
 * @param {D} defaultValue 第一个状态值，默认值为false
 * @param {R} [reverseValue] 第二个状态值
 * @returns {[D | R, Actions<D | R>]} 状态值及操作集合
 */
function useToggle<D, R>(
  defaultValue: D = false as unknown as D,
  reverseValue?: R,
): [D | R, Actions<D | R>] {
  const [state, setState] = useState<D | R>(defaultValue);

  // 缓存操作集合
  const actions = useMemo<Actions<D | R>>(() => {
    // 获取第二个状态值，若不传入第二个状态值则把第一个状态值取反作为第二个状态值
    const reverseValueOrigin = (reverseValue === undefined ? !defaultValue : reverseValue) as D | R;

    // 切换状态
    const toggle = () =>
      setState(prevState => (prevState === defaultValue ? reverseValueOrigin : defaultValue));
    // 修改状态
    const set = (value: D | R) => setState(value);
    // 更新状态为第一个状态值
    const setLeft = () => setState(defaultValue);
    // 更新状态为第二个状态值
    const setRight = () => setState(reverseValueOrigin);

    return { toggle, set, setLeft, setRight };
  }, []);

  return [state, actions];
}

export default useToggle;
