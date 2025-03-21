/**
 * 合并多个 CSS 类名
 * @param classes 可选的类名参数
 * @returns 合并后的类名字符串
 */
export function classNames(...classes: Array<string | undefined | boolean>): string {
  return classes.filter(Boolean).join(' ');
} 