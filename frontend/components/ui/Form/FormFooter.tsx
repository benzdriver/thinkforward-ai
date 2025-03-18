import React from 'react';
import { useTranslation } from 'next-i18next';

interface FormFooterProps {
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  submitButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  cancelButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  children?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export const FormFooter: React.FC<FormFooterProps> = ({
  submitText,
  cancelText,
  onCancel,
  loading = false,
  disabled = false,
  className = '',
  submitButtonProps = {},
  cancelButtonProps = {},
  children,
  align = 'right'
}) => {
  const { t } = useTranslation();
  
  const defaultSubmitText = t('components.form.submit', 'Submit');
  const defaultCancelText = t('components.form.cancel', 'Cancel');
  
  // 对齐样式
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };
  
  return (
    <div className={`flex ${alignClasses[align]} space-x-3 ${className}`}>
      {children || (
        <>
          {onCancel && (
            <button
              type="button"
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onCancel}
              disabled={loading || disabled}
              {...cancelButtonProps}
            >
              {cancelText || defaultCancelText}
            </button>
          )}
          
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading || disabled}
            {...submitButtonProps}
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {submitText || defaultSubmitText}
          </button>
        </>
      )}
    </div>
  );
}; 