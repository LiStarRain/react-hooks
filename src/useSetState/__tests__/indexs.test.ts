import { renderHook, act } from '@testing-library/react-hooks';
import useSetState from '../index';

describe('useSetState', () => {
  const setup = <S extends Record<string, any>>(initialValue: S) =>
    renderHook(() => {
      const [state, setState] = useSetState<S>(initialValue);

      return { state, setState } as const;
    });

  it('should support initialState', () => {
    const hook = setup<Record<string, string>>({ name: 'James' });
    expect(hook.result.current.state).toEqual({ name: 'James' });
  });

  it('should support inititalState from function', () => {
    const hook = setup<() => Record<string, string>>(() => ({ name: 'Allen' }));
    expect(hook.result.current.state).toEqual({ name: 'Allen' });
  });

  it('should support object update', () => {
    const hook = setup<Record<string, string | number>>({ name: 'James' });
    act(() => {
      hook.result.current.setState({ age: 23 });
    });
    expect(hook.result.current.state).toEqual({ name: 'James', age: 23 });
  });

  it('should support function update', () => {
    const hook = setup<Record<string, number>>({ count: 0 });
    act(() => {
      hook.result.current.setState(prevState => ({ count: prevState.count + 1 }));
    });
    expect(hook.result.current.state).toEqual({ count: 1 });
  });

  it('should not update when newState is null', () => {
    const initalValue = { count: 0 };
    const hook = setup<Record<string, number>>(initalValue);
    act(() => {
      hook.result.current.setState(null);
    });
    expect(hook.result.current.state).toBe(initalValue);
  });
});
