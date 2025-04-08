import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface BilingualToggleProps {
  className?: string;
}

export const BilingualToggle: React.FC<BilingualToggleProps> = ({ 
  className = '' 
}) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { pathname, asPath, query } = router;
  
  const switchLanguage = (locale: string) => {
    router.push({ pathname, query }, asPath, { locale });
  };
  
  return (
    <div className={`bilingual-toggle ${className}`}>
      <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => switchLanguage('en')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
            router.locale === 'en' 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Switch to English"
        >
          English
        </button>
        <button
          onClick={() => switchLanguage('fr')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
            router.locale === 'fr' 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Switch to French"
        >
          Français
        </button>
      </div>
    </div>
  );
};

export default BilingualToggle; 