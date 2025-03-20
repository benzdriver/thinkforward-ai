import { useState, useRef, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { useMediaQuery } from './useMediaQuery';
import React from 'react';

interface VirtualScrollOptions<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  itemHeight: number | ((item: T, index: number) => number);
  overscan?: number; // 额外渲染的项目数量
  scrollingDelay?: number; // 滚动停止延迟
  onEndReached?: () => void; // 滚动到底部回调
  endReachedThreshold?: number; // 触发底部回调的阈值
}

/**
 * 虚拟滚动hook
 */
export function useVirtualScroll<T>({
  items,
  renderItem,
  keyExtractor,
  itemHeight,
  overscan = 5,
  scrollingDelay = 150,
  onEndReached,
  endReachedThreshold = 200
}: VirtualScrollOptions<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // 计算每个项目的高度
  const getItemHeight = useCallback(
    (item: T, index: number) => {
      return typeof itemHeight === 'function' ? itemHeight(item, index) : itemHeight;
    },
    [itemHeight]
  );
  
  // 计算项目位置和高度
  const itemMetadata = useMemo(() => {
    let totalHeight = 0;
    const metadata = items.map((item, index) => {
      const height = getItemHeight(item, index);
      const offsetTop = totalHeight;
      totalHeight += height;
      
      return {
        height,
        offsetTop
      };
    });
    
    return {
      items: metadata,
      totalHeight
    };
  }, [items, getItemHeight]);
  
  // 计算可见范围
  const visibleRange = useMemo(() => {
    if (containerHeight === 0) return { start: 0, end: 10 };
    
    const { items: itemsMetadata } = itemMetadata;
    
    let startIndex = 0;
    while (
      startIndex < itemsMetadata.length &&
      itemsMetadata[startIndex].offsetTop + itemsMetadata[startIndex].height < scrollTop
    ) {
      startIndex++;
    }
    
    // 应用overscan
    startIndex = Math.max(0, startIndex - overscan);
    
    let endIndex = startIndex;
    while (
      endIndex < itemsMetadata.length &&
      itemsMetadata[endIndex].offsetTop < scrollTop + containerHeight
    ) {
      endIndex++;
    }
    
    // 应用overscan
    endIndex = Math.min(itemsMetadata.length - 1, endIndex + overscan);
    
    return {
      start: startIndex,
      end: endIndex
    };
  }, [scrollTop, containerHeight, itemMetadata, overscan]);
  
  // 处理滚动事件
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    
    setScrollTop(scrollTop);
    setIsScrolling(true);
    
    // 清除之前的定时器
    if (scrollingTimeoutRef.current) {
      clearTimeout(scrollingTimeoutRef.current);
    }
    
    // 设置新的定时器
    scrollingTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, scrollingDelay);
    
    // 检查是否滚动到底部
    if (
      onEndReached &&
      scrollHeight - scrollTop - clientHeight < endReachedThreshold
    ) {
      onEndReached();
    }
  }, [scrollingDelay, onEndReached, endReachedThreshold]);
  
  // 监听容器大小变化
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      const { height } = entries[0].contentRect;
      setContainerHeight(height);
    });
    
    resizeObserver.observe(containerRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  
  // 清理定时器
  useEffect(() => {
    return () => {
      if (scrollingTimeoutRef.current) {
        clearTimeout(scrollingTimeoutRef.current);
      }
    };
  }, []);
  
  // 渲染虚拟列表
  const renderVirtualList = useCallback(() => {
    const { start, end } = visibleRange;
    const { totalHeight } = itemMetadata;
    
    // 确保有项目可渲染
    if (items.length === 0 || end < start) {
      return (
        <div
          ref={containerRef}
          className="virtual-scroll-container"
          style={{ overflow: 'auto' }}
        >
          <div>无数据</div>
        </div>
      );
    }
    
    const visibleItems = items.slice(start, end + 1);
    
    return (
      <div
        ref={containerRef}
        className="virtual-scroll-container"
        style={{ overflow: 'auto', willChange: 'transform' }}
        onScroll={handleScroll}
      >
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          {visibleItems.map((item, index) => {
            const actualIndex = start + index;
            // 确保 actualIndex 在有效范围内
            if (actualIndex >= itemMetadata.items.length) return null;
            
            const { offsetTop, height } = itemMetadata.items[actualIndex];
            
            return (
              <div
                key={keyExtractor(item, actualIndex)}
                style={{
                  position: 'absolute',
                  top: `${offsetTop}px`,
                  height: `${height}px`,
                  width: '100%'
                }}
                className={isScrolling ? 'virtual-item-scrolling' : 'virtual-item'}
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [
    visibleRange,
    itemMetadata,
    items,
    handleScroll,
    keyExtractor,
    renderItem,
    isScrolling
  ]);
  
  return {
    containerRef,
    isScrolling,
    renderVirtualList,
    visibleRange,
    scrollTop,
    totalHeight: itemMetadata.totalHeight
  };
} 