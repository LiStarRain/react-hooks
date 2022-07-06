import { useEffect } from 'react';

/**
 * @description 只在组件初始化时执行的Hook
 * @author lixingyu
 */
export default function useMount(fn: () => void) {
  if (process.env.NODE_ENV === 'development') {
    if (typeof fn !== 'function') {
      console.error(`useMount: parameter \`fn\` expected to be a function, but got ${typeof fn}`);
    }
  }

  useEffect(() => {
    fn?.();
  }, []);
}
