import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'next-i18next';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  error?: boolean;
  errorMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  className = '',
  error = false,
  errorMessage,
  size = 'md',
  placeholder,
  ...props
}) => {
  const { t } = useTranslation();
  
  // 尺寸样式映射
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };
  
  return (
    <div>
      <select
        className={`block w-full rounded-md shadow-sm ${
          error
            ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        } ${sizeClasses[size]} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error && errorMessage ? `${props.id}-error` : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error && errorMessage && (
        <p id={`${props.id}-error`} className="mt-2 text-sm text-red-600 flex items-center">
          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}; 