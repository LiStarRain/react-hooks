import { useState } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import useMemoizedFn from '../index';

const useCount = () => {
  const [count, setCount] = useState<number>(0);

  const addCount = () => {
    setCount(count => count + 1);
  };

  const memoizedFn = useMemoizedFn(() => count);

  return { addCount, memoizedFn };
};

describe('useMemoized', () => {
  it('should be defined', () => {
    expect(useMemoizedFn).toBeDefined();
  });

  it('useMemoizedFn should work', () => {
    const hook = renderHook(() => useCount());
    const currentFn = hook.result.current.memoizedFn;
    expect(hook.result.current.memoizedFn()).toEqual(0);

    act(() => {
      hook.result.current.addCount();
    });

    // 地址不变
    expect(currentFn).toEqual(hook.result.current.memoizedFn);
    // 无闭包陷阱
    expect(hook.result.current.memoizedFn()).toEqual(1);
  });
});
