import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'next-i18next';

interface BreadcrumbItemProps {
  href?: string;
  current?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  href,
  current = false,
  icon,
  children,
  className = ''
}) => {
  const itemContent = (
    <>
      {icon && <span className="mr-1">{icon}</span>}
      <span className={current ? 'font-medium' : ''}>{children}</span>
    </>
  );
  
  return (
    <li className={className}>
      {href && !current ? (
        <Link href={href} className="text-gray-500 hover:text-gray-700">
          {itemContent}
        </Link>
      ) : (
        <span className="text-gray-900">{itemContent}</span>
      )}
    </li>
  );
};

interface BreadcrumbProps {
  children: React.ReactNode;
  separator?: React.ReactNode;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  children,
  separator = <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-1" />,
  className = ''
}) => {
  const { t } = useTranslation();
  // 将子元素转换为数组
  const items = React.Children.toArray(children);
  
  return (
    <nav className={`flex ${className}`} aria-label={t('components.breadcrumb.ariaLabel', 'Breadcrumb') || 'Breadcrumb'}>
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => {
          // 如果不是最后一个元素，添加分隔符
          if (index < items.length - 1) {
            return (
              <React.Fragment key={index}>
                {item}
                <li className="flex items-center">{separator}</li>
              </React.Fragment>
            );
          }
          
          return <React.Fragment key={index}>{item}</React.Fragment>;
        })}
      </ol>
    </nav>
  );
}; 