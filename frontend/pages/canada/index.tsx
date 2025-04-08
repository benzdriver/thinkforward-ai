import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { CanadianFlag, BilingualToggle } from '../../components/canada/common';
import { CanadianImmigrationProvider } from '../../contexts/CanadianImmigrationContext';

export default function CanadianImmigrationPortal() {
  const { t } = useTranslation(['canada', 'common']);
  
  const pathways = [
    {
      key: 'expressEntry',
      href: '/canada/express-entry',
      icon: '/images/canada/icons/express-entry.svg',
    },
    {
      key: 'pnp',
      href: '/canada/provincial-programs',
      icon: '/images/canada/icons/provincial-nominee.svg',
    },
    {
      key: 'familySponsorship',
      href: '/canada/family-sponsorship',
      icon: '/images/canada/icons/family.svg',
    },
    {
      key: 'businessImmigration',
      href: '/canada/business-immigration',
      icon: '/images/canada/icons/business.svg',
    },
    {
      key: 'temporaryResidence',
      href: '/canada/temporary-residence',
      icon: '/images/canada/icons/temporary.svg',
    }
  ];
  
  return (
    <>
      <Head>
        <title>{t('pageTitle', { ns: 'canada' }) as string} | ThinkForward AI</title>
        <meta name="description" content={t('pageDescription', { ns: 'canada' }) as string} />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <CanadianImmigrationProvider>
          <div className="mb-6 flex justify-end">
            <BilingualToggle />
          </div>
          
          <div className="page-header flex items-center gap-4 mb-8">
            <CanadianFlag size="lg" />
            <h1 className="text-3xl font-bold text-gray-800">{t('welcomeMessage', { ns: 'canada' })}</h1>
          </div>
          
          <div className="intro-section mb-12">
            <p className="text-xl text-gray-600">{t('introText', { ns: 'canada' })}</p>
          </div>
          
          <div className="pathways-section mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('pathways.title', { ns: 'canada' })}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pathways.map((pathway) => (
                <Link href={pathway.href} key={pathway.key}>
                  <a className="pathway-card block p-6 border border-gray-200 rounded-lg transition-shadow hover:shadow-md">
                    <div className="mb-4">
                      <img 
                        src={pathway.icon} 
                        alt={t(`pathways.${pathway.key}.title`, { ns: 'canada' }) as string}
                        className="w-12 h-12"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {t(`pathways.${pathway.key}.title`, { ns: 'canada' })}
                    </h3>
                    <p className="text-gray-600">
                      {t(`pathways.${pathway.key}.description`, { ns: 'canada' })}
                    </p>
                    <div className="mt-4 flex items-center text-primary font-medium">
                      <span>{t('common.learnMore', { ns: 'canada' })}</span>
                      <svg 
                        className="w-5 h-5 ml-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="consultant-section mb-12 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t('consultantDashboard.title', { ns: 'canada' })}
            </h2>
            <p className="text-gray-600 mb-4">
              {"Are you an immigration consultant? Access your specialized dashboard to manage Canadian immigration cases."}
            </p>
            <Link href="/canada/consultant/dashboard">
              <a className="inline-flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
                {t('common.getStarted', { ns: 'canada' })}
              </a>
            </Link>
          </div>
        </CanadianImmigrationProvider>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['canada', 'common'])),
    },
  };
}; 