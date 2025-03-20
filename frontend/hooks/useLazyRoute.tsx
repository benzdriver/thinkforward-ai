import React, { useCallback, useEffect, useState, ComponentType, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useLazyComponent } from './useLazyComponent';
import { useI18n } from './useI18n';

type ComponentOrLoader<T extends ComponentType<any>> = 
  | ComponentType<React.ComponentProps<T>>
  | (() => JSX.Element);

interface LazyRouteOptions {
  minDelay?: number;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
}

interface LazyRouteResult<T extends ComponentType<any>> {
  Component: ComponentOrLoader<T>;
  isLoading: boolean;
  error: Error | null;
  retry: () => void;
}

/**
 * 用于路由级别懒加载的hook
 * @param getComponent 获取组件的函数
 * @param loadingCondition 加载条件，默认为true
 * @param options 懒加载选项
 * @returns 包含懒加载组件和状态的对象
 */
export function useLazyRoute<T extends ComponentType<any>>(
  getComponent: () => Promise<{ default: T }>,
  loadingCondition: boolean = true,
  options: LazyRouteOptions = {}
): LazyRouteResult<T> {
  const router = useRouter();
  const { t } = useI18n('common');
  const [shouldLoad, setShouldLoad] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  
  const { 
    minDelay = 100,
    loadingComponent,
    errorComponent
  } = options;
  
  // 当路由准备好且满足加载条件时，设置shouldLoad为true
  useEffect(() => {
    if (router.isReady && loadingCondition) {
      setShouldLoad(true);
    }
  }, [router.isReady, loadingCondition]);
  
  // 重试加载
  const retry = useCallback(() => {
    setError(null);
    setRetryCount(prev => prev + 1);
  }, []);
  
  // 包装getComponent以捕获错误
  const safeGetComponent = useCallback(async () => {
    try {
      return await getComponent();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }, [getComponent, retryCount]);
  
  // 使用useLazyComponent创建懒加载组件
  const LazyComponent = useLazyComponent(safeGetComponent, {
    minDelay,
    fallback: loadingComponent || <div className="lazy-loading">{t('common.loading')}</div>,
    errorComponent: errorComponent || (
      <div className="lazy-error">
        <p>{t('error.loading_component')}</p>
        <button onClick={retry}>{t('common.retry')}</button>
      </div>
    )
  });
  
  const Loader: React.FC = () => loadingComponent || <div className="lazy-loading">{t('common.loading')}</div>;
  
  return {
    Component: shouldLoad ? LazyComponent : Loader,
    isLoading: !shouldLoad,
    error,
    retry
  };
} 