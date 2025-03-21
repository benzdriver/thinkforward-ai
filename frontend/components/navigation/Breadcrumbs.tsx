import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  homeHref?: string;
  homeLabel?: string;
  className?: string;
  separator?: React.ReactNode;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items = [],
  homeHref = '/',
  homeLabel = 'navigation.home',
  className = '',
  separator = '/',
}) => {
  const router = useRouter();
  const { t } = useTranslation(['navigation', 'common']);
  
  // 如果没有提供项目，则尝试从路由路径生成
  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbsFromPath(router.pathname, t);
  
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href={homeHref}
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            {t(homeLabel)}
          </Link>
        </li>
        
        {breadcrumbItems.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">{separator}</span>
              {item.href ? (
                <Link
                  href={item.href}
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

// 辅助函数：从路径生成面包屑
function generateBreadcrumbsFromPath(path: string, t: (key: string, options?: any) => string): BreadcrumbItem[] {
  if (path === '/') return [];
  
  const segments = path.split('/').filter(Boolean);
  let currentPath = '';
  
  return segments.map((segment, index) => {
    currentPath += `/${segment}`;
    
    // 尝试将路径段转换为更友好的标签
    // 例如：'user-profile' -> 'User Profile'
    const label = t(`navigation.${segment}`) !== `navigation.${segment}`
      ? t(`navigation.${segment}`)
      : segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // 对于最后一个段，不提供链接
    const isLast = index === segments.length - 1;
    
    return {
      label,
      href: isLast ? undefined : currentPath,
    };
  });
} 