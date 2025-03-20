import { useState, useEffect } from 'react';

/**
 * 用于响应式设计的媒体查询 hook
 * 返回一个布尔值，表示当前是否匹配指定的媒体查询
 */
export function useMediaQuery(query: string): boolean {
  // 默认为 false，避免服务器渲染不匹配
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // 确保在浏览器环境中运行
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia(query);
      
      // 设置初始值
      setMatches(mediaQuery.matches);

      // 创建事件监听器
      const handleChange = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      // 添加事件监听
      mediaQuery.addEventListener('change', handleChange);

      // 清理函数
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [query]);

  return matches;
} 