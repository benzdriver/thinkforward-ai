import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { PointsCalculator, EligibilityChecker } from '../../components/canada/express-entry';
import { CanadianFlag, BilingualToggle } from '../../components/canada/common';
import { CanadianImmigrationProvider } from '../../contexts/CanadianImmigrationContext';

export default function ExpressEntryPage() {
  const { t } = useTranslation(['express-entry', 'common']);
  
  return (
    <>
      <Head>
        <title>{t('pageTitle', { ns: 'express-entry' }) as string} | ThinkForward AI</title>
        <meta name="description" content={t('pageDescription', { ns: 'express-entry' }) as string} />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <CanadianImmigrationProvider>
          <div className="mb-6 flex justify-between items-center">
            <Link href="/canada">
              <a className="flex items-center text-primary hover:underline">
                <svg 
                  className="w-5 h-5 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>{t('common:back')}</span>
              </a>
            </Link>
            <BilingualToggle />
          </div>
          
          <div className="page-header flex items-center gap-4 mb-8">
            <CanadianFlag />
            <h1 className="text-3xl font-bold text-gray-800">{t('pageTitle', { ns: 'express-entry' })}</h1>
          </div>
          
          <div className="intro-section mb-12">
            <p className="text-xl text-gray-600">{t('pageIntro', { ns: 'express-entry' })}</p>
          </div>
          
          <div className="content-section mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('eligibilitySection', { ns: 'express-entry' })}</h2>
            <EligibilityChecker />
          </div>
          
          <div className="content-section">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('calculatorSection', { ns: 'express-entry' })}</h2>
            <PointsCalculator />
          </div>
        </CanadianImmigrationProvider>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['express-entry', 'common'])),
    },
  };
}; 