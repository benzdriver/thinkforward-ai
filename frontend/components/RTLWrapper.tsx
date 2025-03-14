import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface RTLWrapperProps {
  children: ReactNode;
}

export const RTLWrapper = ({ children }: RTLWrapperProps) => {
  const { i18n } = useTranslation();
  const router = useRouter();
  
  useEffect(() => {
    // Set the direction based on the current language
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n, router.locale]);

  return (
    <div className={i18n.dir() === 'rtl' ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
};

export default RTLWrapper; 