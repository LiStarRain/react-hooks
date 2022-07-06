import { useState } from 'react';
import Cookies from 'js-cookie';
import useMemoizedFn from '../useMemoizedFn';
import { isFunction } from '../utils';

// 配置项
export type Options = Cookies.CookieAttributes & {
  defaultValue?: State | (() => State);
};

// state类型
export type State = string | undefined;

export type SetState = (newValue: State | ((prevState: State) => State), newOptions?: Options) => void;

/**
 * @description 一个可以将状态存储在cookie中的hook
 */
export default function useCookieState(cookieKey: string, options: Options = {}) {
  const [state, setState] = useState<State>(() => {
    // 如果有指定的key所对应的cookie值,则直接使用
    const cookieValue = Cookies.get(cookieKey);

    if (typeof cookieValue === 'string') return cookieValue;

    // 否则适应用户设置的默认值
    if (isFunction(options.defaultValue)) {
      return options.defaultValue();
    }

    // 用户显式设置的state,defaultValue 可以设置为undefined
    return options.defaultValue;
  });

  const updateState = useMemoizedFn<SetState>((newValue, newOptions = {}) => {
    const { defaultValue, ...restOptions } = { ...options, ...newOptions };
    setState(prevState => {
      const value = isFunction(newValue) ? newValue(prevState) : newValue;
      if (value === undefined) {
        // 更新的值为undefined时清空cookie
        Cookies.remove(cookieKey);
      } else {
        // 否则设置cookie
        Cookies.set(cookieKey, value, restOptions);
      }
      return value;
    });
  });

  return [state, updateState] as const;
}
