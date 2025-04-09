import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { Spinner } from '@/components/ui/Spinner';

interface LoadingScreenProps {
  message?: string;
  translationKey?: string;
}

/**
 * LoadingScreen component
 * Displays a loading spinner with an optional message
 * Uses a hydration-safe approach to prevent React hydration errors
 */
export function LoadingScreen({ 
  message,
  translationKey = 'common:loading' 
}: LoadingScreenProps) {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  
  const serverMessage = message || "Loading...";
  
  const clientMessage = message || t(translationKey);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const displayMessage = isClient ? clientMessage : serverMessage;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50">
      <Spinner size="large" />
      <p className="mt-4 text-gray-600 dark:text-gray-300">{displayMessage}</p>
    </div>
  );
}
