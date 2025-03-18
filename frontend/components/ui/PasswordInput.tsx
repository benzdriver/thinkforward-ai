import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'next-i18next';
import { Input } from './Input';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showPasswordToggle?: boolean;
  error?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ 
  showPasswordToggle = true, 
  className = '', 
  error = false,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  
  const { size, ...inputProps } = props;
  
  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={className}
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
  );
}; 