import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import {
  HomeIcon,
  UsersIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { ErrorBoundary } from '@/components/error';
import { RTLWrapper } from './RTLWrapper';
import { UserRole } from '@/types/user';
import { Button, Avatar, LanguageSwitcher, LoadingIndicator } from '@/components/ui';

interface AdminLayoutProps {
  children: React.ReactNode;
  titleKey?: string;
  defaultTitle?: string;
  namespace?: string | string[];
  suffix?: string;
}

export const AdminLayout = ({ 
  children,
  titleKey,
  defaultTitle = 'Admin Dashboard',
  namespace = ['admin', 'common', 'layout'],
  suffix = '| ThinkForward AI'
}: AdminLayoutProps) => {
  const { t } = useTranslation(['admin', 'common', 'layout']);
  const { user, signOut, userRole, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // 处理页面标题逻辑
  const title = titleKey 
    ? `${t(titleKey)} ${suffix}` 
    : defaultTitle 
      ? `${defaultTitle} ${suffix}` 
      : `ThinkForward AI - ${t('admin.dashboard_title')}`;
  
  const navigation = [
    { 
      name: t('navigation.dashboard'), 
      href: '/admin/dashboard', 
      icon: HomeIcon, 
      current: router.pathname === '/admin/dashboard' 
    },
    { 
      name: t('navigation.users'), 
      href: '/admin/users', 
      icon: UsersIcon, 
      current: router.pathname.startsWith('/admin/users') 
    },
    { 
      name: t('navigation.permissions'), 
      href: '/admin/permissions', 
      icon: ShieldCheckIcon, 
      current: router.pathname === '/admin/permissions' 
    },
    { 
      name: t('navigation.subscriptions'), 
      href: '/admin/subscriptions', 
      icon: CreditCardIcon, 
      current: router.pathname.startsWith('/admin/subscriptions') 
    },
    { 
      name: t('navigation.analytics'), 
      href: '/admin/analytics', 
      icon: ChartBarIcon, 
      current: router.pathname === '/admin/analytics' 
    },
    { 
      name: t('navigation.settings'), 
      href: '/admin/settings', 
      icon: Cog6ToothIcon, 
      current: router.pathname === '/admin/settings' 
    },
  ];

  useEffect(() => {
    if (!isLoading && userRole !== UserRole.ADMIN) {
      router.push('/dashboard'); // 非管理员重定向
    }
  }, [userRole, isLoading]);
  
  if (isLoading) return <LoadingIndicator />;
  if (userRole !== UserRole.ADMIN) return null;

  // 用户资料组件
  const UserProfile = () => (
    <div className="flex-shrink-0 w-full group block">
      <div className="flex items-center">
        <Avatar
          src={user?.profileImageUrl}
          alt={user?.firstName || 'User'}
          text={user?.firstName?.charAt(0) || 'U'}
          size="md"
        />
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-700">
            {user?.firstName} {user?.lastName}
          </p>
          <Button
            variant="text"
            size="sm"
            onClick={signOut}
            className="text-xs font-medium text-gray-500 hover:text-gray-700 p-0"
          >
            {t('common:auth.sign_out')}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <RTLWrapper>
      <Head>
        <title>{title}</title>
        <meta name="description" content={t('layout:admin.meta_description') as string} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar */}
        <div className="lg:hidden">
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 flex">
              <div 
                className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-in-out duration-300" 
                onClick={() => setSidebarOpen(false)}
              ></div>
              
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transition-transform ease-in-out duration-300">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <Button
                    variant="icon"
                    aria-label={t('common:actions.close') as string}
                    onClick={() => setSidebarOpen(false)}
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  >
                    <XMarkIcon className="h-6 w-6 text-white" />
                  </Button>
                </div>
                
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex-shrink-0 flex items-center px-4">
                    <Image
                      src="/logo.png"
                      alt="ThinkForward"
                      width={150}
                      height={40}
                    />
                  </div>
                  <nav className="mt-5 px-2 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                          item.current
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon
                          className={`mr-4 flex-shrink-0 h-6 w-6 ${
                            item.current
                              ? 'text-blue-500'
                              : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                        />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                
                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                  <UserProfile />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-5">
                <Image
                  src="/logo.png"
                  alt="ThinkForward"
                  width={150}
                  height={40}
                />
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      item.current
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        item.current
                          ? 'text-blue-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <UserProfile />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col">
          {/* Top navigation on mobile */}
          <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white shadow-sm">
            <Button
              variant="icon"
              aria-label={t('common:actions.open_menu') as string}
              onClick={() => setSidebarOpen(true)}
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <Bars3Icon className="h-6 w-6" />
            </Button>
            <div className="absolute right-4 top-4">
              <LanguageSwitcher />
            </div>
          </div>

          <main className="flex-1">
            {/* Desktop language switcher */}
            <div className="hidden lg:block absolute top-4 right-4">
              <LanguageSwitcher />
            </div>
            
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </RTLWrapper>
  );
}; 