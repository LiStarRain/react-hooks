/**
 * @description 判断传入的值是否是一个函数
 * @param {unknown} value 需要判断的值
 * @returns {boolean} 若返回true，则传入的值是一个函数；反之，则不是
 */
function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

export default isFunction;
