import type { DependencyList } from 'react';

/**
 * @description 检测前后的依赖项是否相等
 * @author lixingyu
 */
export default function depsAreSame(oldDeps: DependencyList, deps: DependencyList): boolean {
  // 依赖项数组地址相等的话认为依赖项并没有改变
  if (oldDeps === deps) return true;

  // 将老的依赖项与新的依赖项数组中的依赖项进行比较
  for (let i = 0; i < oldDeps.length; i++) {
    // 这里引用类型的值的检测之后判断其地址是否相等
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }

  // 如果老的依赖项是空数组的话,认为无论何时都与新依赖项相等(不根据依赖项而进行重新计算值)
  return true;
}
