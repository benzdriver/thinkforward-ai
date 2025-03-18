import React from 'react';
import { useTranslation } from 'next-i18next';
import { Locale } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { fr } from 'date-fns/locale/fr';
import { zhCN } from 'date-fns/locale/zh-CN';
import { zhTW } from 'date-fns/locale/zh-TW';
import { ar } from 'date-fns/locale/ar';
import { ko } from 'date-fns/locale/ko';
import { ja } from 'date-fns/locale/ja';

// 创建一个工具函数来处理文本方向
export function getTextDirection(locale: string | undefined): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

// 获取所有支持的语言
export const supportedLanguages = [
  { code: 'zh-CN', name: '简体中文', dir: 'ltr' },
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'ja', name: '日本語', dir: 'ltr' },
  { code: 'ko', name: '한국어', dir: 'ltr' },
  { code: 'zh-TW', name: '繁體中文', dir: 'ltr' }
];

// 当前启用的语言（全部启用）
export const enabledLanguages = supportedLanguages.map(lang => ({
  ...lang,
  flag: getLanguageFlag(lang.code)
}));

// 获取语言对应的国旗emoji
function getLanguageFlag(code: string): string {
  switch (code) {
    case 'zh-CN': return '🇨🇳';
    case 'en': return '🇺🇸';
    case 'ar': return '🇦🇪';
    case 'ja': return '🇯🇵';
    case 'ko': return '🇰🇷';
    case 'zh-TW': return '🇹🇼';
    default: return '🏳️';
  }
}

// 获取日期格式化所需的本地化对象
export function getDateLocale(locale: string | undefined): Locale {
  switch (locale) {
    case 'zh-CN':
      return zhCN;
    case 'zh-TW':
      return zhTW;
    case 'fr':
      return fr;
    case 'ar':
      return ar;
    case 'ko':
      return ko;
    case 'ja':
      return ja;
    default:
      return enUS;
  }
}

// 创建一个自定义hook，简化翻译使用
export function useI18n() {
  const { t, i18n } = useTranslation();
  
  return {
    // 基本翻译函数
    t,
    
    // 当前语言
    currentLanguage: i18n.language,
    
    // 切换语言
    changeLanguage: (lang: string) => i18n.changeLanguage(lang),
    
    // 格式化日期
    formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
      const dateObj = date instanceof Date ? date : new Date(date);
      return new Intl.DateTimeFormat(i18n.language, options).format(dateObj);
    },
    
    // 格式化数字
    formatNumber: (num: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(i18n.language, options).format(num);
    },
    
    // 格式化货币
    formatCurrency: (amount: number, currency = 'CNY') => {
      return new Intl.NumberFormat(i18n.language, {
        style: 'currency',
        currency
      }).format(amount);
    }
  };
}

// 创建一个高阶组件，用于包装需要国际化的组件
export function withI18n<P extends object>(Component: React.ComponentType<P & { i18n: ReturnType<typeof useI18n> }>) {
  return function WithI18nComponent(props: P) {
    const i18n = useI18n();
    return React.createElement(Component, { ...props, i18n });
  };
}