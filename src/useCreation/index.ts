import type { DependencyList } from 'react';
import { useRef } from 'react';
import depsAreSame from '../utils/depsAreSame';

/**
 * @description 根据依赖项计算回调函数的返回值，用于替代`useMemo`或`useRef`
 *  - `useCreation`可以避免`useRef`每次渲染都会实例化值的过程，即便这个值立马就被扔掉了，减少性能隐患
 *    eg: `useRef(new User())`
 *        `useCreation(() => new User(), [])`
 *  - `useMemo`不一定能保证被memo的值一定不会被重计算
 * @author lixingyu
 */
export default function useCreation<T>(factory: () => T, deps: DependencyList) {
  const { current } = useRef({
    // 上一次执行的依赖项
    deps,
    // 存储的值
    obj: undefined as undefined | T,
    // 是否初始化
    initialized: false,
  });

  // 第一次初始化或者依赖项改变的时候,才会调用传入的回调函数去更新存储的数据
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps;
    current.obj = factory();
    current.initialized = true;
  }

  return current.obj as T;
}
