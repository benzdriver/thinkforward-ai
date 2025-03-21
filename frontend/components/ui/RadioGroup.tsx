import React from 'react';
import { Radio } from './Radio';
import { useTranslation } from 'next-i18next';
import { RadioOption } from './RadioOption';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  layout?: 'vertical' | 'horizontal';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  className = '',
  children,
  label,
  error = false,
  errorMessage,
  layout = 'vertical'
}) => {
  const { t } = useTranslation();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className={`space-${layout === 'vertical' ? 'y' : 'x'}-4 ${layout === 'horizontal' ? 'flex items-center' : ''}`}>
        {children}
      </div>
      
      {error && errorMessage && (
        <p className="mt-2 text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
}; 