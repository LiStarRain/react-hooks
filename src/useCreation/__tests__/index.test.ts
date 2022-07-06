import { useState } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useCreation from '../index';

describe('useCreation', () => {
  it('should be defined', () => {
    expect(useCreation).toBeDefined();
  });

  class Foo {
    public data: number;
    constructor() {
      this.data = Math.random();
    }
  }

  const setUp = () =>
    renderHook(() => {
      const [count, setCount] = useState<number>(0);
      const [, forceUpdate] = useState<{}>({});
      const foo = useCreation(() => new Foo(), [count]);

      return { foo, count, setCount, forceUpdate };
    });

  it('should work', () => {
    const { result } = setUp();
    const { foo } = result.current;
    act(() => {
      result.current.forceUpdate({});
    });
    // 地址相同
    expect(result.current.foo).toBe(foo);
    act(() => {
      result.current.setCount(1);
    });
    expect(result.current.foo).not.toBe(foo);
  });
});
