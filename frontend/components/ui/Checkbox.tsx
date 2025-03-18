import React from 'react';
import { useTranslation } from 'next-i18next';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: boolean;
  indeterminate?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  className = '',
  error = false,
  indeterminate = false,
  ...props
}) => {
  const { t } = useTranslation();
  const checkboxRef = React.useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);
  
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          ref={checkboxRef}
          type="checkbox"
          className={`h-4 w-4 rounded ${
            error
              ? 'border-red-300 text-red-600 focus:ring-red-500'
              : 'border-gray-300 text-blue-600 focus:ring-blue-500'
          } ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={props['aria-label'] || label || t('components.checkbox.ariaLabel') || ''}
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