import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'next-i18next';
import { classNames } from '@/utils/classNames';

interface InputProps {
  label?: string;
  type?: string;
  id?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  errorMessage?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  error = false,
  required = false,
  fullWidth = false,
  className = '',
  size = 'md',
  errorMessage,
  prefix,
  suffix,
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
      <div className={classNames(fullWidth ? 'w-full' : 'w-auto', className)}>
        {label && (
          <label 
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className={`${prefixSuffixContainerClass} ${error ? 'border-red-300 focus-within:ring-red-500 focus-within:border-red-500' : ''}`}>
          {prefix && (
            <div className="pl-3 flex items-center pointer-events-none">
              {prefix}
            </div>
          )}
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`block w-full border-0 p-0 focus:ring-0 ${sizeClasses[size]} ${className}`}
            required={required}
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
    <div className={classNames(fullWidth ? 'w-full' : 'w-auto', className)}>
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={classNames(
          'form-input block w-full rounded-md border-gray-300 shadow-sm',
          'focus:border-blue-500 focus:ring-blue-500',
          error ? 'border-red-500' : 'border-gray-300',
          size === 'sm' && 'text-sm px-3 py-2',
          size === 'md' && 'px-4 py-2',
          size === 'lg' && 'px-4 py-3 text-base'
        )}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error && errorMessage ? `${id}-error` : undefined}
      />
      {error && errorMessage && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-600 flex items-center">
          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}; 