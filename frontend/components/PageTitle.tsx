import { useTranslation } from 'next-i18next';
import Head from 'next/head';

interface PageTitleProps {
  titleKey?: string;
  defaultTitle?: string;
  namespace?: string;
}

export default function PageTitle({ titleKey, defaultTitle, namespace = 'common' }: PageTitleProps) {
  const { t } = useTranslation(namespace);
  
  // 使用模板字符串确保title是单个字符串
  const title = titleKey ? `${t(titleKey)}` : defaultTitle;
  
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
} 