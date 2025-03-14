import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { enabledLanguages } from '../utils/i18n';

export default function LanguageSelector() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { userData, refreshUserData } = useAuth();
  
  // 获取当前语言
  const currentLanguage = enabledLanguages.find(lang => lang.code === router.locale) || enabledLanguages[0];
  
  // 切换下拉菜单
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  // 切换语言
  const changeLanguage = async (langCode: string) => {
    // 关闭下拉菜单
    setIsOpen(false);
    
    // 如果选择的语言与当前语言相同，则不做任何操作
    if (router.locale === langCode) return;
    
    // 如果用户已登录，更新用户的语言偏好
    if (userData) {
      try {
        await api.user.updateProfile({
          preferredLanguage: langCode
        });
        await refreshUserData();
      } catch (error) {
        console.error('更新用户语言偏好失败:', error);
      }
    }
    
    // 切换页面语言
    router.push(router.pathname, router.asPath, { locale: langCode });
  };
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="mr-1">{currentLanguage.flag}</span>
        <span className="hidden md:inline">{currentLanguage.name}</span>
        <svg className={`h-5 w-5 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {enabledLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  router.locale === language.code 
                    ? 'bg-gray-100 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
              >
                <span className="mr-2">{language.flag}</span>
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 