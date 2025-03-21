import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'next-i18next';
import { Input } from './Input';
import { classNames } from '@/utils/classNames';

interface PasswordInputProps {
  label?: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
  showPasswordToggle?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ 
  showPasswordToggle = true, 
  className = '', 
  error = false,
  required = false,
  fullWidth = false,
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  ...inputProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  
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
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={classNames(
            'form-input block w-full rounded-md border-gray-300 shadow-sm',
            'focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
            error ? 'border-red-500' : 'border-gray-300'
          )}
          error={error}
          size="md"
          {...inputProps}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={String(showPassword ? t('components.form.passwordToggle.hide') : t('components.form.passwordToggle.show'))}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}; 