/**
 * @description 检测传入值是否是一个函数
 * @param {*} obj 需要检测的值
 * @author lixingyu
 */
export default function isFunction(obj: any): obj is Function {
  return typeof obj === 'function';
}
