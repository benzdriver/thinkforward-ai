import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

interface ConsultantLayoutProps {
  children: React.ReactNode;
}

export default function ConsultantLayout({ children }: ConsultantLayoutProps) {
  const { t } = useTranslation(['consultant', 'common', 'layout']);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigation = [
    { 
      name: t('navigation.dashboard'), 
      href: '/consultant/dashboard', 
      icon: HomeIcon, 
      current: router.pathname === '/consultant/dashboard' 
    },
    { 
      name: t('navigation.clients'), 
      href: '/consultant/clients', 
      icon: UserGroupIcon, 
      current: router.pathname.startsWith('/consultant/clients') 
    },
    { 
      name: t('navigation.ai_assistant'), 
      href: '/consultant/ai-assistant', 
      icon: ChatBubbleLeftRightIcon, 
      current: router.pathname === '/consultant/ai-assistant' 
    },
    { 
      name: t('navigation.forms'), 
      href: '/consultant/forms', 
      icon: DocumentTextIcon, 
      current: router.pathname.startsWith('/consultant/forms') 
    },
    { 
      name: t('navigation.analytics'), 
      href: '/consultant/analytics', 
      icon: ChartBarIcon, 
      current: router.pathname === '/consultant/analytics' 
    },
    { 
      name: t('navigation.settings'), 
      href: '/consultant/settings', 
      icon: Cog6ToothIcon, 
      current: router.pathname === '/consultant/settings' 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
            
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon className="h-6 w-6 text-white" />
                </button>
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
                <div className="flex-shrink-0 group block">
                  <div className="flex items-center">
                    <div>
                      {user?.profileImageUrl ? (
                        <Image
                          className="h-10 w-10 rounded-full"
                          src={user.profileImageUrl}
                          alt={user.firstName || 'User'}
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-lg">
                            {user?.firstName?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-700">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <button
                        onClick={signOut}
                        className="text-sm font-medium text-gray-500 hover:text-gray-700"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
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
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  {user?.profileImageUrl ? (
                    <Image
                      className="h-9 w-9 rounded-full"
                      src={user.profileImageUrl}
                      alt={user.firstName || 'User'}
                      width={36}
                      height={36}
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-lg">
                        {user?.firstName?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <button
                    onClick={signOut}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col">
        {/* Top navigation on mobile */}
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white shadow-sm">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="absolute right-4 top-4">
            <LanguageSwitcher />
          </div>
        </div>

        <main className="flex-1">
          {/* Desktop language switcher */}
          <div className="hidden lg:block absolute top-4 right-4">
            <LanguageSwitcher />
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
} 