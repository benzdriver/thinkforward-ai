import { useCallback } from 'react';
import { toast, ToastOptions } from '@/components/ui/Toast';
import { useTranslation } from 'next-i18next';

export function useToast() {
  const { t } = useTranslation('common');
  
  const success = useCallback((messageKey: string, options?: ToastOptions & { values?: Record<string, any> }) => {
    const message = options?.values ? t(messageKey, options.values) : t(messageKey);
    toast.success(message, options);
  }, [t]);

  const error = useCallback((messageKey: string, options?: ToastOptions & { values?: Record<string, any> }) => {
    const message = options?.values ? t(messageKey, options.values) : t(messageKey);
    toast.error(message, options);
  }, [t]);

  const info = useCallback((messageKey: string, options?: ToastOptions & { values?: Record<string, any> }) => {
    const message = options?.values ? t(messageKey, options.values) : t(messageKey);
    toast.info(message, options);
  }, [t]);

  const warning = useCallback((messageKey: string, options?: ToastOptions & { values?: Record<string, any> }) => {
    const message = options?.values ? t(messageKey, options.values) : t(messageKey);
    toast.warning(message, options);
  }, [t]);

  return {
    success,
    error,
    info,
    warning,
  };
}
