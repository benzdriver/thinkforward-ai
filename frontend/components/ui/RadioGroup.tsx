import React from 'react';
import { Radio } from './Radio';
import { useTranslation } from 'next-i18next';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  layout?: 'vertical' | 'horizontal';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  error = false,
  errorMessage,
  className = '',
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
        {options.map((option) => (
          <Radio
            key={option.value}
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={handleChange}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            error={error}
            className={layout === 'horizontal' ? 'mr-4' : ''}
          />
        ))}
      </div>
      
      {error && errorMessage && (
        <p className="mt-2 text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
}; 