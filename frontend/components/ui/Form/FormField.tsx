import React from 'react';
import { useTranslation } from 'next-i18next';

interface FormFieldProps {
  label?: string;
  name: string;
  required?: boolean;
  error?: string;
  help?: string;
  className?: string;
  children: React.ReactNode;
  labelClassName?: string;
  fieldClassName?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  required = false,
  error,
  help,
  className = '',
  children,
  labelClassName = '',
  fieldClassName = ''
}) => {
  const { t } = useTranslation();
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={fieldClassName}>
        {children}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {help && !error && (
        <p className="mt-1 text-sm text-gray-500">{help}</p>
      )}
    </div>
  );
}; 