import React, { useEffect } from 'react';
import { useError } from '../../contexts/ErrorContext';
import { Alert } from './Alert';
import { useTranslation } from 'next-i18next';

interface ErrorNotificationProps {
  position?: 'top' | 'bottom';
  autoHideDuration?: number;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  position = 'top',
  autoHideDuration = 5000,
}) => {
  const { error, clearError } = useError();
  const { t } = useTranslation(['common']);

  useEffect(() => {
    if (error && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        clearError();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [error, clearError, autoHideDuration]);

  if (!error) return null;

  const title = error.title ?? t('error.default_title');
  const message = error.message || t('error.default_message');

  return (
    <div
      className={`fixed left-0 right-0 z-50 mx-auto w-full max-w-md px-4 ${
        position === 'top' ? 'top-4' : 'bottom-4'
      }`}
    >
      <Alert
        type="error"
        title={title}
        message={message}
        onClose={clearError}
        showIcon
      />
    </div>
  );
}; 