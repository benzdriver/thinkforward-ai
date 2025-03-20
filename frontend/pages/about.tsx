import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { function as Head } from 'next/head';
import { useTranslation } from 'next-i18next';
import Layout from '@/components/Layout';
import { UserRole } from '@/types/user';
import { function as Hero } from '@/components/about/Hero';
import { function as MissionVision } from '@/components/about/MissionVision';
import { function as Values } from '@/components/about/Values';
import { function as Team } from '@/components/about/Team';
import { function as Milestones } from '@/components/about/Milestones';
import { function as Contact } from '@/components/about/Contact';

export function AboutPage({ userRole = UserRole.GUEST }) {
  const { t } = useTranslation('about');

  return (
    <Layout userRole={userRole}>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description') || ''} />
      </Head>
      
      <main className="bg-white">
        <Hero />
        <MissionVision />
        <Values />
        <Team />
        <Milestones />
        <Contact />
      </main>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'about'])),
    },
  };
};