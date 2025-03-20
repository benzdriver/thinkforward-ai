import React from 'react';
import { useTranslation } from 'next-i18next';

type ButtonVariant = 
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'link'
  | 'ghost'
  | 'white'
  | 'text'
  | 'icon';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const { t } = useTranslation();
  
  // 变体样式映射
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    outline: 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    white: 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
    info: 'bg-blue-400 hover:bg-blue-500 text-white focus:ring-blue-400',
    light: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-200',
    dark: 'bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-700',
    link: 'bg-transparent text-blue-600 hover:text-blue-800 hover:underline focus:ring-blue-300',
    text: 'bg-transparent hover:bg-transparent text-gray-700 hover:text-gray-900 shadow-none border-none',
    icon: 'bg-transparent hover:bg-gray-100 text-gray-700 rounded-full p-2 shadow-none border-none focus:ring-gray-300'
  };

  // 尺寸样式映射
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base'
  };

  // 禁用状态样式
  const disabledClass = (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : '';
  
  // 全宽样式
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`inline-flex items-center justify-center border border-transparent rounded-md font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-label={t('components.button.loading', 'Loading...') || 'Loading...'}>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {icon && iconPosition === 'left' && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

// 图标按钮
interface IconButtonProps extends Omit<ButtonProps, 'icon'> {
  icon: React.ReactNode;
  ariaLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  ariaLabel,
  variant = 'light',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeMap: Record<ButtonSize, string> = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3'
  };
  
  return (
    <Button
      variant={variant}
      aria-label={ariaLabel}
      className={`${sizeMap[size]} ${className}`}
      {...props}
    >
      {icon}
    </Button>
  );
};

// 按钮组
interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  vertical?: boolean;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className = '',
  vertical = false
}) => {
  return (
    <div
      className={`
        inline-flex ${vertical ? 'flex-col' : 'flex-row'}
        ${vertical ? 'space-y-1' : 'space-x-1'}
        ${className}
      `}
      role="group"
    >
      {children}
    </div>
  );
};