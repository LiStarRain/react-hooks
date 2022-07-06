import { useEffect } from 'react';
import useLatest from '../useLatest';

/**
 * @description 在组件卸载时执行的hook
 */
export default function useUnmount(fn: () => void) {
  if (process.env.NODE_ENV === 'development') {
    if (typeof fn !== 'function') {
      console.error(`useUnmount expected parameter is a function, got ${typeof fn}`);
    }
  }

  // 获取最新的fn,避免多次执行时的闭包问题
  const fnRef = useLatest(fn);

  useEffect(
    () => () => {
      fnRef.current();
    },
    []
  );
}
