import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { SignOutButton } from '@clerk/nextjs';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export const Header: React.FC = () => {
  const { t } = useTranslation(['layout', 'common']);
  const router = useRouter();
  const { userRole } = useAuth();
  
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          ThinkForward AI
        </Link>
        
        <div className="flex items-center space-x-4">
          <nav className="flex space-x-4">
            <Link href="/" className="text-gray-600 hover:text-blue-500">
              {t('header.home')}
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-500">
              {t('header.about')}
            </Link>
            <Link href="/services" className="text-gray-600 hover:text-blue-500">
              {t('header.services')}
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-500">
              {t('header.contact')}
            </Link>
          </nav>
          
          <LanguageSwitcher />
          
          {userRole !== UserRole.GUEST ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-500">
                {t('header.dashboard')}
              </Link>
              <SignOutButton>
                <button className="text-gray-600 hover:text-red-500">
                  {t('header.signout')}
                </button>
              </SignOutButton>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/auth/sign-in" className="text-gray-600 hover:text-blue-500">
                {t('header.login')}
              </Link>
              <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                {t('header.register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};