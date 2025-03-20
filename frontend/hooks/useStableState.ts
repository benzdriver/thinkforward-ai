import { useState, useCallback, useRef, useEffect } from 'react';
import isEqual from 'lodash/isEqual';

/**
 * 稳定状态hook，只在值真正变化时更新状态
 * @param initialValue 初始值
 * @param compareFn 比较函数，默认使用lodash的isEqual
 */
export function useStableState<T>(
  initialValue: T,
  compareFn: (a: T, b: T) => boolean = isEqual
) {
  const [state, setState] = useState<T>(initialValue);
  const previousValueRef = useRef<T>(initialValue);
  
  // 只在值真正变化时更新状态
  const setStableState = useCallback(
    (newValue: T | ((prevState: T) => T)) => {
      // 处理函数形式的状态更新
      if (typeof newValue === 'function') {
        setState(prevState => {
          const resolvedNewValue = (newValue as ((prevState: T) => T))(prevState);
          if (!compareFn(prevState, resolvedNewValue)) {
            previousValueRef.current = resolvedNewValue;
            return resolvedNewValue;
          }
          return prevState;
        });
      } else {
        // 处理直接值的状态更新
        setState(prevState => {
          if (!compareFn(prevState, newValue)) {
            previousValueRef.current = newValue;
            return newValue;
          }
          return prevState;
        });
      }
    },
    [compareFn]
  );
  
  // 当比较函数变化时，重新检查当前值
  useEffect(() => {
    if (!compareFn(previousValueRef.current, state)) {
      previousValueRef.current = state;
    }
  }, [compareFn, state]);
  
  return [state, setStableState] as const;
}

/**
 * 使用引用相等性比较的稳定状态hook
 * 适用于原始类型值
 */
export function useStableStateReference<T>(initialValue: T) {
  return useStableState<T>(initialValue, (a, b) => Object.is(a, b));
}

/**
 * 使用浅比较的稳定状态hook
 * 适用于对象和数组的一级属性比较
 */
export function useStableStateShallow<T>(initialValue: T) {
  return useStableState<T>(initialValue, (a, b) => {
    if (a === b) return true;
    if (a === null || b === null) return a === b;
    if (typeof a !== 'object' || typeof b !== 'object') return a === b;
    
    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);
    
    if (keysA.length !== keysB.length) return false;
    
    return keysA.every(key => 
      Object.prototype.hasOwnProperty.call(b, key) && 
      Object.is((a as any)[key], (b as any)[key])
    );
  });
} 