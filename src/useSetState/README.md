## useSetState

管理`object`类型的 hook，用法与类组件的`this.setState`方法基本一致。

### 代码演示

#### 基础用法

```react
import { useSetState } from 'ahooks';

interface State {
  name: string;
  age: number;
  [key: string]: any;
}

export default () => {
  const [state, setState] = useSetState<State>({ name: 'Allen', age: 23 });

  return (
    <div>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <p>
        <button type='button' onClick={() => setState({ name: 'James' })}>
          change name
        </button>
        <button type='button' onClick={() => setState({ address: 'kunming' })}>
          add address
        </button>
        <button type='button' onClick={() => setState(prevState => ({ age: prevState.age + 10 }))}>
          change age
        </button>
      </p>
    </div>
  );
};
```

### API

```typescript
const [state, setState] = useSetState<S extends Record<string, any>>(
  initialState: S | (() => S)
): [S, (patch: null | Partial<T> | ((prevState: T) => Partial<T> | null)) => void]
```

### Params

| 参数         | 说明     | 类型            | 默认值 |
| ------------ | -------- | --------------- | ------ |
| initialState | 初始状态 | `S | (() => S)` | -      |

### Result

| 参数     | 说明           | 类型                                                         | 默认值 |
| -------- | -------------- | ------------------------------------------------------------ | ------ |
| state    | 当前状态值     | `S`                                                          | -      |
| setState | 更新状态的函数 | `(state: Partial<S> | null | ((prevState: Readonly<S>) => Partial<S> | null)) => void` | -      |

### 源码

```typescript
import { useCallback, useState } from 'react';
import { isFunction } from '../utils';

// 更新状态的setState函数类型约束
export type SetState<S extends Record<string, any>> = <K extends keyof S>(
  state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null),
) => void;

/**
 * @description 管理`object`类型的hook，用法与类组件的`this.setState`基本一致
 * @param initialState 初始状态或者获取初始状态的回调函数
 * @returns [state, setMergeState] 返回当前的状态对象及更新状态的函数
 */
function useSetState<S extends Record<string, any>>(initialState: S | (() => S)): [S, SetState<S>] {
  // 初始状态
  const [state, setState] = useState<S>(initialState);

  // 合并更新状态
  const setMergeState = useCallback<SetState<S>>(patch => {
    setState(prevState => {
      // 取得新的状态值，如果传入的是函数则获取函数返回值；否则将传入的值作为新的状态
      const newState = isFunction(patch) ? patch(prevState) : patch;
      /** 
      	* 返回最新的合并后的状态值，如果新的状态是null，则返回原始状态，
      		此时react会对state的地址进行比较，新老状态相等，不会进入更新流程 
      **/
      return newState ? { ...prevState, ...newState } : prevState;
    });
  }, []);

  return [state, setMergeState];
}

export default useSetState;
```

### 总结

1. 内部通过`useState`自己维护一个`obejct`类型的状态对象

2. 每次进行状态更新时，先获取新的`state`，进行合法性检验后与老的`state`进行合并，然后再更新
