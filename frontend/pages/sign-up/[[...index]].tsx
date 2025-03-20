import { SignUp } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { function as Head } from 'next/head';
import Layout from '../../components/Layout';
import { UserRole } from '../../types/user';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { defaultLogger as logger } from '../../utils/logger';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import Link from 'next/link';
import { function as Image } from 'next/image';

export function SignUpPage({ locale: serverLocale }: { locale?: string }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation(['sign-up', 'common']);
  
  useEffect(() => {
    setMounted(true);
    logger.debug("Sign-up page mounted, router locale:", router.locale);
  }, [router.locale]);
  
  // 在客户端和服务器端都获取 locale
  const locale = mounted ? router.locale : serverLocale;
  
  // 映射Next.js语言到Clerk语言
  const localeMapping: Record<string, string> = {
    'zh': 'zh-CN',
    'en': 'en-US',
    'ar': 'ar',
    'ja': 'ja',
    'ko': 'ko',
    'es': 'es',
    'fr': 'fr',
    'zh-TW': 'zh-TW'
  };
  
  const clerkLocale = locale ? (localeMapping[locale] || 'zh-CN') : 'zh-CN';

  // 自定义 Clerk 主题颜色 - 使用与网站主题匹配的颜色
  const primaryColor = '#3B82F6'; // 蓝色系 - 根据您网站主色调调整
  const textColor = '#1F2937';
  const backgroundColor = '#F9FAFB';
  const buttonTextColor = '#FFFFFF';
  
  // 在客户端渲染之前显示加载状态
  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">{t('loading')}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* 头部导航栏 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Image 
                src="/images/logo.png" 
                alt="ThinkForward AI" 
                width={40} 
                height={40} 
              />
              <span className="ml-2 text-xl font-bold text-gray-900">ThinkForward AI</span>
            </div>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>
      
      <div className="flex flex-col items-center justify-center flex-grow py-12">
        <Head>
          <title>{t('page_title')} - ThinkForward AI</title>
        </Head>
        
        <div className="w-full max-w-md">
          <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">
            {t('heading')}
          </h1>
          
          {process.env.NODE_ENV !== 'production' && (
            <div className="bg-yellow-100 p-4 mb-4 rounded text-sm">
              <p>{t('debug_info')}</p>
              <p>{t('locale_from_props')}: {serverLocale || 'undefined'}</p>
              <p>{t('locale_from_router')}: {router.locale || 'undefined'}</p>
              <p>{t('clerk_locale')}: {clerkLocale || 'undefined'}</p>
              <p>{t('path')}: {router.asPath}</p>
            </div>
          )}
          
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="flex min-h-[500px] items-center justify-center px-4 py-8 sm:px-10">
              <SignUp 
                path="/sign-up" 
                routing="path" 
                signInUrl="/sign-in" 
                fallbackRedirectUrl="/onboarding"
                appearance={{
                  // 自定义 Clerk 样式以匹配网站主题
                  layout: {
                    logoPlacement: "inside",
                    socialButtonsVariant: "iconButton",
                    socialButtonsPlacement: "top"
                  },
                  elements: {
                    rootBox: {
                      "& .cl-localizationState": {
                        locale: clerkLocale
                      },
                      boxShadow: "none"
                    },
                    card: {
                      boxShadow: "none",
                      border: "none"
                    },
                    formButtonPrimary: {
                      backgroundColor: primaryColor,
                      color: buttonTextColor,
                      "&:hover": {
                        backgroundColor: "#2563EB" // 深蓝色
                      },
                      fontWeight: "600"
                    },
                    formFieldInput: {
                      borderColor: "#E5E7EB",
                      "&:focus": {
                        borderColor: primaryColor,
                        boxShadow: `0 0 0 1px ${primaryColor}`
                      }
                    },
                    formFieldLabel: {
                      color: textColor
                    },
                    headerTitle: {
                      fontSize: "1.5rem",
                      color: textColor
                    },
                    headerSubtitle: {
                      color: "#6B7280"
                    },
                    dividerLine: {
                      backgroundColor: "#E5E7EB"
                    },
                    dividerText: {
                      color: "#6B7280"
                    },
                    identityPreviewText: {
                      color: textColor
                    },
                    identityPreviewEditButton: {
                      color: primaryColor
                    },
                    footerActionText: {
                      color: "#6B7280"
                    },
                    footerActionLink: {
                      color: primaryColor,
                      "&:hover": {
                        color: "#2563EB"
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* 页脚 */}
      <footer className="bg-white shadow-inner py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ThinkForward AI. {t('all_rights_reserved', { ns: 'common' })}
          </div>
        </div>
      </footer>
    </div>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  logger.debug("Server side locale for sign-up:", locale);
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh', ['common', 'sign-up'])),
      locale
    },
  };
} 