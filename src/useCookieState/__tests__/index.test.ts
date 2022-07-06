import { renderHook, act } from '@testing-library/react-hooks';
import Cookies from 'js-cookie';
import type { Options } from '../index';
import useCookieState from '../index';

describe('useCookieState', () => {
  it('should be defined', () => {
    expect(useCookieState).toBeDefined();
  });

  const setUp = (key: string, options: Options) =>
    renderHook(() => {
      const [state, setState] = useCookieState(key, options);
      return { state, setState };
    });

  it('should init by function', () => {
    const COOKIE_KEY = 'test-key-with-init';
    const hook = setUp(COOKIE_KEY, { defaultValue: () => 'foo' });
    expect(hook.result.current.state).toEqual('foo');
  });

  it('should work by key', () => {
    const COOKIE_KEY = 'test-key';
    const hook = setUp(COOKIE_KEY, { defaultValue: 'A' });
    expect(hook.result.current.state).toEqual('A');
    act(() => {
      hook.result.current.setState('B');
    });
    expect(hook.result.current.state).toEqual('B');
    const anotherHook = setUp(COOKIE_KEY, { defaultValue: 'A' });
    // 默认获取cookie key指定的value作为初始值
    expect(anotherHook.result.current.state).toEqual('B');
    act(() => {
      anotherHook.result.current.setState('C');
    });
    expect(anotherHook.result.current.state).toEqual('C');
    expect(hook.result.current.state).toEqual('B');
  });

  it('should support undefined', () => {
    const COOKIE_KEY = 'test-key-with-undefined';
    const hook = setUp(COOKIE_KEY, { defaultValue: 'undefined' });
    expect(hook.result.current.state).toEqual('undefined');
    act(() => {
      // 清空了cookie
      hook.result.current.setState(undefined);
    });
    expect(hook.result.current.state).toEqual(undefined);
    const anotherHook = setUp(COOKIE_KEY, { defaultValue: 'false' });
    expect(anotherHook.result.current.state).toEqual('false');
  });

  it('should support empty string', () => {
    const COOKIE_KEY = 'test-key-with-empty-string';
    Cookies.set(COOKIE_KEY, '');
    expect(Cookies.get(COOKIE_KEY)).toEqual('');
    const hook = setUp(COOKIE_KEY, { defaultValue: 'hello' });
    expect(hook.result.current.state).toEqual('');
  });

  it('should support function updater', () => {
    const COOKIE_KEY = 'test-key-with-func-updater';
    const hook = setUp(COOKIE_KEY, { defaultValue: 'hello world' });
    expect(hook.result.current.state).toEqual('hello world');
    act(() => {
      hook.result.current.setState(prevState => `${prevState}, ame`);
    });
    expect(hook.result.current.state).toEqual('hello world, ame');
  });
});
