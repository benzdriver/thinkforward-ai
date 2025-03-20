import React from 'react';
import classNames from 'classnames';
import { LoadingSpinner } from './LoadingSpinner';

export interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
  blur?: boolean;
  spinnerSize?: 'small' | 'medium' | 'large';
  className?: string;
  overlayClassName?: string;
  spinnerClassName?: string;
}

/**
 * 覆盖加载状态组件，用于在内容上显示加载状态
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  text,
  blur = true,
  spinnerSize = 'medium',
  className,
  overlayClassName,
  spinnerClassName
}) => {
  return (
    <div className={classNames('relative', className)}>
      {children}
      
      {isLoading && (
        <div
          className={classNames(
            'absolute inset-0 flex flex-col items-center justify-center z-10',
            blur ? 'backdrop-blur-sm' : '',
            'bg-white/70 dark:bg-gray-900/70',
            overlayClassName
          )}
        >
          <LoadingSpinner 
            size={spinnerSize} 
            color="primary" 
            className={spinnerClassName} 
          />
          {text && (
            <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {text}
            </p>
          )}
        </div>
      )}
    </div>
  );
}; 