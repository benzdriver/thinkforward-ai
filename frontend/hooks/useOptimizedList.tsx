import React from 'react';
import { useState, useCallback, useMemo, ReactNode } from 'react';
import { useMediaQuery } from './useMediaQuery';
import { useI18n } from './useI18n';

interface OptimizedListOptions<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  initialBatchSize?: number;
  batchSize?: number;
  threshold?: number; // 滚动阈值
  mobileInitialBatchSize?: number; // 移动端初始批次大小
  mobileBatchSize?: number; // 移动端批次大小
  emptyComponent?: ReactNode; // 空列表时显示的组件
  loadMoreText?: string; // "显示全部"按钮文本
  containerClassName?: string; // 容器类名
  itemClassName?: string; // 项目类名
}

interface OptimizedListResult<T> {
  visibleItems: T[];
  renderOptimizedList: () => JSX.Element;
  resetVisibleCount: () => void;
  showAll: () => void;
  hasMore: boolean;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  totalItems: number; // 总项目数
  loadedItems: number; // 已加载项目数
}

/**
 * 优化列表渲染的hook
 * @param options 列表选项
 * @returns 优化的列表渲染结果
 */
export function useOptimizedList<T>({
  items,
  renderItem,
  keyExtractor,
  initialBatchSize = 20,
  batchSize = 10,
  threshold = 200,
  mobileInitialBatchSize = 10,
  mobileBatchSize = 5,
  emptyComponent,
  loadMoreText,
  containerClassName = "optimized-list-container",
  itemClassName = "optimized-list-item"
}: OptimizedListOptions<T>): OptimizedListResult<T> {
  const { t } = useI18n('common');
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // 根据设备类型确定批次大小
  const actualInitialBatchSize = isMobile ? mobileInitialBatchSize : initialBatchSize;
  const actualBatchSize = isMobile ? mobileBatchSize : batchSize;
  
  // 当前渲染的项目数量
  const [visibleCount, setVisibleCount] = useState<number>(actualInitialBatchSize);
  
  // 处理滚动加载更多
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>): void => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // 当滚动到底部附近时加载更多
    if (scrollHeight - scrollTop - clientHeight < threshold && visibleCount < items.length) {
      setVisibleCount(prev => Math.min(prev + actualBatchSize, items.length));
    }
  }, [items.length, visibleCount, threshold, actualBatchSize]);
  
  // 重置可见数量
  const resetVisibleCount = useCallback((): void => {
    setVisibleCount(actualInitialBatchSize);
  }, [actualInitialBatchSize]);
  
  // 强制显示所有项目
  const showAll = useCallback((): void => {
    setVisibleCount(items.length);
  }, [items.length]);
  
  // 计算可见项目
  const visibleItems = useMemo((): T[] => {
    return items.slice(0, visibleCount);
  }, [items, visibleCount]);
  
  // 渲染优化后的列表
  const renderOptimizedList = useCallback((): JSX.Element => {
    // 处理空列表情况
    if (items.length === 0) {
      return (
        <div className={containerClassName}>
          {emptyComponent || <div className="empty-list">{t('common.no_data')}</div>}
        </div>
      );
    }
    
    return (
      <div className={containerClassName} onScroll={handleScroll}>
        {visibleItems.map((item, index) => (
          <div key={keyExtractor(item, index)} className={itemClassName}>
            {renderItem(item, index)}
          </div>
        ))}
        {visibleCount < items.length && (
          <div className="load-more-indicator">
            <button 
              onClick={showAll}
              className="load-more-button"
            >
              {loadMoreText || t('common.show_all')}
            </button>
          </div>
        )}
      </div>
    );
  }, [
    items,
    visibleItems,
    keyExtractor,
    renderItem,
    handleScroll,
    showAll,
    visibleCount,
    containerClassName,
    itemClassName,
    emptyComponent,
    loadMoreText,
    t
  ]);
  
  return {
    visibleItems,
    renderOptimizedList,
    resetVisibleCount,
    showAll,
    hasMore: visibleCount < items.length,
    handleScroll,
    totalItems: items.length,
    loadedItems: visibleCount
  };
} 