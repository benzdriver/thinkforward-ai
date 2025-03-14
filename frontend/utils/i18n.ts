// 创建一个工具函数来处理文本方向
export function getTextDirection(locale: string | undefined): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

// 获取所有支持的语言
export const supportedLanguages = [
  { code: 'zh', name: '简体中文', dir: 'ltr' },
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
    case 'zh': return '🇨🇳';
    case 'en': return '🇺🇸';
    case 'ar': return '🇦🇪';
    case 'ja': return '🇯🇵';
    case 'ko': return '🇰🇷';
    case 'zh-TW': return '🇹🇼';
    default: return '🏳️';
  }
}

import { enUS } from 'date-fns/locale/en-US';
import { fr } from 'date-fns/locale/fr';
import { zhCN } from 'date-fns/locale/zh-CN';
import { zhTW } from 'date-fns/locale/zh-TW';
import { ar } from 'date-fns/locale/ar';
import { ko } from 'date-fns/locale/ko';
import { ja } from 'date-fns/locale/ja';
import { Locale } from 'date-fns';

// 获取日期格式化所需的本地化对象
export function getDateLocale(locale: string | undefined): Locale {
  switch (locale) {
    case 'zh':
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