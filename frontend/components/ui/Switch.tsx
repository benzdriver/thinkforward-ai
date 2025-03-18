import React from 'react';
import { useTranslation } from 'next-i18next';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  size = 'md',
  ariaLabel
}) => {
  const { t } = useTranslation();
  
  // 尺寸样式映射
  const sizeClasses = {
    sm: {
      switch: 'h-4 w-8',
      dot: 'h-3 w-3',
      translate: checked ? 'translate-x-4' : 'translate-x-0.5'
    },
    md: {
      switch: 'h-6 w-11',
      dot: 'h-5 w-5',
      translate: checked ? 'translate-x-5' : 'translate-x-0'
    },
    lg: {
      switch: 'h-8 w-14',
      dot: 'h-7 w-7',
      translate: checked ? 'translate-x-6' : 'translate-x-0'
    }
  };
  
  const defaultAriaLabel = ariaLabel || (checked 
    ? t('components.switch.ariaLabel.on', 'Switch is on') 
    : t('components.switch.ariaLabel.off', 'Switch is off'));
  
  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        className={`${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex flex-shrink-0 ${sizeClasses[size].switch} border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        role="switch"
        aria-checked={checked}
        aria-label={defaultAriaLabel || ''}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
      >
        <span
          className={`${
            sizeClasses[size].translate
          } pointer-events-none inline-block ${sizeClasses[size].dot} rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
        />
      </button>
      {label && (
        <span className="ml-3 text-sm">
          <span className="text-gray-900">{label}</span>
        </span>
      )}
    </div>
  );
}; 