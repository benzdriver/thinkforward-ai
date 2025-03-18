import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface RTLWrapperProps {
  children: React.ReactNode;
}

export const RTLWrapper: React.FC<RTLWrapperProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const router = useRouter();
  
  // 修复: 检查 i18n.dir 是否为函数，如果不是，提供一个后备方案
  const getDirection = () => {
    if (typeof i18n.dir === 'function') {
      return i18n.dir();
    }
    
    // 后备方案: 根据语言代码判断方向
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    const currentLang = i18n.language || 'en';
    return rtlLanguages.includes(currentLang) ? 'rtl' : 'ltr';
  };

  return (
    <div className={getDirection() === 'rtl' ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
};