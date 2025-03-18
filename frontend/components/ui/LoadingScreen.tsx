import React from 'react';
import { useTranslation } from 'next-i18next';

interface LoadingScreenProps {
  message?: string;
}

/**
 * LoadingScreen component
 * Displays a loading spinner with an optional message
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  const { t } = useTranslation('common');
  const defaultMessage = t('components.loading.message', { defaultValue: 'Loading...' });
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-600">{message || defaultMessage}</p>
    </div>
  );
};
