import { useTranslation } from 'next-i18next';
import { getDateLocale } from '@/utils/i18n';

/**
 * 增强的国际化 hook，支持命名空间和格式化功能
 * @param namespace 翻译命名空间，默认为 'common'
 */
export function useI18n(namespace = 'common') {
  const { t, i18n } = useTranslation(namespace);
  
  return {
    // 基本翻译函数
    t,
    
    // i18n 实例
    i18n,
    
    // 当前语言
    currentLanguage: i18n.language,
    language: i18n.language,
    
    // 切换语言
    changeLanguage: (lang: string) => i18n.changeLanguage(lang),
    
    // 方向
    isRTL: i18n.dir() === 'rtl',
    
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