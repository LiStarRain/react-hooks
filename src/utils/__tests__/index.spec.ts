import { isFunction } from '../index';

// 公共的工具函数测试用例
describe('shared utils function', () => {
  it('isFunction', () => {
    expect(isFunction(function foo() {})).toBe(true);
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction([])).toBe(false);
    expect(isFunction({})).toBe(false);
  });
});
