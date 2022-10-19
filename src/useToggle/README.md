## useToggle

用于在两个状态值之间切换的hook。

### 代码演示

#### 基础用法

```react
import { useToggle } from 'ahooks';

export default () => {
  // 不传入初始状态则会将第一个初始状态设置为false，第二个状态为第一个状态取反后的值
  const [state, { toggle, setLeft, setRight }] = useToggle();

  return (
    <div>
      <p>Effects: {`${state}`}</p>
      <p>
        <button onClick={() => toggle()}>Toggle</button>
        <button onClick={() => setLeft()} style={{ margin: '0 8px' }}>
          Toggle False
        </button>
        <button onClick={() => setRight()}>Toggle True</button>
      </p>
    </div>
  );
};
```

#### 高级用法

```react
import { useToggle } from 'ahooks';

export default () => {
  const [state, { toggle, setLeft, setRight, set }] = useToggle('Hello', 'World');

  return (
    <div>
      <p>Effects: {`${state}`}</p>
      <p>
        <button onClick={() => toggle()}>Toggle</button>
        <button onClick={() => set('Hello')} style={{ margin: '0 8px' }}>
          Set Hello
        </button>
        <button onClick={() => set('World')}>Set World</button>
        <button onClick={() => setLeft()} style={{ margin: '0 8px' }}>
          Set Left
        </button>
        <button onClick={() => setRight()}>Set Right</button>
      </p>
    </div>
  );
};
```

### API

```typescript
const [state, { toggle, set, setLeft, setRight }] = useToggle<T = boolean>(defaultValue?: T);
const [state, { toggle, set, setLeft, setRight }] = useToggle<T>(defaultValue: T);
const [state, { toggle, set, setLeft, setRight }] = useToggle<T, U>(defaultValue: T, reverseValue: U);
```

### Params

| 参数         | 说明                     | 类型 | 默认值          |
| ------------ | ------------------------ | ---- | --------------- |
| defaultValue | 可选项，传入默认的状态值 | `T`  | `false`         |
| reverseValue | 可选项，传入取反的状态值 | `U`  | `!defaultValue` |

### Result

| 参数   | 说明     | 类型             |
| ------ | -------- | ---------------- |
| state  | 状态值   | `T | U`          |
| action | 操作集合 | `Actions<T | U>` |

### Actions

| 参数     | 说明                                                         | 类型                     |
| -------- | ------------------------------------------------------------ | ------------------------ |
| toggle   | 切换state                                                    | `() => void`             |
| set      | 修改state                                                    | `(value: T | U) => void` |
| setLeft  | 设置state为defaultValue                                      | `() => void`             |
| setRight | 若传入了reverseValue，则设置state为reverseValue；否则设置为defaultValue的反值 | `() => void`             |

### 源码

```typescript
import { useMemo, useState } from 'react';

// 约束更新状态的函数类型
export interface Actions<T> {
  // 将state更新为传入的第一个状态（左边的那个值）
  setLeft: () => void;
  // 将state更新为传入的第二个状态（右边的那个值）
  setRight: () => void;
  // 将state更新为传入的两个初始状态中的其中一个
  set: (value: T) => void;
  // 将state切换为另一个状态
  toggle: () => void;
}

/**
 * @description 用于在两个状态值之间切换的hook
 */

/**
 * @description 匹配不传入任何状态的情况，若不传入任何状态，则默认初始状态为false
 * @returns {[boolean, Actions<boolean>]} 返回当前状态及改变状态的方法集
 */
function useToggle<T = boolean>(): [boolean, Actions<T>];

/**
 * @description 匹配只传入一个状态的情况
 * @param {T} defaultValue 初始值
 * @returns {[T, Actions<T>]} 返回当前状态及改变状态的方法集
 */
function useToggle<T>(defaultValue: T): [T, Actions<T>];

/**
 * @description 匹配传入了两个状态的情况
 * @param {T} defaultValue 第一个状态
 * @param {U} reverseValue 第二个状态
 * @returns {[T | U, Actions<T | U>]} 返回当前状态及改变状态的方法集
 */
function useToggle<T, U>(defaultValue: T, reverseValue: U): [T | U, Actions<T | U>];

/**
 * @description 对前面几个函数重载的实现
 * @param {D} defaultValue 第一个状态值，默认值为false
 * @param {R} [reverseValue] 第二个状态值
 * @returns {[D | R, Actions<D | R>]} 状态值及操作集合
 */
function useToggle<D, R>(
  defaultValue: D = false as unknown as D,
  reverseValue?: R,
): [D | R, Actions<D | R>] {
  const [state, setState] = useState<D | R>(defaultValue);

  // 缓存操作集合
  const actions = useMemo<Actions<D | R>>(() => {
    // 获取第二个状态值，若不传入第二个状态值则把第一个状态值取反作为第二个状态值
    const reverseValueOrigin = (reverseValue === undefined ? !defaultValue : reverseValue) as D | R;

    // 切换状态
    const toggle = () =>
      setState(prevState => (prevState === defaultValue ? reverseValueOrigin : defaultValue));
    // 修改状态
    const set = (value: D | R) => setState(value);
    // 更新状态为第一个状态值
    const setLeft = () => setState(defaultValue);
    // 更新状态为第二个状态值
    const setRight = () => setState(reverseValueOrigin);

    return { toggle, set, setLeft, setRight };
  }, []);

  return [state, actions];
}

export default useToggle;
```

### 总结

1. 利用函数重载来匹配不同的函数签名，适应不同的需求场景。
2. 使用`useState`内部自行维护一个状态。
3. 针对各种情况获取默认状态值和相反状态值。
4. 由于操作集合不依赖外部状态值，因此使用`useMemo`进行缓存，防止反复创建，影响性能。
