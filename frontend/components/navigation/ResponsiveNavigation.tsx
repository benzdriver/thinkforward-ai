import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { useResponsive } from '../../contexts/ResponsiveContext';
import { useTranslation } from 'next-i18next';
import { TouchFeedback } from '../ui/TouchFeedback';

interface NavigationItem {
  key: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
}

interface ResponsiveNavigationProps {
  items: NavigationItem[];
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  items,
  logo,
  actions,
  className,
}) => {
  const { isMobile } = useResponsive();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation(['navigation', 'common']);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (href: string) => {
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };

  const renderLabel = (label: string) => {
    if (label.includes(':')) {
      const [namespace, key] = label.split(':');
      return t(key, { ns: namespace });
    }
    return t(label);
  };

  return (
    <nav className={classNames('bg-white dark:bg-gray-900 shadow-sm', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {logo}
            </div>
            {!isMobile && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {items.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={classNames(
                      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                      isActive(item.href)
                        ? 'border-primary-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                    )}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {renderLabel(item.label)}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-6">
              {actions}
            </div>
            {isMobile && (
              <div className="-mr-2 flex items-center sm:hidden">
                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
                  aria-expanded="false"
                >
                  <span className="sr-only">{t('navigation.toggle_menu')}</span>
                  {isMenuOpen ? (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobile && isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {items.map((item) => (
              <TouchFeedback key={item.key}>
                <Link
                  href={item.href}
                  className={classNames(
                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                    isActive(item.href)
                      ? 'border-primary-500 text-primary-700 bg-primary-50 dark:bg-primary-900 dark:text-primary-300'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                  )}
                >
                  <div className="flex items-center">
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {renderLabel(item.label)}
                  </div>
                </Link>
              </TouchFeedback>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}; 