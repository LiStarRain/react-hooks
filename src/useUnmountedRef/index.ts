import { useEffect, useRef } from 'react';

/**
 * @description 获取当前组件是否已经卸载的hook
 * @author lixingyu
 */
export default function useUnmountedRef() {
  const unmountedRef = useRef<boolean>(false);

  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
    };
  }, []);

  return unmountedRef;
}
