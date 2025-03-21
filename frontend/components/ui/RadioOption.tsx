import React from 'react';
import { Radio } from './Radio';

interface RadioOptionProps {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  className?: string;
}

export const RadioOption: React.FC<RadioOptionProps> = ({
  value,
  label,
  description,
  disabled = false,
  checked = false,
  onChange,
  error = false,
  className = '',
}) => {
  return (
    <Radio
      id={`radio-${value}`}
      name="radio-group"
      value={value}
      checked={checked}
      onChange={onChange}
      label={label}
      description={description}
      disabled={disabled}
      error={error}
      className={className}
    />
  );
}; 