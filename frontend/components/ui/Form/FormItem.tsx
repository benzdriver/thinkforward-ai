import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

interface FormItemProps {
  label?: React.ReactNode;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  help?: React.ReactNode;
  className?: string;
  labelClassName?: string;
  children: React.ReactNode;
  layout?: 'vertical' | 'horizontal' | 'inline';
  labelCol?: number;
  wrapperCol?: number;
}

export const FormItem: React.FC<FormItemProps> = ({
  label,
  htmlFor,
  error,
  required = false,
  help,
  className = '',
  labelClassName = '',
  children,
  layout = 'vertical',
  labelCol = 3,
  wrapperCol = 9
}) => {
  const hasError = !!error;
  
  // 布局样式
  const layoutClasses = {
    vertical: 'flex flex-col space-y-1',
    horizontal: `sm:grid sm:grid-cols-12 sm:gap-4 sm:items-start`,
    inline: 'flex flex-row items-center space-x-4'
  };
  
  // 标签样式
  const labelClasses = {
    vertical: '',
    horizontal: `sm:col-span-${labelCol} sm:mt-1.5`,
    inline: 'flex-shrink-0'
  };
  
  // 内容包装器样式
  const wrapperClasses = {
    vertical: '',
    horizontal: `sm:col-span-${wrapperCol}`,
    inline: 'flex-grow'
  };
  
  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className={`block text-sm font-medium text-gray-700 ${labelClasses[layout]} ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={wrapperClasses[layout]}>
        {children}
        
        {hasError && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <ExclamationCircleIcon className="h-4 w-4 mr-1" />
            {error}
          </p>
        )}
        
        {help && !hasError && (
          <p className="mt-2 text-sm text-gray-500">{help}</p>
        )}
      </div>
    </div>
  );
}; 