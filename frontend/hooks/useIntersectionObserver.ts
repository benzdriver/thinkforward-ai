import { useState, useEffect, useRef, RefObject } from 'react';

interface IntersectionOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * 使用 Intersection Observer API 检测元素是否在视口中
 * 用于实现懒加载、无限滚动等功能
 */
export function useIntersectionObserver(
  options: IntersectionOptions = {}
): [RefObject<HTMLElement>, boolean] {
  const { 
    threshold = 0, 
    root = null, 
    rootMargin = '0px', 
    freezeOnceVisible = false 
  } = options;
  
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    
    // 如果元素不存在，或者已经可见且设置了冻结，则不执行
    if (!element || (freezeOnceVisible && isVisible)) {
      return;
    }

    // 创建观察者回调
    const observerCallback: IntersectionObserverCallback = ([entry]) => {
      setIsVisible(entry.isIntersecting);
    };

    // 创建观察者
    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      root,
      rootMargin,
    });

    // 开始观察
    observer.observe(element);

    // 清理函数
    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, freezeOnceVisible, isVisible]);

  return [elementRef as RefObject<HTMLElement>, isVisible];
} 