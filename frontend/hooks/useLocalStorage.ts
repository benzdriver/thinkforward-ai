import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const { t } = useTranslation(['error', 'common']);
  
  // 获取初始值
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(t('localStorage.read_error', { key }), error);
      return initialValue;
    }
  };

  // 状态管理
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 返回一个包装版的 setState 函数
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 允许值是一个函数，类似于 useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // 保存到 state
      setStoredValue(valueToStore);
      
      // 保存到 localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(t('localStorage.write_error', { key }), error);
    }
  };

  // 监听其他标签页的变化
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    // 监听 storage 事件
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}
