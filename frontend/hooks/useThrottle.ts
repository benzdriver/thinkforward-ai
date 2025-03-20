import { useState, useEffect, useRef } from 'react';

/**
 * 创建一个节流值，在指定间隔内最多更新一次
 * 用于限制高频事件（如滚动、调整大小）的处理频率
 */
export function useThrottle<T>(value: T, interval: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(0);

  useEffect(() => {
    const now = Date.now();
    const shouldUpdate = now - lastUpdated.current >= interval;

    if (shouldUpdate) {
      setThrottledValue(value);
      lastUpdated.current = now;
    } else {
      // 如果不应该立即更新，设置一个定时器在间隔结束时更新
      const timerId = setTimeout(() => {
        setThrottledValue(value);
        lastUpdated.current = Date.now();
      }, interval - (now - lastUpdated.current));

      return () => clearTimeout(timerId);
    }
  }, [value, interval]);

  return throttledValue;
} 