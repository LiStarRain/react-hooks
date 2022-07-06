import { useMemo, useRef } from 'react';

type noop = (this: any, ...args: any[]) => any;

// 提取函数上下文this和函数参数的类型
type PickFunction<T extends noop> = (this: ThisParameterType<T>, ...args: Parameters<T>) => ReturnType<T>;

/**
 * @description 缓存传入的回调函数，不仅函数的地址永远不会改变，并且规避了闭包陷阱
 * @author lixingyu
 */
function useMemoizedFn<T extends noop>(fn: T) {
  if (process.env.NODE_ENV === 'development') {
    if (typeof fn !== 'function') {
      console.error(`useMemoizedFn expected parameter is a function, got ${typeof fn}`);
    }
  }

  // 存储函数，useRef只会在第一次执行时初始化一次，可以利用该特性在多次渲染过程中共享数据
  const fnRef = useRef<T>(fn);

  // 传入的回调函数更新时，需要更新ref上缓存的函数，保证函数始终能引用到外层最新的作用域
  // 其实这个时候由于外部每次渲染都会生成新的回调函数fn，因此这里其实是依赖外部变化而变化的
  // why not write `fnRef.current = fn`?
  // https://github.com/alibaba/hooks/issues/728
  fnRef.current = useMemo(() => fn, [fn]);

  // 初始化缓存函数的容器
  const memoizedFn = useRef<PickFunction<T>>();
  // 缓存函数
  if (!memoizedFn.current) {
    // 注意不要破坏了函数上下文
    memoizedFn.current = function (this, ...args) {
      // 而缓存函数内部始终引用着外部最新的函数，避免了地址变化
      return fnRef.current.apply(this, args);
    };
  }

  return memoizedFn.current;
}

export default useMemoizedFn;
