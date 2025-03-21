import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { TouchFeedback } from '../ui/TouchFeedback';

interface NavigationItem {
  key: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
}

interface SideNavigationProps {
  items: NavigationItem[];
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({
  items,
  className,
  collapsible = false,
  defaultCollapsed = false,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const router = useRouter();
  const { t } = useTranslation(['navigation', 'common']);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const toggleExpand = (key: string) => {
    setExpandedKeys((prevKeys) =>
      prevKeys.includes(key)
        ? prevKeys.filter((k) => k !== key)
        : [...prevKeys, key]
    );
  };

  const isActive = (href: string) => {
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };

  // 处理可能包含命名空间前缀的翻译键
  const renderLabel = (label: string) => {
    if (label.includes(':')) {
      const [namespace, key] = label.split(':');
      return t(key, { ns: namespace });
    }
    return t(label);
  };

  const renderNavItem = (item: NavigationItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedKeys.includes(item.key);
    const active = isActive(item.href);

    return (
      <li key={item.key} className="w-full">
        <TouchFeedback
          className={classNames(
            'flex items-center w-full',
            hasChildren ? 'justify-between' : 'justify-start',
            active
              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
              : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
            level === 0 ? 'py-2.5 px-4' : `py-2 pl-${level * 4 + 4} pr-4`,
            'transition-colors duration-200'
          )}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.key);
            }
          }}
        >
          <Link
            href={item.href}
            className={classNames(
              'flex items-center w-full',
              hasChildren ? 'pointer-events-none' : ''
            )}
            onClick={(e) => {
              if (hasChildren) {
                e.preventDefault();
              }
            }}
          >
            {item.icon && (
              <span className={classNames('mr-3', collapsed && level === 0 ? 'mx-auto' : '')}>
                {item.icon}
              </span>
            )}
            {(!collapsed || level > 0) && (
              <span className="truncate">{renderLabel(item.label)}</span>
            )}
          </Link>
          {hasChildren && !collapsed && (
            <svg
              className={classNames(
                'w-5 h-5 transition-transform duration-200',
                isExpanded ? 'transform rotate-180' : ''
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
        </TouchFeedback>
        {hasChildren && isExpanded && !collapsed && (
          <ul className="space-y-1 py-1">
            {(item.children ?? []).map((child) => renderNavItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div
      className={classNames(
        'flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700',
        collapsed ? 'w-16' : 'w-64',
        'transition-all duration-300',
        className
      )}
    >
      {collapsible && (
        <div className="p-4 flex justify-end">
          <button
            onClick={toggleCollapse}
            className="p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
          >
            <span className="sr-only">
              {collapsed ? t('navigation.expand') : t('navigation.collapse')}
            </span>
            <svg
              className={classNames(
                'w-6 h-6 transition-transform duration-200',
                collapsed ? 'transform rotate-180' : ''
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={collapsed ? 'M13 5l7 7-7 7' : 'M11 19l-7-7 7-7'}
              ></path>
            </svg>
          </button>
        </div>
      )}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 py-2">
          {items.map((item) => renderNavItem(item))}
        </ul>
      </nav>
    </div>
  );
}; 