import React from 'react';
import { useTranslation } from 'next-i18next';
import { Spinner } from '@/components/ui/Spinner';

interface LoadingScreenProps {
  message?: string;
  translationKey?: string;
}

/**
 * LoadingScreen component
 * Displays a loading spinner with an optional message
 */
export function LoadingScreen({ 
  message,
  translationKey = 'common:loading' 
}: LoadingScreenProps) {
  const { t } = useTranslation();
  
  // 如果提供了自定义消息，使用它；否则使用翻译键
  const displayMessage = message || t(translationKey);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50">
      <Spinner size="large" />
      <p className="mt-4 text-gray-600 dark:text-gray-300">{displayMessage}</p>
    </div>
  );
}
