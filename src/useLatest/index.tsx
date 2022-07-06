import { useRef } from 'react';

/**
 * @description 返回当前最新值的hook，可以避免闭包问题
 * @author lixingyu
 */
function useLatest<T>(value: T) {
  // 利用ref只会初始化一次的特性在多次执行过程中来共享数据
  const ref = useRef<T>(value);

  // 更新数据
  ref.current = value;

  return ref;
}

export default useLatest;
