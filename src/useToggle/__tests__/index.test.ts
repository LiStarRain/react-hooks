import { renderHook, act } from '@testing-library/react-hooks';
import useToggle from '../index';

describe('useToggle', () => {
  it('should be defined', () => {
    expect(useToggle).toBeDefined();
  });

  it('test on init', () => {
    const hook = renderHook(() => useToggle());
    expect(hook.result.current[0]).toBeFalsy();
  });

  it('test on methods', () => {
    const hook = renderHook(() => useToggle('Hello'));
    expect(hook.result.current[0]).toEqual('Hello');
    act(() => {
      hook.result.current[1].toggle();
    });
    expect(hook.result.current[0]).toBeFalsy();
    act(() => {
      hook.result.current[1].setLeft();
    });
    expect(hook.result.current[0]).toEqual('Hello');
    act(() => {
      hook.result.current[1].setRight();
    });
    expect(hook.result.current[0]).toBeFalsy();
  });

  it('test on optional', () => {
    const hook = renderHook(() => useToggle('Hello', 'World'));
    act(() => {
      hook.result.current[1].toggle();
    });
    expect(hook.result.current[0]).toEqual('World');
    act(() => {
      hook.result.current[1].set('World');
    });
    expect(hook.result.current[0]).toEqual('World');
    act(() => {
      hook.result.current[1].toggle();
    });
    expect(hook.result.current[0]).toEqual('Hello');
  });
});
