export default function isFunction(obj: any): obj is Function {
  return typeof obj === 'function';
}
