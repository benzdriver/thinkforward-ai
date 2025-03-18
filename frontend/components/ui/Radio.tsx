import React from 'react';
import { useTranslation } from 'next-i18next';

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: boolean;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  description,
  className = '',
  error = false,
  ...props
}) => {
  const { t } = useTranslation();
  
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="radio"
          className={`h-4 w-4 ${
            error
              ? 'border-red-300 text-red-600 focus:ring-red-500'
              : 'border-gray-300 text-blue-600 focus:ring-blue-500'
          } ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={props['aria-label'] || label || t('components.radio.ariaLabel') || ''}
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="ml-3 text-sm">
          {label && (
            <label
              htmlFor={props.id}
              className={`font-medium ${
                error ? 'text-red-700' : 'text-gray-700'
              } ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {label}
            </label>
          )}
          {description && (
            <p className={`text-gray-500 ${props.disabled ? 'opacity-50' : ''}`}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}; 