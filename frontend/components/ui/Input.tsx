import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'next-i18next';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'> {
  error?: boolean;
  errorMessage?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Input: React.FC<InputProps> = ({
  className = '',
  error = false,
  errorMessage,
  prefix,
  suffix,
  size = 'md',
  ...props
}) => {
  const { t } = useTranslation();
  
  // 尺寸样式映射
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };
  
  // 前缀/后缀的容器样式
  const prefixSuffixContainerClass = 'flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500';
  
  // 错误状态样式
  const errorClass = error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : '';
  
  // 如果有前缀或后缀，使用容器
  if (prefix || suffix) {
    return (
      <div>
        <div className={`${prefixSuffixContainerClass} ${error ? 'border-red-300 focus-within:ring-red-500 focus-within:border-red-500' : ''}`}>
          {prefix && (
            <div className="pl-3 flex items-center pointer-events-none">
              {prefix}
            </div>
          )}
          <input
            className={`block w-full border-0 p-0 focus:ring-0 ${sizeClasses[size]} ${className}`}
            {...props}
          />
          {suffix && (
            <div className="pr-3 flex items-center">
              {suffix}
            </div>
          )}
        </div>
        {error && errorMessage && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <ExclamationCircleIcon className="h-4 w-4 mr-1" />
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
  
  // 没有前缀或后缀的标准输入框
  return (
    <div>
      <input
        className={`block w-full rounded-md shadow-sm ${
          error
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        } ${sizeClasses[size]} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error && errorMessage ? `${props.id}-error` : undefined}
        {...props}
      />
      {error && errorMessage && (
        <p id={`${props.id}-error`} className="mt-2 text-sm text-red-600 flex items-center">
          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}; 