import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types/user";
import { useTranslation } from 'next-i18next';
import LanguageSelector from './LanguageSwitcher';
import Head from 'next/head';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
}

export default function Layout({ children, userRole }: LayoutProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const isRTL = router.locale === 'ar';

  console.log("Layout rendering with userRole:", userRole);
  console.log("Layout children:", children ? "有内容" : "无内容");

  return (
    <>
      <Head>
        <title>{t('siteTitle')}</title>
      </Head>
      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              ThinkForward AI
            </Link>
            
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                <Link href="/landing" className="text-gray-600 hover:text-blue-500">
                  {t('nav.home')}
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-blue-500">
                  {t('nav.about')}
                </Link>
              </nav>
              
              <LanguageSelector />
              
              {userRole !== UserRole.GUEST ? (
                <SignOutButton>
                  <button className="text-gray-600 hover:text-red-500">
                    {t('nav.signout')}
                  </button>
                </SignOutButton>
              ) : (
                <Link href="/sign-in" className="text-gray-600 hover:text-blue-500">
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="py-6 sm:py-8 lg:py-10">
          {children}
        </main>

        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} ThinkForward AI</p>
          </div>
        </footer>
      </div>
    </>
  );
}
