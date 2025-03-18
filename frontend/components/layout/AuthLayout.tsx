import React from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { RTLWrapper } from './RTLWrapper';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle
}) => {
  const { t } = useTranslation(['auth', 'common', 'layout']);
  
  return (
    <RTLWrapper>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="ThinkForward AI"
              width={180}
              height={48}
            />
          </div>
          
          {title && (
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {title}
            </h2>
          )}
          
          {subtitle && (
            <p className="mt-2 text-center text-sm text-gray-600">
              {subtitle}
            </p>
          )}
          
          <div className="absolute top-4 right-4">
            <LanguageSwitcher />
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          {children}
        </div>
      </div>
    </RTLWrapper>
  );
}; 