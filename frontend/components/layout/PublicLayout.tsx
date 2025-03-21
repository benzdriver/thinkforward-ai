import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import { ResponsiveNavigation } from '@/components/navigation/ResponsiveNavigation';
import { Footer } from './Footer';
import { RTLWrapper } from './RTLWrapper';
import Head from 'next/head';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { SignOutButton } from '@clerk/nextjs';

interface PublicLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  navigation?: React.ReactNode;
  className?: string;
  titleKey?: string;
  defaultTitle?: string;
  namespace?: string | string[];
  suffix?: string;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ 
  children, 
  titleKey,
  defaultTitle,
  namespace = ['layout', 'common', 'navigation'],
  suffix = '| ThinkForward AI'
}) => {
  const { t } = useTranslation(['layout', 'common', 'navigation']);
  const { userRole } = useAuth();
  const router = useRouter();
  
  // 导航项
  const navigationItems = [
    { key: 'home', label: 'navigation:items.home', href: '/' },
    { key: 'about', label: 'navigation:items.about', href: '/about' },
    { key: 'services', label: 'navigation:items.services', href: '/services' },
    { key: 'contact', label: 'navigation:items.contact', href: '/contact' },
  ];
  
  // 处理页面标题逻辑
  const title = titleKey 
    ? `${t(titleKey)} ${suffix}` 
    : defaultTitle 
      ? `${defaultTitle} ${suffix}` 
      : `ThinkForward AI - ${t('public.site_title')}`;
  
  // 导航栏右侧操作按钮
  const navActions = (
    <div className="flex items-center space-x-4">
      <LanguageSwitcher />
      
      {userRole !== UserRole.GUEST ? (
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-blue-500">
            {t('navigation:actions.dashboard')}
          </Link>
          <SignOutButton>
            <button className="text-gray-600 hover:text-red-500">
              {t('navigation:actions.signout')}
            </button>
          </SignOutButton>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Link href="/auth/sign-in" className="text-gray-600 hover:text-blue-500">
            {t('navigation:actions.login')}
          </Link>
          <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            {t('navigation:actions.register')}
          </Link>
        </div>
      )}
    </div>
  );
  
  // Logo组件
  const logo = (
    <Link href="/" className="text-xl font-bold text-blue-600">
      ThinkForward AI
    </Link>
  );
  
  return (
    <RTLWrapper>
      <Head>
        <title>{title}</title>
        <meta name="description" content={t('layout:public.meta_description') as string} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ResponsiveNavigation 
          items={navigationItems} 
          logo={logo}
          actions={navActions}
          className="bg-white shadow"
        />
        <main className="flex-grow py-6 sm:py-8 lg:py-10">
          {children}
        </main>
        <Footer />
      </div>
    </RTLWrapper>
  );
}; 