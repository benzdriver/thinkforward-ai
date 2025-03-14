import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import Layout from '@/components/Layout';
import { UserRole } from '@/types/user';
import Hero from '@/components/about/Hero';
import MissionVision from '@/components/about/MissionVision';
import Values from '@/components/about/Values';
import Team from '@/components/about/Team';
import Milestones from '@/components/about/Milestones';
import Contact from '@/components/about/Contact';

export default function AboutPage({ userRole = UserRole.GUEST }) {
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