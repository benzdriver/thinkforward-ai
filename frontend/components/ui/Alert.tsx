import React from 'react';
import { useTranslation } from 'next-i18next';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';

type AlertType = 'success' | 'info' | 'warning' | 'error';

interface AlertProps {
  type?: AlertType;
  message: React.ReactNode;
  description?: React.ReactNode;
  showIcon?: boolean;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
  /** 是否使用左边框样式 (ErrorAlert风格) */
  leftBorder?: boolean;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  message,
  description,
  showIcon = true,
  closable = false,
  onClose,
  className = '',
  children,
  leftBorder = false
}) => {
  const { t } = useTranslation(['common']);
  
  // 类型样式映射
  const typeClasses = {
    success: leftBorder 
      ? 'bg-green-50 border-l-4 border-green-600 text-green-700' 
      : 'bg-green-50 text-green-800 border-green-200',
    info: leftBorder 
      ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-700' 
      : 'bg-blue-50 text-blue-800 border-blue-200',
    warning: leftBorder 
      ? 'bg-yellow-50 border-l-4 border-yellow-600 text-yellow-700' 
      : 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: leftBorder 
      ? 'bg-red-50 border-l-4 border-red-600 text-red-700' 
      : 'bg-red-50 text-red-800 border-red-200'
  };
  
  // 图标映射
  const icons = {
    success: <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />,
    info: <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />,
    warning: <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />,
    error: <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
  };
  
  const borderClass = leftBorder ? '' : 'border';
  
  return (
    <div className={`rounded-md ${borderClass} p-4 ${typeClasses[type]} ${className}`} role="alert">
      <div className="flex items-start">
        {showIcon && <div className="flex-shrink-0">{icons[type]}</div>}
        <div className={`${showIcon ? 'ml-3' : ''} flex-1`}>
          <div className="text-sm font-medium">{message}</div>
          {description && <div className="mt-2 text-sm">{description}</div>}
          {children}
        </div>
        {closable && onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  type === 'success' ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' :
                  type === 'info' ? 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600' :
                  type === 'warning' ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600' :
                  'text-red-500 hover:bg-red-100 focus:ring-red-600'
                }`}
                onClick={onClose}
                aria-label={t('components.alert.close', 'Close') as string}
              >
                <span className="sr-only">{t('components.alert.close', 'Close')}</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ErrorAlert component - 兼容层
 * 使用Alert组件实现，保持与原ErrorAlert相同的API
 */
export const ErrorAlert: React.FC<{ message: string; onClose?: () => void }> = ({ 
  message, 
  onClose 
}) => {
  return (
    <Alert
      type="error"
      message={message}
      closable={!!onClose}
      onClose={onClose}
      leftBorder={true}
      className="shadow-sm mb-6"
    />
  );
};

