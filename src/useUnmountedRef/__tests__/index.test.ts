import { renderHook } from '@testing-library/react-hooks';
import useUnmountedRef from '../';

describe('useUnmountedRef', () => {
  it('should be defined', () => {
    expect(useUnmountedRef).toBeDefined();
  });

  it('should work', () => {
    const hook = renderHook(() => useUnmountedRef());
    expect(hook.result.current.current).toBe(false);
    hook.rerender();
    expect(hook.result.current.current).toBe(false);
    hook.unmount();
    expect(hook.result.current.current).toBe(true);
  });
});
