import { SignIn } from "@clerk/nextjs";
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SignInPage({ locale: serverLocale }: { locale?: string }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 在客户端和服务器端都获取 locale
  const locale = mounted ? router.locale : serverLocale;
  
  // 映射Next.js语言到Clerk语言
  const localeMapping = {
    'zh': 'zh-CN',
    'en': 'en-US'
  };
  
  const clerkLocale = locale ? localeMapping[locale as keyof typeof localeMapping] : 'zh-CN';

  // 在客户端渲染之前显示加载状态
  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12">
      <Head>
        <title>登录 - Thinkforward移民AI助手</title>
      </Head>
      
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-3xl font-bold">
          {locale === 'en' ? 'Sign in to your account' : '登录您的账户'}
        </h1>
        
        <div className="bg-yellow-100 p-4 mb-4 rounded text-sm">
          <p>Debug Info:</p>
          <p>Locale from props: {serverLocale || 'undefined'}</p>
          <p>Locale from router: {router.locale || 'undefined'}</p>
          <p>Clerk locale: {clerkLocale || 'undefined'}</p>
          <p>Path: {router.asPath}</p>
        </div>
        
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="flex min-h-[500px] items-center justify-center px-4 py-8 sm:px-10">
            <SignIn 
              path="/sign-in" 
              routing="path" 
              signUpUrl="/sign-up" 
              fallbackRedirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: {
                    "& .cl-localizationState": {
                      locale: clerkLocale
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 确保添加getServerSideProps以支持i18n
export async function getServerSideProps({ locale }: { locale: string }) {
  console.log("Server side locale:", locale); // 服务器端调试
  return {
    props: {
      locale
    }
  };
} 