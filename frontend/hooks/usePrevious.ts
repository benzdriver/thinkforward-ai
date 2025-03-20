import { useRef, useEffect } from 'react';

/**
 * 保存并返回前一个渲染周期中的值
 * 用于比较当前值和前一个值
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
} 