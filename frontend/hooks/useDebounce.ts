import { useState, useEffect } from 'react';

/**
 * 创建一个防抖值，在指定延迟后更新
 * 用于减少频繁变化的值（如搜索输入）触发的渲染
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 设置延迟更新
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函数，在下一次 effect 运行前或组件卸载时执行
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
} 