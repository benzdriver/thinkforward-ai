import React, {
    lazy,
    Suspense,
    ComponentType,
    ReactNode,
    ComponentProps,
    FC
  } from 'react';
  import { useI18n } from './useI18n';
  
  interface LazyComponentOptions {
    fallback?: ReactNode;
    errorComponent?: ReactNode;
    minDelay?: number; // 最小延迟时间，防止闪烁
  }
  
  interface ErrorBoundaryProps {
    fallback: ReactNode;
    children: ReactNode;
  }
  
  interface ErrorBoundaryState {
    hasError: boolean;
  }
  
  // 错误边界组件
  class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(): ErrorBoundaryState {
      return { hasError: true };
    }
  
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
      console.error('Lazy component error:', error, errorInfo);
    }
  
    render(): ReactNode {
      if (this.state.hasError) {
        return this.props.fallback;
      }
      return this.props.children;
    }
  }
  
  /**
   * 创建懒加载组件
   * @param factory 组件导入函数
   * @param options 懒加载选项
   * @returns 带有Suspense和ErrorBoundary的懒加载组件
   */
  export function useLazyComponent<T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>,
    options: LazyComponentOptions = {}
  ): FC<ComponentProps<T>> {
    const { t } = useI18n('common');
    const {
      fallback = <div className="lazy-loading">{t('loading')}</div>,
      errorComponent = <div className="lazy-error">{t('error.loading_component')}</div>,
      minDelay = 0
    } = options;
  
    // lazy() 内部：Promise.all 用来实现“最小延迟 + 异步加载”
    const LazyComponent = lazy(async () => {
      try {
        const [module] = await Promise.all([
          factory(),
          new Promise<void>((resolve) => setTimeout(resolve, minDelay))
        ]);
        return module;
      } catch (error) {
        // 用类型断言确保“默认导出”与 T 相匹配，避免编译报错
        return {
          default: (() => errorComponent) as unknown as T
        };
      }
    });
  
    // 最终返回一个真正可渲染的 React 组件
    return (props) => (
      <Suspense fallback={fallback}>
        <ErrorBoundary fallback={errorComponent}>
          <LazyComponent {...props} />
        </ErrorBoundary>
      </Suspense>
    );
  }
  