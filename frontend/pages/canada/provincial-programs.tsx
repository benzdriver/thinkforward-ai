import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { ProvinceSelector, ProgramFinder } from '../../components/canada/pnp';
import { CanadianFlag, BilingualToggle } from '../../components/canada/common';
import { CanadianImmigrationProvider } from '../../contexts/CanadianImmigrationContext';
import { CanadianProvince } from '../../types/canada';

export default function ProvincialProgramsPage() {
  const { t } = useTranslation(['provincial-programs', 'common']);
  const [selectedProvince, setSelectedProvince] = useState<CanadianProvince | undefined>(undefined);
  
  return (
    <>
      <Head>
        <title>{t('pageTitle', { ns: 'provincial-programs' }) as string} | ThinkForward AI</title>
        <meta name="description" content={t('pageDescription', { ns: 'provincial-programs' }) as string} />
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
            <h1 className="text-3xl font-bold text-gray-800">{t('pageTitle', { ns: 'provincial-programs' })}</h1>
          </div>
          
          <div className="intro-section mb-12">
            <p className="text-xl text-gray-600">{t('pageIntro', { ns: 'provincial-programs' })}</p>
          </div>
          
          <div className="content-section mb-12">
            <ProvinceSelector 
              selectedProvince={selectedProvince} 
              onProvinceSelect={(province) => setSelectedProvince(province)} 
            />
          </div>
          
          {selectedProvince && (
            <div className="content-section">
              <ProgramFinder province={selectedProvince} />
            </div>
          )}
        </CanadianImmigrationProvider>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['provincial-programs', 'common'])),
    },
  };
}; 