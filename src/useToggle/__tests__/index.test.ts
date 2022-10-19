import { renderHook, act } from '@testing-library/react-hooks';
import useToggle from '../index';

describe('useToggle', () => {
  it('should support init by nothing', () => {
    const hook = renderHook(() => useToggle());
    expect(hook.result.current[0]).toBeFalsy();
    act(() => {
      hook.result.current[1].toggle();
    });
    expect(hook.result.current[0]).toBeTruthy();
  });

  it('should support defaultValue', () => {
    const hook = renderHook(() => useToggle('Hello'));
    expect(hook.result.current[0]).toBe('Hello');
    act(() => {
      hook.result.current[1].toggle();
    });
    expect(hook.result.current[0]).toBeFalsy();
  });

  it('should support optional defaultValue', () => {
    const hook = renderHook(() => useToggle('hello', 'world'));
    expect(hook.result.current[0]).toBe('hello');
    act(() => {
      hook.result.current[1].toggle();
    });
    expect(hook.result.current[0]).toBe('world');
    act(() => {
      hook.result.current[1].setLeft();
    });
    expect(hook.result.current[0]).toBe('hello');
    act(() => {
      hook.result.current[1].setRight();
    });
    expect(hook.result.current[0]).toBe('world');
    act(() => {
      hook.result.current[1].toggle();
    });
    expect(hook.result.current[0]).toBe('hello');
    act(() => {
      hook.result.current[1].set('hi');
    });
    expect(hook.result.current[0]).toBe('hi');
    act(() => {
      hook.result.current[1].toggle();
    });
    expect(hook.result.current[0]).toBe('hello');
  });
});
