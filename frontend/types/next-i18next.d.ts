import 'next-i18next';
import { NestedKeyOf } from '@/types/utils';
import { Resources } from '@/i18n'; // 确保资源类型定义存在

declare module 'next-i18next' {
  type TFunction = (key: string, options?: object) => string;
} 