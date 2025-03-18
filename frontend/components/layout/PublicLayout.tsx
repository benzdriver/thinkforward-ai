import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import { Header } from './Header';
import { Footer } from './Footer';
import { RTLWrapper } from './RTLWrapper';
import Head from 'next/head';

interface PublicLayoutProps {
  children: React.ReactNode;
  titleKey?: string;
  defaultTitle?: string;
  namespace?: string | string[];
  suffix?: string;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ 
  children, 
  titleKey,
  defaultTitle,
  namespace = ['layout', 'common'],
  suffix = '| ThinkForward AI'
}) => {
  const { t } = useTranslation(['layout', 'common']);
  const { userRole } = useAuth();
  const router = useRouter();
  
  // 处理页面标题逻辑 (从PageTitle组件整合)
  const title = titleKey 
    ? `${t(titleKey)} ${suffix}` 
    : defaultTitle 
      ? `${defaultTitle} ${suffix}` 
      : `ThinkForward AI - ${t('public.site_title')}`;
  
  return (
    <RTLWrapper>
      <Head>
        <title>{title}</title>
        <meta name="description" content={t('layout:public.meta_description') as string} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow py-6 sm:py-8 lg:py-10">
          {children}
        </main>
        <Footer />
      </div>
    </RTLWrapper>
  );
}; 